import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useLazyVerifyDoctorQuery } from "api/apiSlice";
import { enableIsAuthenticated, disableIsAuthenticated } from "./appSlice";
import { selectIsAuthenticated } from "./appSlice";

import Login from "pages/login/Login";
import Signup from "pages/signup/Signup";
import Dashboard from "pages/dashboard/Dashboard";
function App() {
  // Redux State
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();

  // Queries
  const [verify] = useLazyVerifyDoctorQuery();

  useEffect(() => {
    const checkAuthenticated = async () => {
      try {
        let res = await verify({ jwtToken: localStorage.token }).unwrap();
        console.log(res);

        const { isVerified } = res;
        console.log(isVerified);

        if (isVerified) {
          dispatch(enableIsAuthenticated());
        } else {
          dispatch(disableIsAuthenticated());
        }
      } catch (err) {
        console.log("gggg");
        dispatch(disableIsAuthenticated());
      }
    };

    checkAuthenticated();
  }, [dispatch, verify]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Navigate to="/login" replace={true} />} />
          <Route exact path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route
            exact
            path="/signup"
            element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />}
          />
          <Route
            exact
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
