import React from "react";
import { useDispatch, useSelector } from "react-redux";

// Utils
import { hasSelectedPatient } from "utils/validateData";
import { getCurrentDate, toDisplayFormat } from "utils/utils";

// Redux selectors
import { selectCollectedData, selectIsConnected } from "pages/dashboard/status/statusSlice";
import {
  selectIsGatheringData,
  selectIsSubmittingSession,
  selectGatherButtonText,
  selectSelectedPatient,
} from "pages/dashboard/patientInfo/patientInfoSlice";

// Redux reducers
import { setStatus, clearData } from "pages/dashboard/status/statusSlice";
import {
  enableIsGatheringData,
  disableIsGatheringData,
  enableIsSubmittingSession,
  disableIsSubmittingSession,
} from "pages/dashboard/patientInfo/patientInfoSlice";

// Queries
import { usePostSessionMutation } from "api/apiSlice";

// Components
import SearchPatient from "pages/dashboard/patientInfo/searchPatient/SearchPatient";

export default function PatientInfo() {
  // Redux state
  const dispatch = useDispatch();
  const collectedData = useSelector(selectCollectedData);
  const isGatheringData = useSelector(selectIsGatheringData);
  const isSubmittingSession = useSelector(selectIsSubmittingSession);
  const gatherButtonText = useSelector(selectGatherButtonText);
  const selectedPatient = useSelector(selectSelectedPatient);
  const isConnected = useSelector(selectIsConnected);

  // Queries
  const [insertSession] = usePostSessionMutation();

  // Insert the new session if valid predictions exist
  // If the session exists then update it
  async function submitSession() {
    dispatch(enableIsSubmittingSession());

    try {
      await insertSession({
        jwtToken: localStorage.accessToken,
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
      if (collectedData.length > 0) {
        const showData = collectedData.reduce(
          (acc, cur) => {
            const temp = {};
            temp.normal = acc.normal + cur.normal;
            temp.cp = acc.cp + cur.cp2 + cur.cp1;
            return temp;
          },
          { normal: 0, cp: 0 }
        );

        showData.normal = showData.normal / collectedData.length;
        showData.cp = showData.cp / collectedData.length;

        dispatch(clearData());
        dispatch(
          setStatus({
            text: `N:${showData.normal.toFixed(2)},
            CP:${showData.cp.toFixed(2)}`,
            showSensorPredictions: true,
          })
        );
      }

      await submitSession();
      dispatch(disableIsGatheringData());
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
          value={
            selectedPatient.patientDateOfBirth ? toDisplayFormat(selectedPatient.patientDateOfBirth) : ""
          }
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
