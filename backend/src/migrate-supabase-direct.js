/**
 * Migration: Add missing columns using Direct Connection (not pooler)
 */
const { Pool } = require('pg');
require('dotenv').config();

// Use Direct Connection (not pooler) for DDL operations
const directPool = new Pool({
  user: process.env.PGUSER,
  host: 'db.qzlkrkbwtoyfzkvpsgzc.supabase.co',  // Direct, not pooler
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: 5432  // Direct connection port
});

const migrateWithDirect = async () => {
  try {
    console.log('🔧 [DIRECT-MIGRATE] Using Direct Connection for DDL...');
    
    // Test connection
    const result = await directPool.query('SELECT NOW()');
    console.log('✅ [DIRECT-MIGRATE] Direct connection successful');
    
    // Add missing columns
    const columns = [
      { name: 'description', sql: 'ALTER TABLE products ADD COLUMN description TEXT DEFAULT \'\'' },
      { name: 'image', sql: 'ALTER TABLE products ADD COLUMN image VARCHAR(255) DEFAULT NULL' },
      { name: 'created_at', sql: 'ALTER TABLE products ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP' },
      { name: 'updated_at', sql: 'ALTER TABLE products ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP' }
    ];
    
    for (const col of columns) {
      try {
        console.log(`⏳ [DIRECT-MIGRATE] Adding ${col.name}...`);
        await directPool.query(col.sql);
        console.log(`✅ [DIRECT-MIGRATE] ${col.name} added`);
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log(`ℹ️  [DIRECT-MIGRATE] ${col.name} already exists`);
        } else {
          throw err;
        }
      }
    }
    
    console.log('✨ [DIRECT-MIGRATE] Schema migration completed!');
    await directPool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ [DIRECT-MIGRATE] Error:', error.message);
    await directPool.end();
    process.exit(1);
  }
};

migrateWithDirect();
