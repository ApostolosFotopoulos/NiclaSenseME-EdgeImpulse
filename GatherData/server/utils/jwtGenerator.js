const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(doctorId) {
  const payload = {
    doctor: {
      doctorId,
    },
  };

  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "8h" });
}

module.exports = jwtGenerator;
