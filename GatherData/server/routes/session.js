const router = require("express").Router();
const pool = require("@root/config/db");
const { isPosInt, isValidDateFormat } = require("@root/utils/validateData");

// SESSION QUERIES
// Get session with patient id and session date
router.get("/session/:pid&:sdate", async (req, res) => {
  console.log("Get session");
  try {
    console.log(req.params);
    const { pid: patientId, sdate: sessionDate } = req.params;

    if (!isPosInt(patientId) || !isValidDateFormat(sessionDate)) {
      return res.status(422).json({ errMsg: "Invalid data" });
    }

    const queryRes = await pool.query("SELECT * FROM session WHERE patient_id=$1 AND session_date=$2", [
      patientId,
      sessionDate,
    ]);
    console.log(queryRes.rows[0]);
    res.json(queryRes.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ errMsg: "Server error" });
  }
});

// Insert session
router.post("/session", async (req, res) => {
  console.log("Insert session");
  try {
    console.log("Body:");
    console.log(req.body);
    const { patientId, sessionDate } = req.body;

    if (!isPosInt(patientId) || !isValidDateFormat(sessionDate)) {
      return res.status(422).json({ errMsg: "Invalid data" });
    }

    // Ckeck if valid predictions exist
    let queryRes = await pool.query(
      "SELECT COUNT(prediction_id) AS prediction_count FROM prediction WHERE patient_id=$1 AND prediction_date=$2",
      [patientId, sessionDate]
    );
    console.log(queryRes.rows[0]);
    const { prediction_count: predictionCount } = queryRes.rows[0];
    if (predictionCount <= 0) {
      return res.status(422).json({ errMsg: `No valid predictions exist on ${sessionDate}` });
    }

    // Ckeck if the session already exists
    queryRes = await pool.query("SELECT * FROM session WHERE patient_id=$1 AND session_date=$2", [
      patientId,
      sessionDate,
    ]);
    console.log("Session exists:");
    console.log(queryRes.rows[0]);

    // If a session doesn't exist insert a new session else update the existing session
    if (queryRes.rowCount === 0) {
      console.log("Insert session");

      queryRes = await pool.query(
        "INSERT INTO session (patient_id, normal, cp1 , cp2, session_date) SELECT patient_id, ROUND(AVG(normal)::numeric, 5), ROUND(AVG(cp1)::numeric, 5), ROUND(AVG(cp2)::numeric, 5), prediction_date FROM prediction WHERE patient_id=$1 AND prediction_date=$2 GROUP BY patient_id, prediction_date RETURNING *",
        [patientId, sessionDate]
      );
      console.log(queryRes.rows[0]);
      res.json(queryRes.rows[0]);
    } else {
      console.log("Update session");
      const { session_id: sessionId } = queryRes.rows[0];

      queryRes = await pool.query(
        "UPDATE session as s SET normal=new_avg.normal, cp1=new_avg.cp1, cp2=new_avg.cp2 FROM (SELECT ROUND(AVG(normal)::numeric, 5) as normal, ROUND(AVG(cp1)::numeric, 5) as cp1, ROUND(AVG(cp2)::numeric, 5) as cp2 FROM prediction WHERE patient_id=$1 AND prediction_date=$2) AS new_avg WHERE session_id = $3 RETURNING s.session_id, s.patient_id, s.normal, s.cp1, s.cp2, s.session_date",
        [patientId, sessionDate, sessionId]
      );
      console.log(queryRes.rows[0]);
      res.json(queryRes.rows[0]);
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ errMsg: "Server error" });
  }
});

// Update session
router.put("/session/:sid&:pid&:sdate", async (req, res) => {
  console.log("Update session");
  try {
    console.log(req.body);
    const { sid: sessionId, pid: patientId, sdate: sessionDate } = req.params;

    if (!isPosInt(sessionId) || !isPosInt(patientId) || !isValidDateFormat(sessionDate)) {
      return res.status(422).json({ errMsg: "Invalid data" });
    }

    const queryRes = await pool.query(
      "UPDATE session as s SET normal=new_avg.normal, cp1=new_avg.cp1, cp2=new_avg.cp2 FROM (SELECT ROUND(AVG(normal)::numeric, 5) as normal, ROUND(AVG(cp1)::numeric, 5) as cp1, ROUND(AVG(cp2)::numeric, 5) as cp2 FROM prediction WHERE patient_id=$1 AND prediction_date=$2) AS new_avg WHERE session_id = $3 RETURNING s.session_id, s.patient_id, s.normal, s.cp1, s.cp2, s.session_date",
      [patientId, sessionDate, sessionId]
    );
    console.log(queryRes.rows[0]);
    res.json(queryRes.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ errMsg: "Server error" });
  }
});

// Get latest sessions with patient id
router.get("/latest-sessions/:pid", async (req, res) => {
  console.log("Get latest sessions");
  try {
    console.log(req.params);
    const { pid: patientId } = req.params;

    if (!isPosInt(patientId)) {
      return res.status(422).json({ errMsg: "Invalid data" });
    }

    const queryRes = await pool.query(
      "SELECT * FROM session WHERE patient_id = $1 ORDER BY session_date DESC LIMIT 20",
      [patientId]
    );
    console.log(queryRes.rows);
    res.json(queryRes.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ errMsg: "Server error" });
  }
});

module.exports = router;
