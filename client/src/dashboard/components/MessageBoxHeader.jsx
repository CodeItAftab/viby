import { memo } from "react";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import { CaretLeft, VideoCamera } from "@phosphor-icons/react";
import AvatarWithStatus from "./AvatarWithStatus";
import { Info, Phone } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { undoSelectedChat } from "@/redux/slices/chat";
import { useNavigate } from "react-router-dom";

function MessageBoxHeader({ showUserInfo, setShowUserInfo }) {
  const { selectedUser } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <header className=" h-14 w-full  px-3 border-b-[1px] flex justify-between items-center bg-white shrink-0 messagebox-header">
      <div className="chat-user-info h-full flex items-center gap-3 ">
        <IconButton
          sx={{
            padding: "0",
            width: "fit-content",
          }}
          onClick={() => {
            dispatch(undoSelectedChat());
            navigate("/chats");
          }}
        >
          <CaretLeft color="black" />
        </IconButton>
        <div className="chat-user-avatar h-9 w-9 ">
          <AvatarWithStatus
            url={selectedUser?.avatar}
            isOnline={selectedUser?.isOnline}
          />
        </div>
        <div className="header-user-info h-full flex flex-col justify-center gap-1">
          <h3 className="text-base leading-none">
            {/* {faker.person.fullName()} */}
            {selectedUser?.name}
          </h3>

          {selectedUser?.isTyping ? (
            <span className="user-online-status text-[10px] leading-none">
              {selectedUser?.isTyping ? "typing..." : " "}
            </span>
          ) : (
            <span className="user-online-status text-[10px] leading-none">
              {selectedUser?.isOnline ? "Online" : "Offline"}
            </span>
          )}
        </div>
      </div>
      <div className="header-menu flex h-full gap-1 items-center">
        <IconButton>
          <VideoCamera size={20} color="black" weight="fill" />
        </IconButton>
        <IconButton>
          <Phone size={20} color="black" weight="fill" />
        </IconButton>
        <IconButton onClick={() => setShowUserInfo(!showUserInfo)}>
          <Info size={20} color="black" />
        </IconButton>
      </div>
    </header>
  );
}

MessageBoxHeader.propTypes = {
  showUserInfo: PropTypes.bool.isRequired,
  setShowUserInfo: PropTypes.func.isRequired,
};

export default memo(MessageBoxHeader);
