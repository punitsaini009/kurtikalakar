const { encode } = require('next-auth/jwt');

async function testRealUpload() {
  const secret = 'K9xP7mQ2vL8nR4sT6wY1zA7';
  
  // Create an ADMIN token
  const tokenStr = await encode({
    token: { email: 'admin@kurtikalakar.com', role: 'ADMIN', id: 'cmshh93i00000tpfgexu15tnw' },
    secret
  });

  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  const fileContent = 'Dummy Image Data';
  
  let body = '';
  body += `--${boundary}\r\n`;
  body += `Content-Disposition: form-data; name="file"; filename="dummy.png"\r\n`;
  body += `Content-Type: image/png\r\n\r\n`;
  body += `${fileContent}\r\n`;
  body += `--${boundary}--\r\n`;

  console.log('Testing /api/upload on localhost:3001...');
  try {
    const res = await fetch('http://localhost:3001/api/upload', {
      method: 'POST',
      headers: {
        'Cookie': `next-auth.session-token=${tokenStr}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      },
      body
    });
    
    console.log('/api/upload Status:', res.status);
    const text = await res.text();
    console.log('/api/upload Response:', text);
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

testRealUpload().catch(console.error);
