import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Redux selectors
import { selectDoctor } from "pages/dashboard/status/doctorProfile/doctorProfileSlice";

// Redux reducers
import { setStatus } from "pages/dashboard/status/statusSlice";

// Queries
import { useLazyGetPatientsQuery } from "api/apiSlice";

// Components
import SearchPatientsItem from "pages/dashboard/patientInfo/searchPatient/searchPatientsItem/SearchPatientsItem";

export default function SearchPatient() {
  // Refs
  const searchRef = useRef(null);

  // Local state
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [searchFocus, setSearchFocus] = useState(false);

  // Redux state
  const doctor = useSelector(selectDoctor);
  const dispatch = useDispatch();

  // Queries
  const [getPatients] = useLazyGetPatientsQuery();

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocus(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  async function fetchPatients(value) {
    if (value === "") {
      setPatients([]);
      return;
    }

    try {
      const res = await getPatients({ doctorId: doctor.doctorId, partOfName: value }).unwrap();
      setPatients(res);
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
    <div ref={searchRef} className="patient__search">
      <div className={`patient__search-bar ${searchFocus ? "patient__search-bar--selected" : ""}`}>
        <FontAwesomeIcon icon={faSearch} className="patient__search-icon" />
        <input
          className="patient__search-input"
          type="text"
          id="search"
          placeholder="Search patient ..."
          autoComplete="off"
          value={search}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setSearchFocus(true)}
        />
      </div>
      {patients && patients.length > 0 && (
        <div className={searchFocus ? "patient__search-list" : "hide"}>
          {patients.map((patient) => {
            return (
              <SearchPatientsItem
                patient={patient}
                setSearch={setSearch}
                setSearchFocus={setSearchFocus}
                setPatients={setPatients}
                key={patient.patient_id}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
