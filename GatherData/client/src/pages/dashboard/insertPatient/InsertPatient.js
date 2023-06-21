import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NAME_REGEX } from "utils/constants";
import { checkRes, isValidYear, isValidDate, toIsoDayFormat } from "utils/utils";
import { setStatus } from "pages/dashboard/status/statusSlice";
import { setSelectedpatient } from "pages/dashboard/patientInfo/patientInfoSlice";
import { selectIsGatheringData } from "pages/dashboard/patientInfo/patientInfoSlice";
import { useLazyGetPatientQuery, usePostPatientMutation } from "api/apiSlice";

export default function InsertPatient() {
  // Local state
  const [patientFirstName, setPatientFirstName] = useState("");
  const [validPatientFirstName, setValidPatientFirstName] = useState(false);
  const [patientFirstNameFocus, setPatientFirstNameFocus] = useState(false);

  const [patientLastName, setPatientLastName] = useState("");
  const [validPatientLastName, setValidPatientLastName] = useState(false);
  const [patientLastNameFocus, setPatientLastNameFocus] = useState(false);

  const [patientDateOfBirth, setPatientDateOfBirth] = useState("");
  const [validPatientDateOfBirth, setValidPatientDateOfBirth] = useState(false);
  const [patientDateOfBirthFocus, setPatientDateOfBirthFocus] = useState(false);

  // Redux state
  const isGatheringData = useSelector(selectIsGatheringData);
  const dispatch = useDispatch();

  // Queries
  const [getPatient] = useLazyGetPatientQuery();
  const [insertPatient] = usePostPatientMutation();

  useEffect(() => {
    setValidPatientFirstName(NAME_REGEX.test(patientFirstName));
  }, [patientFirstName]);

  useEffect(() => {
    setValidPatientLastName(NAME_REGEX.test(patientLastName));
  }, [patientLastName]);

  useEffect(() => {
    setValidPatientDateOfBirth(isValidDate(patientDateOfBirth) && isValidYear(patientDateOfBirth));
  }, [patientDateOfBirth]);

  // Clear the form
  function clearForm() {
    setPatientFirstName("");
    setPatientLastName("");
    setPatientDateOfBirth("");
  }

  // Select and submit the new patient, if he doesn't already exist, in the database
  async function handleSubmit(e) {
    e.preventDefault();

    const v1 = NAME_REGEX.test(patientFirstName);
    const v2 = NAME_REGEX.test(patientLastName);
    const v3 = isValidDate(patientDateOfBirth) && isValidYear(patientDateOfBirth);
    if (!v1 || !v2 || !v3) {
      dispatch(setStatus("Invalid entry"));
      return;
    }

    if (isGatheringData) {
      dispatch(setStatus("Can't edit the patient while gathering data"));
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
      <h1>Select Patient</h1>
      <form className="patient__form" onSubmit={handleSubmit}>
        <label className="main-input-label" htmlFor="patient-first-name">
          First Name:
          <FontAwesomeIcon icon={faCheck} className={validPatientFirstName ? "faCheck--green" : "hide"} />
          <FontAwesomeIcon
            icon={faTimes}
            className={validPatientFirstName || !patientFirstName ? "hide" : "faTimes--red"}
          />
        </label>
        <input
          className="main-input"
          type="text"
          id="patient-first-name"
          onChange={(e) => setPatientFirstName(e.target.value)}
          value={patientFirstName}
          required
          aria-invalid={validPatientFirstName ? "false" : "true"}
          aria-describedby="patient-first-name-note"
          onFocus={() => setPatientFirstNameFocus(true)}
          onBlur={() => setPatientFirstNameFocus(false)}
        />
        <p
          id="patient-first-name-note"
          className={patientFirstNameFocus && !validPatientFirstName ? "input-instructions" : "offscreen"}
        >
          <FontAwesomeIcon className="input-instructions-svg" icon={faInfoCircle} />
          Only latin characters allowed.
          <br />
          No numbers or spaces.
        </p>
        <label className="main-input-label" htmlFor="patient-last-name">
          Last Name:
          <FontAwesomeIcon icon={faCheck} className={validPatientLastName ? "faCheck--green" : "hide"} />
          <FontAwesomeIcon
            icon={faTimes}
            className={validPatientLastName || !patientLastName ? "hide" : "faTimes--red"}
          />
        </label>
        <input
          className="main-input"
          type="text"
          id="patient-last-name"
          onChange={(e) => setPatientFirstName(e.target.value)}
          value={patientLastName}
          required
          aria-invalid={validPatientLastName ? "false" : "true"}
          aria-describedby="patient-last-name-note"
          onFocus={() => setPatientLastNameFocus(true)}
          onBlur={() => setPatientLastNameFocus(false)}
        />
        <p
          id="patient-last-name-note"
          className={patientLastNameFocus && !validPatientLastName ? "input-instructions" : "offscreen"}
        >
          <FontAwesomeIcon className="input-instructions-svg" icon={faInfoCircle} />
          Only latin characters allowed.
          <br />
          No numbers or spaces.
        </p>
        <label className="main-input-label" htmlFor="patient-date-of-birth">
          Date of Birth:
          <FontAwesomeIcon icon={faCheck} className={validPatientDateOfBirth ? "faCheck--green" : "hide"} />
          <FontAwesomeIcon
            icon={faTimes}
            className={validPatientDateOfBirth || !patientDateOfBirth ? "hide" : "faTimes--red"}
          />
        </label>
        <input
          className="main-input"
          type="text"
          id="patient-date-of-birth"
          onChange={(e) => setPatientDateOfBirth(e.target.value)}
          value={patientDateOfBirth}
          required
          aria-invalid={validPatientDateOfBirth ? "false" : "true"}
          aria-describedby="patient-date-of-birth-note"
          onFocus={() => setPatientDateOfBirthFocus(true)}
          onBlur={() => setPatientDateOfBirthFocus(false)}
        />
        <p
          id="patient-date-of-birth-note"
          className={patientDateOfBirthFocus && !validPatientDateOfBirth ? "input-instructions" : "offscreen"}
        >
          <FontAwesomeIcon className="input-instructions-svg" icon={faInfoCircle} />
          Formats allowed: D/M/YYYY or D-M-YYYY
          <br />
          E.g. 1/10/2000 or 25/9/1998
        </p>
        <button className="patient__form-button" type="submit">
          SUBMIT
        </button>
      </form>
    </div>
  );
}
