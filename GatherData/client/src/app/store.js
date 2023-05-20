import { configureStore } from "@reduxjs/toolkit";
import statusReducer from "features/status/statusSlice";
import patientInfoReducer from "features/patientInfo/patientInfoSlice";

export const store = configureStore({
  reducer: {
    status: statusReducer,
    patientInfo: patientInfoReducer,
  },
});
