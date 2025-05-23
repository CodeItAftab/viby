const {
  NEW_FRIEND_REQUEST,
  FRIEND_REQUEST_SENT,
  FRIEND_REQUEST_ACCEPTED,
  FRIEND_REQUEST_REJECTED,
  FRIEND_REQUEST_CANCELLED,
} = require("../constants/event");
const Request = require("../models/request");
const Chat = require("../models/chat");
const User = require("../models/user");
const { TryCatch, ErrorHandler } = require("../utils/error");
const { getIO, users, getSocketId } = require("../utils/socket");
const {
  SendNewFriendRequestNotification,
  SendFriendRequestAcceptedNotification,
} = require("../utils/notification");
const { UserToFCMToken } = require("./notification");
const { GetTransformedURL } = require("../utils/cloudinary");

const sendFriendRequest = TryCatch(async (req, res, next) => {
  const { to } = req.body;
  const userId = req?.user?._id;

  //   Check if to is a valid user id
  if (!to) {
    throw new ErrorHandler(400, "Receiver ID is required");
  }

  // check if the user is sending a friend request to himself
  if (userId.toString() === to.toString()) {
    throw new ErrorHandler(400, "You cannot send a friend request to yourself");
  }

  // Check if there is a chat between the two users
  const existingChat = await Chat.findOne({
    members: { $all: [userId.toString(), to.toString()] },
    isGroup: false,
  });

  if (existingChat) {
    throw new ErrorHandler(400, "You are already friends");
  }

  //   Check if there is an existing friend request between the two users
  const existingRequest = await Request.findOne({
    $or: [
      { sender: userId, receiver: to },
      { sender: to, receiver: userId },
    ],
  });

  if (existingRequest) {
    throw new ErrorHandler(400, "Friend request already exists");
  }

  //   Create a new friend request
  const request = await Request.create({
    sender: userId,
    receiver: to,
  });

  //   Populate the sender and receiver fields for realtime notification
  const old_requset = await Request.findById(request._id)
    .populate("sender receiver", "name avatar")
    .lean();

  //   Get the socket id of the sender and receiver
  const io = getIO();
  const toSocketId = getSocketId(to);
  const userSocketId = users.get(userId.toString());

  //   Emit the NEW_FRIEND_REQUEST event to the receiver
  io.to(toSocketId).emit(NEW_FRIEND_REQUEST, {
    message: "New Friend Request",
    request: {
      _id: old_requset._id,
      sender: {
        ...old_requset.sender,
        avatar: old_requset?.sender?.avatar?.url,
      },
    },
  });

  const receiver = await User.findById(to, "name fcm_tokens").lean();

  //   Send a notification to the receiver
  const sender_name = req?.user?.name;
  const requestId = request._id;
  const sender_avatar = req?.user?.avatar
    ? GetTransformedURL(req?.user?.avatar?.url)
    : undefined;
  const receiver_fcm_tokens = UserToFCMToken[to.toString()];
  if (receiver_fcm_tokens) {
    receiver_fcm_tokens.forEach((tokenData) => {
      const token = tokenData.token;
      SendNewFriendRequestNotification(
        token,
        requestId,
        sender_name,
        sender_avatar
      );
    });
  }

  return res.status(200).json({
    success: true,
    message: "Friend request sent",
    request: {
      _id: old_requset._id,
      receiver: {
        ...old_requset.receiver,
        avatar: old_requset?.receiver?.avatar?.url,
      },
    },
  });
});

const cancelFriendRequest = TryCatch(async (req, res, next) => {
  const { requestId } = req.params;
  //   Check if the request id is provided
  if (!requestId) {
    throw new ErrorHandler(400, "Request ID is required");
  }

  //   Find the request by id
  const request = await Request.findById(requestId);

  //   Check if the request exists
  if (!request) {
    throw new ErrorHandler(404, "Friend request not found");
  }

  //   Check if the user is the sender of the request
  if (request.sender.toString() !== req?.user?._id.toString()) {
    throw new ErrorHandler(
      403,
      "You are not authorized to cancel this request"
    );
  }

  //   Delete the request
  await Request.findByIdAndDelete(requestId);

  // Notify the receiver that the request has been cancelled
  const io = getIO();
  const receiverSocketId = getSocketId(request.receiver.toString());
  io.to(receiverSocketId).emit(FRIEND_REQUEST_CANCELLED, {
    requestId: requestId,
  });

  //   Send a success response
  return res.status(200).json({
    success: true,
    message: "Friend request cancelled",
    requestId: requestId,
  });
});

const acceptFriendRequest = TryCatch(async (req, res, next) => {
  const { requestId } = req.params;

  //  Check if the request id is provided
  if (!requestId) {
    throw new ErrorHandler(400, "Request ID is required");
  }

  //  Find the request by id
  const request = await Request.findById(requestId);

  if (!request) {
    throw new ErrorHandler(404, "Friend request not found");
  }

  // Check if the user is the receiver of the request
  if (request.receiver.toString() !== req?.user?._id.toString()) {
    throw new ErrorHandler(
      403,
      "You are not authorized to accept this request"
    );
  }

  //   Create a new chat between the two users

  const existingChat = await Chat.findOne({
    members: { $all: [request.sender, request.receiver] },
    isGroup: false,
  });

  if (existingChat) {
    throw new ErrorHandler(400, "You are already friends");
  }

  //   Create a new chat
  const chat = await Chat.create({
    members: [request.sender, request.receiver],
  });

  //   Delete the request
  await Request.findByIdAndDelete(requestId);

  //  Notify the sender that the request has been accepted
  const io = getIO();
  const senderSocketId = getSocketId(request.sender.toString());

  const senderFriend = await User.findById(
    request.sender,
    "name avatar"
  ).lean();

  const receiverFriend = await User.findById(
    request.receiver,
    "name avatar"
  ).lean();

  io.to(senderSocketId).emit(FRIEND_REQUEST_ACCEPTED, {
    requestId: requestId,
    chatId: chat._id,
    friend: {
      _id: receiverFriend._id,
      name: receiverFriend.name,
      avatar: receiverFriend?.avatar?.url,
      isOnline: users.has(request.receiver.toString()),
      chatId: chat._id,
    },
  });

  //  Send a notification to the
  const chatId = chat._id;
  const receiver_name = receiverFriend.name;
  const receiver_avatar = GetTransformedURL(receiverFriend?.avatar?.url);
  const sender_fcm_tokens = UserToFCMToken[request.sender.toString()];
  if (sender_fcm_tokens) {
    sender_fcm_tokens.forEach((tokenData) => {
      const token = tokenData.token;
      SendFriendRequestAcceptedNotification(
        token,
        chatId,
        receiver_name,
        receiver_avatar
      );
    });
  }

  //   Send a success response
  return res.status(200).json({
    success: true,
    message: "Friend request accepted",
    requestId: requestId,
    chatId: chat._id,
    friend: {
      _id: senderFriend._id,
      name: senderFriend.name,
      avatar: senderFriend?.avatar?.url,
      isOnline: users.has(request.sender.toString()),
      chatId: chat._id,
    },
  });
});

const rejectFriendRequest = TryCatch(async (req, res, next) => {
  const { requestId } = req.params;

  //  Check if the request id is provided
  if (!requestId) {
    throw new ErrorHandler(400, "Request ID is required");
  }

  //  Find the request by id
  const request = await Request.findById(requestId);
  if (!request) {
    throw new ErrorHandler(404, "Friend request not found");
  }

  // Check if the user is the receiver of the request
  if (request.receiver.toString() !== req?.user?._id.toString()) {
    throw new ErrorHandler(
      403,
      "You are not authorized to reject this request"
    );
  }

  // Delete the request
  await Request.findByIdAndDelete(requestId);

  // TODO: Notify the sender that the request has been rejected
  const io = getIO();
  const senderSocketId = getSocketId(request.sender.toString());
  io.to(senderSocketId).emit(FRIEND_REQUEST_REJECTED, {
    requestId: requestId,
  });

  //   Send a success response
  return res.status(200).json({
    success: true,
    message: "Friend request rejected",
    requestId: requestId,
  });
});

const getAllRequests = TryCatch(async (req, res, next) => {
  const requests = await Request.find({ receiver: req?.user?._id }, "sender")
    .populate("sender", "name avatar")
    .lean();

  // console.log("received request", requests);

  // change avatar to avatar.url
  const modifiedRequests = requests.map((request) => {
    console.log("request", request);
    return {
      _id: request?._id,
      sender: {
        _id: request.sender._id,
        name: request.sender.name,
        avatar: request.sender?.avatar?.url,
      },
    };
  });
  res.status(200).json({ success: true, requests: modifiedRequests });
});

const getAllSentRequests = TryCatch(async (req, res, next) => {
  const requests = await Request.find({ sender: req?.user?._id }, "receiver")
    .populate("receiver", "name avatar")
    .lean();

  // change avatar to avatar.url
  const modifiedRequests = requests.map((request) => {
    return {
      _id: request._id,
      receiver: {
        _id: request.receiver._id,
        name: request.receiver.name,
        avatar: request.receiver?.avatar?.url,
      },
    };
  });

  res.status(200).json({ success: true, requests: modifiedRequests });
});

module.exports = {
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getAllRequests,
  getAllSentRequests,
};
