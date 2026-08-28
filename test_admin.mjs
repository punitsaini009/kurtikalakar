import { createAdminClient } from '@insforge/sdk';

const originalFetch = global.fetch;
global.fetch = async (url, options) => {
  console.log('FETCHING URL:', url);
  console.log('HEADERS:', options?.headers);
  return originalFetch(url, options);
};

const supabaseUrl = 'https://74mncgr7.us-east.insforge.app';
const apiKey = 'ik_78c14aea78b50d58e799cad00b823ffd'; // from project.json

const adminClient = createAdminClient({
  baseUrl: supabaseUrl,
  apiKey: apiKey
});

async function checkSettings() {
  console.log('Fetching tables via RPC...');
  try {
    let { data, error } = await adminClient.database.rpc('get_tables');
    console.log('get_tables data:', data, error);
    let { data: d2, error: e2 } = await adminClient.database.rpc('sql', { query: "SELECT table_name FROM information_schema.tables WHERE table_schema='public'" });
    console.log('sql data:', d2, e2);
  } catch (err) {
    console.error('Exception:', err);
  }
}

checkSettings();
