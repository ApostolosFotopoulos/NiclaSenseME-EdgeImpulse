import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import React from "react";

export default function Login() {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // const response = await axios.post(LOGIN_URL, JSON.stringify({ user, pwd }), {
      //   headers: { "Content-Type": "application/json" },
      //   withCredentials: true,
      // });
      // console.log(JSON.stringify(response?.data));
      // //console.log(JSON.stringify(response));
      // const accessToken = response?.data?.accessToken;
      // const roles = response?.data?.roles;
      // setAuth({ user, pwd, roles, accessToken });
      setUser("");
      setPwd("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="main-container">
      <section className="col-container login">
        <p ref={errRef} className={errMsg ? "login-signup__errmsg" : "offscreen"} aria-live="assertive">
          {errMsg}
        </p>
        <h1>Log In</h1>
        <form className="login-signup__form" onSubmit={handleSubmit}>
          <label className="login-signup__form-label" htmlFor="username">
            Username:
          </label>
          <input
            className="login-signup__form-input"
            type="text"
            id="username"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setUser(e.target.value)}
            value={user}
            required
          />
          <label className="login-signup__form-label" htmlFor="password">
            Password:
          </label>
          <input
            className="login-signup__form-input"
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
          />
          <button className="login-signup__button">Sign In</button>
        </form>
        <p className="login-signup__link">
          Need an Account?
          <br />
          <span className="line">
            {/*put router link here*/}
            <Link to={"/signup"}>Sign Up</Link>
          </span>
        </p>
      </section>
    </div>
  );
}
