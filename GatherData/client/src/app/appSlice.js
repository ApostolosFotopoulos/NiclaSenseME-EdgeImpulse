import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  checkedAuth: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    enableIsAuthenticated: (state) => {
      state.isAuthenticated = true;
    },
    disableIsAuthenticated: (state) => {
      state.isAuthenticated = false;
    },
    enableCheckedAuth: (state) => {
      state.checkedAuth = true;
    },
    disableCheckedAuth: (state) => {
      state.checkedAuth = false;
    },
  },
});

export const { enableIsAuthenticated, disableIsAuthenticated, enableCheckedAuth, disableCheckedAuth } =
  appSlice.actions;

export const selectIsAuthenticated = (state) => state.app.isAuthenticated;
export const selectCheckedAuth = (state) => state.app.checkedAuth;

export default appSlice.reducer;
