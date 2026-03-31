// Script untuk test API endpoints
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000';
let token = '';

async function testAPI() {
  try {
    console.log('\n🧪 Testing API Endpoints...\n');

    // 1. Login first
    console.log('1️⃣ Testing LOGIN...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'janah@gmail.com',
        password: '123456'
      })
    });
    const loginData = await loginRes.json();
    
    if (loginData.token) {
      token = loginData.token;
      console.log('✅ Login successful');
      console.log('   Token:', token.substring(0, 20) + '...');
    } else {
      console.error('❌ Login failed:', loginData);
      return;
    }

    // 2. Test GET products
    console.log('\n2️⃣ Testing GET /products...');
    const getProductsRes = await fetch(`${BASE_URL}/products`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const products = await getProductsRes.json();
    console.log(`✅ Found ${products.length} products`);
    console.log('   Sample:', products[0]?.name);

    // 3. Test POST (create product)
    console.log('\n3️⃣ Testing POST /products (create)...');
    const testProduct = {
      name: 'Test Product ' + Date.now(),
      price: 99999,
      stock: 10,
      category_id: 1,
      description: 'Ini adalah produk test'
    };
    
    const createRes = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testProduct)
    });
    const createData = await createRes.json();
    
    if (createRes.status === 201) {
      console.log('✅ Product created successfully');
      console.log('   Response:', createData);
      
      // 4. Test PUT (update product)
      const productId = createData.product_id;
      if (productId) {
        console.log('\n4️⃣ Testing PUT /products/:id (update)...');
        const updateRes = await fetch(`${BASE_URL}/products/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: 'Updated Product ' + Date.now(),
            price: 88888,
            stock: 20,
            category_id: 1,
            description: 'Updated description'
          })
        });
        const updateData = await updateRes.json();
        
        if (updateRes.status === 200) {
          console.log('✅ Product updated successfully');
          console.log('   Response:', updateData);
        } else {
          console.error('❌ Update failed:', updateRes.status, updateData);
        }
      }
    } else {
      console.error('❌ Create failed:', createRes.status, createData);
    }

    console.log('\n✅ All tests completed!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();
