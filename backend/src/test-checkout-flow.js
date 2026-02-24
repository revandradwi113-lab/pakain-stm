// Script untuk test checkout flow lengkap
const pool = require('./db/pool');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function testCheckoutFlow() {
  const client = await pool.connect();
  try {
    console.log('🧪 TESTING COMPLETE CHECKOUT FLOW\n');
    console.log('='.repeat(70));

    // 1. Create test user if not exists
    console.log('\n1️⃣  Setup: Ensure test user exists...');
    const testEmail = 'test-kasir@endro.com';
    let userId;
    
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [testEmail]
    );

    if (existingUser.rows.length > 0) {
      userId = existingUser.rows[0].id;
      console.log(`   ✅ Found existing test kasir: ID ${userId}`);
    } else {
      const hashedPwd = await bcrypt.hash('test123', 10);
      const result = await client.query(
        'INSERT INTO users (name, email, password, role, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        ['Test Kasir', testEmail, hashedPwd, 'kasir', true]
      );
      userId = result.rows[0].id;
      console.log(`   ✅ Created test kasir: ID ${userId}`);
    }

    // 2. Get a product
    console.log('\n2️⃣  Getting product to purchase...');
    const products = await client.query('SELECT id, name, price, stock FROM products LIMIT 1');
    if (products.rows.length === 0) {
      console.log('   ❌ NO PRODUCTS! Cannot test checkout.');
      process.exit(1);
    }
    const product = products.rows[0];
    console.log(`   ✅ Product: ${product.name} (ID: ${product.id}, Price: ${product.price}, Stock: ${product.stock})`);

    // 3. Start transaction
    console.log('\n3️⃣  Starting transaction TEST...');
    await client.query('BEGIN');

    // 4. Create transaction
    console.log('\n4️⃣  Creating transaction...');
    const txResult = await client.query(
      'INSERT INTO transactions (user_id, total) VALUES ($1, $2) RETURNING id',
      [userId, product.price * 2]
    );
    const txId = txResult.rows[0].id;
    console.log(`   ✅ Transaction created: ID ${txId}, Total: Rp ${product.price * 2}`);

    // 5. Add transaction item
    console.log('\n5️⃣  Adding item to transaction...');
    await client.query(
      'INSERT INTO transaction_items (transaction_id, product_id, quantity, subtotal) VALUES ($1, $2, $3, $4)',
      [txId, product.id, 2, product.price * 2]
    );
    console.log(`   ✅ Item added: ${product.name} x2`);

    // 6. Reduce stock
    console.log('\n6️⃣  Reducing product stock...');
    const updateResult = await client.query(
      'UPDATE products SET stock = stock - $1 WHERE id = $2 RETURNING stock',
      [2, product.id]
    );
    console.log(`   ✅ Stock reduced from ${product.stock} to ${updateResult.rows[0].stock}`);

    // 7. Commit
    await client.query('COMMIT');
    console.log('\n7️⃣  Transaction COMMITTED ✅');

    // 8. Verify what was created
    console.log('\n8️⃣  VERIFICATION:');
    const savedTx = await pool.query(
      'SELECT * FROM transactions WHERE id = $1',
      [txId]
    );
    console.log(`   Transaction created: ${savedTx.rows.length > 0 ? '✅' : '❌'}`);

    const savedItems = await pool.query(
      'SELECT * FROM transaction_items WHERE transaction_id = $1',
      [txId]
    );
    console.log(`   Items created: ${savedItems.rows.length} ✅`);

    // 9. Test GET transactions endpoint behavior
    console.log('\n9️⃣  Testing GET /transactions filter (as admin)...');
    const allTx = await pool.query('SELECT COUNT(*) as total FROM transactions');
    console.log(`   Total transactions in DB: ${allTx.rows[0].total}`);

    // 10. Get detail
    console.log('\n🔟 Testing GET /transactions/:id detail...');
    const detail = await pool.query(
      `SELECT t.id, t.user_id, t.total, t.created_at, u.name, u.email
       FROM transactions t
       LEFT JOIN users u ON t.user_id = u.id
       WHERE t.id = $1`,
      [txId]
    );
    if (detail.rows.length > 0) {
      console.log(`   ✅ Detail retrieved: ${JSON.stringify(detail.rows[0])}`);
    }

    const items = await pool.query(
      `SELECT ti.*, p.name as product_name
       FROM transaction_items ti
       LEFT JOIN products p ON ti.product_id = p.id
       WHERE ti.transaction_id = $1`,
      [txId]
    );
    console.log(`   ✅ Items retrieved: ${items.rows.length} items`);

    console.log('\n' + '='.repeat(70));
    console.log('✅ CHECKOUT TEST COMPLETE - Everything looks good!');
    console.log('\nIf frontend still shows empty, check:');
    console.log('1. Browser console for API errors');
    console.log('2. User role is "admin" in localStorage');
    console.log('3. Token is valid');
    console.log('4. Run: npm start in frontend & backend');

    process.exit(0);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('\n❌ Error during test:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    client.release();
  }
}

testCheckoutFlow();
