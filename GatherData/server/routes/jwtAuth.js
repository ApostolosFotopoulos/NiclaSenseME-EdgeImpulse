const router = require("express").Router();
const pool = require("@root/config/db");
router.post("/signup", async (req, res) => {
  try {
    console.log("aaaa");
    const { doctorUserName, doctorFirstName, doctorLastName, doctorPassword } = req.body;
    console.log(doctorUserName);

    const queryRes = await pool.query("SELECT * FROM doctor WHERE user_name=$1", [doctorUserName]);
    console.log(queryRes.rows[0]);
    res.json(queryRes.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
