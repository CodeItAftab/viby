/* eslint-disable react/prop-types */
import { faker } from "@faker-js/faker";
import AvatarWithStatus from "./AvatarWithStatus";
import { IconButton } from "@mui/material";
import { Chat, CheckCircle, XCircle, UserPlus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
// import { READ_MESSAGE } from "@/constants/event";

import { useDispatch } from "react-redux";
// import {
//   FetchChatMessages,
//   pushChat,
//   setSelectedChatId,
//   setSelectedUser,
//   setSelectedUserId,
// } from "@/redux/slices/chat";
// import { getFromattedTime } from "@/utils/date";
import { Check } from "lucide-react";
import { Checks, Image } from "phosphor-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AcceptFriendRequest,
  CancelFriendRequest,
  RejectFriendRequest,
  SendFriendRequest,
} from "@/redux/slices/request";
import AvatarWithoutStatus from "./AvatarWithoutStatus";
import { getFromattedTime } from "@/utils/date";

export function ChatListItem({ chat }) {
  // const { selectedChatId } = useSelector((state) => state.chat);
  // const dispatch = useDispatch();
  const { chatId } = useParams();
  const navigate = useNavigate();

  return (
    <div
      // className="h-16 w-full bg-slate-100 cursor-pointer  flex items-center lg:p-2 px-2 py-0 shrink-0 rounded-lg "
      // className="h-16 w-full bg-white cursor-pointer  flex items-center lg:p-2 px-2 py-0 shrink-0 rounded-lg "
      className="h-16 w-full bg-white cursor-pointer  flex items-center lg:p-2 px-4 py-0 shrink-0 rounded-lg lg:shadow-sm"
      onClick={async () => {
        if (chatId !== chat?._id) {
          navigate(`/chats/${chat?._id}`);
        }
      }}
    >
      <div className="avatar-container h-12 w-12 rounded-full  bg-white">
        <AvatarWithStatus url={chat?.avatar} isOnline={chat?.isOnline} />
      </div>
      <div className="Chat-user-info h-full tracking-wide flex-grow box-border  pl-3 flex flex-col gap-[2px] justify-center">
        <h2 className="chat-user-name text-base font-medium leading-none text-slate-700">
          {chat?.name}
        </h2>
        <div className="flex items-center gap-1">
          {chat?.lastMessage?.isSender && (
            <span className="flex items-center pt-[2px] justify-center">
              {chat?.lastMessage?.state === "read" && (
                <Checks
                  size={18}
                  color="#1976d2"
                  className="self-end text-slate-500"
                />
              )}
              {chat?.lastMessage?.state === "delivered" && (
                <Checks size={18} className="self-end text-slate-500" />
              )}
              {chat?.lastMessage?.state === "sent" && (
                <Check size={18} className="self-end text-slate-500" />
              )}
            </span>
          )}

          {chat?.isTyping ? (
            <span className="text-sm  text-blue-600  shrink-0">typing...</span>
          ) : (
            <p className="last-message text-sm  text-slate-700 text-nowrap flex gap-1 items-center">
              {/* {faker.lorem.sentence().slice(0, 30) + "..."} */}
              {chat?.lastMessage?.type === "image" && (
                <Image size={18} weight="bold" />
              )}
              {!chat?.lastMessage?.content &&
                chat?.lastMessage?.type === "image" && <span>Image</span>}
              {!chat?.lastMessage?.content &&
                chat?.lastMessage?.type === "video" && <span>Video</span>}
              <span>
                {chat?.lastMessage?.content?.length > 30
                  ? chat?.lastMessage?.content.slice(0, 25) + "..."
                  : chat?.lastMessage?.content}
              </span>
            </p>
          )}
        </div>
      </div>
      <div className="chat-time-container h-full w-14 flex flex-col items-center lg:justify-around lg:gap-0 justify-center gap-1 ">
        <span
          className={
            "last-message-time text-[12px] leading-none text-slate-500 font-semibold shrink-0" +
            (chat?.unread ? " text-[#1976d2] " : "")
          }
        >
          {/* 10:10 AM */}
          {chat &&
            chat.lastMessage !== undefined &&
            getFromattedTime(new Date(chat?.lastMessage?.createdAt))}
          {/* {faker.number.int({ min: 1, max: 12 })}:
          {faker.number.int({ min: 1, max: 12 })} */}
          {/* {new Date(chat?.lastMessage?.createdAt)?.toLocaleTimeString()} */}
        </span>
        {
          <span
            className={
              "new-message-count h-[18px] w-[18px] flex items-center justify-center text-[11px] shrink-0 bg-[#1976d2] text-white leading-none  rounded-full" +
              (chat?.unread ? "" : " bg-transparent text-transparent")
            }
          >
            {/* {faker.number.int({ min: 0, max: 99 })} */}
            {chat?.unread > 0 && chat?.unread}
          </span>
        }
      </div>
    </div>
  );
}

export function FriendListItem({ user }) {
  // const { chats } = useSelector((state) => state.chat);
  // const { socket } = useSocket();
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div
      className="h-16 w-full bg-white cursor-pointer  flex items-center p-2 rounded-lg lg:shadow-sm"
      onClick={() => {
        navigate(`/chats/${user?.chatId}`);
      }}
    >
      <div className="avatar-container h-10 w-10 rounded-full  bg-white">
        <AvatarWithStatus url={user?.avatar} isOnline={user?.isOnline} />
      </div>
      <div className="Chat-user-info h-full flex-grow box-border  pl-3 flex flex-col gap-[6px] justify-center">
        <h2 className="chat-user-name text-base font-medium leading-none text-slate-700">
          {user ? user.name : faker.person.fullName()}
        </h2>
      </div>
      <div className="chat-time-container h-full w-16 flex flex-col items-center justify-center gap-2">
        <IconButton>
          <Chat size={24} color="#1976d4" />
        </IconButton>
      </div>
    </div>
  );
}

// export function FriendListItem({ user }) {
//   const { chats } = useSelector((state) => state.chat);
//   const { socket } = useSocket();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   return (
//     <div
//       className="h-16 w-full bg-white cursor-pointer  flex items-center p-2 rounded-lg lg:shadow-sm"
//       onClick={() => {
//         dispatch(setSelectedUserId(user?._id));
//         dispatch(setSelectedChatId(user?.chatId));
//         dispatch(
//           setSelectedUser({
//             name: user?.name,
//             isOnline: user?.isOnline,
//           })
//         );
//         const chatIndex = chats.findIndex((chat) => chat?._id === user?.chatId);
//         if (chatIndex === -1) {
//           dispatch(
//             pushChat({
//               _id: user.chatId,
//               name: user.name,
//               avatar: user.avatar,
//               friendId: user._id,
//               isOnline: user.isOnline,
//               lastMessage: undefined,
//               unread: 0,
//             })
//           );
//         } else {
//           dispatch(FetchChatMessages(user?.chatId));
//           socket?.emit(READ_MESSAGE, { chatId: user?.chatId });
//         }
//         navigate("/");
//       }}
//     >
//       <div className="avatar-container h-10 w-10 rounded-full  bg-white">
//         <AvatarWithStatus url={user?.avatar} isOnline={user?.isOnline} />
//       </div>
//       <div className="Chat-user-info h-full flex-grow box-border  pl-3 flex flex-col gap-[6px] justify-center">
//         <h2 className="chat-user-name text-base font-medium leading-none text-slate-700">
//           {user ? user.name : faker.person.fullName()}
//         </h2>
//       </div>
//       <div className="chat-time-container h-full w-16 flex flex-col items-center justify-center gap-2">
//         <IconButton>
//           <Chat size={24} color="#1976d4" />
//         </IconButton>
//       </div>
//     </div>
//   );
// }

export function RequestListItem({ user }) {
  const dispatch = useDispatch();
  return (
    <div className="h-16 w-full bg-white cursor-pointer  flex items-center p-2 rounded-lg lg:shadow-sm">
      <div className="avatar-container h-10 w-10 rounded-full bg-white">
        <AvatarWithoutStatus url={user?.avatar} />
      </div>
      <div className="Chat-user-info h-full flex-grow box-border  pl-2 flex flex-col gap-[6px] justify-center">
        <h2 className="chat-user-name text-sm font-poppins whitespace-nowrap overflow-ellipsis font-medium pr-2 leading-none text-slate-700">
          {user?.name?.length > 30
            ? user?.name?.slice(0, 27) + "..."
            : user?.name}
        </h2>
      </div>
      <div className="chat-time-container h-full w-20 px-3 flex  items-center justify-center gap-1">
        <IconButton
          sx={{ padding: 1 }}
          onClick={() => {
            dispatch(RejectFriendRequest(user?.requestId));
          }}
        >
          <XCircle size={28} color="red" />
        </IconButton>
        <IconButton
          sx={{ padding: 1 }}
          onClick={() => {
            dispatch(AcceptFriendRequest(user.requestId));
          }}
        >
          <CheckCircle size={28} color="#1976d4" />
        </IconButton>
      </div>
    </div>
  );
}

export function SentRequestListItem({ user }) {
  const dispatch = useDispatch();
  return (
    <div className="h-16 w-full bg-white cursor-pointer  flex items-center p-2 rounded-lg lg:shadow-sm">
      <div className="avatar-container h-10 w-10 rounded-full bg-white">
        <AvatarWithoutStatus url={user?.avatar} />
      </div>
      <div className="Chat-user-info h-full flex-grow box-border  pl-2 flex flex-col gap-[6px] justify-center">
        <h2 className="chat-user-name text-sm font-poppins whitespace-nowrap overflow-ellipsis font-medium pr-2 leading-none text-slate-700">
          {user?.name || faker.person.fullName().slice(0, 24) + "..."}
        </h2>
      </div>
      <div className="chat-time-container h-full w-20 px-3 flex  items-center justify-center gap-1">
        <Button
          variant="outline"
          onClick={() => {
            dispatch(CancelFriendRequest(user.requestId));
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export function SearchListItem({ user }) {
  const dispatch = useDispatch();
  return (
    <div className="h-16 w-full bg-white cursor-pointer  flex items-center p-2 rounded-lg lg:shadow-sm">
      <div className="avatar-container h-10 w-10 rounded-full bg-white">
        <AvatarWithoutStatus url={user?.avatar} />
      </div>
      <div className="Chat-user-info h-full flex-grow box-border  pl-2 flex flex-col gap-[6px] justify-center">
        <h2 className="chat-user-name text-base font-poppins whitespace-nowrap overflow-ellipsis font-medium pr-2 leading-none text-slate-700">
          {user?.name}
        </h2>
      </div>
      <div className="chat-time-container h-full w-16  flex  items-center justify-center ">
        <IconButton onClick={() => dispatch(SendFriendRequest(user._id))}>
          <UserPlus size={24} color="#1976d4" />
        </IconButton>
      </div>
    </div>
  );
}

export function GroupMemberSelectItem({ user, selected, onSelect }) {
  return (
    <div
      className={`h-16 w-full my-2 bg-white cursor-pointer   flex items-center p-2 rounded-lg  ${
        selected && "border-[1px] border-[#1976d4]"
      }`}
      onClick={() => {
        onSelect(user._id);
      }}
    >
      <div className="avatar-container h-10 w-10 rounded-full  bg-white">
        <AvatarWithoutStatus url={user?.avatar} />
      </div>
      <div className="Chat-user-info h-full flex-grow box-border  pl-3 flex flex-col gap-[6px] justify-center">
        <h2 className="chat-user-name text-base font-medium leading-none text-slate-700">
          {user ? user.name : faker.person.fullName()}
        </h2>
      </div>
      <div className="chat-time-container h-full w-16 flex flex-col items-center justify-center gap-2">
        <div className="rounded-full h-8 w-8">
          {selected && <CheckCircle weight="thin" size={32} color="#1976d4" />}
        </div>
      </div>
    </div>
  );
}
