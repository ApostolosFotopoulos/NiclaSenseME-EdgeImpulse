const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Utility Functions
function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

function isInt(n) {
  return Number.isInteger(n);
}

function isString(str) {
  return typeof str === "string";
}

// PATIENT QUERIES
// Get patient with first name, last name and date of birth
app.get("/patient/:fname&:lname&:dob", async (req, res) => {
  try {
    console.log(req.params);
    let { fname: patientFirstName, lname: patientLastName, dob: patientDateOfBirth } = req.params;
    if (isString(patientFirstName) && isString(patientLastName) && isString(patientDateOfBirth)) {
      const patient = await pool.query(
        "SELECT * FROM patient WHERE first_name=$1 AND last_name=$2 AND date_of_birth=$3",
        [patientFirstName, patientLastName, patientDateOfBirth]
      );
      console.log(patient.rows[0]);
      res.json(patient.rows[0]);
    } else {
      res.json("Invalid Inputs");
    }
  } catch (err) {
    console.log(err);
  }
});

//Insert new patient
app.post("/patient", async (req, res) => {
  try {
    console.log("Body:");
    console.log(req.body);
    const { patientFirstName, patientLastName, patientDateOfBirth } = req.body;

    if (isString(patientFirstName) && isString(patientLastName) && isString(patientDateOfBirth)) {
      const newPatient = await pool.query(
        "INSERT INTO patient(first_name, last_name, date_of_birth) VALUES ($1, $2, $3) RETURNING *",
        [patientFirstName, patientLastName, patientDateOfBirth]
      );
      console.log("Inserted data:");
      console.log(newPatient.rows[0]);
      res.json(newPatient.rows[0]);
    } else {
      res.json("Invalid Inputs");
    }
  } catch (err) {
    console.log(err);
  }
});

// PREDICTION QUERIES
// Insert new prediction
app.post("/prediction", async (req, res) => {
  try {
    console.log("Body:");
    console.log(req.body);
    const { patientId, normal, cp1, cp2, predictionDate } = req.body;

    if (isInt(patientId) && isFloat(normal) && isFloat(cp1) && isFloat(cp2) && isString(predictionDate)) {
      const newPatient = await pool.query(
        "INSERT INTO prediction (patient_id, normal, cp1, cp2, prediction_date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [patientId, normal, cp1, cp2, predictionDate]
      );
      console.log(newPatient.rows[0]);
      res.json(newPatient.rows[0]);
    } else {
      res.json("Invalid Inputs");
    }
  } catch (err) {
    console.log(err);
  }
});

app.put("/patient/:id", async (req, res) => {
  try {
    console.log(req.body);
    const { patientName } = req.body;
    const { id: patientId } = req.params;
    const patient = await pool.query("UPDATE patient SET name=$1 WHERE patient_id = $2", [
      patientName,
      patientId,
    ]);
    res.json("update success");
  } catch (err) {
    console.log(err);
  }
});

app.delete("/patient/:id", async (req, res) => {
  try {
    const { id: patientId } = req.params;
    const patient = await pool.query("DELETE FROM patient WHERE patient_id = $1", [patientId]);
    res.json("delete success");
  } catch (err) {}
});

app.listen(5000, () => {
  console.log("Server has started on port 5000");
});
