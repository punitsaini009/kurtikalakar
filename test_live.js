const { encode } = require('next-auth/jwt');
const fs = require('fs');

async function runLiveTest() {
  const baseUrl = 'https://74mncgr7.insforge.site';
  const secret = 'K9xP7mQ2vL8nR4sT6wY1zA7';
  
  // Create an ADMIN token
  const tokenStr = await encode({
    token: { email: 'admin@kurtikalakar.com', role: 'ADMIN', id: 'cmskeggdl0000tprk74evf9wn' },
    secret
  });

  const headers = {
    'Cookie': `__Secure-next-auth.session-token=${tokenStr}`,
    'Content-Type': 'application/json'
  };

  console.log(`[TEST 1] Testing manual checkout (order creation)...`);
  const checkoutRes = await fetch(`${baseUrl}/api/checkout/manual`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      items: [{ productId: 'cmsku32q80003tpbwsdap8zok', size: 'M', quantity: 1, price: 100 }],
      total: 100,
      utrNumber: 'LIVE_TEST_123',
      paymentScreenshot: 'https://test.com/screenshot.jpg'
    })
  });
  
  if (!checkoutRes.ok) throw new Error(`Checkout failed: ${await checkoutRes.text()}`);
  const checkoutData = await checkoutRes.json();
  const orderId = checkoutData.orderId;
  console.log(`✓ Order created: ${orderId}`);

  console.log(`\n[TEST 2] Testing admin payment screenshot upload...`);
  // Create a dummy image file
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  const fileContent = 'dummy image data';
  let body = `--${boundary}\r\n`;
  body += `Content-Disposition: form-data; name="file"; filename="test_screenshot.jpg"\r\n`;
  body += `Content-Type: image/jpeg\r\n\r\n`;
  body += fileContent + '\r\n';
  body += `--${boundary}--\r\n`;

  const uploadRes = await fetch(`${baseUrl}/api/upload`, {
    method: 'POST',
    headers: {
      'Cookie': `__Secure-next-auth.session-token=${tokenStr}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    },
    body
  });

  if (!uploadRes.ok) throw new Error(`Upload failed: ${await uploadRes.text()}`);
  const uploadData = await uploadRes.json();
  console.log(`✓ Upload successful. URL: ${uploadData.url}`);

  console.log(`\n[TEST 3] Testing Admin PENDING -> PAID update...`);
  const statusRes = await fetch(`${baseUrl}/api/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status: 'PAID' })
  });

  if (!statusRes.ok) throw new Error(`Status update failed: ${await statusRes.text()}`);
  const statusData = await statusRes.json();
  console.log(`✓ Status updated to PAID for order ${orderId}`);
  
  console.log('\nAll live tests passed successfully!');
}

runLiveTest().catch(console.error);
