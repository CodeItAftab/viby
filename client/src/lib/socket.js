import { io } from "socket.io-client";

let socket;

const connectSocket = (userId) => {
  if (!socket) {
    // socket = io("https://16kbbt38-3000.inc1.devtunnels.ms", {
    socket = io("http://localhost:3000", {
      // socket = io("https://vibychat.onrender.com", {
      query: {
        userId,
      },
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }

  socket = null;
};

export { connectSocket };
