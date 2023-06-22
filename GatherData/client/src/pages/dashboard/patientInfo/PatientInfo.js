import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkRes, getCurrentDate } from "utils/utils";
import { isEmptyObj } from "utils/validateData";
import { setStatus } from "pages/dashboard/status/statusSlice";
import { selectIsConnected } from "pages/dashboard/status/statusSlice";
import {
  enableIsGatheringData,
  disableIsGatheringData,
  enableIsSubmittingSession,
  disableIsSubmittingSession,
} from "./patientInfoSlice";
import {
  selectIsGatheringData,
  selectIsSubmittingSession,
  selectGatherButtonText,
  selectSelectedPatient,
} from "./patientInfoSlice";
import {
  useLazyGetPredictionCountQuery,
  useLazyGetSessionQuery,
  usePostSessionMutation,
  useUpdateSessionMutation,
} from "api/apiSlice";

export default function PatientInfo() {
  // Redux state
  const isGatheringData = useSelector(selectIsGatheringData);
  const isSubmittingSession = useSelector(selectIsSubmittingSession);
  const gatherButtonText = useSelector(selectGatherButtonText);
  const selectedPatient = useSelector(selectSelectedPatient);
  const isConnected = useSelector(selectIsConnected);
  const dispatch = useDispatch();

  // Queries
  const [getPredictionCount] = useLazyGetPredictionCountQuery();
  const [getSession] = useLazyGetSessionQuery();
  const [insertSession] = usePostSessionMutation();
  const [updateSession] = useUpdateSessionMutation();

  async function submitSession() {
    dispatch(enableIsSubmittingSession());

    try {
      // Ckeck if valid predictions exist
      let res = await getPredictionCount({
        patientId: selectedPatient.patientId,
        predictionDate: getCurrentDate(),
      }).unwrap();
      checkRes(res);

      const { count } = res;
      console.log(count);
      if (count <= 0) {
        return;
      }

      res = await getSession({
        patientId: selectedPatient.patientId,
        sessionDate: getCurrentDate(),
      }).unwrap();
      checkRes(res);
      console.log(res);

      if (res === null) {
        res = await insertSession({
          patientId: selectedPatient.patientId,
          sessionDate: getCurrentDate(),
        }).unwrap();
        checkRes(res);
        console.log(res);
      } else {
        const { session_id: sessionId } = res;
        console.log(sessionId);
        res = await updateSession({
          sessionId: sessionId,
          patientId: selectedPatient.patientId,
          sessionDate: getCurrentDate(),
        });
        checkRes(res);
        console.log(res);
      }
    } catch (e) {
      console.log(e);
      dispatch(setStatus("Error communicating with the database"));
    }

    dispatch(disableIsSubmittingSession());
  }

  // Enable gathering data to the database
  async function gatherData() {
    if (!isConnected) {
      dispatch(setStatus("Nicla isn't connected"));
      return;
    }

    if (isEmptyObj(selectedPatient)) {
      dispatch(setStatus("No patient is selected"));
      return;
    }

    if (isGatheringData) {
      dispatch(disableIsGatheringData());
      await submitSession();
      return;
    }

    dispatch(enableIsGatheringData());
  }

  return (
    <div className="col-container">
      <h1>Patient's Details</h1>
      <div className="patient__details">
        <input
          readOnly
          placeholder="First Name"
          type="text"
          className="patient__details-input"
          id={"patient-details-first-name"}
          value={selectedPatient.patientFirstName}
        />
        <input
          readOnly
          placeholder="Last Name"
          type="text"
          className="patient__details-input"
          id={"patient-details-last-name"}
          value={selectedPatient.patientLastName}
        />
        <input
          readOnly
          placeholder="Date Of Birth"
          type="text"
          className="patient__details-input"
          id={"patient-details-date-of-birth"}
          value={selectedPatient.patientDateOfBirth}
        />
      </div>

      <button
        className={`patient__details-button ${isGatheringData ? "patient__details-button--collecting" : ""}`}
        onClick={gatherData}
        disabled={isSubmittingSession}
      >
        {gatherButtonText}
      </button>
    </div>
  );
}
