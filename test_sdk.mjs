import { createClient } from '@insforge/sdk';

async function main() {
  const insforgeUrl = 'https://74mncgr7.us-east.insforge.app';
  const insforgeAnonKey = 'anon_bef499c78be106f01604cd18d131443ba7118560b896ece1c8050f3e15f52a42';

  const insforgeClient = createClient({
    baseUrl: insforgeUrl,
    anonKey: insforgeAnonKey
  });

  console.log('Testing upload...');
  const blob = new Blob(['test file content'], { type: 'text/plain' });
  
  const res = await insforgeClient.storage
    .from('products')
    .upload('test-screenshot-' + Date.now() + '.txt', blob);

  console.log('Upload result:', res);
  
  if (res.error) {
    process.exit(1);
  } else {
    // Check if both url and key are returned
    if (res.data && res.data.path) {
        console.log("Successfully retrieved key:", res.data.path);
    }
    
    const { data: publicUrlData } = insforgeClient.storage
      .from('products')
      .getPublicUrl(res.data.path);
    
    console.log("Successfully retrieved URL:", publicUrlData.publicUrl);
    
    process.exit(0);
  }
}

main().catch(console.error);
