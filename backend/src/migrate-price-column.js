/**
 * Migration: Expand price column from DECIMAL(10,2) to DECIMAL(15,2)
 * Untuk fix numeric field overflow error
 */
const pool = require('./db/pool');

const migrateDatabase = async () => {
  try {
    console.log('🔧 [MIGRATE] Starting migration...');
    
    // Alter products table - expand price column
    console.log('⏳ [MIGRATE] Altering products.price column...');
    try {
      await pool.query(`
        ALTER TABLE products 
        ALTER COLUMN price TYPE DECIMAL(15, 2)
      `);
      console.log('✅ [MIGRATE] products.price column updated');
    } catch (err) {
      console.warn('⚠️  [MIGRATE] Could not alter products.price:', err.message);
    }
    
    // Check if transactions table has total_price column
    console.log('⏳ [MIGRATE] Checking transactions table structure...');
    const checkTx = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='transactions' AND column_name='total_price'
    `);
    
    if (checkTx.rows.length > 0) {
      console.log('⏳ [MIGRATE] Altering transactions.total_price column...');
      try {
        await pool.query(`
          ALTER TABLE transactions 
          ALTER COLUMN total_price TYPE DECIMAL(15, 2)
        `);
        console.log('✅ [MIGRATE] transactions.total_price column updated');
      } catch (err) {
        console.warn('⚠️  [MIGRATE] Could not alter transactions.total_price:', err.message);
      }
    } else {
      console.log('ℹ️  [MIGRATE] transactions table does not have total_price column, skipping');
    }
    
    // Check if transaction_items table has price column
    console.log('⏳ [MIGRATE] Checking transaction_items table structure...');
    const checkTxItems = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='transaction_items' AND column_name='price'
    `);
    
    if (checkTxItems.rows.length > 0) {
      console.log('⏳ [MIGRATE] Altering transaction_items.price column...');
      try {
        await pool.query(`
          ALTER TABLE transaction_items 
          ALTER COLUMN price TYPE DECIMAL(15, 2)
        `);
        console.log('✅ [MIGRATE] transaction_items.price column updated');
      } catch (err) {
        console.warn('⚠️  [MIGRATE] Could not alter transaction_items.price:', err.message);
      }
    } else {
      console.log('ℹ️  [MIGRATE] transaction_items table does not have price column, skipping');
    }
    
    console.log('✨ [MIGRATE] Migration completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ [MIGRATE] Error:', error.message);
    console.error('❌ [MIGRATE] Full error:', error);
    process.exit(1);
  }
};

migrateDatabase();
