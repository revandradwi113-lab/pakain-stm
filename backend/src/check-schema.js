/**
 * Check what columns exist in products table
 */
const pool = require('./db/pool');

const checkSchema = async () => {
  try {
    console.log('🔍 Checking products table schema...');
    
    const result = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns 
      WHERE table_name='products'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Products table columns:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });
    
    pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    pool.end();
  }
};

checkSchema();
