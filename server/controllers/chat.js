const { TryCatch, ErrorHandler } = require("../utils/error");
const Chat = require("../models/chat");
const Message = require("../models/Message");
const User = require("../models/user");
const { getOtherMembers } = require("../utils/helper");
const { users, getIO } = require("../utils/socket");
const { NEW_MESSAGE_ALERT } = require("../constants/event");
const { getLinkPreview } = require("link-preview-js");
const {
  uploadOnCloudinary,
  uploadAvatarOnCloudinary,
} = require("../utils/cloudinary");
// const { default: NotificationService } = require("../utils/notification");

const getMessages = TryCatch(async (req, res, next) => {
  const { chatId } = req.params;
  console.log(chatId);
  const chat = await Chat.findOne({
    _id: chatId,
    members: req.user._id,
  });
  const messages = await Message.find({ chatId })
    .sort({ createdAt: -1 })
    // .limit(20)
    // .limit(3)
    .lean();

  let friend = undefined;
  if (!chat.isGroup) {
    freindId = chat.members.find(
      (member) => member.toString() !== req.user._id.toString()
    );

    friend = await User.findById(
      freindId,
      "name avatar bio email createdAt"
    ).lean();
    friend.avatar = friend?.avatar?.url;
    friend.joined = friend?.createdAt;
    friend.createdAt = undefined;
    friend.isOnline = users.has(freindId.toString());
  }

  const msgs = messages.map((message) => {
    const isSender = message.sender.toString() === req.user._id.toString();
    return {
      _id: message._id,
      content: message.content,
      attachments: message.attachments,
      sender: message.sender,
      chatId: message.chatId,
      state: message.state,
      type: message.type,
      // deliveredList: message.deliveredList,
      // readList: message.readList,
      isSender,
      createdAt: message.createdAt,
    };
  });

  res.json({ success: true, messages: msgs, friend });
});

const sendMessage = TryCatch(async (req, res, next) => {
  const { chatId, content } = req.body;
  let MessageType = "text";
  let attachments = [];

  console.log(req.files);

  if (!content && !req?.files?.attachments) {
    throw new ErrorHandler(400, "Message or attachment is required");
  }

  if (!chatId) {
    throw new ErrorHandler(400, "Chat ID is required");
  }

  const chat = await Chat.findById(chatId, "members").lean();

  if (!chat) {
    throw new ErrorHandler(404, "Chat not found");
  }

  if (req?.files?.attachments) {
    attachments = await uploadOnCloudinary(req.files.attachments);
    MessageType = "media";
  }

  const otherMembers = getOtherMembers(chat.members, req.user._id);
  const activeMembers = otherMembers.filter((member) =>
    users.has(member.toString())
  );

  let messageStatus = "sent";

  if (activeMembers.length === otherMembers.length) {
    messageStatus = "delivered";
  }

  const message = new Message({
    sender: req.user._id,
    type: MessageType,
    attachments: attachments?.length > 0 ? attachments : undefined,
    chatId,
    content,
    state: messageStatus,
    deliveredList: activeMembers,
    readList: [],
  });

  const savedMessage = await message.save();
  const messageForRealTime = {
    _id: savedMessage._id,
    content: savedMessage.content,
    attachments: savedMessage.attachments,
    sender: savedMessage.sender,
    chatId: savedMessage.chatId,
    state: savedMessage.state,
    type: savedMessage.type,
    isSender: true,
    createdAt: savedMessage.createdAt,
  };

  const io = getIO();

  // console.log(req.user.fcm_token);

  // NotificationService.sendNotification(
  //   req.user.fcm_token,
  //   "TEst",
  //   "<h1>Heading notification</h1>"
  // );

  activeMembers.forEach((member) => {
    const socketId = users.get(member.toString());
    io.to(socketId).emit(NEW_MESSAGE_ALERT, {
      message: { ...messageForRealTime, isSender: false },
    });
  });

  res.json({
    // chat,.
    success: true,
    message: messageForRealTime,
  });

  // const message = new Message({
  //   sender: req.user._id,
  //   chatId,
  //   content,
  // });

  // res.status(200).json({ message });
});

const getAllChats = TryCatch(async (req, res, next) => {
  const friends = await Chat.find({ members: req.user._id })
    .populate("members")
    .lean();
  const chats = await Promise.all(
    friends.map(async (friend) => {
      const message = await Message.findOne(
        { chatId: friend._id },
        {},
        { sort: { createdAt: -1 } }
      ).populate("sender");
      const otherMember = friend.members.find(
        (member) => member._id.toString() !== req.user._id.toString()
      );
      console.log(otherMember);
      const unreadMessageCount = await Message.countDocuments({
        chatId: friend._id,
        sender: { $ne: req.user._id },
        readList: { $ne: req.user._id },
      });

      if (message || friend.isGroup) {
        return {
          _id: friend._id,
          name: friend?.isGroup ? friend.groupName : otherMember.name,
          friendId: otherMember._id,
          isOnline: !friend.isGroup && users.has(otherMember._id.toString()),
          isGroup: friend.isGroup,
          avatar: friend?.isGroup
            ? friend?.avatar?.url
            : otherMember?.avatar?.url,
          lastMessage: {
            content: message?.content,
            createdAt: message?.createdAt,
            sender: friend.isGroup && message?.sender,
            state: message?.state,
            isSender: message?.sender.toString() === req.user._id.toString(),
            senderName: friend.isGroup ? message?.sender.name : undefined,
            type:
              message?.type === "media"
                ? message?.attachments[0].type
                : message?.type,
          },
          unread: unreadMessageCount || 0,
        };
      }
    })
  );

  const sortedChats = chats.sort((a, b) => {
    if (a.lastMessage.createdAt > b.lastMessage.createdAt) {
      return -1;
    } else if (a.lastMessage.createdAt < b.lastMessage.createdAt) {
      return 1;
    } else {
      return 0;
    }
  });

  res.json({
    success: true,
    message: "Chats fetched successfully",
    chats: sortedChats,
  });

  // console.log(chats);
});

const LinkPreview = async (req, res, next) => {
  const { url } = req.query;
  try {
    const data = await getLinkPreview(url);
    res.json({ success: true, data });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Invalid URL" });
    // next(error);
  }
};

const readMessage = TryCatch(async (req, res, next) => {
  const { chatId } = req.params;
  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new ErrorHandler(404, "Chat not found");
  }

  // const messages = await Message.updateMany(
  //   { chatId, sender: { $ne: req.user._id }, readList: { $ne: req.user._id } },
  //   { $push: { readList: req.user._id } }
  // );

  const messages = await Message.find({
    chatId,
    sender: { $ne: req.user._id },
    readList: { $ne: req.user._id },
  }).lean();

  await Promise.all(
    messages.map(async (message) => {
      msg = await Message.findById(message._id);
      msg.readList.push(req.user._id);
      // if all members are in read list then change state to read
      if (chat.members.length - 1 === msg.readList.length) {
        msg.state = "read";
      } else if (chat.members.length - 1 == msg.deliveredList.length) {
        msg.state = "delivered";
      }

      return await msg.save();
    })
  );

  res.json({ success: true, message: "Message read" });
});

const createGroup = TryCatch(async (req, res, next) => {
  const { name } = req.body;
  const members = req.body["members[]"];
  let groupAvatar;
  if (!members || members.length < 2) {
    throw new ErrorHandler(400, "Atleast 2 members are required");
  }

  if (!name) {
    throw new ErrorHandler(400, "Group name is required");
  }

  if (req?.files?.avatar) {
    groupAvatar = await uploadAvatarOnCloudinary(req.files.avatar);
  }

  // check if all members are valid and are friends

  const chat = new Chat({
    members: [...members, req.user._id],
    isGroup: true,
    groupAvatar: groupAvatar,
    admin: req.user._id,
    groupName: name,
  });

  const savedChat = await chat.save();

  res.json({ success: true, chat: savedChat });
});

module.exports = {
  sendMessage,
  getAllChats,
  getMessages,
  LinkPreview,
  readMessage,
  createGroup,
};
