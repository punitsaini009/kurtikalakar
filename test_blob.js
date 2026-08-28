const { createClient } = require('@insforge/sdk');

const insforgeClient = createClient({
  baseUrl: 'https://74mncgr7.us-east.insforge.app',
  anonKey: 'anon_bef499c78be106f01604cd18d131443ba7118560b896ece1c8050f3e15f52a42'
});

async function main() {
  const blob = new Blob(['Hello World'], { type: 'text/plain' });
  const { data, error } = await insforgeClient.storage.from('products').upload('test.txt', blob);
  console.log('Result:', { data, error });
}

main().catch(console.error);
