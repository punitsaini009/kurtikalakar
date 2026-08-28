const { encode } = require('next-auth/jwt');
const fs = require('fs');

async function testUpload(tokenStr, endpoint) {
  const fileContent = Buffer.from('test file content');
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  
  let body = '';
  body += '--' + boundary + '\r\n';
  body += 'Content-Disposition: form-data; name="file"; filename="test.png"\r\n';
  body += 'Content-Type: image/png\r\n\r\n';
  
  const payload = Buffer.concat([
    Buffer.from(body, 'utf-8'),
    fileContent,
    Buffer.from('\r\n--' + boundary + '--\r\n', 'utf-8'),
  ]);

  console.log(`Testing ${endpoint}...`);
  const res = await fetch(`http://localhost:3000${endpoint}`, {
    method: 'POST',
    headers: {
      'Cookie': `next-auth.session-token=${tokenStr}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    },
    body: payload
  });
  
  const text = await res.text();
  console.log(`${endpoint} Status:`, res.status);
  console.log(`${endpoint} Response:`, text);
}

async function main() {
  const secret = process.env.NEXTAUTH_SECRET || 'K9xP7mQ2vL8nR4sT6wY1zA7';
  
  // Admin Token
  const adminToken = await encode({
    token: { email: 'admin@kurtikalakar.com', role: 'ADMIN', id: 'cmshh93i00000tpfgexu15tnw' },
    secret
  });
  
  // User Token
  const userToken = await encode({
    token: { email: 'user@example.com', role: 'USER', id: 'cmshh93k30001tpfgwoafjam3' },
    secret
  });

  await testUpload(userToken, '/api/upload');
  await testUpload(adminToken, '/api/admin/upload');
}

main().catch(console.error);
