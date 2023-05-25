function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

function isInt(n) {
  return Number.isInteger(n);
}

function isString(str) {
  return typeof str === "string";
}

module.exports = { isFloat, isInt, isString };
