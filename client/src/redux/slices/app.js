import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isError: false,
  errorMessage: "",
  openCreateGroupModal: false,
};

export const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLoader(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.isError = action.payload.isError;
      state.errorMessage = action.payload.errorMessage;
    },
    setOpenCreateGroupModal(state, action) {
      state.openCreateGroupModal = action.payload;
    },
  },
});

export const { setLoader, setError, setOpenCreateGroupModal } = slice.actions;

export default slice.reducer;
