import Status from "./status/Status";
import PatientInfo from "./patientInfo/PatientInfo";
import InsertPatient from "./insertPatient/InsertPatient";

function Dashboard() {
  return (
    <section className="dashboard">
      <Status />
      <PatientInfo />
      <InsertPatient />
    </section>
  );
}

export default Dashboard;
