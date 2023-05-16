import "./index.css";
import React, { useState } from "react";
import Status from "./components/Status.js";
import PatientInfo from "./components/PatientInfo.js";

function App() {
  const [msg, setMsg] = useState("Waiting...");

  return (
    <section className="main-container">
      <Status msg={msg} setMsg={setMsg} />
      <PatientInfo setMsg={setMsg} />
    </section>
  );
}

export default App;
