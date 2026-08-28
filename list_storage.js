const { createAdminClient } = require('@insforge/sdk');
const fs = require('fs');
const path = require('path');

const projectJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), '.insforge', 'project.json'), 'utf8'));
const adminClient = createAdminClient({
  baseUrl: 'https://74mncgr7.us-east.insforge.app',
  apiKey: projectJson.api_key
});

async function main() {
  const { data, error } = await adminClient.storage.from('payment_qr').list();
  console.log("Bucket objects:", data);
  if (data && data.length > 0) {
    const pub = adminClient.storage.from('payment_qr').getPublicUrl(data[0].name);
    console.log("Public URL for first object:", pub.data.publicUrl);
  }
}
main();
