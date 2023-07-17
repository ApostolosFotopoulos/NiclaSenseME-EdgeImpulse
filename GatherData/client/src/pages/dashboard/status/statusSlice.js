import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  msg: "Waiting ...",
  connectButtonText: "CONNECT CPWATCHER",
  isConnecting: false,
  isConnected: false,
};

export const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    setStatus: (state, msg) => {
      state.msg = msg.payload;
    },
    enableIsConnecting: (state) => {
      state.isConnecting = true;
      state.connectButtonText = "CONNECTING";
      state.msg = "Requesting device ...";
    },
    disableIsConnecting: (state) => {
      state.isConnecting = false;
    },
    enableIsConnected: (state) => {
      state.isConnected = true;
      state.connectButtonText = "CONNECTED";
      state.msg = "Characteristics configured";
    },
    disableIsConnected: (state) => {
      state.isConnecting = false;
      state.isConnected = false;
      state.connectButtonText = "CONNECT CPWATCHER";
      state.msg = "Waiting ...";
    },
  },
});

export const { setStatus, enableIsConnecting, disableIsConnecting, enableIsConnected, disableIsConnected } =
  statusSlice.actions;

export const selectMsg = (state) => state.status.msg;
export const selectIsConnecting = (state) => state.status.isConnecting;
export const selectIsConnected = (state) => state.status.isConnected;
export const selectConnectButtonText = (state) => state.status.connectButtonText;

export default statusSlice.reducer;
