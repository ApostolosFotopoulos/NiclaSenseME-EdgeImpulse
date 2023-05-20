import React, { useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import PatientInput from "./PatientInput";
import SelectedPatientInput from "./SelectedPatientInput";
import { setStatus } from "features/status/statusSlice";
import { toggleIsGatheringData, setSelectedpatient } from "./patientInfoSlice";

moment.suppressDeprecationWarnings = true;
const formats = ["DD/MM/YYYY", "D/M/YYYY", "DD-MM-YYYY", "D-M-YYYY"];

export default function PatientInfo() {
  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientLastName, setPatientLastName] = useState("");
  const [patientDateOfBirth, setPatientDateOfBirth] = useState("");
  const [gatherButtonText, setGatherButtonText] = useState("GATHER DATA");

  const isGatheringData = useSelector((state) => state.patientInfo.isGatheringData);
  const selectedPatient = useSelector((state) => state.patientInfo.selectedPatient);
  const isConnected = useSelector((state) => state.status.isConnected);
  const dispatch = useDispatch();

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
      dispatch(setStatus("Invalid date"));
    } else if (isGatheringData) {
      dispatch(setStatus("Can't edit patient's name while gathering data"));
    } else {
      dispatch(setSelectedpatient({ patientFirstName, patientLastName, patientDateOfBirth }));
      clearForm();
      dispatch(setStatus("Patient Selected"));
    }
  }

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
