import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLazyGetDoctorQuery } from "api/apiSlice";

export default function UserProfile() {
  // Queries
  const [getDoctor] = useLazyGetDoctorQuery();

  useEffect(() => {
    async function getProfile() {
      try {
        let res = await getDoctor({ jwtToken: localStorage.accessToken }).unwrap();
        console.log(res);
      } catch (err) {
        console.error(err.message);
      }
    }

    getProfile();
  }, [getDoctor]);

  function logout(e) {
    e.preventDefault();
    try {
      localStorage.removeItem("accessToken");
      //setAuth(false);
    } catch (err) {
      console.error(err.message);
    }
  }

  return <div>UserProfile</div>;
}
