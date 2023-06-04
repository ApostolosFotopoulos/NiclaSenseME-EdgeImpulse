import "styles/index.css";
import React from "react";
import Status from "pages/main/status/Status";
import PatientInfo from "pages/main/patientInfo/PatientInfo";

function Main() {
  return (
    <section className="main-container">
      <Status />
      <PatientInfo />
    </section>
  );
}

export default Main;
