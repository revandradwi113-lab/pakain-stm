// Script untuk register admin user
const http = require('http');

const adminData = {
  name: 'Admin User',
  email: 'admin@endro.com',
  password: 'admin123'
};

const postData = JSON.stringify(adminData);

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/auth/register-customer',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    console.log('\n⚠️ PENTING: Admin dibuat dengan role "kasir" dari endpoint register-customer');
    console.log('Anda perlu UPDATE role di database menjadi "admin"');
    console.log('\nRunkan query SQL ini:');
    console.log(`UPDATE users SET role = 'admin' WHERE email = '${adminData.email}';`);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(postData);
req.end();
