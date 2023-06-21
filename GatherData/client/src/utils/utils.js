import moment from "moment";
moment.suppressDeprecationWarnings = true;
// Valid inserted date formats
const formats = ["D/M/YYYY", "D-M-YYYY"];

// Check if a query result got the "Invalid Inputs" return from the database
export function checkRes(res) {
  if (res === "Invalid Inputs") {
    throw new Error("Invalid Inputs");
  }
}

// Check if an object is empty
export function isEmptyObj(obj) {
  return Object.keys(obj).length === 0;
}

// Check if a string date is valid
export function isValidDate(date) {
  return moment(date, formats, true).isValid();
}

// Check if the inserted year is valid
export function isValidYear(date) {
  const year = moment(date, formats, true).year();
  return year > new Date().getFullYear() - 100 && year < new Date().getFullYear();
}

// Change a string date to ISO8601 format
export function toIsoDayFormat(date) {
  return moment(date, formats, true).toISOString(true).split("T")[0];
}

//Get current date in ISO8601 format
export function getCurrentDate() {
  return moment(new Date(), formats, true).toISOString(true).split("T")[0];
}
