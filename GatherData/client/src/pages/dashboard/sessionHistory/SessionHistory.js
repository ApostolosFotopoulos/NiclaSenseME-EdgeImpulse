import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Utils
import { hasSelectedPatient } from "utils/validateData";

// Redux selectors
import { selectIsGatheringData, selectSelectedPatient } from "pages/dashboard/patientInfo/patientInfoSlice";

// Redux reducers
import { setStatus } from "pages/dashboard/status/statusSlice";

// Queries
import { useLazyGetLatestSessionsQuery } from "api/apiSlice";

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
        let res = await getLatestSessions({ patientId: selectedPatient.patientId }).unwrap();
        console.log(res);
        setSessions(res);
      } catch (err) {
        console.log(err);
        if (err?.data) {
          dispatch(setStatus(err.data.errMsg));
        } else {
          dispatch(setStatus("No server response"));
        }
      }
    }

    if (hasSelectedPatient(selectedPatient)) {
      getSessions();
    }
  }, [selectedPatient, getLatestSessions, dispatch]);

  return <div className="col-container">SessionHistory</div>;
}
