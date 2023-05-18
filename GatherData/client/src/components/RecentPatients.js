import React, { useState, useRef, useEffect } from "react";
import "boxicons/css/boxicons.min.css";
import globals from "./../globals.js";

export default function RecentPatients() {
  const [isMenuOpen, setMenu] = useState(false);

  function toggleMenu() {
    setMenu(!isMenuOpen);
    globals.isMenuOpen = !globals.isMenuOpen;
  }

  function useOutsideAlerter(ref) {
    useEffect(() => {
      //Alert if clicked on outside of element
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target) && isMenuOpen) {
          setMenu((isMenuOpen) => !isMenuOpen);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, isMenuOpen]);
  }

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  return (
    <div className="col-container recent-patients">
      <div className="select-menu">
        <div className="select-menu__button" ref={wrapperRef} onClick={toggleMenu}>
          <span className="select-menu__button-text">Select Patient</span>
          <i
            className={`bx bx-chevron-down select-menu__button-img ${
              isMenuOpen ? "select-menu__button-img--open" : ""
            }`}
          ></i>
        </div>

        <ul className={`select-menu__options ${isMenuOpen ? "select-menu__options--open" : ""}`}>
          <li className="select-menu__option">
            <span className="select-menu__option-text">Apostolos Fotopoulos</span>
          </li>
          <li className="select-menu__option">
            <span className="select-menu__option-text">Linkedin</span>
          </li>
          <li className="select-menu__option">
            <span className="select-menu__option-text">Facebook</span>
          </li>
          <li className="select-menu__option">
            <span className="select-menu__option-text">Twitter</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
