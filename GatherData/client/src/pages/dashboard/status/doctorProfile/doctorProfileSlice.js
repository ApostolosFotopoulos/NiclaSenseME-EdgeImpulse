import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  doctor: {
    doctorId: "",
    doctorUserName: "",
    doctorFirstName: "",
    doctorLastName: "",
  },
};

export const doctorProfileSlice = createSlice({
  name: "doctorProfile",
  initialState,
  reducers: {
    setDoctor: (state, doctor) => {
      state.doctor = doctor.payload;
    },
  },
});

export const { setDoctor } = doctorProfileSlice.actions;

export const selectDoctor = (state) => state.doctorProfile.doctor;

export default doctorProfileSlice.reducer;
