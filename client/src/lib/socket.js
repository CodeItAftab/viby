import { io } from "socket.io-client";

let socket;

const connectSocket = (userId) => {
  if (!socket) {
    socket = io("https://viby.onrender.com", {
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
