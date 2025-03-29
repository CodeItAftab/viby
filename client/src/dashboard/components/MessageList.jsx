import { memo, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import MessageItem from "./MessageItem";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useSocket } from "@/hooks/useSocket";
import { markMessageReadByViewer } from "@/redux/slices/chat";
import { READ_MESSAGE } from "@/constants/event";

const formatMessages = (messages) => {
  const processedMessages = [];
  let lastSender = null;
  let lastMessageDate = null;
  messages = [...messages].reverse();

  for (let i = 0; i < messages.length; i++) {
    const message = { ...messages[i] }; // Clone to avoid modifying original
    const messageDate = new Date(message?.createdAt).toDateString(); // Convert to date string (YYYY-MM-DD)

    // Check if this message has the same sender and was sent on the same date as the last message
    message.sameSender =
      lastSender === message.sender && lastMessageDate === messageDate;

    // Push date separator if it's a new day
    if (messageDate && lastMessageDate && lastMessageDate !== messageDate) {
      console.log("date in format message func", messageDate, lastMessageDate);
      processedMessages.push({
        type: "date",
        date: messageDate || undefined,
      });
    }

    // Push the message
    processedMessages.push(message);

    // Update last sender and last message date for next iteration
    lastSender = message.sender;
    lastMessageDate = messageDate;
  }

  return processedMessages;
};

function MessageList({ messages = [] }) {
  const dispatch = useDispatch();
  const { chatId } = useParams();
  const socket = useSocket();

  const handleReadMessage = useCallback(() => {
    dispatch(markMessageReadByViewer({ chatId }));
    socket?.emit(READ_MESSAGE, { chatId });
  }, [chatId, dispatch, socket]);

  useEffect(() => {
    handleReadMessage();
  }, [handleReadMessage, socket]);

  return (
    <ul
      // ref={chatListRef}
      className="messages-box  w-full h-[calc(100%-120px)] flex-grow px-3 py-4 flex flex-col-reverse  gap-[2px]  overflow-auto bg-white  "
    >
      {formatMessages(messages)
        .reverse()
        .map((message, index) => (
          <MessageItem key={message?._id ?? index} message={message} />
        ))}
    </ul>
  );
}

MessageList.propTypes = {
  messages: PropTypes.array,
};

export default memo(MessageList);
