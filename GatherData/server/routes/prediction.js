const router = require("express").Router();
const pool = require("@root/config/db");
const { isPosInt, isPosNumeric, isString } = require("@root/utils/validateData");

// PREDICTION QUERIES
// Get predictions count with patient id and prediction date
router.get("/prediction-count/:pid&:pdate", async (req, res) => {
  console.log("Get predictions count");
  try {
    console.log(req.params);
    const { pid: patientId, pdate: predictionDate } = req.params;

    if (!isPosInt(patientId) || !isString(predictionDate)) {
      return res.status(422).json({ errMsg: "Invalid data" });
    }

    const queryRes = await pool.query(
      "SELECT COUNT(prediction_id) FROM prediction WHERE patient_id=$1 AND prediction_date=$2",
      [patientId, predictionDate]
    );
    console.log(queryRes.rows[0]);
    res.json(queryRes.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ errMsg: "Server error" });
  }
});

// Insert prediction
router.post("/prediction", async (req, res) => {
  console.log("Insert prediction");
  try {
    console.log("Body:");
    console.log(req.body);
    const { patientId, normal, cp1, cp2, predictionDate } = req.body;

    if (
      !isPosInt(patientId) ||
      !isPosNumeric(normal) ||
      !isPosNumeric(cp1) ||
      !isPosNumeric(cp2) ||
      !isString(predictionDate)
    ) {
      return res.status(422).json({ errMsg: "Invalid data" });
    }

    const queryRes = await pool.query(
      "INSERT INTO prediction (patient_id, normal, cp1, cp2, prediction_date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [patientId, normal, cp1, cp2, predictionDate]
    );
    console.log(queryRes.rows[0]);
    res.json(queryRes.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ errMsg: "Server error" });
  }
});

module.exports = router;
