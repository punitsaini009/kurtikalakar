import { createClient } from '@insforge/sdk';

const insforgeClient = createClient({
  baseUrl: 'https://74mncgr7.us-east.insforge.app',
  anonKey: 'anon_bef499c78be106f01604cd18d131443ba7118560b896ece1c8050f3e15f52a42'
});

async function main() {
  const blob = new Blob([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])], { type: 'image/png' });
  const { data, error } = await insforgeClient.storage.from('products').upload('test-' + Date.now() + '.png', blob);
  console.log('Result:', { data, error });
}

main().catch(console.error);
