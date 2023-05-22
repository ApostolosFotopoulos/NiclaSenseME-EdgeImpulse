import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  msg: "Waiting ...",
  isConnected: false,
};

export const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    setStatus: (state, msg) => {
      state.msg = msg.payload;
    },
    toggleIsConnected: (state) => {
      state.isConnected = !state.isConnected;
    },
    setIsConnected: (state, isConnected) => {
      state.isConnected = isConnected.payload;
    },
  },
});

export const { setStatus, toggleIsConnected, setIsConnected } = statusSlice.actions;

export const selectMsg = (state) => state.status.msg;
export const selectIsConnected = (state) => state.status.isConnected;

export default statusSlice.reducer;
