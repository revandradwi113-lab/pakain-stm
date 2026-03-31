// 📋 DEBUG SCRIPT - Copy paste di browser console (F12)
// untuk debug masalah edit dan tambah produk

console.log('=== 🔍 DEBUGGING EDIT & TAMBAH PRODUK ===\n');

// 1. Check localStorage
console.log('1️⃣ Checking localStorage...');
const user = JSON.parse(localStorage.getItem('user') || '{}');
const token = localStorage.getItem('token');

console.log('   User data:', user);
console.log('   Token exists:', !!token);
console.log('   User role:', user.role);

// 2. Verify user is admin
console.log('\n2️⃣ Checking if you are admin...');
if (user.role === 'admin') {
  console.log('   ✅ YES, you are ADMIN');
} else {
  console.error('   ❌ NO, you are ' + user.role);
  console.error('   ⚠️  Only ADMIN can edit/create products!');
}

// 3. Test API connectivity
console.log('\n3️⃣ Testing API connectivity...');
fetch('http://localhost:5000/')
  .then(r => {
    console.log('   ✅ Backend is running (status:', r.status + ')');
    return r.text();
  })
  .then(text => {
    console.log('   Response:', text);
  })
  .catch(e => {
    console.error('   ❌ Cannot reach backend:', e.message);
    console.error('   Make sure backend is running: cd backend && npm start');
  });

// 4. Test protected endpoint
console.log('\n4️⃣ Testing protected endpoint (GET /products)...');
if (!token) {
  console.error('   ❌ No token! Need to login first');
} else {
  fetch('http://localhost:5000/products', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(r => {
      console.log('   Response status:', r.status);
      if (r.status === 401) {
        console.error('   ❌ Token invalid or expired - need to login again');
      } else if (r.status === 403) {
        console.error('   ❌ Forbidden - user not authorized');
      }
      return r.json();
    })
    .then(data => {
      if (Array.isArray(data)) {
        console.log('   ✅ API working! Found ' + data.length + ' products');
      } else {
        console.log('   Response:', data);
      }
    })
    .catch(e => {
      console.error('   ❌ API Error:', e.message);
    });
}

// 5. Test POST (create product)
console.log('\n5️⃣ Testing POST /products (create)...');
if (!token) {
  console.error('   ❌ No token - cannot test');
} else if (user.role !== 'admin') {
  console.error('   ❌ Not admin - cannot test');
} else {
  const testProduct = {
    name: 'Debug Test ' + Date.now(),
    price: 50000,
    stock: 5,
    category_id: 1,
    description: 'Test description'
  };
  
  console.log('   Sending payload:', testProduct);
  
  fetch('http://localhost:5000/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(testProduct)
  })
    .then(r => {
      console.log('   Response status:', r.status);
      return r.json();
    })
    .then(data => {
      if (data.product_id) {
        console.log('   ✅ Product created! ID:', data.product_id);
      } else {
        console.log('   Response:', data);
      }
    })
    .catch(e => {
      console.error('   ❌ Error:', e.message);
    });
}

console.log('\n=== 📝 CHECKLIST ===');
console.log('✓ Token exists:', !!token);
console.log('✓ User role is admin:', user.role === 'admin');
console.log('✓ Can reach backend');
console.log('✓ API responding to requests');
console.log('\n💡 If any check fails, fix that first!');
