// Simple script untuk test API
console.log('🧪 Testing API Endpoints...\n');

// Ambil token dari localStorage
const user = JSON.parse(localStorage.getItem('user') || '{}');
const token = localStorage.getItem('token');

console.log('👤 Current User:', user);
console.log('👤 User Role:', user.role);
console.log('🔐 Token:', token ? token.substring(0, 20) + '...' : 'NOT FOUND');

if (!token) {
  console.error('❌ No token found! Please login first.');
} else if (user.role !== 'admin') {
  console.error('❌ User is not admin! Role:', user.role);
  console.error('📝 Only admin can edit/create products');
} else {
  console.log('✅ You are admin! You should be able to edit/create products.');
}

// Test GET products
console.log('\n🧪 Testing GET /products...');
fetch('http://localhost:5000/products', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(data => {
  console.log('✅ GET products response:', data.length, 'products');
  console.log('   First product:', data[0]?.name);
})
.catch(e => console.error('❌ GET Error:', e));

// Test POST products
console.log('\n🧪 Testing POST /products...');
const newProduct = {
  name: 'Test Product ' + Date.now(),
  price: 99999,
  stock: 10,
  category_id: 1,
  description: 'Test description'
};

console.log('   Payload:', newProduct);

fetch('http://localhost:5000/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(newProduct)
})
.then(r => {
  console.log('   Response status:', r.status);
  return r.json();
})
.then(data => {
  console.log('✅ POST response:', data);
})
.catch(e => console.error('❌ POST Error:', e));
