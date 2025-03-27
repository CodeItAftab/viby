import { READ_MESSAGE } from "@/constants/event";
import { useSocket } from "@/hooks/useSocket";
import { getRequest, postMultiPartRequest, postRequest } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { setLoader } from "./app";

const initialState = {
  selectedChatId: null,
  selectedUserId: null,
  selectedUser: {
    name: "",
    isOnline: false,
    avatar: "",
    email: "",
    bio: "",
    joined: "",
  },
  messages: [],
  unreadMessages: [],
  chats: [],
};

const slice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    pushChat: (state, action) => {
      state.chats.unshift(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setUnreadMessages: (state, action) => {
      state.unreadMessages = action.payload;
    },
    setSelectedChatId: (state, action) => {
      state.selectedChatId = action.payload;
    },
    setSelectedUserId: (state, action) => {
      state.selectedUserId = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setFriendOnlineStatus: (state, action) => {
      state.chats = state.chats.map((chat) => {
        if (chat?._id === action.payload.chatId) {
          chat.isOnline = action.payload.isOnline;
        }
        return chat;
      });
    },
    setSelectedUserOnlineStatus: (state, action) => {
      state.selectedUser.isOnline = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    undoSelectedChat: (state) => {
      state.selectedChatId = null;
      state.selectedUserId = null;
      state.selectedUser = {
        name: "",
        isOnline: false,
        read: undefined,
      };
      state.messages = [];
    },
    makeMessagesDelivered: (state, action) => {
      state.chats = state.chats.map((chat) => {
        if (chat._id === action.payload.chatId) {
          if (chat.lastMessage.state === "sent" && chat.lastMessage.isSender) {
            chat.lastMessage.state = "delivered";
          }
        }
        return chat;
      });

      if (
        state.selectedChatId &&
        state.selectedChatId === action.payload.chatId
      ) {
        state.messages = state.messages.map((message) => {
          if (message.state === "sent" && message.isSender) {
            message.state = "delivered";
          }
          return message;
        });
      }
    },

    readIndividualMessage: (state, action) => {
      state.messages = state.messages.map((message) => {
        if (message._id === action.payload.messageId) {
          message.state = "read";
        }
        return message;
      });
    },

    setTypingStatus: (state, action) => {
      state.chats = state.chats.map((chat) => {
        if (chat?._id === action.payload.chatId) {
          chat.isTyping = action.payload.isTyping;
          if (chat.isGroup) {
            chat.typingUser = action.payload.userId;
          }
        }
        return chat;
      });

      if (state.selectedChatId === action.payload.chatId) {
        state.selectedUser.isTyping = action.payload.isTyping;
      }
    },
    readMessage: (state, action) => {
      state.unreadMessages = [];
      state.chats = state.chats.map((chat) => {
        if (chat?._id === action?.payload?.chatId) {
          return {
            ...chat,
            unread: 0,
          };
        } else {
          return chat;
        }
        // console.log(chat.unread, "read message worked");
      });
    },
    makeMessageRead: (state, action) => {
      state.chats = state.chats.map((chat) => {
        if (
          chat?._id === action.payload.chatId &&
          chat?.lastMessage?.state !== "read" &&
          chat?.lastMessage?.isSender
        ) {
          chat.lastMessage.state = "read";
          chat.unread = 0;
        }
        return chat;
      });

      state.messages = state.messages.map((message) => {
        if (
          message.chatId === action.payload.chatId &&
          message.state !== "read" &&
          message.isSender
        ) {
          message.state = "read";
        }
        return message;
      });
    },
    pushNewMessage: (state, action) => {
      state.messages.unshift(action.payload);
    },
    pushUnreadMessage: (state, action) => {
      state.unreadMessages.push(action.payload);
    },
    updateLastMessage: (state, action) => {
      state.chats = state?.chats?.map((chat) => {
        if (chat?._id === action?.payload?.chatId) {
          chat.lastMessage = action?.payload?.message;
        }
        return chat;
      });
    },
    updateLastMessageForNewMessage: (state, action) => {
      state.chats = state.chats.map((chat) => {
        if (chat?._id === action.payload.chatId) {
          chat.lastMessage = action.payload.message;
          if (state.selectedChatId !== chat?._id) {
            chat.unread += 1;
          }
        }
        return chat;
      });
    },
    incrementUnreadCount: (state, action) => {
      state.chats = state.chats.map((chat) => {
        if (chat._id === action.payload.chatId) {
          chat.unread += 1;
        }
        return chat;
      });
    },
    resetChatSlice: (state) => {
      state.selectedChatId = null;
      state.selectedUserId = null;
      state.selectedUser = {
        name: "",
        isOnline: false,
      };
      state.messages = [];
      state.unreadMessages = [];
      state.chats = [];
    },
    markMessageReadByViewer: (state, action) => {
      state.messages = state.messages.map((message) => {
        if (
          message?.chatId === action.payload.chatId &&
          message?.isSender === false &&
          message?.state !== "read"
        ) {
          message.state = "read";
        }
      });

      state.chats = state.chats.map((chat) => {
        if (chat?._id === action.payload?.chatId) {
          if (
            chat?.lastMessage?.isSender === false &&
            chat?.lastMessage?.state !== "read"
          ) {
            chat.lastMessage.state = "read";
          }
          chat.unread = 0;
        }
        return chat;
      });
    },
  },

  markMessageReadBySender: (state, action) => {
    state.messages = state.messages.map((message) => {
      if (
        message.chatId === action.payload.chatId &&
        message.isSender === true &&
        message.state !== "read"
      ) {
        message.state = "read";
      }
    });

    state.chats = state.chats.map((chat) => {
      if (chat._id === action.payload.chatId) {
        if (
          chat.lastMessage.isSender === true &&
          chat.lastMessage.state !== "read"
        ) {
          chat.lastMessage.state = "read";
        }
      }
    });
  },
});

export const {
  setChats,
  pushChat,
  setFriendOnlineStatus,
  setMessages,
  setSelectedChatId,
  setSelectedUserId,
  setSelectedUser,
  undoSelectedChat,
  setLoading,
  setSelectedUserOnlineStatus,
  makeMessagesDelivered,
  readMessage,
  makeMessageRead,
  pushNewMessage,
  pushUnreadMessage,
  updateLastMessage,
  updateLastMessageForNewMessage,
  resetChatSlice,
  readIndividualMessage,
  makeMessageViewdById,
  markMessageReadByViewer,
  markMessageReadBySender,
  setTypingStatus,
} = slice.actions;

export default slice.reducer;

export const FetchChats = createAsyncThunk(
  "chat/fetchChats",
  async (_, { dispatch }) => {
    try {
      const response = await getRequest("/chat/all/chats");
      if (response.success) {
        dispatch(slice.actions.setChats(response.chats));
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const FetchChatMessages = createAsyncThunk(
  "chat/fetchChatMessages",
  async (chatId, { dispatch }) => {
    try {
      dispatch(setLoader(true));
      const response = await getRequest(`/chat/messages/${chatId}`);
      if (response.success) {
        dispatch(slice.actions.setMessages(response.messages));
        dispatch(slice.actions.setSelectedUser(response.friend));
        let unreadMessages;
        unreadMessages = response.messages.map((message) => {
          if (
            message.state === "sent" ||
            (message.state === "delivered" && !message.isSender)
          ) {
            return message._id;
          }
          return null;
        });
        dispatch(slice.actions.setUnreadMessages(unreadMessages));
      }
      dispatch(setLoader(false));

      return response;
    } catch (error) {
      console.log(error);
      dispatch(setLoader(false));
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (formData) => {
    try {
      // const chatId = getState().chat.selectedChatId;
      const response = await postMultiPartRequest(
        "/chat/send-message",
        formData
      );
      if (response.success) {
        // dispatch(slice.actions.pushNewMessage(response.message));
        // dispatch(
        //   slice.actions.updateLastMessage({
        //     chatId,
        //     message: response.message,
        //   })
        // );
        // console.log(response.message);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const ReadMessage = createAsyncThunk(
  "chat/ReadMessage",
  async (_, { getState }) => {
    try {
      const response = await postRequest(
        `/chat/read/${getState().chat.selectedChatId}`
      );
      if (response.success) {
        console.log(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const HandleNewMessage = createAsyncThunk(
  "chat/handleNewMessage",
  (message, { dispatch, getState }) => {
    const { socket } = useSocket();
    console.log(socket);
    const { selectedChatId } = getState().chat;
    if (selectedChatId === message.chatId) {
      dispatch(slice.actions.pushNewMessage(message));
      dispatch(slice.actions.makeMessageRead({ chatId: message.chatId }));
      dispatch(
        slice.actions.updateLastMessageForNewMessage({
          chatId: message.chatId,
          message,
        })
      );
      socket?.emit(READ_MESSAGE, { chatId: message.chatId });
    } else {
      dispatch(slice.actions.pushUnreadMessage(message._id));
      dispatch(
        slice.actions.updateLastMessageForNewMessage({
          chatId: message.chatId,
          message,
        })
      );
    }
  }
);

export const HandleReadEvent = createAsyncThunk(
  "chat/handleReadEvent",
  (_, { getState }) => {
    const { socket } = useSocket();
    const chatId = getState().chat.selectedChatId;
    console.log("Read Event", chatId);
    if (chatId) {
      socket?.emit(READ_MESSAGE, { chatId });
    }
  }
);

export const CreateGroup = createAsyncThunk(
  "chat/createGroup",
  async (data) => {
    try {
      setLoading(true);
      const response = await postMultiPartRequest("/chat/create-group", data);
      if (response.success) {
        // dispatch(slice.actions.pushChat(response.chat));
        console.log(response);
        return response;
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create group");
    } finally {
      setLoading(false);
    }
  }
);
