// Script untuk mengubah user menjadi admin
const pool = require('./db/pool');
require('dotenv').config();

const changeUserRole = async () => {
  try {
    console.log('👤 Mengubah role user...');

    const email = 'janah@gmail.com';
    const newRole = 'admin';

    // Update user role
    const result = await pool.query(
      `UPDATE users SET role = $1 WHERE email = $2 RETURNING email, name, role`,
      [newRole, email]
    );

    if (result.rows.length === 0) {
      console.log('❌ User tidak ditemukan:', email);
      process.exit(1);
    }

    console.log('✅ Role berhasil diubah!');
    console.log('📧 Email:', result.rows[0].email);
    console.log('👤 Nama:', result.rows[0].name);
    console.log('🔐 Role BARU:', result.rows[0].role);
    console.log('\n✨ Sekarang user ini BISA edit dan tambah produk!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

changeUserRole();
