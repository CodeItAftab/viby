const { Server } = require("socket.io");
const {
  FRIEND_CAME_ONLINE,
  FRIEND_WENT_OFFLINE,
  MESSAGE_DELIVERED,
  READ_MESSAGE,
  FRIEND_READ_MESSAGE,
  TYPING,
  STOP_TYPING,
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
      origin: "https://viby-alpha.vercel.app",
      // origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    const { userId } = socket.handshake.query;
    console.log("New connection: ", socket.id, "\nuserId: ", userId);
    // push user to active users map
    users.set(userId, socket.id);

    const chats = await Chat.find({ members: userId, isGroup: false });

    NotifyFriendOnlineStatus(socket, chats, userId, users, "online");
    MarkMessagesAsDelivered(chats, userId, users, io);

    socket.on("disconnect", () => {
      console.log(socket.id, " disconnected");
      NotifyFriendOnlineStatus(socket, chats, userId, users, "offline");
      users.delete(userId);
    });

    socket.on(READ_MESSAGE, async (data) => {
      const chatId = data.chatId;
      await ReadMessages(chatId, userId, users, io);
      console.log("readMessages of ", chatId);
    });

    socket.on(TYPING, (data) => {
      const chatId = data.chatId;
      const chat = chats.find((chat) => chat._id.toString() === chatId);

      for (const member of chat?.members) {
        if (member.toString() !== userId) {
          io.to(users.get(member.toString())).emit(TYPING, { chatId, userId });
        }
      }
    });

    socket.on(STOP_TYPING, (data) => {
      try {
        const chatId = data?.chatId;
        const chat = chats.find((chat) => chat._id.toString() === chatId);
        for (const member of chat?.members) {
          if (member.toString() !== userId) {
            io.to(users.get(member.toString())).emit(STOP_TYPING, {
              chatId,
              userId,
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    });
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
