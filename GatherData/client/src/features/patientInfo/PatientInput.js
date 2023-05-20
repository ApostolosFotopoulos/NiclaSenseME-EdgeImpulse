import React from "react";

export default function PatientInput({ field, placeholderText, data, setData, isGatheringData }) {
  return (
    <>
      <label className="patient__form-label" htmlFor="name">
        {field}
      </label>
      <input
        required
        disabled={isGatheringData}
        placeholder={placeholderText}
        type="text"
        className="patient__form-input"
        name={field}
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
    </>
  );
}
