#!/usr/bin/env npx tsx

/**
 * Production Testing Script for Registry-as-Protocol
 * Tests all deployed forms, APIs, and webhooks
 */

const BASE_URL = 'https://eden-genesis-registry.vercel.app';
const API_BASE = `${BASE_URL}/api/v1`;

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL';
  message?: string;
  data?: any;
}

const results: TestResult[] = [];

async function testEndpoint(name: string, url: string, options?: RequestInit): Promise<void> {
  try {
    console.log(`Testing: ${name}`);
    const response = await fetch(url, options);
    
    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      results.push({
        name,
        status: 'PASS',
        message: `Status: ${response.status}`,
        data
      });
      console.log(`✅ ${name} - PASS`);
    } else {
      results.push({
        name,
        status: 'FAIL',
        message: `Status: ${response.status} - ${response.statusText}`
      });
      console.log(`❌ ${name} - FAIL (${response.status})`);
    }
  } catch (error) {
    results.push({
      name,
      status: 'FAIL',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    console.log(`❌ ${name} - ERROR: ${error}`);
  }
}

async function testFormPage(name: string, path: string): Promise<void> {
  try {
    console.log(`Testing form page: ${name}`);
    const response = await fetch(`${BASE_URL}${path}`);
    
    if (response.ok) {
      const html = await response.text();
      const hasForm = html.includes('<form') || html.includes('Form');
      const hasRegistry = html.includes('Registry') || html.includes('REGISTRY');
      
      if (hasForm && hasRegistry) {
        results.push({
          name: `Form Page: ${name}`,
          status: 'PASS',
          message: 'Page loads with form elements'
        });
        console.log(`✅ Form Page: ${name} - PASS`);
      } else {
        results.push({
          name: `Form Page: ${name}`,
          status: 'FAIL',
          message: 'Missing form or Registry elements'
        });
        console.log(`⚠️ Form Page: ${name} - Missing elements`);
      }
    } else {
      results.push({
        name: `Form Page: ${name}`,
        status: 'FAIL',
        message: `Status: ${response.status}`
      });
      console.log(`❌ Form Page: ${name} - FAIL (${response.status})`);
    }
  } catch (error) {
    results.push({
      name: `Form Page: ${name}`,
      status: 'FAIL',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    console.log(`❌ Form Page: ${name} - ERROR: ${error}`);
  }
}

async function runTests() {
  console.log('🧪 Starting Registry-as-Protocol Production Tests\n');
  console.log('=' .repeat(50));
  
  // Test 1: Form Pages
  console.log('\n📝 TESTING FORM PAGES:');
  console.log('-'.repeat(30));
  
  await testFormPage('Documentation Hub', '/docs');
  await testFormPage('Agent Creation', '/docs/agent-creation');
  await testFormPage('Trainer Application', '/docs/trainer-application');
  await testFormPage('Genesis Application', '/docs/genesis-application');
  await testFormPage('Agent Interview', '/docs/agent-interview');
  await testFormPage('API Documentation', '/docs/api');
  await testFormPage('Webhook Configuration', '/docs/webhooks');
  
  // Test 2: API Endpoints
  console.log('\n🔌 TESTING API ENDPOINTS:');
  console.log('-'.repeat(30));
  
  await testEndpoint('GET /agents', `${API_BASE}/agents`);
  await testEndpoint('GET /status', `${API_BASE}/status`);
  await testEndpoint('GET /genesis-cohort', `${API_BASE}/genesis-cohort`);
  
  // Test 3: Form Submission (with test data)
  console.log('\n📮 TESTING FORM SUBMISSIONS:');
  console.log('-'.repeat(30));
  
  const testApplication = {
    track: 'TEST',
    applicantName: 'Test Agent ' + Date.now(),
    applicantEmail: `test-${Date.now()}@eden.art`,
    customData: {
      type: 'PRODUCTION_TEST',
      timestamp: new Date().toISOString(),
      purpose: 'Automated testing of Registry forms'
    }
  };
  
  await testEndpoint('POST /applications (Test)', `${API_BASE}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testApplication)
  });
  
  // Test 4: Webhook Registration (test endpoint)
  console.log('\n🔔 TESTING WEBHOOK SYSTEM:');
  console.log('-'.repeat(30));
  
  const testWebhook = {
    url: `https://webhook.site/test-${Date.now()}`,
    events: ['agent.created', 'agent.updated'],
    secret: 'test-secret',
    description: 'Production test webhook'
  };
  
  await testEndpoint('POST /webhooks/register', `${API_BASE}/webhooks/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testWebhook)
  });
  
  // Test 5: Data Persistence Check
  console.log('\n💾 TESTING DATA PERSISTENCE:');
  console.log('-'.repeat(30));
  
  // Check if we can retrieve agents (indicates database connection)
  const agentsResponse = await fetch(`${API_BASE}/agents`);
  if (agentsResponse.ok) {
    const data = await agentsResponse.json();
    if (data.agents && Array.isArray(data.agents)) {
      console.log(`✅ Data Persistence: Found ${data.agents.length} agents in Registry`);
      results.push({
        name: 'Data Persistence',
        status: 'PASS',
        message: `${data.agents.length} agents persisted`,
        data: data.agents.map((a: any) => a.handle)
      });
    }
  } else {
    console.log('❌ Data Persistence: Could not verify');
    results.push({
      name: 'Data Persistence',
      status: 'FAIL',
      message: 'Could not retrieve persisted data'
    });
  }
  
  // Generate Report
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST RESULTS SUMMARY:\n');
  
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const total = results.length;
  const passRate = ((passed / total) * 100).toFixed(1);
  
  console.log(`Total Tests: ${total}`);
  console.log(`Passed: ${passed} ✅`);
  console.log(`Failed: ${failed} ❌`);
  console.log(`Pass Rate: ${passRate}%`);
  
  console.log('\n📝 DETAILED RESULTS:');
  console.log('-'.repeat(30));
  
  results.forEach(result => {
    const icon = result.status === 'PASS' ? '✅' : '❌';
    console.log(`${icon} ${result.name}`);
    if (result.message) {
      console.log(`   ${result.message}`);
    }
    if (result.data && result.name === 'Data Persistence') {
      console.log(`   Agents: ${result.data.join(', ')}`);
    }
  });
  
  // Final Status
  console.log('\n' + '='.repeat(50));
  if (passRate === '100.0') {
    console.log('🎉 ALL TESTS PASSED! Registry-as-Protocol is fully operational.');
  } else if (passed > failed) {
    console.log('⚠️ PARTIAL SUCCESS: Most tests passed but some issues detected.');
  } else {
    console.log('❌ CRITICAL: Multiple test failures detected. Investigation needed.');
  }
}

// Run tests
runTests().catch(console.error);