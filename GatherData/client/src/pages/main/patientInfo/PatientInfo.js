import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PatientInput from "./PatientInput";
import SelectedPatientInput from "./SelectedPatientInput";
import { checkRes, isValidYear, isEmptyObj, getCurrentDate, isValidDate, toIsoDayFormat } from "utils/utils";
import { setStatus } from "pages/main/status/statusSlice";
import { selectIsConnected } from "pages/main/status/statusSlice";
import {
  enableIsGatheringData,
  disableIsGatheringData,
  enableIsSubmittingSession,
  disableIsSubmittingSession,
  setSelectedpatient,
} from "./patientInfoSlice";
import {
  selectIsGatheringData,
  selectIsSubmittingSession,
  selectGatherButtonText,
  selectSelectedPatient,
} from "./patientInfoSlice";
import {
  useLazyGetPatientQuery,
  usePostPatientMutation,
  useLazyGetPredictionCountQuery,
  useLazyGetSessionQuery,
  usePostSessionMutation,
  useUpdateSessionMutation,
} from "api/apiSlice";

export default function PatientInfo() {
  // Local state
  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientLastName, setPatientLastName] = useState("");
  const [patientDateOfBirth, setPatientDateOfBirth] = useState("");

  // Redux state
  const isGatheringData = useSelector(selectIsGatheringData);
  const isSubmittingSession = useSelector(selectIsSubmittingSession);
  const gatherButtonText = useSelector(selectGatherButtonText);
  const selectedPatient = useSelector(selectSelectedPatient);
  const isConnected = useSelector(selectIsConnected);
  const dispatch = useDispatch();

  // Queries
  const [getPatient] = useLazyGetPatientQuery();
  const [insertPatient] = usePostPatientMutation();
  const [getPredictionCount] = useLazyGetPredictionCountQuery();
  const [getSession] = useLazyGetSessionQuery();
  const [insertSession] = usePostSessionMutation();
  const [updateSession] = useUpdateSessionMutation();

  // Clear the form
  function clearForm() {
    setPatientFirstName("");
    setPatientLastName("");
    setPatientDateOfBirth("");
  }

  // Select and submit the new patient, if he doesn't already exist, in the database
  async function submit(e) {
    e.preventDefault();

    if (!isValidDate(patientDateOfBirth) || !isValidYear(patientDateOfBirth)) {
      dispatch(setStatus("Invalid date"));
      return;
    }

    if (isGatheringData) {
      dispatch(setStatus("Can't edit patient's name while gathering data"));
      return;
    }

    try {
      // Format the date to ISO8601
      const patientDateOfBirthIso = toIsoDayFormat(patientDateOfBirth);
      // Ckeck if the patient exists
      let res = await getPatient({
        patientFirstName,
        patientLastName,
        patientDateOfBirth: patientDateOfBirthIso,
      }).unwrap();
      checkRes(res);
      // If the patient doesn't exist, insert the patient in the database
      if (res === null) {
        res = await insertPatient({
          patientFirstName,
          patientLastName,
          patientDateOfBirth: patientDateOfBirthIso,
        }).unwrap();
        checkRes(res);
      }

      const { patient_id: patientId } = res;
      dispatch(setSelectedpatient({ patientId, patientFirstName, patientLastName, patientDateOfBirth }));
      dispatch(setStatus(`Patient ${patientFirstName} ${patientLastName} selected`));
      clearForm();
    } catch (e) {
      dispatch(setStatus("Error communicating with the database"));
    }
  }

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
    <div className="row-container patient">
      <form className="patient__form" action="" onSubmit={submit}>
        <h1>Select Patient</h1>
        <PatientInput
          field={"First Name"}
          placeholderText={"First name"}
          data={patientFirstName}
          setData={setPatientFirstName}
          isGatheringData={isGatheringData}
        />
        <PatientInput
          field={"Last Name"}
          placeholderText={"Last name"}
          data={patientLastName}
          setData={setPatientLastName}
          isGatheringData={isGatheringData}
        />
        <PatientInput
          field={"Date Of Birth"}
          placeholderText={"10/10/2000 or 10-10-2000"}
          data={patientDateOfBirth}
          setData={setPatientDateOfBirth}
          isGatheringData={isGatheringData}
        />
        <button className="patient__form-button" type="submit">
          SUBMIT
        </button>
      </form>
      <div className="patient__details">
        <h1>Patient's Details</h1>
        <SelectedPatientInput field={"First Name"} selectedData={selectedPatient.patientFirstName} />
        <SelectedPatientInput field={"Last Name"} selectedData={selectedPatient.patientLastName} />
        <SelectedPatientInput field={"Date Of Birth"} selectedData={selectedPatient.patientDateOfBirth} />
        <button
          className={`patient__details-button ${
            isGatheringData ? "patient__details-button--collecting" : ""
          }`}
          onClick={gatherData}
          disabled={isSubmittingSession}
        >
          {gatherButtonText}
        </button>
      </div>
    </div>
  );
}
