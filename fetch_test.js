const http = require('http');

http.get('http://localhost:3001/products/cmsku32q80003tpbwsdap8zok', (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.log(data.substring(0, 1000));
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
