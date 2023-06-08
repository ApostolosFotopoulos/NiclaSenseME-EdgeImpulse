require("module-alias/register");
const express = require("express");
const cors = require("cors");
const pool = require("@root/config/db");
const { isPosInt, isPosNumeric, isString } = require("@root/utils/utils");

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/", require("@root/routes/jwtAuth"));
// PATIENT QUERIES
// Get patient with first name, last name and date of birth
app.get("/patient/:fname&:lname&:dob", async (req, res) => {
  try {
    console.log("Get patient");
    console.log(req.params);
    const { fname: patientFirstName, lname: patientLastName, dob: patientDateOfBirth } = req.params;
    if (isString(patientFirstName) && isString(patientLastName) && isString(patientDateOfBirth)) {
      const queryRes = await pool.query(
        "SELECT * FROM patient WHERE first_name=$1 AND last_name=$2 AND date_of_birth=$3",
        [patientFirstName, patientLastName, patientDateOfBirth]
      );
      console.log(queryRes.rows[0]);
      res.json(queryRes.rows[0]);
    } else {
      res.json("Invalid Inputs");
    }
  } catch (err) {
    console.log(err);
  }
});

// Insert patient
app.post("/patient", async (req, res) => {
  console.log("Insert patient");
  try {
    console.log("Body:");
    console.log(req.body);
    const { patientFirstName, patientLastName, patientDateOfBirth } = req.body;

    if (isString(patientFirstName) && isString(patientLastName) && isString(patientDateOfBirth)) {
      const queryRes = await pool.query(
        "INSERT INTO patient(first_name, last_name, date_of_birth) VALUES ($1, $2, $3) RETURNING *",
        [patientFirstName, patientLastName, patientDateOfBirth]
      );
      console.log("Inserted data:");
      console.log(queryRes.rows[0]);
      res.json(queryRes.rows[0]);
    } else {
      res.json("Invalid Inputs");
    }
  } catch (err) {
    console.log(err);
  }
});

// PREDICTION QUERIES
// Get predictions count with patient id and prediction date
app.get("/prediction-count/:pid&:pdate", async (req, res) => {
  console.log("Get predictions count");
  try {
    console.log(req.params);
    const { pid: patientId, pdate: predictionDate } = req.params;
    if (isPosInt(parseInt(patientId)) && isString(predictionDate)) {
      const queryRes = await pool.query(
        "SELECT COUNT(prediction_id) FROM prediction WHERE patient_id=$1 AND prediction_date=$2",
        [patientId, predictionDate]
      );
      console.log(queryRes.rows[0]);
      res.json(queryRes.rows[0]);
    } else {
      res.json("Invalid Inputs");
    }
  } catch (err) {
    console.log(err);
  }
});

// Insert prediction
app.post("/prediction", async (req, res) => {
  console.log("Insert prediction");
  try {
    console.log("Body:");
    console.log(req.body);
    const { patientId, normal, cp1, cp2, predictionDate } = req.body;

    if (
      isPosInt(patientId) &&
      isPosNumeric(normal) &&
      isPosNumeric(cp1) &&
      isPosNumeric(cp2) &&
      isString(predictionDate)
    ) {
      const queryRes = await pool.query(
        "INSERT INTO prediction (patient_id, normal, cp1, cp2, prediction_date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [patientId, normal, cp1, cp2, predictionDate]
      );
      console.log(queryRes.rows[0]);
      res.json(queryRes.rows[0]);
    } else {
      console.log("Why");
      res.json("Invalid Inputs");
    }
  } catch (err) {
    console.log(err);
  }
});

// SESSION QUERIES
// Get session with patient id and session date
app.get("/session/:pid&:sdate", async (req, res) => {
  console.log("Get session");
  try {
    console.log(req.params);
    const { pid: patientId, sdate: sessionDate } = req.params;
    if (isPosInt(parseInt(patientId)) && isString(sessionDate)) {
      const queryRes = await pool.query("SELECT * FROM session WHERE patient_id=$1 AND session_date=$2", [
        patientId,
        sessionDate,
      ]);
      console.log(queryRes.rows[0]);
      res.json(queryRes.rows[0]);
    } else {
      res.json("Invalid Inputs");
    }
  } catch (err) {
    console.log(err);
  }
});

// Insert session
app.post("/session", async (req, res) => {
  console.log("Insert session");
  try {
    console.log("Body:");
    console.log(req.body);
    const { patientId, sessionDate } = req.body;

    if (isPosInt(patientId) && isString(sessionDate)) {
      const queryRes = await pool.query(
        "INSERT INTO session (patient_id, normal, cp1 , cp2, session_date) SELECT patient_id, ROUND(AVG(normal)::numeric, 5), ROUND(AVG(cp1)::numeric, 5), ROUND(AVG(cp2)::numeric, 5), prediction_date FROM prediction WHERE patient_id=$1 AND prediction_date=$2 GROUP BY patient_id, prediction_date RETURNING *",
        [patientId, sessionDate]
      );
      console.log(queryRes.rows[0]);
      res.json(queryRes.rows[0]);
    } else {
      res.json("Invalid Inputs");
    }
  } catch (err) {
    console.log(err);
  }
});

// Update session
app.put("/session/:sid&:pid&:sdate", async (req, res) => {
  console.log("Update session");
  try {
    console.log(req.body);
    const { sid: sessionId, pid: patientId, sdate: sessionDate } = req.params;
    const queryRes = await pool.query(
      "UPDATE session as s SET normal=new_avg.normal, cp1=new_avg.cp1, cp2=new_avg.cp2 FROM (SELECT ROUND(AVG(normal)::numeric, 5) as normal, ROUND(AVG(cp1)::numeric, 5) as cp1, ROUND(AVG(cp2)::numeric, 5) as cp2 FROM prediction WHERE patient_id=$1 AND prediction_date=$2) AS new_avg WHERE session_id = $3 RETURNING s.session_id, s.patient_id, s.normal, s.cp1, s.cp2, s.session_date",
      [patientId, sessionDate, sessionId]
    );
    console.log(queryRes.rows[0]);
    res.json(queryRes.rows[0]);
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
