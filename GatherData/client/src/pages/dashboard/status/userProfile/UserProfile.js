import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { disableIsAuthenticated } from "app/appSlice";
import { useLazyGetDoctorQuery } from "api/apiSlice";

export default function UserProfile() {
  // Redux state
  const dispatch = useDispatch();

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
    localStorage.removeItem("accessToken");
    dispatch(disableIsAuthenticated());
  }

  // to do
  return <div>UserProfile</div>;
}
