function isPosFloat(n) {
  return Number(n) === n && n % 1 !== 0 && n >= 0;
}

function isPosInt(n) {
  return Number.isInteger(n) && n >= 0;
}

function isPosNumeric(n) {
  return isPosInt(n) || isPosFloat(n);
}

function isString(str) {
  return typeof str === "string";
}

module.exports = { isPosFloat, isPosInt, isPosNumeric, isString };
