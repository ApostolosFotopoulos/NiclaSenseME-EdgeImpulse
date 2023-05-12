const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  password: "1233",
  host: "localhost",
  port: 5432,
  database: "nicla",
});

module.exports = pool;
