import "styles/index.css";
import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import React from "react";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function Register() {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      //Querry
      //clear state and controlled inputs
      //need value attrib on inputs for this
      setUser("");
      setPwd("");
      setMatchPwd("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="main-container">
      <section className="col-container register">
        <p ref={errRef} className={errMsg ? "register__errmsg" : "offscreen"} aria-live="assertive">
          {errMsg}
        </p>
        <h1>Register</h1>
        <form className="register__form" onSubmit={handleSubmit}>
          <label className="register__form-label" htmlFor="username">
            Username:
            <FontAwesomeIcon icon={faCheck} className={validName ? "faCheck--green" : "hide"} />
            <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "faTimes--red"} />
          </label>
          <input
            className="register__form-input"
            type="text"
            id="username"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setUser(e.target.value)}
            value={user}
            required
            aria-invalid={validName ? "false" : "true"}
            aria-describedby="uidnote"
            onFocus={() => setUserFocus(true)}
            onBlur={() => setUserFocus(false)}
          />
          <p
            id="uidnote"
            className={userFocus && user && !validName ? "register__instructions" : "offscreen"}
          >
            <FontAwesomeIcon className="register__instructions-svg" icon={faInfoCircle} />
            4 to 24 characters.
            <br />
            Must begin with a letter.
            <br />
            Letters, numbers, underscores, hyphens allowed.
          </p>

          <label className="register__form-label" htmlFor="password">
            Password:
            <FontAwesomeIcon icon={faCheck} className={validPwd ? "faCheck--green" : "hide"} />
            <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "faTimes--red"} />
          </label>
          <input
            className="register__form-input"
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
            aria-invalid={validPwd ? "false" : "true"}
            aria-describedby="pwdnote"
            onFocus={() => setPwdFocus(true)}
            onBlur={() => setPwdFocus(false)}
          />
          <p id="pwdnote" className={pwdFocus && !validPwd ? "register__instructions" : "offscreen"}>
            <FontAwesomeIcon className="register__instructions-svg" icon={faInfoCircle} />
            8 to 24 characters.
            <br />
            Must include uppercase and lowercase letters, a number and a special character.
            <br />
            Allowed special characters: <span aria-label="exclamation mark">!</span>{" "}
            <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span>{" "}
            <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
          </p>

          <label className="register__form-label" htmlFor="confirm_pwd">
            Confirm Password:
            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "faCheck--green" : "hide"} />
            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "faTimes--red"} />
          </label>
          <input
            className="register__form-input"
            type="password"
            id="confirm_pwd"
            onChange={(e) => setMatchPwd(e.target.value)}
            value={matchPwd}
            required
            aria-invalid={validMatch ? "false" : "true"}
            aria-describedby="confirmnote"
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
          />
          <p id="confirmnote" className={matchFocus && !validMatch ? "register__instructions" : "offscreen"}>
            <FontAwesomeIcon className="register__instructions-svg" icon={faInfoCircle} />
            Must match the first password input field.
          </p>
          <button
            className="register__button"
            disabled={!validName || !validPwd || !validMatch ? true : false}
          >
            Sign Up
          </button>
          <p className="register__login-link">
            Already registered?
            <br />
            <span>
              {/*put router link here*/}
              <a className="wtf" href="http://localhost:3000/#">
                Sign In
              </a>
            </span>
          </p>
        </form>
      </section>
    </div>
  );
}
