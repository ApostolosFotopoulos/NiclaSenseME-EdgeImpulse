import dayjs from "dayjs";
dayjs.suppressDeprecationWarnings = true;
// Valid inserted date formats
const formats = ["D/M/YYYY", "D-M-YYYY"];

// Change a string date to ISO8601 format
export function toIsoDayFormat(date) {
  return dayjs(date, formats, true).toISOString(true).split("T")[0];
}

// Change date to D-M-YYYY format
export function toCustomFormat(date) {
  return dayjs(date).format(formats[1]);
}

//Get current date in ISO8601 format
export function getCurrentDate() {
  return dayjs(new Date(), true).toISOString(true).split("T")[0];
}
