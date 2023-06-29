import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setStatus } from "pages/dashboard/status/statusSlice";
import { selectDoctor } from "pages/dashboard/status/doctorProfile/doctorProfileSlice";
import { useLazyGetPatientsQuery } from "api/apiSlice";

export default function SearchPatient() {
  // Local state
  const [search, setSearch] = useState("");

  // Redux state
  const doctor = useSelector(selectDoctor);
  const dispatch = useDispatch();

  // Queries
  const [getPatients] = useLazyGetPatientsQuery();

  async function fetchPatients(value) {
    if (value === "") {
      return;
    }

    try {
      const res = await getPatients({ doctorId: doctor.doctorId, partOfName: value }).unwrap();
      console.log(res);
    } catch (err) {
      console.log(err);
      if (err?.data) {
        dispatch(setStatus(err.data.errMsg));
      } else {
        dispatch(setStatus("No server response"));
      }
    }
  }

  function handleChange(value) {
    setSearch(value);
    fetchPatients(value);
  }

  return (
    <div className="patient__search">
      <FontAwesomeIcon icon={faSearch} className="patient__search-icon" />
      <input
        className="patient__search-input"
        type="text"
        id="search"
        placeholder="Search patient ..."
        autoComplete="off"
        value={search}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
}
