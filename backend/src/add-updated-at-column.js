const pool = require('./db/pool');

async function addUpdatedAtColumn() {
  try {
    console.log('⏳ Checking if updated_at column exists...');
    
    // Check if column exists
    const checkQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND column_name = 'updated_at'
    `;
    
    const result = await pool.query(checkQuery);
    
    if (result.rows.length > 0) {
      console.log('✅ updated_at column sudah ada');
      process.exit(0);
    }

    // Add column jika tidak ada
    console.log('⏳ Adding updated_at column to products table...');
    await pool.query(`
      ALTER TABLE products 
      ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);

    console.log('✅ updated_at column berhasil ditambahkan');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addUpdatedAtColumn();
