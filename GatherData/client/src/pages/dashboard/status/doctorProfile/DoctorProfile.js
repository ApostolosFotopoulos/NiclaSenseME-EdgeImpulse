import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { disableIsAuthenticated } from "app/appSlice";
import { useLazyGetDoctorQuery } from "api/apiSlice";
import { setDoctor } from "./doctorProfileSlice";
import { selectDoctor } from "./doctorProfileSlice";

export default function DoctorProfile() {
  // Redux state
  const doctor = useSelector(selectDoctor);
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
    localStorage.removeItem("accessToken");
    dispatch(disableIsAuthenticated());
  }

  // to do
  return (
    <div className="dropdown">
      <img className="dropdown__img" src="https://placehold.co/400" alt="User" />
      <ul className="dropdown__content">
        <li className="dropdown__content-item">
          <span>Logout</span>
        </li>
      </ul>
    </div>
  );
}
