// Script untuk menambahkan user login
const pool = require('./db/pool');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const addUser = async () => {
  try {
    console.log('👤 Menambahkan user baru...');

    // Email dan password yang ingin ditambahkan
    const email = 'janah@gmail.com';
    const password = '123456'; // Ganti dengan password yang diinginkan
    const name = 'Janah';
    const role = 'customer'; // atau 'admin', 'kasir'

    // Cek apakah user sudah ada
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log('⚠️  User sudah ada:', email);
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user baru
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, is_active) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, email, name, role`,
      [name, email, hashedPassword, role, true]
    );

    console.log('✅ User berhasil ditambahkan!');
    console.log('📧 Email:', result.rows[0].email);
    console.log('🔑 Password:', password);
    console.log('👤 Nama:', result.rows[0].name);
    console.log('🔐 Role:', result.rows[0].role);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

addUser();
