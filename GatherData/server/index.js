const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/patient", async (req, res) => {
  try {
    console.log(req.body);
    const { patientName } = req.body;
    const newPatient = await pool.query("INSERT INTO patient (name) VALUES ($1) RETURNING *", [patientName]);
    console.log(newPatient.rows[0]);
    res.json(newPatient.rows[0]);
  } catch (err) {}
});

app.get("/patient/:id", async (req, res) => {
  try {
    const { id: patientId } = req.params;
    const patient = await pool.query("SELECT * FROM patient WHERE patient_id = $1", [patientId]);
    console.log(patient.rows[0]);
    res.json(patient.rows[0]);
  } catch (err) {}
});

app.put("/patient/:id", async (req, res) => {
  try {
    console.log(req.body);
    const { patientName } = req.body;
    const { id: patientId } = req.params;
    const patient = await pool.query("UPDATE patient SET name=$1 WHERE patient_id = $2", [patientName, patientId]);
    res.json("update success");
  } catch (err) {}
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
