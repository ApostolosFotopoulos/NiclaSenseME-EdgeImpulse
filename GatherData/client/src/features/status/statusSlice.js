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

export default statusSlice.reducer;
