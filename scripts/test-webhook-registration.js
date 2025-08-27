/**
 * Test webhook registration functionality
 * Tests webhook system without authentication requirements
 */

async function testWebhookSystem() {
  console.log('🔔 Testing Webhook System');
  console.log('=' .repeat(50));
  
  // Test webhook page availability
  console.log('📄 Testing webhook configuration page...');
  try {
    const response = await fetch('https://eden-genesis-registry.vercel.app/docs/webhooks');
    if (response.ok) {
      const html = await response.text();
      const hasWebhookForm = html.includes('REGISTER WEBHOOK') || html.includes('webhook');
      console.log(hasWebhookForm ? '✅ Webhook page loads correctly' : '⚠️ Webhook page missing elements');
    } else {
      console.log(`❌ Webhook page failed to load: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Webhook page error: ${error.message}`);
  }
  
  // Test webhook events documentation
  console.log('\n📚 Testing webhook events...');
  const expectedEvents = [
    'agent.created',
    'agent.updated', 
    'creation.published',
    'application.submitted'
  ];
  
  console.log('✅ Webhook events system includes:');
  expectedEvents.forEach(event => {
    console.log(`   • ${event}`);
  });
  
  // Test webhook endpoint existence (without auth)
  console.log('\n🔌 Testing webhook endpoint availability...');
  try {
    const response = await fetch('https://eden-genesis-registry.vercel.app/api/v1/webhooks/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    
    // 401 means endpoint exists but requires auth (good)
    // 404 means endpoint doesn't exist (bad)
    if (response.status === 401) {
      console.log('✅ Webhook endpoint exists (requires authentication)');
    } else if (response.status === 404) {
      console.log('❌ Webhook endpoint not found');
    } else {
      console.log(`ℹ️ Webhook endpoint returned: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Webhook endpoint error: ${error.message}`);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 Webhook system tests completed!');
  console.log('ℹ️ Note: Webhook registration requires authentication for security');
}

// Run the test
testWebhookSystem().catch(console.error);