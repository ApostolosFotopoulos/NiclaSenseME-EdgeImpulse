import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NAME_REGEX } from "utils/constants";
import PatientInput from "pages/dashboard/patientInfo/PatientInput";
import { checkRes, isValidYear, isValidDate, toIsoDayFormat } from "utils/utils";
import { setStatus } from "pages/dashboard/status/statusSlice";
import { setSelectedpatient } from "pages/dashboard/patientInfo/patientInfoSlice";
import { selectIsGatheringData } from "pages/dashboard/patientInfo/patientInfoSlice";
import { useLazyGetPatientQuery, usePostPatientMutation } from "api/apiSlice";

export default function InsertPatient() {
  // Local state
  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientLastName, setPatientLastName] = useState("");
  const [patientDateOfBirth, setPatientDateOfBirth] = useState("");

  // Redux state
  const isGatheringData = useSelector(selectIsGatheringData);
  const dispatch = useDispatch();

  // Queries
  const [getPatient] = useLazyGetPatientQuery();
  const [insertPatient] = usePostPatientMutation();

  // Clear the form
  function clearForm() {
    setPatientFirstName("");
    setPatientLastName("");
    setPatientDateOfBirth("");
  }

  // Select and submit the new patient, if he doesn't already exist, in the database
  async function handleSubmit(e) {
    e.preventDefault();

    if (!isValidDate(patientDateOfBirth) || !isValidYear(patientDateOfBirth)) {
      dispatch(setStatus("Invalid date"));
      return;
    }

    if (isGatheringData) {
      dispatch(setStatus("Can't edit patient's name while gathering data"));
      return;
    }

    try {
      // Format the date to ISO8601
      const patientDateOfBirthIso = toIsoDayFormat(patientDateOfBirth);
      // Ckeck if the patient exists
      let res = await getPatient({
        patientFirstName,
        patientLastName,
        patientDateOfBirth: patientDateOfBirthIso,
      }).unwrap();
      checkRes(res);
      // If the patient doesn't exist, insert the patient in the database
      if (res === null) {
        res = await insertPatient({
          patientFirstName,
          patientLastName,
          patientDateOfBirth: patientDateOfBirthIso,
        }).unwrap();
        checkRes(res);
      }

      const { patient_id: patientId } = res;
      dispatch(setSelectedpatient({ patientId, patientFirstName, patientLastName, patientDateOfBirth }));
      dispatch(setStatus(`Patient ${patientFirstName} ${patientLastName} selected`));
      clearForm();
    } catch (e) {
      dispatch(setStatus("Error communicating with the database"));
    }
  }

  return (
    <div className="col-container patient">
      <form className="patient__form" onSubmit={handleSubmit}>
        <h1>Select Patient</h1>
        <PatientInput
          field={"First Name"}
          placeholderText={"First name"}
          data={patientFirstName}
          setData={setPatientFirstName}
          isGatheringData={isGatheringData}
        />
        <PatientInput
          field={"Last Name"}
          placeholderText={"Last name"}
          data={patientLastName}
          setData={setPatientLastName}
          isGatheringData={isGatheringData}
        />
        <PatientInput
          field={"Date Of Birth"}
          placeholderText={"10/10/2000 or 10-10-2000"}
          data={patientDateOfBirth}
          setData={setPatientDateOfBirth}
          isGatheringData={isGatheringData}
        />
        <button className="patient__form-button" type="submit">
          SUBMIT
        </button>
      </form>
    </div>
  );
}
