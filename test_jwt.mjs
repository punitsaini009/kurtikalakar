import { createClient } from '@insforge/sdk';
import { encode } from 'next-auth/jwt';

async function main() {
  const secret = 'K9xP7mQ2vL8nR4sT6wY1zA7';
  
  // Create an ADMIN token (since admin/upload needs admin)
  const tokenStr = await encode({
    token: { email: 'admin@kurtikalakar.com', role: 'ADMIN', id: 'cmshh93i00000tpfgexu15tnw' },
    secret
  });

  const insforgeClient = createClient({
    baseUrl: 'https://74mncgr7.us-east.insforge.app',
    anonKey: 'anon_bef499c78be106f01604cd18d131443ba7118560b896ece1c8050f3e15f52a42',
    accessToken: tokenStr
  });

  const blob = new Blob(['Hello World Admin'], { type: 'text/plain' });
  const { data, error } = await insforgeClient.storage.from('payment_qr').upload('test-admin.txt', blob);
  console.log('Admin Result:', { data, error });
}

main().catch(console.error);
