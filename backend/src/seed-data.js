// Script untuk memasukkan data contoh ke database
const pool = require('./db/pool');

const seedDatabase = async () => {
  try {
    console.log('🌱 Memulai seed data...');

    // 1. Insert Categories
    const existingCategories = await pool.query(`SELECT COUNT(*) FROM categories`);
    if (existingCategories.rows[0].count === 0) {
      await pool.query(`
        INSERT INTO categories (name, description) VALUES
        ('Atasan', 'Pakaian bagian atas seperti kaos, kemeja'),
        ('Bawahan', 'Pakaian bagian bawah seperti celana, rok'),
        ('Outer', 'Pakaian luar seperti jaket, cardigan'),
        ('Dress', 'Gaun dan dress untuk wanita')
      `);
      console.log('✅ Categories berhasil ditambahkan');
    } else {
      console.log('ℹ️  Categories sudah ada di database');
    }

    // 2. Insert Products
    // First check if products already exist
    const existingProducts = await pool.query(`SELECT COUNT(*) FROM products`);
    if (existingProducts.rows[0].count === 0) {
      await pool.query(`
        INSERT INTO products (name, description, price, stock, category_id) VALUES
        ('T-Shirt Premium', 'Kaos premium berkualitas tinggi', 150000, 50, 1),
        ('Jeans Casual', 'Celana jeans casual nyaman', 350000, 30, 2),
        ('Kemeja Formal', 'Kemeja formal untuk acara penting', 280000, 25, 1),
        ('Celana Chino', 'Celana chino premium warna beragam', 300000, 40, 2),
        ('Jaket Denim', 'Jaket denim trendy dan stylish', 450000, 20, 3),
        ('Dress Wanita', 'Dress cantik untuk wanita', 400000, 35, 4)
      `);
      console.log('✅ Products berhasil ditambahkan');
    } else {
      console.log('ℹ️  Products sudah ada di database');
    }

    // 3. Insert Sample Transactions (commented out for now - optional)
    // const userResult = await pool.query(`SELECT id FROM users LIMIT 1`);
    // if (userResult.rows.length > 0) {
    //   const userId = userResult.rows[0].id;
    //   const existingTransactions = await pool.query(`SELECT COUNT(*) FROM transactions`);
    //   if (existingTransactions.rows[0].count === 0) {
    //     // Insert transaction
    //     const transactionResult = await pool.query(`
    //       INSERT INTO transactions (user_id, total_price) VALUES
    //       ($1, 750000),
    //       ($1, 1050000),
    //       ($1, 600000)
    //       RETURNING id
    //     `, [userId]);
    //     if (transactionResult.rows.length > 0) {
    //       const transactionIds = transactionResult.rows.map(row => row.id);
    //       await pool.query(`
    //         INSERT INTO transaction_items (transaction_id, product_id, quantity, price) VALUES
    //         ($1, 1, 5, 150000),
    //         ($1, 3, 1, 280000)
    //       `, [transactionIds[0]]);
    //       await pool.query(`
    //         INSERT INTO transaction_items (transaction_id, product_id, quantity, price) VALUES
    //         ($1, 2, 3, 350000),
    //         ($1, 5, 1, 450000)
    //       `, [transactionIds[1]]);
    //       await pool.query(`
    //         INSERT INTO transaction_items (transaction_id, product_id, quantity, price) VALUES
    //         ($1, 6, 1, 400000)
    //       `, [transactionIds[2]]);
    //       console.log('✅ Transactions berhasil ditambahkan');
    //     }
    //   }
    // }

    console.log('✨ Seed data selesai!');
    console.log('📊 Data sudah siap dilihat di pgAdmin');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seed data:', error.message);
    process.exit(1);
  }
};

seedDatabase();
