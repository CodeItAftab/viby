import { postRequest } from "@/lib/axios";
import { toast } from "react-hot-toast";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { resetUserSlice } from "./user";
import { resetChatSlice } from "./chat";

const initialState = {
  userId: undefined,
  isLoggedIn: false,
  isFirstLogin: false,
  isLoading: false,
};

export const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.userId = action.payload.userId;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.userId = undefined;
      state.isLoggedIn = false;
    },
    setFirstLogin(state, action) {
      state.isFirstLogin = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const { login, logout, setFirstLogin } = slice.actions;

export default slice.reducer;

export const LoginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, { dispatch }) => {
    try {
      dispatch(slice.actions.setIsLoading(true));
      const response = await postRequest("/auth/login", data);
      if (response.success) {
        toast.success(response.message);
        // window.localStorage.setItem("reload", "true");
        dispatch(slice.actions.login({ userId: response.userId }));
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      dispatch(slice.actions.setIsLoading(false));
    }
  }
);

export const LogoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    try {
      const browserId = window.localStorage.getItem("browserId");
      const response = await postRequest("/auth/logout", { browserId });
      if (response?.success) {
        window.localStorage.removeItem("reload");
        window.localStorage.removeItem("browserId");
        window.localStorage.removeItem("lastNotificationPrompt");
        dispatch(resetUserSlice());
        dispatch(slice.actions.logout());
        dispatch(resetChatSlice());
        return response;
      }
    } catch (err) {
      console.error(err);
    }
  }
);

export const RegisterUser = createAsyncThunk(
  "auth/registerUser",
  async (data, { dispatch }) => {
    try {
      dispatch(slice.actions.setIsLoading(true));
      const response = await postRequest("/auth/register", data);
      if (response.success) {
        console.log(response);
        window.localStorage.setItem("email", data.email);
        return response;
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(slice.actions.setIsLoading(false));
    }
  }
);

export const VerifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (data, { dispatch }) => {
    try {
      dispatch(slice.actions.setIsLoading(true));
      const response = await postRequest("/auth/verify_otp", data);
      if (response.success) {
        dispatch(slice.actions.setFirstLogin(true));
        dispatch(slice.actions.login({ userId: response.userId }));
        window.localStorage.removeItem("email");
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(slice.actions.setIsLoading(false));
    }
  }
);
