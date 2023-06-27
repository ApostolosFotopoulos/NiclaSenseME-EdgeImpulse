import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
// Valid inserted date formats
const formats = ["D/M/YYYY", "D-M-YYYY"];

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const NAME_REGEX = /^[a-zA-Z]+([ \\'-]{0,1}[a-zA-Z]+){0,2}[.]{0,1}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

// Check if a string date is valid
function isValidDateFormat(date) {
  return dayjs(date, formats, true).isValid();
}

// Check if the inserted year is valid
function isValidYear(date) {
  const year = dayjs(date, formats, true).year();
  return year > new Date().getFullYear() - 100 && year < new Date().getFullYear();
}

// Check if a date is valid
export function isValidBirthDate(date) {
  return isValidDateFormat(date) && isValidYear(date);
}

// Check if the user has selected a patient
export function hasSelectedPatient(patient) {
  if (
    patient?.patientFirstName === "" ||
    patient?.patientLastName === "" ||
    patient?.patientDateOfBirth === ""
  ) {
    return false;
  }

  return true;
}

// Check if an object is empty
export function isEmptyObj(obj) {
  return Object.keys(obj).length === 0;
}

// Check if a username is valid
export function isValidUserName(userName) {
  return USER_REGEX.test(userName);
}

// Check if a name is valid
export function isValidName(name) {
  return NAME_REGEX.test(name);
}

// Check if a password is valid
export function isValidPassword(password) {
  return PWD_REGEX.test(password);
}
