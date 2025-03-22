import MessageList from "./MessageList";
import MessageBoxHeader from "./MessageBoxHeader";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import MessageBoxInput from "./MessageBoxInput";
import { IconButton } from "@mui/material";
import { Smiley, X } from "phosphor-react";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchChatMessages,
  markMessageReadByViewer,
  sendMessage,
  setSelectedChatId,
  undoSelectedChat,
} from "@/redux/slices/chat";
import { useParams } from "react-router-dom";
import { motion } from "motion/react";
import { useSocket } from "@/hooks/useSocket";
import { READ_MESSAGE } from "@/constants/event";
import ChatUserInfo from "./ChatUserInfo";

function MessageBox() {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const socket = useSocket();
  const { selectedChatId, messages } = useSelector((state) => state.chat);
  const { chatId } = useParams();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("chatId", selectedChatId);
    formData.append("content", message.trim());
    Array.from(attachments).forEach((attachment) => {
      formData.append("attachments", attachment);
    });
    console.log(formData);
    dispatch(sendMessage(formData));
    setMessage("");
    setAttachments([]);
  };

  const handleAddFile = (e) => {
    if (e.target.files.length > 0) {
      const updatedFiles = [...attachments, ...e.target.files].slice(0, 4);
      setAttachments([...updatedFiles]);
      setSelectedIndex(attachments.length);
    }
  };

  const handleReadMessage = useCallback(() => {
    dispatch(markMessageReadByViewer({ chatId }));
    socket?.emit(READ_MESSAGE, { chatId });
  }, [chatId, dispatch, socket]);

  useEffect(() => {
    if (!chatId) return;

    dispatch(setSelectedChatId(chatId));
    dispatch(FetchChatMessages(chatId));
    handleReadMessage();
    return () => {
      dispatch(undoSelectedChat());
    };
  }, [dispatch, chatId, handleReadMessage]);

  return (
    <div className="h-full   lg:w-[calc(100%-360px)] relative  w-full flex  items-center justify-center  shrink">
      <motion.div
        // animate={{ display: "flex-column", transition: { duration: 0.1 } }}
        exit={{ right: -480, transition: { duration: 0.1 } }}
        className={`h-full w-full flex-col items-center justify-center bg-white lg:shadow-[0px_0px_1px_1px_#0000001b] transition-all ease-in-out duration-100 ${
          showUserInfo && "md:flex hidden"
        }`}
      >
        <MessageBoxHeader
          showUserInfo={showUserInfo}
          setShowUserInfo={setShowUserInfo}
        />
        <MessageList messages={messages} />
        <MessageBoxInput
          setAttachments={setAttachments}
          message={message}
          setMessage={setMessage}
          attachments={attachments}
        />

        {attachments?.length > 0 && (
          <form
            onSubmit={handleSubmit}
            className=" w-full absolute top-14 h-[calc(100%-56px)] flex flex-col bg-slate-200  items-center overflow-hidden"
          >
            <header className="h-12 w-full  flex items-center pl-8">
              <IconButton
                onClick={() => {
                  setAttachments([]);
                  setSelectedIndex(0);
                }}
              >
                <X size={28} className=" font-semibold" />
              </IconButton>
            </header>
            <div className="h-[65%] w-[80%]  attachment-preview bg-sla te-300 px-8 py-4 flex items-center justify-center shrink-0">
              {attachments[selectedIndex].type.includes("image") && (
                <img
                  src={
                    attachments.length > 0 &&
                    selectedIndex >= 0 &&
                    selectedIndex < attachments.length &&
                    URL.createObjectURL(attachments[selectedIndex])
                  }
                  alt="image"
                  className="object-center max-h-full border-2 border-blue-500 rounded-md shadow-md"
                />
              )}
              {attachments[selectedIndex].type.includes("video") && (
                <video
                  src={
                    attachments.length > 0 &&
                    selectedIndex >= 0 &&
                    selectedIndex < attachments.length &&
                    URL.createObjectURL(attachments[selectedIndex])
                  }
                  controls
                  alt="image"
                  className="object-cover max-h-full border-2 border-blue-500 rounded-md shadow-md"
                />
              )}
            </div>
            <div className="h-14 rounded  max-w-[90%] min-w-80 mt-4 flex items-center gap-2 justify-center bg-wh4ite">
              {Array.from(attachments)?.map((attachment, index) => {
                return (
                  <div
                    key={attachment.name + index}
                    className={` ${
                      selectedIndex === index ? "h-14 w-14" : "h-12 w-12"
                    }  rounded-sm  flex items-center justify-center overflow-hidden`}
                    onClick={() => {
                      setSelectedIndex(index);
                    }}
                  >
                    {attachment.type.includes("image") && (
                      <img
                        src={
                          Array.from(attachments).length > 0 &&
                          selectedIndex < Array.from(attachments).length &&
                          selectedIndex >= 0 &&
                          URL.createObjectURL(attachment)
                        }
                        alt="image"
                        className={` h-full object-center rounded-sm shadow-lg   ${
                          index === selectedIndex
                            ? "border-blue-500 border-2"
                            : "border-slate-500 border-[1px]"
                        }`}
                      />
                    )}

                    {attachment.type.includes("video") && (
                      <video
                        src={
                          Array.from(attachments).length > 0 &&
                          selectedIndex < Array.from(attachments).length &&
                          selectedIndex >= 0 &&
                          URL.createObjectURL(attachment)
                        }
                        alt="image"
                        className=" h-full object-cover rounded-sm shadow-lg"
                      />
                    )}
                  </div>
                );
              })}
              <IconButton
                sx={{
                  height: "48px",
                  width: "48px",
                  padding: "none",
                  borderRadius: "4px",
                  // backgroundColor: "#f1f5f9",
                  backgroundColor: "white",
                  // ":hover": { backgroundColor: "#e2e8f0" },
                  ":hover": { backgroundColor: "ghostwhite" },
                }}
                className="bg-slate-300"
                onClick={() => {
                  fileInputRef.current.click();
                }}
              >
                <Plus size={24} color="black" />
              </IconButton>
            </div>
            <input
              type="file"
              name="attachments"
              id="attachments_add"
              className="hidden"
              accept="image/* video/*"
              ref={fileInputRef}
              onChange={handleAddFile}
              multiple
            />
            <div className="w-10/12 h-12 flex gap-4 items-center justify-center mt-4 cursor-">
              <div className="message-input pr-2 h-11  w-[calc(100%-80px)]  flex items-center bg-white rounded-[30px] overflow-hidden border--[1px]">
                <IconButton className="emoji-button h-10 w-10">
                  <Smiley size={20} color="black" />
                </IconButton>
                <input
                  className="h-11 w-[calc(100%-20px)]  pl-2 py-4 font-normal leading-none outline-none rounded-[6px] bg-transparent text-black"
                  type="text"
                  name="message"
                  id="message"
                  maxLength={200}
                  placeholder="Caption (optional)"
                  value={message}
                  autoComplete="off"
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <IconButton
                className="message-send-button "
                sx={{
                  backgroundColor: "#1976d2",
                  height: "44px",
                  width: "44px",
                  padding: "none",
                  borderRadius: "50%",
                  ":hover": { backgroundColor: "#1976d4" },
                }}
                type="submit"
                onClick={handleSubmit}
              >
                <PaperPlaneTilt size={20} color="white" />
              </IconButton>
            </div>
          </form>
        )}
      </motion.div>
      {showUserInfo && <ChatUserInfo setShowUserInfo={setShowUserInfo} />}
    </div>
  );
}

export default memo(MessageBox);
