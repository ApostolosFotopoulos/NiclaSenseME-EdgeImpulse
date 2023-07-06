import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// Redux selectors
import { selectIsAuthenticated } from "app/appSlice";

// Redux reducers
import { enableIsAuthenticated, disableIsAuthenticated, enableCheckedAuth } from "app/appSlice";

// Queries
import { useLazyVerifyDoctorQuery } from "api/apiSlice";

// Components
import Login from "pages/login/Login";
import Signup from "pages/signup/Signup";
import Dashboard from "pages/dashboard/Dashboard";

function App() {
  // Redux state
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Queries
  const [verify] = useLazyVerifyDoctorQuery();

  useEffect(() => {
    async function checkAuthenticated() {
      try {
        let res = await verify({ jwtToken: localStorage.accessToken }).unwrap();

        const { isVerified } = res;

        if (isVerified) {
          dispatch(enableIsAuthenticated());
        } else {
          dispatch(disableIsAuthenticated());
        }
        dispatch(enableCheckedAuth());
      } catch (err) {
        dispatch(disableIsAuthenticated());
        dispatch(enableCheckedAuth());
      }
    }

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
