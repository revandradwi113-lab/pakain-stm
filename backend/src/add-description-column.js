// Script untuk menambahkan kolom description ke tabel products
const pool = require('./db/pool');

const addDescriptionColumn = async () => {
  try {
    console.log('🔧 Menambahkan kolom description ke tabel products...');

    // Cek apakah kolom sudah ada
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND column_name = 'description'
    `);

    if (checkColumn.rows.length > 0) {
      console.log('ℹ️  Kolom description sudah ada');
      process.exit(0);
    }

    // Tambahkan kolom description jika belum ada
    await pool.query(`
      ALTER TABLE products 
      ADD COLUMN description TEXT
    `);

    console.log('✅ Kolom description berhasil ditambahkan!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

addDescriptionColumn();
