const {
  FRIEND_CAME_ONLINE,
  MESSAGE_DELIVERED,
  FRIEND_WENT_OFFLINE,
  FRIEND_READ_MESSAGE,
} = require("../constants/event");
const Chat = require("../models/chat");
const Message = require("../models/Message");

const NotifyFriendCameOnline = function (socket, chats, userId, users) {
  for (let chat of chats) {
    if (chat.isGroup) continue;

    const friendId = chat.members.find(
      (member) => member?.toString() !== userId?.toString()
    );

    const friendSocketId = users?.get(friendId?.toString());
    if (friendSocketId) {
      socket.to(friendSocketId).emit(FRIEND_CAME_ONLINE, {
        chatId: chat._id,
      });
    }
  }
};

const NotifyFriendOnlineStatus = function (
  socket,
  chats,
  userId,
  users,
  status = "offline"
) {
  for (let chat of chats) {
    if (chat.isGroup) continue;

    const friendId = chat.members.find(
      (member) => member?.toString() !== userId?.toString()
    );

    const friendSocketId = users?.get(friendId?.toString());
    if (status === "online") {
      if (friendSocketId) {
        socket.to(friendSocketId).emit(FRIEND_CAME_ONLINE, {
          chatId: chat._id,
        });
      }
    } else if (status === "offline") {
      if (friendSocketId) {
        socket.to(friendSocketId).emit(FRIEND_WENT_OFFLINE, {
          chatId: chat._id,
        });
      }
    }
  }
};

const MarkMessagesAsDelivered = async function (chats, userId, users, io) {
  // for (let chat of chats) {
  //   const lastMessage = await Message.findOne(
  //     { chatId: chat._id, sender: { $ne: userId }, state: "sent" },
  //     {},
  //     { sort: { createdAt: -1 } }
  //   );

  //   if (!lastMessage) continue;
  //   if (lastMessage.sender.toString() === userId.toString()) continue;
  //   if (lastMessage.deliveredList.includes(userId)) continue;
  //   if (Message.status !== "sent") continue;

  // }

  const senders = new Set();
  const chatIds = new Set();
  const senderChatIds = new Set();
  for (let chat of chats) {
    const messages = await Message.find({
      chatId: chat._id,
      state: "sent",
      sender: { $ne: userId },
    });

    if (messages.length === 0) continue;

    for (let message of messages) {
      if (message.state === "delivered" || message.state === "read") continue;
      if (message.sender.toString() === userId.toString()) continue;
      if (message.deliveredList.includes(userId)) continue;

      message.deliveredList.push(userId);
      if (message.deliveredList.length === chat.members.length - 1) {
        message.state = "delivered";
        senders.add(message.sender.toString());
        chatIds.add(chat._id.toString());
        senderChatIds.add(
          message.sender.toString() + "=%=%" + chat._id.toString()
        );
      }

      await message.save();
    }
  }

  for (let senderChatId of senderChatIds) {
    const [sender, chatId] = senderChatId.split("=%=%");
    const senderSocketId = users?.get(sender);
    if (senderSocketId) {
      io.to(senderSocketId).emit(MESSAGE_DELIVERED, {
        chatId: chatId,
      });
    }
  }
};

const ReadMessages = async function (chatId, userId, users, io) {
  const messages = await Message.find({
    chatId: chatId,
    state: { $ne: "read" },
    sender: { $ne: userId },
  });

  const senders = new Set();

  if (messages.length === 0) return;

  const chat = await Chat.findById(chatId);
  if (!chat) return;

  for (let message of messages) {
    if (message.state === "read") continue;
    if (message.sender.toString() === userId.toString()) continue;
    if (message.readList.includes(userId)) continue;
    message.readList.push(userId);
    if (message.readList.length === chat.members.length - 1) {
      message.state = "read";
      senders.add(message.sender.toString());
    }
    await message.save();
  }
  const newest_message = await Message.findOne(
    { chatId: chatId, sender: { $ne: userId } },
    {},
    { sort: { createdAt: -1 } }
  );

  const isRead = newest_message?.state === "read";

  if (isRead) {
    for (let sender of senders) {
      if (sender === userId) continue;
      if (!users.has(sender)) continue;
      if (!sender) continue;
      const senderSocketId = users?.get(sender);
      if (senderSocketId) {
        io.to(senderSocketId).emit(FRIEND_READ_MESSAGE, {
          chatId: chat._id,
          friendId: userId,
        });
      }
    }
  }
};

module.exports = {
  NotifyFriendCameOnline,
  MarkMessagesAsDelivered,
  NotifyFriendOnlineStatus,
  ReadMessages,
};

/*
    const messages = await Message.find({
      chatId: chat._id,
      state: "sent",
      sender: { $ne: userId },
    });

    if (messages.length === 0) continue;
    var senders = new Set();
    for (let message of messages) {
      if (message.state === "delivered" || message.state === "read") continue;
      if (message.sender.toString() === userId.toString()) continue;
      if (message.deliveredList.includes(userId)) continue;

      senders.add(message.sender.toString());

      message.deliveredList.push(userId);
      if (message.deliveredList.length === chat.members.length - 1) {
        message.state = "delivered";
      }
      await message.save();
    }

    for (let sender of senders) {
      const senderSocketId = users?.get(sender);
      if (senderSocketId) {
        io.to(senderSocketId).emit(MESSAGE_DELIVERED, {
          chatId: chat._id,
        });
      }
    }
*/
