import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentDate } from "utils/utils";
import { hasSelectedPatient } from "utils/validateData";
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
import { usePostSessionMutation } from "api/apiSlice";
import SearchPatient from "./searchPatient/SearchPatient";

export default function PatientInfo() {
  // Redux state
  const isGatheringData = useSelector(selectIsGatheringData);
  const isSubmittingSession = useSelector(selectIsSubmittingSession);
  const gatherButtonText = useSelector(selectGatherButtonText);
  const selectedPatient = useSelector(selectSelectedPatient);
  const isConnected = useSelector(selectIsConnected);
  const dispatch = useDispatch();

  // Queries
  const [insertSession] = usePostSessionMutation();

  // Insert the new session if valid predictions exist
  // If the session exists then update it
  async function submitSession() {
    dispatch(enableIsSubmittingSession());

    try {
      await insertSession({
        patientId: selectedPatient.patientId,
        sessionDate: getCurrentDate(),
      }).unwrap();
    } catch (err) {
      if (err?.data) {
        dispatch(setStatus(err.data.errMsg));
      } else {
        dispatch(setStatus("No server response"));
      }
    }

    dispatch(disableIsSubmittingSession());
  }

  // Enable gathering data to the database
  async function gatherData() {
    if (!isConnected) {
      dispatch(setStatus("Nicla isn't connected"));
      return;
    }

    if (!hasSelectedPatient(selectedPatient)) {
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
      <SearchPatient />
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
        className={`patient__details-button ${isGatheringData ? "button-loading" : ""}`}
        onClick={gatherData}
        disabled={isSubmittingSession}
      >
        {gatherButtonText}
      </button>
    </div>
  );
}
