const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const NAME_REGEX = /^[a-zA-Z]+([ \\'-]{0,1}[a-zA-Z]+){0,2}[.]{0,1}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

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
  isPosFloat,
  isPosInt,
  isPosNumeric,
  isString,
  isValidUserName,
  isValidName,
  isValidPassword,
};
