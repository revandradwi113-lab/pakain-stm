// Script untuk reset password user
const pool = require('./db/pool');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const resetPassword = async () => {
  try {
    console.log('🔑 Reset password user...');

    const email = 'janah@gmail.com';
    const newPassword = '123456';

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    const result = await pool.query(
      `UPDATE users SET password = $1 WHERE email = $2 RETURNING email, name`,
      [hashedPassword, email]
    );

    if (result.rows.length === 0) {
      console.log('❌ User tidak ditemukan:', email);
      process.exit(1);
    }

    console.log('✅ Password berhasil direset!');
    console.log('📧 Email:', result.rows[0].email);
    console.log('🔑 Password baru: 123456');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

resetPassword();
