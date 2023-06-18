import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
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
  },
});

export const { enableIsAuthenticated, disableIsAuthenticated } = appSlice.actions;

export const selectIsAuthenticated = (state) => state.app.isAuthenticated;

export default appSlice.reducer;
