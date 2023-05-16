import React, { useState } from "react";

export default function PatientInfo({ selectedPatientName, setSelectedPatientName, isGatheringData, setGatheringData }) {
  const [patientName, setPatientName] = useState("");
  const [gatherButtonText, setGatherButtonText] = useState("GATHER DATA");

  function submit(e) {
    e.preventDefault();
    setSelectedPatientName(patientName);
    setPatientName("");
  }

  function toggleisGatheringDataClass() {
    if (!isGatheringData) {
      setGatherButtonText("GATHERING");
    } else {
      setGatherButtonText("GATHER DATA");
    }

    setGatheringData(!isGatheringData);
  }

  async function gatherData() {
    toggleisGatheringDataClass();
  }

  return (
    <div className="row-container patient">
      <form className="patient__form" action="" onSubmit={submit}>
        <h1>Current Patient</h1>
        <label className="patient__form-label" htmlFor="name">
          Patient Name
        </label>
        <input
          required
          placeholder="Enter Patient's Name"
          type="text"
          className="patient__form-input"
          name="name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
        />
        <button className="patient__form-button" type="submit">
          SUBMIT
        </button>
      </form>
      <div className="patient__details">
        <h1>Patient's Details</h1>
        <label className="patient__details-label" htmlFor="name">
          Patient Name
        </label>
        <input readOnly placeholder="" type="text" className="patient__details-input" name="name" value={selectedPatientName} />
        <button className={`patient__details-button ${isGatheringData ? "patient__details-button--collecting" : ""}`} onClick={gatherData}>
          {gatherButtonText}
        </button>
      </div>
    </div>
  );
}
