import { createClient } from '@insforge/sdk';

const supabaseUrl = 'https://74mncgr7.us-east.insforge.app';
const supabaseKey = 'anon_bef499c78be106f01604cd18d131443ba7118560b896ece1c8050f3e15f52a42';
const insforgeClient = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Fetching buckets...');
  const { data: buckets, error: bucketError } = await insforgeClient.storage.listBuckets();
  if (bucketError) {
    console.error('Error fetching buckets:', bucketError);
    return;
  }
  console.log('Buckets:', buckets);

  for (const bucket of buckets) {
    console.log(`\nFetching files in bucket: ${bucket.id}`);
    const { data: files, error: fileError } = await insforgeClient.storage.from(bucket.id).list();
    if (fileError) {
      console.error(`Error fetching files for bucket ${bucket.id}:`, fileError);
      continue;
    }
    
    for (const file of files) {
      if (file.name !== '.emptyFolderPlaceholder') {
        const { data: publicUrlData } = insforgeClient.storage.from(bucket.id).getPublicUrl(file.name);
        console.log(`Public URL for ${file.name}:`, publicUrlData.publicUrl);
      }
    }
  }
}

main().catch(console.error);
