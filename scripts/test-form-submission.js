/**
 * Test form submission functionality
 * Client-side test to verify forms work correctly
 */

async function testFormSubmissions() {
  const BASE_URL = 'https://eden-genesis-registry.vercel.app/api/v1';
  
  console.log('🧪 Testing Form Submission Functionality');
  console.log('=' .repeat(50));
  
  // Test 1: Agent Application
  console.log('\n📝 Testing Agent Creation Application...');
  
  const agentData = {
    handle: `test_agent_${Date.now()}`,
    displayName: `Test Agent ${Date.now()}`,
    role: 'CURATOR',
    tagline: 'Testing Registry Integration',
    statement: 'This is a test agent created to verify Registry form functionality.',
    dailyGoal: 'Validate Registry systems and ensure proper data persistence.',
    medium: ['text'],
    cohortSlug: 'genesis'
  };
  
  try {
    const response = await fetch(`${BASE_URL}/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agentData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Agent creation successful!');
      console.log(`   Agent: ${result.displayName} (@${result.handle})`);
      console.log(`   Agent Number: ${result.agentNumber}`);
      console.log(`   Status: ${result.status}`);
    } else {
      const error = await response.text();
      console.log('❌ Agent creation failed:', response.status);
      console.log('   Error:', error);
    }
  } catch (error) {
    console.log('❌ Agent creation error:', error.message);
  }
  
  // Test 2: Application Submission
  console.log('\n📮 Testing General Application Submission...');
  
  const applicationData = {
    track: 'AGENT',
    applicantName: `Test Applicant ${Date.now()}`,
    applicantEmail: `test${Date.now()}@eden.art`,
    customData: {
      type: 'PRODUCTION_TEST',
      timestamp: new Date().toISOString(),
      purpose: 'Registry form validation'
    }
  };
  
  try {
    const response = await fetch(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicationData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Application submission successful!');
      console.log(`   Application ID: ${result.id}`);
      console.log(`   Status: ${result.status}`);
    } else {
      const error = await response.text();
      console.log('❌ Application submission failed:', response.status);
      console.log('   Error:', error);
    }
  } catch (error) {
    console.log('❌ Application submission error:', error.message);
  }
  
  // Test 3: Data Verification
  console.log('\n💾 Verifying Data Persistence...');
  
  try {
    const response = await fetch(`${BASE_URL}/agents`);
    if (response.ok) {
      const data = await response.json();
      const agentCount = data.agents.length;
      console.log(`✅ Data verification successful!`);
      console.log(`   Total agents: ${agentCount}`);
      console.log(`   Active agents: ${data.agents.filter(a => a.status === 'ACTIVE').length}`);
    }
  } catch (error) {
    console.log('❌ Data verification error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 Form submission tests completed!');
}