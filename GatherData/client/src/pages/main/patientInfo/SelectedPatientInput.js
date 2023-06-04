import React from "react";

export default function SelectedPatientInput({ field, selectedData }) {
  return (
    <>
      <label className="patient__details-label" htmlFor={field}>
        {field}
      </label>
      <input
        readOnly
        placeholder=""
        type="text"
        className="patient__details-input"
        id={field}
        value={selectedData ? selectedData : ""}
      />
    </>
  );
}
