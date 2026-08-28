const https = require('https');

function checkUrl(url) {
  https.get(url, (res) => {
    console.log(`URL: ${url}`);
    console.log(`Status Code: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => { console.log(data.substring(0, 200)); });
  });
}

checkUrl('https://74mncgr7.us-east.insforge.app/storage/v1/object/public/payment_qr/6318942962225713354_120.jpg');
checkUrl('https://74mncgr7.us-east.insforge.app/api/storage/v1/object/public/payment_qr/6318942962225713354_120.jpg');
