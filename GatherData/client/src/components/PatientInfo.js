import React, { useState } from "react";
import moment from "moment";
import globals from "./../globals.js";
import PatientInput from "./PatientInput.js";
import SelectedPatientInput from "./SelectedPatientInput.js";

moment.suppressDeprecationWarnings = true;
const formats = ["DD/MM/YYYY", "D/M/YYYY", "DD-MM-YYYY", "D-M-YYYY"];

export default function PatientInfo({ isGatheringData, setGatheringData, setMsg }) {
  const [patientFirstName, setPatientFirstName] = useState("");
  const [selectedPatientFirstName, setSelectedPatientFirstName] = useState("");
  const [patientLastName, setPatientLastName] = useState("");
  const [selectedPatientLastName, setSelectedPatientLastName] = useState("");
  const [patientDateOfBirth, setPatientDateOfBirth] = useState("");
  const [selectedPatientDateOfBirth, setSelectedPatientDateOfBirth] = useState("");

  const [gatherButtonText, setGatherButtonText] = useState("GATHER DATA");

  function clearForm() {
    setPatientFirstName("");
    setPatientLastName("");
    setPatientDateOfBirth("");
  }

  function isYearValid(year) {
    return year > 1920 && year < 2023;
  }

  function submit(e) {
    e.preventDefault();
    console.log(patientDateOfBirth);
    const checkDate = moment(patientDateOfBirth, formats, true);
    console.log(checkDate.year());
    if (!checkDate.isValid() || !isYearValid(checkDate.year())) {
      console.log("Trash");
      setMsg("Invalid date");
    } else if (isGatheringData) {
      setMsg("Can't edit patient's name while gathering data");
    } else {
      setSelectedPatientFirstName(patientFirstName);
      setSelectedPatientLastName(patientLastName);
      setSelectedPatientDateOfBirth(patientDateOfBirth);
      globals.selectedPatient = {
        patientFirstName,
        patientLastName,
        patientDateOfBirth,
      };
      console.log(globals.selectedPatient);
      clearForm();
      setMsg("Patient Selected");
    }
  }

  function toggleIsGatheringDataClass() {
    if (!isGatheringData) {
      setGatherButtonText("GATHERING");
    } else {
      setGatherButtonText("GATHER DATA");
    }

    globals.isGatheringData = !isGatheringData;
    setGatheringData(!isGatheringData);
  }

  async function gatherData() {
    toggleIsGatheringDataClass();
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
        <SelectedPatientInput field={"First Name"} selectedData={selectedPatientFirstName} />
        <SelectedPatientInput field={"Last Name"} selectedData={selectedPatientLastName} />
        <SelectedPatientInput field={"Date Of Birth"} selectedData={selectedPatientDateOfBirth} />
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
