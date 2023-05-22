import React, { useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import PatientInput from "./PatientInput";
import SelectedPatientInput from "./SelectedPatientInput";
import { setStatus } from "features/status/statusSlice";
import { selectIsConnected } from "features/status/statusSlice";
import { toggleIsGatheringData, setSelectedpatient } from "./patientInfoSlice";
import { selectIsGatheringData, selectSelectedPatient } from "./patientInfoSlice";
import { useLazyGetPatientQuery, usePostPatientMutation } from "features/api/apiSlice";

moment.suppressDeprecationWarnings = true;
//Valid inserted date formats
const formats = ["DD/MM/YYYY", "D/M/YYYY", "DD-MM-YYYY", "D-M-YYYY"];

export default function PatientInfo() {
  //Local state
  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientLastName, setPatientLastName] = useState("");
  const [patientDateOfBirth, setPatientDateOfBirth] = useState("");
  const [gatherButtonText, setGatherButtonText] = useState("GATHER DATA");

  //Redux state
  const isGatheringData = useSelector(selectIsGatheringData);
  const selectedPatient = useSelector(selectSelectedPatient);
  const isConnected = useSelector(selectIsConnected);
  const dispatch = useDispatch();

  //Queries
  const [getPatient] = useLazyGetPatientQuery();
  const [insertPatient] = usePostPatientMutation();

  //Clear the form
  function clearForm() {
    setPatientFirstName("");
    setPatientLastName("");
    setPatientDateOfBirth("");
  }

  //Check if the inserted year is valid
  function isYearValid(year) {
    return year > new Date().getFullYear() - 100 && year < new Date().getFullYear();
  }

  //Select and submit the new patient, if he doesn't already exist, in the database
  async function submit(e) {
    e.preventDefault();
    const checkDate = moment(patientDateOfBirth, formats, true);

    if (!checkDate.isValid() || !isYearValid(checkDate.year())) {
      console.log("Trash");
      dispatch(setStatus("Invalid date"));
    } else if (isGatheringData) {
      dispatch(setStatus("Can't edit patient's name while gathering data"));
    } else {
      dispatch(setSelectedpatient({ patientFirstName, patientLastName, patientDateOfBirth }));
      clearForm();
      try {
        //Format the date to ISO8601
        const patientDateOfBirthIso = checkDate.toISOString(true).split("T")[0];

        //Ckeck if the patient exists
        let res = await getPatient({
          patientFirstName,
          patientLastName,
          patientDateOfBirth: patientDateOfBirthIso,
        }).unwrap();

        dispatch(setStatus(`Patient ${patientFirstName} ${patientLastName} Selected`));
        //If the patient doesn't exist, insert the patient in the database
        if (res === null) {
          res = await insertPatient({
            patientFirstName,
            patientLastName,
            patientDateOfBirth: patientDateOfBirthIso,
          }).unwrap();
          console.log(res);
        }
      } catch (e) {
        dispatch(setStatus("Error communicating with the database"));
      }
    }
  }

  //Enable gathering data to the database
  async function gatherData() {
    if (isConnected) {
      if (!isGatheringData) {
        setGatherButtonText("GATHERING");
      } else {
        setGatherButtonText("GATHER DATA");
      }
      dispatch(toggleIsGatheringData());
    } else {
      dispatch(setStatus("Nicla isn't connected"));
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
