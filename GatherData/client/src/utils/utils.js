import dayjs from "dayjs";
dayjs.suppressDeprecationWarnings = true;
// Valid inserted date formats
const formats = ["D/M/YYYY", "D-M-YYYY"];

// Check if a query result got the "Invalid Inputs" return from the database
export function checkRes(res) {
  if (res === "Invalid Inputs") {
    throw new Error("Invalid Inputs");
  }
}

// Change a string date to ISO8601 format
export function toIsoDayFormat(date) {
  return dayjs(date, formats, true).toISOString(true).split("T")[0];
}

//Get current date in ISO8601 format
export function getCurrentDate() {
  return dayjs(new Date(), true).toISOString(true).split("T")[0];
}
