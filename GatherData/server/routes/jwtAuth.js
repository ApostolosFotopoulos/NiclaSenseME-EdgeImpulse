const router = require("express").Router();
const bcrypt = require("bcrypt");
const pool = require("@root/config/db");
const jwtGenerator = require("@root/utils/jwtGenerator");
const { isString, isValidUserName, isValidName, isValidPassword } = require("@root/utils/validateData");

// Insert doctor
router.post("/signup", async (req, res) => {
  try {
    console.log("Sign up doctor");
    const { doctorUserName, doctorFirstName, doctorLastName, doctorPassword } = req.body;

    if (
      !isValidUserName(doctorUserName) ||
      !isValidName(doctorFirstName) ||
      !isValidName(doctorLastName) ||
      !isValidPassword(doctorPassword)
    ) {
      return res.status(422).json({ msg: "Invalid data" });
    }

    // Check if the user exists
    let queryRes = await pool.query("SELECT * FROM doctor WHERE user_name=$1", [doctorUserName]);
    console.log(queryRes.rows[0]);

    if (queryRes.rows.length > 0) {
      return res.status(401).json({ msg: "Username already taken" });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const doctorHashPassword = await bcrypt.hash(doctorPassword, salt);

    // If the user doesn't exist, insert the user in the database
    queryRes = await pool.query(
      "INSERT INTO doctor(user_name, first_name, last_name, passhash) VALUES ($1, $2, $3, $4) RETURNING doctor_id",
      [doctorUserName, doctorFirstName, doctorLastName, doctorHashPassword]
    );

    // Return the jwt token
    const { doctor_id: doctorId } = queryRes.rows[0];
    const token = jwtGenerator(doctorId);
    res.json({ token });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// Login doctor
router.post("/login", async (req, res) => {
  try {
    console.log("Log in doctor");
    const { doctorUserName, doctorPassword } = req.body;

    if (!isString(doctorUserName) || !isString(doctorPassword)) {
      return res.status(422).json({ msg: "Invalid data" });
    }

    // Check if the user exists
    let queryRes = await pool.query("SELECT * FROM doctor WHERE user_name=$1", [doctorUserName]);
    console.log(queryRes.rows[0]);

    if (queryRes.rows.length === 0) {
      return res.status(401).json({ msg: "User or password is incorrect" });
    }

    const { passhash: doctorDatabasePassword } = queryRes.rows[0];
    const validPassword = await bcrypt.compare(doctorPassword, doctorDatabasePassword);

    if (!validPassword) {
      return res.status(401).json({ msg: "User or password is incorrect" });
    }

    // Return the jwt token
    const { doctor_id: doctorId } = queryRes.rows[0];
    const token = jwtGenerator(doctorId);
    res.json({ token });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
