import { createAdminClient } from '@insforge/sdk';

try {
  const adminClient = createAdminClient({
    baseUrl: 'https://74mncgr7.us-east.insforge.app',
    apiKey: ''
  });
  console.log('Client initialized successfully');
} catch (error) {
  console.error('Initialization error:', error);
}
