import { getRequest, postRequest } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  makeRequestAccepted,
  makeSentRequest,
  rejectRequest,
  unsentRequest,
} from "./user";

const initialState = {
  requests: [],
  sentRequests: [],
};

export const slice = createSlice({
  name: "request",
  initialState,
  reducers: {
    setRequests(state, action) {
      state.requests = action.payload;
    },
    setSentRequests(state, action) {
      state.sentRequests = action.payload;
    },
    addRequest(state, action) {
      state.requests = state.requests.concat(action.payload);
    },
    addSentRequest(state, action) {
      state.sentRequests = state.sentRequests.concat(action.payload);
    },
    removeSentRequest(state, action) {
      state.sentRequests = state.sentRequests.filter(
        (request) => request._id.toString() !== action.payload.requestId
      );
    },
    removeRequestFromList(state, action) {
      state.requests = state.requests.filter(
        (request) => request._id.toString() !== action.payload.requestId
      );
    },
  },
});

export const {
  setRequests,
  setSentRequests,
  addRequest,
  addSentRequest,
  removeSentRequest,
  removeRequestFromList,
} = slice.actions;

export default slice.reducer;

// <------------------   Async Thunks   -------------------->

export const SendFriendRequest = createAsyncThunk(
  "user/sendFriendRequest",
  async (receiverId, { dispatch }) => {
    try {
      const response = await postRequest("/request/send", { to: receiverId });
      if (response?.success) {
        console.log(response);
        dispatch(slice.actions.addSentRequest(response?.request));
        dispatch(makeSentRequest(response?.request));
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const CancelFriendRequest = createAsyncThunk(
  "user/cancelFriendRequest",
  async (requestId, { dispatch }) => {
    try {
      const response = await postRequest(`/request/cancel/${requestId}`);
      if (response?.success) {
        console.log(response);
        dispatch(
          slice.actions.removeSentRequest({ requestId: response?.requestId })
        );
        dispatch(unsentRequest({ requestId: response?.requestId }));
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const AcceptFriendRequest = createAsyncThunk(
  "user/acceptFriendRequest",
  async (requestId, { dispatch }) => {
    try {
      const response = await postRequest(`/request/accept/${requestId}`);
      if (response?.success) {
        console.log(response);
        dispatch(
          slice.actions.removeRequestFromList({
            requestId: response?.requestId,
          })
        );
        dispatch(
          makeRequestAccepted({
            requestId: response?.requestId,
            chatId: response?.chatId,
            friend: response?.friend,
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const RejectFriendRequest = createAsyncThunk(
  "user/rejectFriendRequest",
  async (requestId, { dispatch }) => {
    try {
      const response = await postRequest(`/request/reject/${requestId}`);
      if (response?.success) {
        console.log(response);
        dispatch(
          slice.actions.removeRequestFromList({
            requestId: response?.requestId,
          })
        );
        dispatch(rejectRequest({ requestId: response?.requestId }));
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const FetchAllRequests = createAsyncThunk(
  "user/fetchAllRequests",
  async (_, { dispatch }) => {
    try {
      const response = await getRequest("/request/all/received");
      if (response?.success) {
        dispatch(slice.actions.setRequests(response?.requests));
        // console.log("Received Requests:", response?.requests);
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const FetchAllSentRequests = createAsyncThunk(
  "user/fetchAllSentRequests",
  async (_, { dispatch }) => {
    try {
      const response = await getRequest("/request/all/sent");
      if (response.success) {
        dispatch(slice.actions.setSentRequests(response.requests));
      }
    } catch (error) {
      console.log(error);
    }
  }
);
