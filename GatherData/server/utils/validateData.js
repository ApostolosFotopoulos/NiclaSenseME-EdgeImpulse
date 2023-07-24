const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
// Valid inserted date formats
const formats = ["YYYY-M-D"];

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const NAME_REGEX = /^[a-zA-Z]+([ \\'-]{0,1}[a-zA-Z]+){0,2}[.]{0,1}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

function isValidDateFormat(date) {
  return dayjs(date, formats, true).isValid();
}

// Check if the inserted year is valid
function isValidYear(date) {
  const year = dayjs(date, formats, true).year();
  return year > new Date().getFullYear() - 100 && year < new Date().getFullYear();
}

function isValidBirthDate(date) {
  return isValidDateFormat(date) && isValidYear(date);
}

function isPosFloat(n) {
  if (typeof n === "string") {
    n = parseFloat(n);
  }
  return Number(n) === n && n % 1 !== 0 && n >= 0;
}

function isPosInt(n) {
  if (typeof n === "string") {
    n = parseInt(n);
  }
  return Number.isInteger(n) && n >= 0;
}

function isPosNumeric(n) {
  return isPosInt(n) || isPosFloat(n);
}

function isString(str) {
  return typeof str === "string";
}

function isValidUserName(userName) {
  return USER_REGEX.test(userName);
}

function isValidName(name) {
  return NAME_REGEX.test(name);
}

function isValidPassword(password) {
  return PWD_REGEX.test(password);
}

module.exports = {
  isValidDateFormat,
  isValidBirthDate,
  isPosFloat,
  isPosInt,
  isPosNumeric,
  isString,
  isValidUserName,
  isValidName,
  isValidPassword,
};
