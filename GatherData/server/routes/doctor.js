const router = require("express").Router();
const pool = require("@root/config/db");
const { isPosInt, isValidUserName, isValidName, isValidPassword } = require("@root/utils/validateData");
const auth = require("@root/middleware/auth");

router.get("/doctor", auth, async (req, res) => {
  try {
    console.log("Select doctor");
    const { doctorId } = req.doctor;

    if (!isPosInt(doctorId)) {
      return res.status(422).json({ errMsg: "Invalid data" });
    }

    const queryRes = await pool.query(
      "SELECT doctor_id, user_name, first_name, last_name FROM doctor WHERE doctor_id = $1",
      [doctorId]
    );

    console.log(queryRes.rows[0]);
    res.json(queryRes.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errMsg: "Server error" });
  }
});

module.exports = router;
