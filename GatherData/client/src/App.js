import "./index.css";
import React, { useState } from "react";
import Status from "./components/Status.js";
import PatientInfo from "./components/PatientInfo.js";
import RecentPatients from "./components/RecentPatients.js";

function App() {
  const [msg, setMsg] = useState("Waiting...");
  const [isGatheringData, setGatheringData] = useState(false);

  return (
    <section className="main-container">
      <Status msg={msg} setMsg={setMsg} isGatheringData={isGatheringData} />
      <RecentPatients />
      <PatientInfo isGatheringData={isGatheringData} setGatheringData={setGatheringData} setMsg={setMsg} />
    </section>
  );
}

export default App;
