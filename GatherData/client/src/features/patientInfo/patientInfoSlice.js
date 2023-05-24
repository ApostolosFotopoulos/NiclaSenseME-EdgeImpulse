import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isGatheringData: false,
  gatherButtonText: "GATHER DATA",
  selectedPatient: {},
};

export const patientInfoSlice = createSlice({
  name: "patientInfo",
  initialState,
  reducers: {
    toggleIsGatheringData: (state) => {
      state.isGatheringData = !state.isGatheringData;
    },
    stopGatheringData: (state) => {
      state.isGatheringData = false;
    },
    setGatherButtonText: (state, txt) => {
      state.gatherButtonText = txt.payload;
    },
    setSelectedpatient: (state, patient) => {
      state.selectedPatient = patient.payload;
    },
  },
});

export const { toggleIsGatheringData, stopGatheringData, setGatherButtonText, setSelectedpatient } =
  patientInfoSlice.actions;

export const selectIsGatheringData = (state) => state.patientInfo.isGatheringData;
export const selectGatherButtonText = (state) => state.patientInfo.gatherButtonText;
export const selectSelectedPatient = (state) => state.patientInfo.selectedPatient;

export default patientInfoSlice.reducer;
