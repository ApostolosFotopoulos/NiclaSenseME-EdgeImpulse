const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/patient", async (req, res) => {
  try {
    console.log(req.body);
    const { name: patientName } = req.body;
    const newPatient = await pool.query("INSERT INTO patient (name) VALUES ($1) RETURNING *", [patientName]);
    console.log(newPatient.rows[0]);
    res.json(newPatient.rows[0]);
  } catch (err) {}
});

app.listen(5000, () => {
  console.log("Server has started on port 5000");
});
