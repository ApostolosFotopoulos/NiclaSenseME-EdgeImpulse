import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import statusReducer from "features/status/statusSlice";
import patientInfoReducer from "features/patientInfo/patientInfoSlice";
import { apiSlice } from "features/api/apiSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    status: statusReducer,
    patientInfo: patientInfoReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

setupListeners(store.dispatch);
