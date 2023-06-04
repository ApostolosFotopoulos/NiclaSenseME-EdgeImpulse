import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import statusReducer from "pages/main/status/statusSlice";
import patientInfoReducer from "pages/main/patientInfo/patientInfoSlice";
import { apiSlice } from "api/apiSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    status: statusReducer,
    patientInfo: patientInfoReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

setupListeners(store.dispatch);
