const { Pool } = require("pg");
require("dotenv").config();

// Adjust connection settings based on environment
const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "toko_online",
  password: process.env.PGPASSWORD || "postgres",
  port: process.env.PGPORT || 5432,
  max: isProduction ? 5 : 20,              // Reduce max connections on production/Vercel
  idleTimeoutMillis: 10000,                // 10 seconds idle timeout (reduced from 30)
  connectionTimeoutMillis: 8000,           // 8 seconds connection timeout (increased from 5)
  ssl: process.env.PGHOST?.includes('supabase') ? { rejectUnauthorized: false } : false,
  // For Vercel compatibility
  ...(isProduction && {
    application_name: 'toko-pakaian-app'
  })
});

// Connection error handler
pool.on('error', (err) => {
  console.error('❌ [POOL] Unexpected pool error:', err.message);
});

module.exports = pool;
