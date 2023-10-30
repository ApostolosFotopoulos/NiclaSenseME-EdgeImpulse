import React from "react";
import { toCustomFormat } from "utils/utils";

export default function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <h1 className="custom-tooltip__header">{toCustomFormat(payload[0].payload?.session_date)}</h1>
        <p className="custom-tooltip__normal">{`normal : ${payload[0].value}`}</p>
        <p className="custom-tooltip__cp">{`cp : ${payload[1].value}`}</p>
      </div>
    );
  }

  return null;
}
