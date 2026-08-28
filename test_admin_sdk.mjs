import { createAdminClient } from '@insforge/sdk';

const insforgeAdminClient = createAdminClient({
  baseUrl: 'https://74mncgr7.us-east.insforge.app',
  apiKey: 'ik_78c14aea78b50d58e799cad00b823ffd'
});

async function main() {
  const blob = new Blob(['Hello World Admin SDK'], { type: 'text/plain' });
  const { data, error } = await insforgeAdminClient.storage.from('products').upload('test-admin-sdk.txt', blob);
  console.log('Result:', { data, error });
}

main().catch(console.error);
