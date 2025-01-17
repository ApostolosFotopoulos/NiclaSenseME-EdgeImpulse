import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

// Utils
import constants from "utils/constants";

// Redux selectors
import { selectIsGatheringData } from "pages/dashboard/patientInfo/patientInfoSlice";
import { selectDoctor } from "pages/dashboard/status/doctorProfile/doctorProfileSlice";

// Redux reducers
import { disableIsAuthenticated } from "app/appSlice";
import { setDoctor } from "pages/dashboard/status/doctorProfile/doctorProfileSlice";
import { setStatus } from "pages/dashboard/status/statusSlice";

// Queries
import { useLazyGetDoctorQuery } from "api/apiSlice";

export default function DoctorProfile() {
  // Redux state
  const dispatch = useDispatch();
  const doctor = useSelector(selectDoctor);
  const isGatheringData = useSelector(selectIsGatheringData);

  // Queries
  const [getDoctor] = useLazyGetDoctorQuery();

  useEffect(() => {
    async function getProfile() {
      try {
        let res = await getDoctor({ jwtToken: localStorage.accessToken }).unwrap();

        const {
          doctor_id: doctorId,
          first_name: doctorFirstName,
          last_name: doctorLastName,
          user_name: doctorUserName,
        } = res;

        // Check if test user
        if (
          doctorId === 16 &&
          doctorUserName === "testSim" &&
          doctorFirstName === "test" &&
          doctorLastName === "sim"
        ) {
          constants.enableDebug();
        }

        dispatch(setDoctor({ doctorId, doctorFirstName, doctorLastName, doctorUserName }));
      } catch (err) {
        console.error(err.message);
      }
    }

    getProfile();
  }, [getDoctor, dispatch]);

  function logout() {
    if (isGatheringData) {
      dispatch(setStatus("Can't log out while gathering data"));
      return;
    }

    localStorage.removeItem("accessToken");
    dispatch(disableIsAuthenticated());
    window.location.reload();
  }

  // to do
  return (
    <div className="dropdown">
      <FontAwesomeIcon icon={faUser} className="dropdown__img" size="2x" border={true} />
      <ul className="dropdown__content">
        <p className="dropdown__name">
          <span>{doctor.doctorUserName}</span>
        </p>
        <hr className="line-divider"></hr>
        <li className="dropdown__item" onClick={logout}>
          <span>Logout</span>
        </li>
      </ul>
    </div>
  );
}
