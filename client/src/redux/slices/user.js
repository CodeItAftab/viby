import { getRequest, postMultiPartRequest, postRequest } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setFirstLogin } from "./auth";

const initialState = {
  user: undefined,
  users: [],
  // requests: [],
  chats: [],
  // sentRequests: [],
  friends: [],
  isLoading: false,
};

export const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setUsers(state, action) {
      state.users = action.payload;
    },
    setFriends(state, action) {
      state.friends = action.payload;
    },
    makeSentRequest(state, action) {
      state.users = state.users.map((user) =>
        user._id.toString() === action.payload.receiver._id.toString()
          ? { ...user, isSentRequest: true, requestId: action.payload._id }
          : user
      );
    },
    makeRequestAccepted(state, action) {
      state.users = state.users.map((user) =>
        user?.requestId?.toString() === action.payload.requestId.toString()
          ? {
              ...user,
              isSentRequest: false,
              isReceivedRequest: false,
              isFriend: true,
              chatId: action.payload.chatId,
              requestId: null,
              isOnline: action.payload?.friend?.isOnline,
              avatar: action.payload?.friend?.avatar,
            }
          : user
      );
      state.friends.push(action.payload?.friend);
    },
    makeNewRequest(state, action) {
      state.users = state.users.map((user) =>
        user._id.toString() === action.payload.sender._id.toString()
          ? {
              ...user,
              isReceivedRequest: true,
              requestId: action.payload._id,
            }
          : user
      );
    },
    rejectRequest(state, action) {
      state.users = state.users.map((user) =>
        user?.requestId?.toString() === action.payload.requestId.toString()
          ? {
              ...user,
              isSentRequest: false,
              isReceivedRequest: false,
              requestId: null,
            }
          : user
      );
    },
    setFriendOnlineStatusInUserSlice: (state, action) => {
      state.friends = state.friends.map((user) =>
        user.chatId === action.payload.chatId
          ? { ...user, isOnline: action.payload.isOnline }
          : user
      );
    },

    unsentRequest(state, action) {
      state.users = state.users.map((user) =>
        user?.requestId?.toString() === action.payload.requestId.toString()
          ? {
              ...user,
              isSentRequest: false,
              requestId: null,
              isReceivedRequest: false,
            }
          : user
      );
    },

    resetUserSlice(state) {
      state.user = undefined;
      state.users = [];
      state.requests = [];
      state.sentRequests = [];
      state.friends = [];
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setUser,
  setUsers,
  makeSentRequest,
  unsentRequest,
  makeRequestAccepted,
  makeNewRequest,
  rejectRequest,
  setFriends,
  resetUserSlice,
  setFriendOnlineStatusInUserSlice,
  setIsLoading,
} = slice.actions;

export default slice.reducer;

// export const SendFriendRequest = createAsyncThunk(
//   "user/sendFriendRequest",
//   async (receiverId) => {
//     try {
//       const response = await postRequest("/request/send", { to: receiverId });
//       if (response.success) {
//
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }
// );

// export const CancelFriendRequest = createAsyncThunk(
//   "user/cancelFriendRequest",
//   async (requestId) => {
//     try {
//       const response = await postRequest(`/request/cancel/${requestId}`);
//       if (response.success) {
// console.log(response);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }
// );

export const FetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (_, { dispatch }) => {
    try {
      const response = await getRequest("/user/all/users");
      if (response.success) dispatch(slice.actions.setUsers(response.users));
    } catch (error) {
      console.log(error);
    }
  }
);

// export const FetchAllRequests = createAsyncThunk(
//   "user/fetchAllRequests",
//   async (_, { dispatch }) => {
//     try {
//       const response = await getRequest("/user/all/requests");
//       if (response.success) {
//         dispatch(slice.actions.setRequests(response.requests));
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }
// );

// export const FetchAllSentRequests = createAsyncThunk(
//   "user/fetchAllSentRequests",
//   async (_, { dispatch }) => {
//     try {
//       const response = await getRequest("/user/all/sent_requests");
//       if (response.success) {
//
//         dispatch(slice.actions.setSentRequests(response.requests));
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }
// );

export const FetchAllFriends = createAsyncThunk(
  "user/fetchAllFriends",
  async (_, { dispatch }) => {
    try {
      const response = await getRequest("/user/all/friends");
      if (response.success)
        dispatch(slice.actions.setFriends(response.friends));
    } catch (error) {
      console.log(error);
    }
  }
);

export const firstProfileUpdate = createAsyncThunk(
  "auth/firstProfileUpdate",
  async (data, { dispatch }) => {
    try {
      dispatch(slice.actions.setIsLoading(true));
      const response = await postMultiPartRequest(
        "/user/first_profile_update",
        data
      );
      if (response.success) {
        dispatch(setFirstLogin(false));
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(slice.actions.setIsLoading(false));
    }
  }
);

export const fetchMyProfile = createAsyncThunk(
  "user/fetchMyProfile",
  async (_, { dispatch, getState }) => {
    try {
      const userId = getState().auth.userId;
      const response = await getRequest(`/user/${userId}`);
      if (response.success) {
        dispatch(slice.actions.setUser(response.user));
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const uploadFCMToken = createAsyncThunk(
  "user/uploadFCMToken",
  async (token) => {
    try {
      await postRequest("/user/upload_fcm_token", {
        fcmToken: token,
      });
    } catch (error) {
      console.log(error);
    }
  }
);
