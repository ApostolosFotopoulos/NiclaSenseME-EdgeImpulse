import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isGatheringData: false,
  isSubmittingSession: false,
  gatherButtonText: "GATHER DATA",
  selectedPatient: {},
};

export const patientInfoSlice = createSlice({
  name: "patientInfo",
  initialState,
  reducers: {
    enableIsGatheringData: (state) => {
      state.isGatheringData = true;
      state.gatherButtonText = "GATHERING";
    },
    disableIsGatheringData: (state) => {
      state.isGatheringData = false;
      state.gatherButtonText = "GATHER DATA";
    },
    enableIsSubmittingSession: (state) => {
      state.isSubmittingSession = true;
      state.gatherButtonText = "SUBMITTING";
    },
    disableIsSubmittingSession: (state) => {
      state.isSubmittingSession = false;
      state.gatherButtonText = "GATHER DATA";
    },
    setGatherButtonText: (state, txt) => {
      state.gatherButtonText = txt.payload;
    },
    setSelectedpatient: (state, patient) => {
      state.selectedPatient = patient.payload;
    },
  },
});

export const {
  enableIsGatheringData,
  disableIsGatheringData,
  enableIsSubmittingSession,
  disableIsSubmittingSession,
  setGatherButtonText,
  setSelectedpatient,
} = patientInfoSlice.actions;

export const selectIsGatheringData = (state) => state.patientInfo.isGatheringData;
export const selectIsSubmittingSession = (state) => state.patientInfo.isSubmittingSession;
export const selectGatherButtonText = (state) => state.patientInfo.gatherButtonText;
export const selectSelectedPatient = (state) => state.patientInfo.selectedPatient;

export default patientInfoSlice.reducer;
