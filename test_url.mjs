import { createAdminClient } from '@insforge/sdk';

const insforgeAdminClient = createAdminClient({
  baseUrl: 'https://74mncgr7.us-east.insforge.app',
  apiKey: 'ik_78c14aea78b50d58e799cad00b823ffd'
});

const url = insforgeAdminClient.storage.from('products').getPublicUrl('test-admin-sdk.txt');
console.log('Public URL:', url);
