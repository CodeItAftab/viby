const { Server } = require("socket.io");
const {
  FRIEND_CAME_ONLINE,
  FRIEND_WENT_OFFLINE,
  MESSAGE_DELIVERED,
  READ_MESSAGE,
  FRIEND_READ_MESSAGE,
} = require("../constants/event");
const Request = require("../models/request");
const Chat = require("../models/chat");
const Message = require("../models/Message");
const {
  MarkMessagesAsDelivered,
  NotifyFriendOnlineStatus,
  ReadMessages,
} = require("./socket-help");

let io;

const users = new Map();

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      // origin: "https://viby-chat.vercel.app",
      origin: "*",
      withCredentials: true,
    },
  });

  io.on("connection", async (socket) => {
    const { userId } = socket.handshake.query;
    console.log("New connection: ", socket.id, "\nuserId: ", userId);
    // push user to active users map
    users.set(userId, socket.id);

    const chats = await Chat.find({ members: userId, isGroup: false });

    // Notify friends that user is online
    // chats.forEach(async (chat) => {
    //   const messageCount = await Message.countDocuments({ chatId: chat._id });
    //   if (messageCount > 0) {
    //     const friendId = chat.members.find(
    //       (member) => member.toString() !== userId.toString()
    //     );
    //     const friendSocketId = users.get(friendId.toString());
    //     if (friendSocketId) {
    //       io.to(friendSocketId).emit(FRIEND_CAME_ONLINE, {
    //         chatId: chat._id,
    //       });
    //     }
    //   }
    // });

    NotifyFriendOnlineStatus(socket, chats, userId, users, "online");

    // Make all sent message as delivered
    // const chatIds = [];
    // chats.forEach(async (chat) => {
    //   const messages = await Message.find({
    //     chatId: chat._id,
    //     state: "sent",
    //     sender: { $ne: userId },
    //   });
    //   if (messages.length > 0) {
    //     chatIds.push(chat._id);
    //     messages.forEach(async (message) => {
    //       message.state = "delivered";
    //       await message.save();
    //     });
    //     friendId = chat.members.find(
    //       (member) => member.toString() !== userId.toString()
    //     );
    //     const friendSocketId = users.get(friendId.toString());
    //     io.to(friendSocketId).emit(MESSAGE_DELIVERED, {
    //       chatIds,
    //     });
    //   }
    // });

    // MarkMessagesAsDelivered(chats, userId, users, io);

    socket.on("disconnect", () => {
      console.log("Disconnected: ", socket.id);

      // Notify friends that user went offline
      // chats.forEach(async (chat) => {
      //   const messageCount = await Message.countDocuments({ chatId: chat._id });
      //   if (messageCount > 0) {
      //     const friendId = chat.members.find(
      //       (member) => member.toString() !== userId.toString()
      //     );
      //     const friendSocketId = users.get(friendId.toString());
      //     if (friendSocketId) {
      //       io.to(friendSocketId).emit(FRIEND_WENT_OFFLINE, {
      //         chatId: chat._id,
      //       });
      //     }
      //   }
      // });
      NotifyFriendOnlineStatus(socket, chats, userId, users, "offline");
      users.delete(userId);

      // console.log(users);
    });

    socket.on(READ_MESSAGE, async (data) => {
      const chatId = data.chatId;
      ReadMessages(chatId, userId, users, io);
    });
    // socket.on(READ_MESSAGE, async (data) => {
    //   const chatId = data.chatId;
    //   const messageId = data.messageId;
    //   const message = await Message.find({
    //     _id: messageId,
    //     sender: { $ne: userId },
    //     chatId: chatId,
    //     state: "delivered",
    //   });
    //   const senderId = message.sender;
    //   const friendSocketId = users.get(senderId?.toString());

    //   io.to(friendSocketId).emit(FRIEND_READ_MESSAGE, {
    //     chatId: chatId,
    //     messageId: messageId,
    //   });

    //   io.to(socket.id).emit(READ_MESSAGE, {
    //     chatId: chatId,
    //     messageId: messageId,
    //   });
    // });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
};

const getSocketId = (userId) => {
  return users.get(userId);
};

module.exports = { initSocket, getIO, users, getSocketId };
