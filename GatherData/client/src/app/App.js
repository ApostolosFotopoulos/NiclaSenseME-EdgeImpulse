import "style/index.css";
import React, { useState } from "react";
import Status from "features/status/Status";
import PatientInfo from "features/patientInfo/PatientInfo";
import RecentPatients from "features/recentPatients/RecentPatients";

function App() {
  const [isGatheringData, setGatheringData] = useState(false);

  return (
    <section className="main-container">
      <Status isGatheringData={isGatheringData} />
      <RecentPatients />
      <PatientInfo isGatheringData={isGatheringData} setGatheringData={setGatheringData} />
    </section>
  );
}

export default App;
