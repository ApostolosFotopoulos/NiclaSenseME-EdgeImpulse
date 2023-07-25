require("module-alias/register");
const express = require("express");
const cors = require("cors");
const envVariables = require("@root/env/envVariables");

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/", require("@root/routes/jwtAuth"));
app.use("/api/", require("@root/routes/doctor"));
app.use("/api/", require("@root/routes/patient"));
app.use("/api/", require("@root/routes/prediction"));
app.use("/api/", require("@root/routes/session"));

const port = envVariables.port || 5000;
app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
