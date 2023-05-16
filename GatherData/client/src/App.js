import "./index.css";
import React, { useState } from "react";
import Status from "./components/Status.js";
import PatientInfo from "./components/PatientInfo.js";

function App() {
  const [selectedPatientName, setSelectedPatientName] = useState("");
  const [isGatheringData, setGatheringData] = useState(false);

  return (
    <section className="main-container">
      <Status selectedPatientName={selectedPatientName} isGatheringData={isGatheringData} />
      <PatientInfo
        selectedPatientName={selectedPatientName}
        setSelectedPatientName={setSelectedPatientName}
        isGatheringData={isGatheringData}
        setGatheringData={setGatheringData}
      />
    </section>
  );
}

export default App;
