import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/", timeout: 5000 }),
  endpoints: (builder) => ({
    signUpDoctor: builder.mutation({
      query: (body) => ({
        url: "signup",
        method: "POST",
        body: body,
      }),
    }),
    logInDoctor: builder.mutation({
      query: (body) => ({
        url: "login",
        method: "POST",
        body: body,
      }),
    }),
    verifyDoctor: builder.query({
      query: ({ jwtToken }) => ({
        url: "verify",
        headers: { jwt_token: jwtToken },
      }),
    }),
    getDoctor: builder.query({
      query: ({ jwtToken }) => ({
        url: "doctor",
        headers: { jwt_token: jwtToken },
      }),
    }),
    getPatient: builder.query({
      query: ({ doctorId, patientFirstName, patientLastName, patientDateOfBirth }) =>
        `patient/${doctorId}&${patientFirstName}&${patientLastName}&${patientDateOfBirth}`,
    }),
    postPatient: builder.mutation({
      query: (body) => ({
        url: "patient",
        method: "POST",
        body: body,
      }),
    }),
    getPredictionCount: builder.query({
      query: ({ patientId, predictionDate }) => `prediction-count/${patientId}&${predictionDate}`,
    }),
    postPrediction: builder.mutation({
      query: (body) => ({
        url: "prediction",
        method: "POST",
        body: body,
      }),
    }),
    getSession: builder.query({
      query: ({ patientId, sessionDate }) => `session/${patientId}&${sessionDate}`,
    }),
    postSession: builder.mutation({
      query: (body) => ({
        url: "session",
        method: "POST",
        body: body,
      }),
    }),
    updateSession: builder.mutation({
      query: ({ sessionId, patientId, sessionDate, ...body }) => ({
        url: `session/${sessionId}&${patientId}&${sessionDate}`,
        method: "PUT",
        body: body,
      }),
    }),
  }),
});

export const {
  useSignUpDoctorMutation,
  useLogInDoctorMutation,
  useLazyVerifyDoctorQuery,
  useLazyGetDoctorQuery,
  useLazyGetPatientQuery,
  usePostPatientMutation,
  useLazyGetPredictionCountQuery,
  usePostPredictionMutation,
  useLazyGetSessionQuery,
  usePostSessionMutation,
  useUpdateSessionMutation,
} = apiSlice;
