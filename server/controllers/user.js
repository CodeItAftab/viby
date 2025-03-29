const User = require("../models/user");
const Request = require("../models/request");
const Chat = require("../models/chat");
const { TryCatch } = require("../utils/error");
const { users } = require("../utils/socket");
const { uploadAvatarOnCloudinary } = require("../utils/cloudinary");

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find(
      { _id: { $ne: req.user._id } },
      "name avatar"
    ).lean();

    const processed_users = [];

    for (let user of allUsers) {
      const chat = await Chat.findOne({
        members: { $all: [req.user._id, user._id] },
        isGroup: false,
      });

      if (chat) {
        processed_users.push({
          ...user,
          isFriend: true,
          isSentRequest: false,
          isReceivedRequest: false,
          chatId: chat._id,
          avatar: user?.avatar?.url,
          isOnline: users.has(user._id.toString()),
        });
        continue;
      }

      const request = await Request.findOne({
        $or: [
          { sender: req.user._id, receiver: user._id },
          { sender: user._id, receiver: req.user._id },
        ],
      });

      if (request) {
        const isSender = request?.sender.toString() === req.user._id.toString();

        processed_users.push({
          ...user,
          isFriend: false,
          isSentRequest: isSender,
          isReceivedRequest: !isSender,
          requestId: request._id,
          avatar: user?.avatar?.url,
        });

        continue;
      }

      processed_users.push({
        ...user,
        isFriend: false,
        isSentRequest: false,
        isReceivedRequest: false,
        avatar: user?.avatar?.url,
      });
    }
    res.status(200).json({ success: true, users: processed_users });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getAllFriends = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({
    members: req.user._id,
    isGroup: false,
  })
    .populate("members", "name avatar")
    .lean();

  const friends = chats.map((chat) => {
    const friend = chat.members.find(
      (member) => member._id.toString() !== req.user._id.toString()
    );
    return {
      _id: friend._id,
      name: friend.name,
      chatId: chat._id,
      isOnline: users.has(friend._id.toString()),
      avatar: friend?.avatar?.url,
    };
  });

  res.status(200).json({ success: true, friends });
});

const getUser = TryCatch(async (req, res, next) => {
  const user = await User.findById(req?.params?.id).lean();

  res
    .status(200)
    .json({ success: true, user: { ...user, avatar: user?.avatar?.url } });
});

const firstProfileUpdate = TryCatch(async (req, res, next) => {
  const bio = req?.body?.bio;
  const avatar = req?.files?.avatar;
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  var av = undefined;
  if (!bio && !avatar) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide bio or avatar" });
  }
  if (req?.files?.avatar) {
    av = await uploadAvatarOnCloudinary(avatar);
    user.avatar = av;
  }

  user.bio = bio;

  await user.save();
  res.json({
    success: true,
    message: "Profile updated successfully",
  });
});

const uploadFCMToken = TryCatch(async (req, res, next) => {
  const { fcmToken } = req.body;

  if (!fcmToken) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide fcmToken" });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (fcmToken === user.fcm_token) {
    return res
      .status(400)
      .json({ success: false, message: "FCM Token already updated" });
  }

  user.fcm_token = fcmToken;
  await user.save();

  res.json({ success: true, message: "FCM Token updated successfully" });
});

module.exports = {
  getAllUsers,
  uploadFCMToken,
  getAllFriends,
  getUser,
  firstProfileUpdate,
};
