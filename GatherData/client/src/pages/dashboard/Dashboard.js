import React from "react";
import Status from "pages/dashboard/status/Status";
import PatientInfo from "pages/dashboard/patientInfo/PatientInfo";

function Dashboard() {
  return (
    <section className="main-container">
      <Status />
      <PatientInfo />
    </section>
  );
}

export default Dashboard;
