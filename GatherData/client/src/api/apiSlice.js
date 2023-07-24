import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

let baseUrl = "http://localhost:5000/api/";
if (process.env.NODE_ENV === "production") {
  baseUrl = "api/";
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl, timeout: 5000 }),
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
        headers: { "jwt-token": jwtToken },
      }),
    }),
    getDoctor: builder.query({
      query: ({ jwtToken }) => ({
        url: "doctor",
        headers: { "jwt-token": jwtToken },
      }),
    }),
    getPatients: builder.query({
      query: ({ jwtToken, doctorId, partOfName }) => ({
        url: `patients/${doctorId}&${partOfName}`,
        headers: { "jwt-token": jwtToken },
      }),
    }),
    postPatient: builder.mutation({
      query: ({ jwtToken, ...body }) => ({
        url: "patient",
        method: "POST",
        body: body,
        headers: { "jwt-token": jwtToken },
      }),
    }),
    postPrediction: builder.mutation({
      query: ({ jwtToken, ...body }) => ({
        url: "prediction",
        method: "POST",
        body: body,
        headers: { "jwt-token": jwtToken },
      }),
    }),
    getLatestSessions: builder.query({
      query: ({ jwtToken, patientId }) => ({
        url: `latest-sessions/${patientId}`,
        headers: { "jwt-token": jwtToken },
      }),
    }),
    postSession: builder.mutation({
      query: ({ jwtToken, ...body }) => ({
        url: "session",
        method: "POST",
        body: body,
        headers: { "jwt-token": jwtToken },
      }),
    }),
  }),
});

export const {
  useSignUpDoctorMutation,
  useLogInDoctorMutation,
  useLazyVerifyDoctorQuery,
  useLazyGetDoctorQuery,
  useLazyGetPatientsQuery,
  usePostPatientMutation,
  usePostPredictionMutation,
  useLazyGetLatestSessionsQuery,
  usePostSessionMutation,
} = apiSlice;
