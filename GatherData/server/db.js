const pg = require("pg");

pg.types.setTypeParser(1114, function (stringValue) {
  return stringValue; //1114 for time without timezone type
});

pg.types.setTypeParser(1082, function (stringValue) {
  return stringValue; //1082 for date type
});

const Pool = pg.Pool;
const pool = new Pool({
  user: "postgres",
  password: "1233",
  host: "localhost",
  port: 5432,
  database: "nicla",
});

module.exports = pool;
