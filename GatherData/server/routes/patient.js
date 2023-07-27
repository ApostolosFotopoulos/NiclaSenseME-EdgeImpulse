const router = require("express").Router();
const pool = require("@root/config/db");
const { isValidName, isValidBirthDate, isPosInt, isString } = require("@root/utils/validateData");
const auth = require("@root/middleware/auth");

// Get patient with first name, last name and date of birth
router.get("/patient/:did&:fname&:lname&:dob", auth, async (req, res) => {
  try {
    console.log("Get patient");
    console.log(req.params);

    const {
      did: doctorId,
      fname: patientFirstName,
      lname: patientLastName,
      dob: patientDateOfBirth,
    } = req.params;

    if (
      !isPosInt(doctorId) ||
      !isValidName(patientFirstName) ||
      !isValidName(patientLastName) ||
      !isValidBirthDate(patientDateOfBirth)
    ) {
      return res.status(422).json({ errMsg: "Invalid data" });
    }

    const queryRes = await pool.query(
      "SELECT * FROM patient WHERE doctor_id=$1 AND first_name=$2 AND last_name=$3 AND date_of_birth=$4",
      [doctorId, patientFirstName, patientLastName, patientDateOfBirth]
    );
    console.log(queryRes.rows[0]);
    res.json(queryRes.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ errMsg: "Server error" });
  }
});

// Get patients from part of their name
router.get("/patients/:did&:name", auth, async (req, res) => {
  try {
    console.log("Get patients");
    console.log(req.params);

    const { did: doctorId, name: partOfName } = req.params;

    if (!isPosInt(doctorId) || !isString(partOfName)) {
      return res.status(422).json({ errMsg: "Invalid data" });
    }

    const partOfNameWildcard = `%${partOfName}%`;
    const queryRes = await pool.query(
      "SELECT patient_id, first_name, last_name, date_of_birth FROM patient WHERE doctor_id=$1 AND LOWER(CONCAT(first_name, ' ', last_name)) LIKE LOWER($2) LIMIT 8",
      [doctorId, partOfNameWildcard]
    );
    console.log(queryRes.rows);
    res.json(queryRes.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ errMsg: "Server error" });
  }
});

// Insert patient
router.post("/patient", auth, async (req, res) => {
  console.log("Insert patient");
  try {
    console.log("Body:");
    console.log(req.body);
    const { doctorId, patientFirstName, patientLastName, patientDateOfBirth } = req.body;

    if (
      !isPosInt(doctorId) ||
      !isValidName(patientFirstName) ||
      !isValidName(patientLastName) ||
      !isValidBirthDate(patientDateOfBirth)
    ) {
      return res.status(422).json({ errMsg: "Invalid data" });
    }

    let queryRes = await pool.query(
      "SELECT * FROM patient WHERE doctor_id=$1 AND first_name=$2 AND last_name=$3 AND date_of_birth=$4",
      [doctorId, patientFirstName, patientLastName, patientDateOfBirth]
    );
    console.log("Patient exists:");
    console.log(queryRes.rows[0]);
    if (queryRes.rowCount > 0) {
      return res.json(queryRes.rows[0]);
    }

    queryRes = await pool.query(
      "INSERT INTO patient(doctor_id ,first_name, last_name, date_of_birth) VALUES ($1, $2, $3, $4) RETURNING *",
      [doctorId, patientFirstName, patientLastName, patientDateOfBirth]
    );
    console.log("Inserted patient:");
    console.log(queryRes.rows[0]);
    res.json(queryRes.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ errMsg: "Server error" });
  }
});

module.exports = router;
