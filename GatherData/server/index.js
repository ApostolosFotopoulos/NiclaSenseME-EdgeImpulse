require("module-alias/register");
const express = require("express");
const cors = require("cors");
const pool = require("@root/config/db");
const { isPosInt, isPosNumeric, isString } = require("@root/utils/validateData");

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/", require("@root/routes/jwtAuth"));
app.use("/", require("@root/routes/doctor"));
app.use("/", require("@root/routes/patient"));
app.use("/", require("@root/routes/prediction"));
app.use("/", require("@root/routes/session"));

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
