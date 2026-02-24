const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.PGUSER  ||"postgres",
  host: process.env.PGHOST   ||"localhost", 
  database: process.env.PGDATABASE  ||"toko_online",
  password: process.env.PGPASSWORD    ||"postgres",
  port: process.env.PGPORT  ||"5432",
});

module.exports = pool;
