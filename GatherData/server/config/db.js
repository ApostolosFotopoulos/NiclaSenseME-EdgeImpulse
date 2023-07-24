const pg = require("pg");
const envVariables = require("@root/env/envVariables");

pg.types.setTypeParser(1114, function (stringValue) {
  return stringValue; //1114 for time without timezone type
});

pg.types.setTypeParser(1082, function (stringValue) {
  return stringValue; //1082 for date type
});

const Pool = pg.Pool;
const pool = new Pool({
  user: envVariables.pgUser,
  password: envVariables.pgPassword,
  host: envVariables.pgHost,
  port: envVariables.pgPort,
  database: envVariables.pgDatabase,
});

module.exports = pool;
