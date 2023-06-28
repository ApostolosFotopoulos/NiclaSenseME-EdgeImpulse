import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { disableIsAuthenticated } from "app/appSlice";
import { useLazyGetDoctorQuery } from "api/apiSlice";
import { setDoctor } from "./doctorProfileSlice";
import { setStatus } from "pages/dashboard/status/statusSlice";
import { selectDoctor } from "./doctorProfileSlice";
import { selectIsGatheringData } from "pages/dashboard/patientInfo/patientInfoSlice";

export default function DoctorProfile() {
  // Redux state
  const doctor = useSelector(selectDoctor);
  const isGatheringData = useSelector(selectIsGatheringData);
  const dispatch = useDispatch();

  // Queries
  const [getDoctor] = useLazyGetDoctorQuery();

  useEffect(() => {
    async function getProfile() {
      try {
        let res = await getDoctor({ jwtToken: localStorage.accessToken }).unwrap();
        console.log(res);
        const {
          doctor_id: doctorId,
          first_name: doctorFirstName,
          last_name: doctorLastName,
          user_name: doctorUserName,
        } = res;

        dispatch(setDoctor({ doctorId, doctorFirstName, doctorLastName, doctorUserName }));
      } catch (err) {
        console.error(err.message);
      }
    }

    getProfile();
  }, [getDoctor, dispatch]);

  function logout(e) {
    e.preventDefault();

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
        <hr className="solid"></hr>
        <li className="dropdown__item" onClick={logout}>
          <span>Logout</span>
        </li>
      </ul>
    </div>
  );
}
