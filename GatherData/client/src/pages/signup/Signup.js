import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { USER_REGEX, NAME_REGEX, PWD_REGEX } from "utils/constants";

import React from "react";

export default function Signup() {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validUser, setValidUser] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);

  const [lastName, setLastName] = useState("");
  const [validLastName, setValidLastName] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidUser(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidFirstName(NAME_REGEX.test(firstName));
  }, [firstName]);

  useEffect(() => {
    setValidLastName(NAME_REGEX.test(lastName));
  }, [lastName]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
    setValidMatch(password === matchPassword);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [user, firstName, lastName, password, matchPassword]);

  function handleSubmit(e) {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(user);
    const v2 = NAME_REGEX.test(firstName);
    const v3 = NAME_REGEX.test(lastName);
    const v4 = PWD_REGEX.test(password);
    if (!v1 || !v2 || !v3 || !v4) {
      setErrMsg("Invalid Entry");
      return;
    }

    try {
      //Querry
      //clear state and controlled inputs
      //need value attrib on inputs for this
      setUser("");
      setFirstName("");
      setLastName("");
      setPassword("");
      setMatchPassword("");
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
  }

  return (
    <div className="main-container">
      <section className="col-container signup">
        <p ref={errRef} className={errMsg ? "login-signup__errmsg" : "offscreen"} aria-live="assertive">
          {errMsg}
        </p>
        <h1>Sign Up</h1>
        <form className="login-signup__form" onSubmit={handleSubmit}>
          <label className="login-signup__form-label" htmlFor="username">
            Username:
            <FontAwesomeIcon icon={faCheck} className={validUser ? "faCheck--green" : "hide"} />
            <FontAwesomeIcon icon={faTimes} className={validUser || !user ? "hide" : "faTimes--red"} />
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
            aria-invalid={validUser ? "false" : "true"}
            aria-describedby="usernote"
            onFocus={() => setUserFocus(true)}
            onBlur={() => setUserFocus(false)}
          />
          <p id="usernote" className={userFocus && !validUser ? "signup__instructions" : "offscreen"}>
            <FontAwesomeIcon className="signup__instructions-svg" icon={faInfoCircle} />
            4 to 24 characters.
            <br />
            Must begin with a letter.
            <br />
            Letters, numbers, underscores, hyphens allowed.
          </p>
          <label className="login-signup__form-label" htmlFor="firstName">
            First Name:
            <FontAwesomeIcon icon={faCheck} className={validFirstName ? "faCheck--green" : "hide"} />
            <FontAwesomeIcon
              icon={faTimes}
              className={validFirstName || !firstName ? "hide" : "faTimes--red"}
            />
          </label>
          <input
            className="login-signup__form-input"
            type="text"
            id="firstName"
            autoComplete="off"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
            required
            aria-invalid={validFirstName ? "false" : "true"}
            aria-describedby="firstnamenote"
            onFocus={() => setFirstNameFocus(true)}
            onBlur={() => setFirstNameFocus(false)}
          />
          <p
            id="firstnamenote"
            className={firstNameFocus && !validFirstName ? "signup__instructions" : "offscreen"}
          >
            <FontAwesomeIcon className="signup__instructions-svg" icon={faInfoCircle} />
            No numbers or spaces.
            <br />
            Must use latin characters.
          </p>
          <label className="login-signup__form-label" htmlFor="lastName">
            Last Name:
            <FontAwesomeIcon icon={faCheck} className={validLastName ? "faCheck--green" : "hide"} />
            <FontAwesomeIcon
              icon={faTimes}
              className={validLastName || !lastName ? "hide" : "faTimes--red"}
            />
          </label>
          <input
            className="login-signup__form-input"
            type="text"
            id="lastName"
            autoComplete="off"
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
            required
            aria-invalid={validLastName ? "false" : "true"}
            aria-describedby="lastnamenote"
            onFocus={() => setLastNameFocus(true)}
            onBlur={() => setLastNameFocus(false)}
          />
          <p
            id="lastnamenote"
            className={lastNameFocus && !validLastName ? "signup__instructions" : "offscreen"}
          >
            <FontAwesomeIcon className="signup__instructions-svg" icon={faInfoCircle} />
            No numbers or spaces.
            <br />
            Must use latin characters.
          </p>
          <label className="login-signup__form-label" htmlFor="password">
            Password:
            <FontAwesomeIcon icon={faCheck} className={validPassword ? "faCheck--green" : "hide"} />
            <FontAwesomeIcon
              icon={faTimes}
              className={validPassword || !password ? "hide" : "faTimes--red"}
            />
          </label>
          <input
            className="login-signup__form-input"
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            aria-invalid={validPassword ? "false" : "true"}
            aria-describedby="passwordnote"
            onFocus={() => setPasswordFocus(true)}
            onBlur={() => setPasswordFocus(false)}
          />
          <p
            id="passwordnote"
            className={passwordFocus && !validPassword ? "signup__instructions" : "offscreen"}
          >
            <FontAwesomeIcon className="signup__instructions-svg" icon={faInfoCircle} />
            8 to 24 characters.
            <br />
            Must include uppercase and lowercase letters, a number and a special character.
            <br />
            Allowed special characters: <span aria-label="exclamation mark">!</span>{" "}
            <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span>{" "}
            <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
          </p>

          <label className="login-signup__form-label" htmlFor="confirm_password">
            Confirm Password:
            <FontAwesomeIcon
              icon={faCheck}
              className={validMatch && matchPassword ? "faCheck--green" : "hide"}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className={validMatch || !matchPassword ? "hide" : "faTimes--red"}
            />
          </label>
          <input
            className="login-signup__form-input"
            type="password"
            id="confirm_password"
            onChange={(e) => setMatchPassword(e.target.value)}
            value={matchPassword}
            required
            aria-invalid={validMatch ? "false" : "true"}
            aria-describedby="confirmnote"
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
          />
          <p id="confirmnote" className={matchFocus && !validMatch ? "signup__instructions" : "offscreen"}>
            <FontAwesomeIcon className="signup__instructions-svg" icon={faInfoCircle} />
            Must match the first password input field.
          </p>
          <button
            className="login-signup__button"
            disabled={!validUser || !validFirstName || !validLastName || !validPassword || !validMatch}
          >
            Sign Up
          </button>
          <p className="login-signup__link">
            Already registered?
            <br />
            <span>
              {/*put router link here*/}
              <a href="http://localhost:3000/#">Sign In</a>
            </span>
          </p>
        </form>
      </section>
    </div>
  );
}
