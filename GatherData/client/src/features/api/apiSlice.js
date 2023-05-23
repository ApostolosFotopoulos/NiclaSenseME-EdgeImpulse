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
    postPrediction: builder.mutation({
      query: (body) => ({
        url: "prediction",
        method: "POST",
        body: body,
      }),
    }),
  }),
});

export const { useLazyGetPatientQuery, usePostPatientMutation, usePostPredictionMutation } = apiSlice;
