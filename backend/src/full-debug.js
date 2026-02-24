// Complete debug script untuk trace checkout dan data penjualan
const pool = require('./db/pool');
require('dotenv').config();

async function fullDebug() {
  try {
    console.log('🔍 FULL DEBUG - CHECKOUT & SALES DATA\n');
    console.log('='.repeat(60));

    // 1. Check users
    console.log('\n1️⃣  USERS IN DATABASE:');
    const users = await pool.query(`
      SELECT id, email, name, role, is_active 
      FROM users 
      ORDER BY id DESC 
      LIMIT 5
    `);
    if (users.rows.length === 0) {
      console.log('   ❌ NO USERS FOUND!');
    } else {
      console.log(`   Found ${users.rows.length} users:`);
      users.rows.forEach(u => {
        console.log(`   - ID: ${u.id}, Email: ${u.email}, Role: ${u.role}, Active: ${u.is_active}`);
      });
    }

    // 2. Check products
    console.log('\n2️⃣  PRODUCTS IN DATABASE:');
    const products = await pool.query(`
      SELECT id, name, stock, price 
      FROM products 
      LIMIT 5
    `);
    if (products.rows.length === 0) {
      console.log('   ❌ NO PRODUCTS FOUND!');
    } else {
      console.log(`   Found ${products.rows.length} products:`);
      products.rows.forEach(p => {
        console.log(`   - ID: ${p.id}, Name: ${p.name}, Stock: ${p.stock}, Price: ${p.price}`);
      });
    }

    // 3. Check transactions
    console.log('\n3️⃣  TRANSACTIONS IN DATABASE:');
    const txCount = await pool.query(`
      SELECT COUNT(*) as total FROM transactions
    `);
    console.log(`   Total transactions: ${txCount.rows[0].total}`);
    
    const transactions = await pool.query(`
      SELECT 
        t.id, 
        t.user_id, 
        u.email, 
        u.name,
        u.role,
        t.total, 
        t.created_at 
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      ORDER BY t.id DESC
      LIMIT 10
    `);
    
    if (transactions.rows.length === 0) {
      console.log('   ❌ NO TRANSACTIONS! (This is the problem)');
    } else {
      console.log(`   Found ${transactions.rows.length} transactions:`);
      transactions.rows.forEach(tx => {
        console.log(`   - TX #${tx.id}: User ID: ${tx.user_id} (${tx.email} / ${tx.name}, ${tx.role}) - Total: Rp ${tx.total}`);
      });
    }

    // 4. Check transaction items
    console.log('\n4️⃣  TRANSACTION ITEMS IN DATABASE:');
    const itemCount = await pool.query(`
      SELECT COUNT(*) as total FROM transaction_items
    `);
    console.log(`   Total items: ${itemCount.rows[0].total}`);

    if (itemCount.rows[0].total === 0) {
      console.log('   ❌ NO TRANSACTION ITEMS!');
    } else {
      const items = await pool.query(`
        SELECT 
          ti.id,
          ti.transaction_id,
          ti.product_id,
          p.name,
          ti.quantity,
          ti.subtotal
        FROM transaction_items ti
        LEFT JOIN products p ON ti.product_id = p.id
        ORDER BY ti.transaction_id DESC
        LIMIT 10
      `);
      console.log(`   Found ${items.rows.length} items:`);
      items.rows.forEach(item => {
        console.log(`   - TX #${item.transaction_id}: ${item.name} x${item.quantity} = Rp ${item.subtotal}`);
      });
    }

    // 5. Check for admin user specifically
    console.log('\n5️⃣  ADMIN USER CHECK:');
    const admins = await pool.query(`
      SELECT id, email, name 
      FROM users 
      WHERE role = 'admin'
    `);
    if (admins.rows.length === 0) {
      console.log('   ⚠️  NO ADMIN USER EXISTS! Create one first:');
      console.log('   UPDATE users SET role = "admin" WHERE email = "[your-email]";');
    } else {
      console.log(`   Found ${admins.rows.length} admin(s):`);
      admins.rows.forEach(admin => {
        console.log(`   - ID: ${admin.id}, Email: ${admin.email}, Name: ${admin.name}`);
      });
    }

    // 6. Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY:');
    console.log(`   Users: ${users.rows.length}`);
    console.log(`   Products: ${products.rows.length}`);
    console.log(`   Transactions: ${txCount.rows[0].total}`);
    console.log(`   Transaction Items: ${itemCount.rows[0].total}`);
    console.log(`   Admins: ${admins.rows.length}`);

    if (txCount.rows[0].total === 0) {
      console.log('\n⚠️  PROBLEM: No transactions saved!');
      console.log('   This means checkout is NOT working properly.');
      console.log('   Possible causes:');
      console.log('   1. Checkout request is failing');
      console.log('   2. Transaction creation has an error');
      console.log('   3. User trying to checkout is not kasir or admin');
      console.log('\n   Next step: Check browser console during checkout AND:');
      console.log('   - Look for error messages');
      console.log('   - Verify user role is "kasir" or "admin"');
      console.log('   - Run: node src/server.js in another terminal');
      console.log('   - Try checkout again and check for error logs');
    } else {
      console.log('\n✅ Transactions exist! Check why they are not showing in frontend.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Database Error:', error.message);
    process.exit(1);
  }
}

fullDebug();
