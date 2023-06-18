import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import statusReducer from "pages/dashboard/status/statusSlice";
import patientInfoReducer from "pages/dashboard/patientInfo/patientInfoSlice";
import appReducer from "app/appSlice";
import { apiSlice } from "api/apiSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    status: statusReducer,
    patientInfo: patientInfoReducer,
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

setupListeners(store.dispatch);
