const router = require("express").Router();
const pool = require("@root/config/db");
const { isValidName, isValidDate } = require("@root/utils/validateData");

// Get patient with first name, last name and date of birth
router.get("/patient/:fname&:lname&:dob", async (req, res) => {
  try {
    console.log("Get patient");
    console.log(req.params);

    const { fname: patientFirstName, lname: patientLastName, dob: patientDateOfBirth } = req.params;
    if (!isValidName(patientFirstName) || !isValidName(patientLastName) || !isValidDate(patientDateOfBirth)) {
      return res.status(422).json({ errMsg: "Invalid data" });
    }

    const queryRes = await pool.query(
      "SELECT * FROM patient WHERE first_name=$1 AND last_name=$2 AND date_of_birth=$3",
      [patientFirstName, patientLastName, patientDateOfBirth]
    );
    console.log(queryRes.rows[0]);
    res.json(queryRes.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ errMsg: "Server error" });
  }
});

// Insert patient
router.post("/patient", async (req, res) => {
  console.log("Insert patient");
  try {
    console.log("Body:");
    console.log(req.body);
    const { patientFirstName, patientLastName, patientDateOfBirth } = req.body;

    if (!isValidName(patientFirstName) || !isValidName(patientLastName) || !isValidDate(patientDateOfBirth)) {
      return res.status(422).json({ errMsg: "Invalid data" });
    }

    let queryRes = await pool.query(
      "SELECT * FROM patient WHERE first_name=$1 AND last_name=$2 AND date_of_birth=$3",
      [patientFirstName, patientLastName, patientDateOfBirth]
    );
    console.log("Patient exists:");
    console.log(queryRes.rows[0]);
    if (queryRes.rows.length > 0) {
      return res.json(queryRes.rows[0]);
    }

    queryRes = await pool.query(
      "INSERT INTO patient(first_name, last_name, date_of_birth) VALUES ($1, $2, $3) RETURNING *",
      [patientFirstName, patientLastName, patientDateOfBirth]
    );
    console.log("Inserted data:");
    console.log(queryRes.rows[0]);
    res.json(queryRes.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ errMsg: "Server error" });
  }
});

module.exports = router;
