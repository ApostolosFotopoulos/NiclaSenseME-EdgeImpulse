import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isGatheringData: false,
  selectedPatient: {},
};

export const patientInfoSlice = createSlice({
  name: "patientInfo",
  initialState,
  reducers: {
    toggleIsGatheringData: (state) => {
      state.isGatheringData = !state.isGatheringData;
    },
    setSelectedpatient: (state, patient) => {
      state.selectedPatient = patient.payload;
    },
  },
});

export const { toggleIsGatheringData, setSelectedpatient } = patientInfoSlice.actions;

export default patientInfoSlice.reducer;
