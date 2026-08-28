const { createAdminClient } = require('@insforge/sdk');

const adminClient = createAdminClient({
  baseUrl: 'https://74mncgr7.us-east.insforge.app',
  apiKey: 'ik_78c14aea78b50d58e799cad00b823ffd'
});

const { data } = adminClient.storage.from('payment_qr').getPublicUrl('payment_qr_1739538521028.png');
console.log('Public URL:', data.publicUrl);
