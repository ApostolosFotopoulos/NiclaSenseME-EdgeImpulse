const jwt = require("jsonwebtoken");
const envVariables = require("@root/env/envVariables");

function jwtGenerator(doctorId) {
  const payload = {
    doctor: {
      doctorId,
    },
  };

  return jwt.sign(payload, envVariables.jwtSecret, { expiresIn: "8h" });
}

module.exports = jwtGenerator;
