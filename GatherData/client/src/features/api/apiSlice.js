import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/" }),
  endpoints: (builder) => ({
    getPatient: builder.query({
      query: ({ patientFirstName, patientLastName, patientDateOfBirth }) =>
        `patient/${patientFirstName}&${patientLastName}&${patientDateOfBirth}`,
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
        body,
      }),
    }),
  }),
});

export const {
  useLazyGetPatientQuery,
  usePostPatientMutation,
  useLazyGetPredictionCountQuery,
  usePostPredictionMutation,
  useLazyGetSessionQuery,
  usePostSessionMutation,
  useUpdateSessionMutation,
} = apiSlice;
