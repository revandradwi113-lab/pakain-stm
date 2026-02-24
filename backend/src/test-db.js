// Script para testar conexão database
const pool = require('./db/pool');

const testConnection = async () => {
  try {
    console.log('🔍 Testando conexão database...');
    
    // Test 1: Koneksi
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Koneksi database BERHASIL');
    console.log('   Waktu server:', result.rows[0].now);
    
    // Test 2: Verifikasi tabel users
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ Tabel users ADA');
      
      // Test 3: Cek struktur tabel
      const columns = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users'
        ORDER BY ordinal_position
      `);
      
      console.log('\n📋 Struktur tabel users:');
      columns.rows.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type}`);
      });
      
      // Test 4: Hitung data
      const countUsers = await pool.query('SELECT COUNT(*) FROM users');
      console.log(`\n📊 Total users: ${countUsers.rows[0].count}`);
      
    } else {
      console.log('❌ Tabel users TIDAK ADA');
      console.log('⚠️  Jalankan: node src/setup-db.js');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testConnection();
