import React from "react";
import { toCustomFormat } from "utils/utils";

export default function CustomTooltip({ active, payload, label }) {
  console.log(payload);
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <h1 className="custom-tooltip__header">{toCustomFormat(payload[0].payload?.session_date)}</h1>
        <p className="custom-tooltip__normal">{`normal : ${payload[0].value}`}</p>
        <p className="custom-tooltip__cp1">{`cp1 : ${payload[1].value}`}</p>
        <p className="custom-tooltip__cp2">{`cp2 : ${payload[2].value}`}</p>
      </div>
    );
  }

  return null;
}
