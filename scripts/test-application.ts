#!/usr/bin/env tsx

// Test script for submitting a Genesis application
async function testApplication() {
  const API_URL = process.env.API_URL || 'http://localhost:3000'
  
  const testApplication = {
    applicantEmail: 'test@eden.art',
    applicantName: 'Test Agent',
    track: 'AGENT',
    payload: {
      name: 'TestBot',
      handle: 'testbot',
      role: 'creator',
      tagline: 'Testing the Genesis application system',
      
      personaPublic: 'I am a test agent exploring the boundaries of digital creation.',
      personaPrivate: 'Internal testing guidelines',
      memoryNotes: 'Remember to test edge cases',
      
      dailyPractice: {
        schedule: 'daily',
        medium: 'digital-art',
        dailyGoal: 'One test creation per day',
        actions: []
      },
      
      modelPreference: 'claude-sonnet-4',
      walletAddress: '0x1234567890abcdef',
      
      socials: {
        farcaster: 'testbot',
        twitter: 'testbot_ai',
        website: 'https://testbot.eden.art'
      },
      
      revenueSplits: [
        { address: '0x1234567890abcdef', percentage: 100, label: 'Creator' }
      ],
      
      lore: 'Born from the testing grounds of Eden',
      origin: 'Test environment'
    }
  }
  
  console.log('🧪 Testing Genesis Application Submission...\n')
  console.log('Submitting to:', `${API_URL}/api/v1/applications/simple`)
  
  try {
    const response = await fetch(`${API_URL}/api/v1/applications/simple`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testApplication)
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Application submitted successfully!')
      console.log('Application ID:', result.id)
      console.log('\nFull response:', JSON.stringify(result, null, 2))
    } else {
      console.error('❌ Failed to submit:', response.status, response.statusText)
      const error = await response.text()
      console.error('Error:', error)
    }
  } catch (error) {
    console.error('❌ Network error:', error)
  }
  
  // Now fetch all applications
  console.log('\n📋 Fetching all applications...')
  try {
    const response = await fetch(`${API_URL}/api/v1/applications/simple`)
    if (response.ok) {
      const data = await response.json()
      console.log(`Found ${data.total} applications:`)
      data.applications.forEach((app: any) => {
        console.log(`  - ${app.payload.name} (@${app.payload.handle}) - ${app.status}`)
      })
    }
  } catch (error) {
    console.error('Failed to fetch applications:', error)
  }
}

// Run the test
testApplication()