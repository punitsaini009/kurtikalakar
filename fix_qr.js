const { encode } = require('next-auth/jwt');
const fs = require('fs');

async function fixQrCode() {
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

  console.log(`[1] Fetching QR code image for UPI...`);
  const qrRes = await fetch('https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=gurjar200@fam');
  const arrayBuffer = await qrRes.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  console.log(`[2] Uploading QR code to admin endpoint...`);
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  let body = `--${boundary}\r\n`;
  body += `Content-Disposition: form-data; name="file"; filename="payment_qr_${Date.now()}.png"\r\n`;
  body += `Content-Type: image/png\r\n\r\n`;
  
  // We need to send binary data correctly using fetch
  const bodyBuffer = Buffer.concat([
    Buffer.from(body),
    buffer,
    Buffer.from(`\r\n--${boundary}--\r\n`)
  ]);

  const uploadRes = await fetch(`${baseUrl}/api/admin/upload`, {
    method: 'POST',
    headers: {
      'Cookie': `__Secure-next-auth.session-token=${tokenStr}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    },
    body: bodyBuffer
  });

  if (!uploadRes.ok) throw new Error(`Upload failed: ${await uploadRes.text()}`);
  const uploadData = await uploadRes.json();
  const newQrUrl = uploadData.url;
  console.log(`✓ Upload successful. URL: ${newQrUrl}`);

  console.log(`\n[3] Updating Payment Settings with new QR URL...`);
  // Admin settings update route takes type: 'PAYMENT' and qrCodeUrl
  const settingsRes = await fetch(`${baseUrl}/api/admin/settings`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ type: 'PAYMENT', qrCodeUrl: newQrUrl })
  });

  if (!settingsRes.ok) throw new Error(`Settings update failed: ${await settingsRes.text()}`);
  console.log(`✓ Payment Settings updated successfully!`);
}

fixQrCode().catch(console.error);
