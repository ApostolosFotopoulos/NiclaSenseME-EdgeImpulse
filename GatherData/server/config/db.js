const pg = require("pg");
require("dotenv").config();

pg.types.setTypeParser(1114, function (stringValue) {
  return stringValue; //1114 for time without timezone type
});

pg.types.setTypeParser(1082, function (stringValue) {
  return stringValue; //1082 for date type
});

const Pool = pg.Pool;
const pool = new Pool({
  user: process.env.pgUser,
  password: process.env.pgPassword,
  host: process.env.pgHost,
  port: process.env.pgPort,
  database: process.env.pgDatabase,
});

module.exports = pool;
