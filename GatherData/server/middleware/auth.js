const jwt = require("jsonwebtoken");
const envVariables = require("@root/env/envVariables");

module.exports = function (req, res, next) {
  console.log("Middleware");
  // Get token from header
  const token = req.header("jwt_token");

  // Check if not token
  if (!token) {
    return res.status(403).json({ msg: "Authorization denied" });
  }

  // Verify token
  try {
    const verify = jwt.verify(token, envVariables.jwtSecret);
    console.log(verify);

    req.doctor = verify.doctor;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
