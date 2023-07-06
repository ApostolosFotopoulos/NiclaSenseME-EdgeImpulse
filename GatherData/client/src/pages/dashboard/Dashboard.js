// Components
import Status from "pages/dashboard/status/Status";
import PatientInfo from "pages/dashboard/patientInfo/PatientInfo";
import InsertPatient from "pages/dashboard/insertPatient/InsertPatient";

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
