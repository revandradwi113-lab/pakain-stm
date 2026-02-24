// Verify data in database
const pool = require('./db/pool');

const verifyData = async () => {
  try {
    console.log('🔍 Verifying data in database...\n');

    // Check products
    const productsResult = await pool.query(`
      SELECT id, name, price, stock, category_id FROM products ORDER BY id
    `);
    console.log(`✅ Total Products: ${productsResult.rows.length}`);
    console.log('📦 Products:');
    productsResult.rows.forEach(p => {
      console.log(`   - ID ${p.id}: ${p.name} (Rp ${p.price}, Stock: ${p.stock})`);
    });

    console.log('\n');

    // Check categories
    const categoriesResult = await pool.query(`
      SELECT id, name FROM categories ORDER BY id
    `);
    console.log(`✅ Total Categories: ${categoriesResult.rows.length}`);
    console.log('📂 Categories:');
    categoriesResult.rows.forEach(c => {
      console.log(`   - ID ${c.id}: ${c.name}`);
    });

    console.log('\n');

    // Check users
    const usersResult = await pool.query(`
      SELECT id, name, email, role FROM users ORDER BY id
    `);
    console.log(`✅ Total Users: ${usersResult.rows.length}`);
    console.log('👥 Users:');
    usersResult.rows.forEach(u => {
      console.log(`   - ID ${u.id}: ${u.name} (${u.email}) [${u.role}]`);
    });

    console.log('\n✨ All data is ready to be viewed in pgAdmin!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error verifying data:', error.message);
    process.exit(1);
  }
};

verifyData();
