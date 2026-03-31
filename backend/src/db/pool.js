const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "toko_online",
  password: process.env.PGPASSWORD || "postgres",
  port: process.env.PGPORT || 5432,
  max: 20,                           // Max connection pools
  idleTimeoutMillis: 30000,          // 30 seconds idle timeout
  connectionTimeoutMillis: 5000,     // 5 seconds connection timeout
  ssl: process.env.PGHOST?.includes('supabase') ? { rejectUnauthorized: false } : false,  // SSL untuk Supabase
});

// Connection error handler
pool.on('error', (err) => {
  console.error('❌ [POOL] Unexpected pool error:', err.message);
});

module.exports = pool;
