// Script para testar endpoint register-customer
const http = require('http');

const testRegister = () => {
  const data = JSON.stringify({
    name: 'Test User ' + Date.now(),
    email: 'test' + Date.now() + '@example.com',
    password: 'password123'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/auth/register-customer',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    let responseData = '';
    
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      console.log('Response:', JSON.parse(responseData));
      process.exit(0);
    });
  });

  req.on('error', (error) => {
    console.error('Error:', error);
    process.exit(1);
  });

  console.log('📤 Mengirim request...');
  console.log('Data:', JSON.parse(data));
  req.write(data);
  req.end();
};

testRegister();
