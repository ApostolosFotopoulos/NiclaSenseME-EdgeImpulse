import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PatientInput from "./PatientInput";
import SelectedPatientInput from "./SelectedPatientInput";
import { checkRes, isValidYear, isEmptyObj, isValidDate, toIsoFormat } from "utils/utils";
import { setStatus } from "features/status/statusSlice";
import { selectIsConnected } from "features/status/statusSlice";
import { toggleIsGatheringData, setSelectedpatient } from "./patientInfoSlice";
import { selectIsGatheringData, selectSelectedPatient } from "./patientInfoSlice";
import { useLazyGetPatientQuery, usePostPatientMutation } from "features/api/apiSlice";

export default function PatientInfo() {
  // Local state
  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientLastName, setPatientLastName] = useState("");
  const [patientDateOfBirth, setPatientDateOfBirth] = useState("");
  const [gatherButtonText, setGatherButtonText] = useState("GATHER DATA");

  // Redux state
  const isGatheringData = useSelector(selectIsGatheringData);
  const selectedPatient = useSelector(selectSelectedPatient);
  const isConnected = useSelector(selectIsConnected);
  const dispatch = useDispatch();

  // Queries
  const [getPatient] = useLazyGetPatientQuery();
  const [insertPatient] = usePostPatientMutation();

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
    } else if (isGatheringData) {
      dispatch(setStatus("Can't edit patient's name while gathering data"));
    } else {
      clearForm();
      try {
        // Format the date to ISO8601
        const patientDateOfBirthIso = toIsoFormat(patientDateOfBirth);
        // Ckeck if the patient exists
        let res = await getPatient({
          patientFirstName,
          patientLastName,
          patientDateOfBirth: patientDateOfBirthIso,
        }).unwrap();
        checkRes(res);
        dispatch(setStatus(`Patient ${patientFirstName} ${patientLastName} selected`));
        // If the patient doesn't exist, insert the patient in the database
        if (res === null) {
          res = await insertPatient({
            patientFirstName,
            patientLastName,
            patientDateOfBirth: patientDateOfBirthIso,
          }).unwrap();
          checkRes(res);
        }

        const { id: patientId } = res;
        dispatch(setSelectedpatient({ patientId, patientFirstName, patientLastName, patientDateOfBirth }));
      } catch (e) {
        dispatch(setStatus("Error communicating with the database"));
      }
    }
  }

  // Enable gathering data to the database
  async function gatherData() {
    if (!isConnected) {
      dispatch(setStatus("Nicla isn't connected"));
    } else if (isEmptyObj(selectedPatient)) {
      dispatch(setStatus("No patient is selected"));
    } else {
      if (!isGatheringData) {
        setGatherButtonText("GATHERING");
      } else {
        setGatherButtonText("GATHER DATA");
      }
      dispatch(toggleIsGatheringData());
    }
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
        >
          {gatherButtonText}
        </button>
      </div>
    </div>
  );
}
