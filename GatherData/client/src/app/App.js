import "styles/index.css";
import React from "react";
import Status from "features/status/Status";
import PatientInfo from "features/patientInfo/PatientInfo";
import RecentPatients from "features/recentPatients/RecentPatients";

function App() {
  return (
    <section className="main-container">
      <Status />
      <RecentPatients />
      <PatientInfo />
    </section>
  );
}

export default App;
