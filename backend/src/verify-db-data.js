// Script untuk verify data di database
const pool = require('./db/pool');
require('dotenv').config();

async function verifyData() {
  try {
    console.log('📊 VERIFYING DATABASE DATA...\n');

    // Check transactions
    console.log('1️⃣  CHECKING TRANSACTIONS:');
    const transactions = await pool.query(`
      SELECT t.id, t.user_id, t.total, t.created_at, u.name, u.email, u.role
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
      LIMIT 10
    `);
    console.log(`Found ${transactions.rows.length} transactions:`);
    transactions.rows.forEach(tx => {
      console.log(`  - TX #${tx.id}: ${tx.email} (${tx.role}) - Rp ${tx.total} - ${tx.created_at}`);
    });

    // Check transaction items
    console.log('\n2️⃣  CHECKING TRANSACTION ITEMS:');
    const items = await pool.query(`
      SELECT ti.id, ti.transaction_id, ti.product_id, ti.quantity, ti.subtotal, p.name
      FROM transaction_items ti
      JOIN products p ON ti.product_id = p.id
      ORDER BY ti.transaction_id DESC
      LIMIT 10
    `);
    console.log(`Found ${items.rows.length} transaction items:`);
    items.rows.forEach(item => {
      console.log(`  - TX #${item.transaction_id}: ${item.name} x${item.quantity} (Rp ${item.subtotal})`);
    });

    // Check products stock
    console.log('\n3️⃣  CHECKING PRODUCTS STOCK:');
    const products = await pool.query(`
      SELECT id, name, stock, price
      FROM products
      ORDER BY id
    `);
    console.log(`Found ${products.rows.length} products:`);
    products.rows.forEach(prod => {
      console.log(`  - ${prod.name}: ${prod.stock} unit @ Rp ${prod.price}`);
    });

    // Check users
    console.log('\n4️⃣  CHECKING USERS:');
    const users = await pool.query(`
      SELECT id, name, email, role, is_active
      FROM users
      ORDER BY id
    `);
    console.log(`Found ${users.rows.length} users:`);
    users.rows.forEach(user => {
      console.log(`  - ${user.email} (${user.role}) - ${user.is_active ? 'Active' : 'Inactive'}`);
    });

    console.log('\n✅ VERIFICATION COMPLETE!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifyData();
