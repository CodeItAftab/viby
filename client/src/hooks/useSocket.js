import { SocketContext } from "@/context/SocketContext";
import { useContext } from "react";

const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export { useSocket };
