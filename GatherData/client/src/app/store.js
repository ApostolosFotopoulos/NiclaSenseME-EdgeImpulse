import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import appReducer from "app/appSlice";
import statusReducer from "pages/dashboard/status/statusSlice";
import patientInfoReducer from "pages/dashboard/patientInfo/patientInfoSlice";
import doctorProfileReducer from "pages/dashboard/status/doctorProfile/doctorProfileSlice";
import { apiSlice } from "api/apiSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    app: appReducer,
    status: statusReducer,
    doctorProfile: doctorProfileReducer,
    patientInfo: patientInfoReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: false,
});

setupListeners(store.dispatch);
