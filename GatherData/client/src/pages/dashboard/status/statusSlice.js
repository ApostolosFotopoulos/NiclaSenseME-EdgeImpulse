import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  msg: "Waiting ...",
  connectButtonText: "CONNECT CPWATCHER",
  collectedData: [],
  isConnecting: false,
  isConnected: false,
};

export const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    setStatus: (state, msg) => {
      if (msg.payload.showSensorPredictions) {
        const nIndex = msg.payload.text.indexOf("N");
        const cp1Index = msg.payload.text.indexOf("CP1");
        const cp2Index = msg.payload.text.indexOf("CP2");

        const n = msg.payload.text.slice(nIndex, nIndex + 6);
        const cp1 = msg.payload.text.slice(cp1Index, cp1Index + 8);
        const cp2 = msg.payload.text.slice(cp2Index, cp2Index + 8);
        state.msg = [n, cp1, cp2];
      } else {
        state.msg = msg.payload;
      }
    },
    addData: (state, data) => {
      state.collectedData.push(data.payload);
    },
    clearData: (state) => {
      state.collectedData = [];
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

export const {
  setStatus,
  addData,
  clearData,
  enableIsConnecting,
  disableIsConnecting,
  enableIsConnected,
  disableIsConnected,
} = statusSlice.actions;

export const selectMsg = (state) => state.status.msg;
export const selectCollectedData = (state) => state.status.collectedData;
export const selectIsConnecting = (state) => state.status.isConnecting;
export const selectIsConnected = (state) => state.status.isConnected;
export const selectConnectButtonText = (state) => state.status.connectButtonText;

export default statusSlice.reducer;
