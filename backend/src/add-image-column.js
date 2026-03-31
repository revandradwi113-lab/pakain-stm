const pool = require('./db/pool');

async function addImageColumn() {
  try {
    console.log('⏳ Checking if image column exists...');
    
    // Check if column exists
    const checkQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND column_name = 'image'
    `;
    
    const result = await pool.query(checkQuery);
    
    if (result.rows.length > 0) {
      console.log('✅ Image column sudah ada');
      process.exit(0);
    }

    // Add column jika tidak ada
    console.log('⏳ Adding image column to products table...');
    await pool.query(`
      ALTER TABLE products 
      ADD COLUMN image VARCHAR(255)
    `);

    console.log('✅ Image column berhasil ditambahkan');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addImageColumn();
