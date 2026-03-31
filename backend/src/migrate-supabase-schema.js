/**
 * Migration: Add missing columns to Supabase products table
 * To match backend schema expectations
 */
const pool = require('./db/pool');

const migrateSupabaseSchema = async () => {
  try {
    console.log('🔧 [MIGRATE] Starting Supabase schema migration...');
    
    // Check if description column exists
    console.log('⏳ [MIGRATE] Checking description column...');
    const checkDesc = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='products' AND column_name='description'
    `);
    
    if (checkDesc.rows.length === 0) {
      console.log('⏳ [MIGRATE] Adding description column...');
      await pool.query(`
        ALTER TABLE products 
        ADD COLUMN description TEXT DEFAULT ''
      `);
      console.log('✅ [MIGRATE] description column added');
    } else {
      console.log('ℹ️  [MIGRATE] description column already exists');
    }
    
    // Check if image column exists
    console.log('⏳ [MIGRATE] Checking image column...');
    const checkImg = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='products' AND column_name='image'
    `);
    
    if (checkImg.rows.length === 0) {
      console.log('⏳ [MIGRATE] Adding image column...');
      await pool.query(`
        ALTER TABLE products 
        ADD COLUMN image VARCHAR(255) DEFAULT NULL
      `);
      console.log('✅ [MIGRATE] image column added');
    } else {
      console.log('ℹ️  [MIGRATE] image column already exists');
    }
    
    // Check if created_at column exists
    console.log('⏳ [MIGRATE] Checking created_at column...');
    const checkCreated = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='products' AND column_name='created_at'
    `);
    
    if (checkCreated.rows.length === 0) {
      console.log('⏳ [MIGRATE] Adding created_at column...');
      await pool.query(`
        ALTER TABLE products 
        ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
      console.log('✅ [MIGRATE] created_at column added');
    } else {
      console.log('ℹ️  [MIGRATE] created_at column already exists');
    }
    
    // Check if updated_at column exists
    console.log('⏳ [MIGRATE] Checking updated_at column...');
    const checkUpdated = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='products' AND column_name='updated_at'
    `);
    
    if (checkUpdated.rows.length === 0) {
      console.log('⏳ [MIGRATE] Adding updated_at column...');
      await pool.query(`
        ALTER TABLE products 
        ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
      console.log('✅ [MIGRATE] updated_at column added');
    } else {
      console.log('ℹ️  [MIGRATE] updated_at column already exists');
    }
    
    console.log('✨ [MIGRATE] Schema migration completed!');
    console.log('✅ All required columns are now in place');
    process.exit(0);
  } catch (error) {
    console.error('❌ [MIGRATE] Error:', error.message);
    console.error('❌ [MIGRATE] Full error:', error);
    process.exit(1);
  }
};

migrateSupabaseSchema();
