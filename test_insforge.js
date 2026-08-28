const { createClient } = require('@insforge/sdk');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
});

async function main() {
  console.log(typeof client.storage.from);
}
main().catch(console.error);
