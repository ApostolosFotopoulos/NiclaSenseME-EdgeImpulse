import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChart,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  Label,
  CartesianGrid,
} from "recharts";

// Utils
import { hasSelectedPatient } from "utils/validateData";

// Redux selectors
import { selectIsGatheringData, selectSelectedPatient } from "pages/dashboard/patientInfo/patientInfoSlice";

// Redux reducers
import { setStatus } from "pages/dashboard/status/statusSlice";

// Queries
import { useLazyGetLatestSessionsQuery } from "api/apiSlice";

// Components
import CustomTooltip from "pages/dashboard/sessionHistory/customTooltip/CustomTooltip";

export default function SessionHistory() {
  // Local state
  const [sessions, setSessions] = useState([]);

  // Redux state
  const dispatch = useDispatch();
  const isGatheringData = useSelector(selectIsGatheringData);
  const selectedPatient = useSelector(selectSelectedPatient);

  const [getLatestSessions] = useLazyGetLatestSessionsQuery();

  useEffect(() => {
    async function getSessions() {
      try {
        let res = await getLatestSessions({
          jwtToken: localStorage.accessToken,
          patientId: selectedPatient.patientId,
        }).unwrap();
        res = [...res].reverse();
        res = res.map((ses, i) => ({
          ...ses,
          xLabel: i + 1,
        }));

        setSessions(res);
      } catch (err) {
        if (err?.data) {
          dispatch(setStatus(err.data.errMsg));
        } else {
          dispatch(setStatus("No server response"));
        }
      }
    }

    if (hasSelectedPatient(selectedPatient) && !isGatheringData) {
      getSessions();
    }
  }, [selectedPatient, isGatheringData, getLatestSessions, dispatch]);

  return (
    <div className="col-container">
      {sessions && sessions.length > 0 ? (
        <ResponsiveContainer width="95%" height={300}>
          <LineChart data={sessions}>
            <CartesianGrid strokeDasharray="5 5" stroke="white" />
            <XAxis dataKey="xLabel" stroke="white">
              <Label value="Recent Sessions" position="insideTop" offset={36} />
            </XAxis>
            <YAxis type="number" domain={[0, 1]} stroke="white">
              <Label
                value="Results"
                position="insideLeft"
                offset={6}
                style={{ textAnchor: "middle" }}
                angle={270}
              />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            <Legend align="right" />
            <Line type="monotone" strokeWidth={3} dataKey="normal" stroke="#2ecbff" />
            <Line type="monotone" dataKey="cp1" stroke="yellow" />
            <Line type="monotone" dataKey="cp2" stroke="red" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="90%" height={300}>
          <LineChart>
            <CartesianGrid strokeDasharray="5 5" stroke="white" />
            <XAxis stroke="white" />
            <YAxis type="number" domain={[0, 1]} stroke="white" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
