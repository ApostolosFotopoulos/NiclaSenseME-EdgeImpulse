import React from "react";
import { useDispatch, useSelector } from "react-redux";

// Redux selectors
import { selectIsGatheringData } from "pages/dashboard/patientInfo/patientInfoSlice";

// Redux reducers
import { setStatus } from "pages/dashboard/status/statusSlice";
import { setSelectedpatient } from "pages/dashboard/patientInfo/patientInfoSlice";

export default function SearchPatientsItem({ patient, setSearch, setSearchFocus, setPatients }) {
  // Redux state
  const dispatch = useDispatch();
  const isGatheringData = useSelector(selectIsGatheringData);

  function handleClick() {
    if (isGatheringData) {
      dispatch(setStatus("Can't edit the patient while gathering data"));
      return;
    }

    dispatch(
      setSelectedpatient({
        patientId: patient.patient_id,
        patientFirstName: patient.first_name,
        patientLastName: patient.last_name,
        patientDateOfBirth: patient.date_of_birth,
      })
    );

    setSearch("");
    setPatients([]);
    setSearchFocus(false);
  }

  return (
    <div className="patient__search-item" onClick={handleClick}>
      {`${patient.first_name} ${patient.last_name}`}
    </div>
  );
}
