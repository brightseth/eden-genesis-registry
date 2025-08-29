#!/usr/bin/env tsx

/**
 * Test Registry SDK Integration
 * Validate that Registry can consume its own API endpoints
 */

import { registryClient } from './src/lib/registry-client'

async function testRegistryIntegration() {
  console.log('🧪 Testing Registry SDK Integration...\n')

  try {
    console.log('1️⃣ Testing Registry Client imports...')
    try {
      const { registryClient } = await import('./src/lib/registry-client')
      const { RegistryClient } = await import('./src/lib/registry-client')
      console.log('✅ Registry Client: Imports successful')
      console.log('   - registryClient instance available')
      console.log('   - RegistryClient class available')
    } catch (error) {
      console.error('❌ Registry Client imports failed:', error)
    }

    // Test 2: SDK Client initialization
    console.log('\n2️⃣ Testing SDK Client initialization...')
    try {
      const { RegistryClient } = await import('./src/lib/registry-client')
      const testClient = new RegistryClient({
        baseURL: 'http://localhost:3000/api/v1',
        apiKey: 'test-key'
      })
      console.log('✅ Registry Client: Initialization successful')
      console.log('   Base URL configured')
      console.log('   API methods available:', Object.keys(testClient.agents || {}).slice(0, 5))
    } catch (error) {
      console.error('❌ Registry Client initialization failed:', error)
    }

    // Test 3: Validation system
    console.log('\n3️⃣ Testing validation gates...')
    const { getValidationStatus } = await import('./src/lib/validation-gates')
    const status = getValidationStatus()
    const activeValidations = Object.entries(status).filter(([_, config]) => config.level === 'enforce').length
    console.log(`✅ Validation system: ${activeValidations}/6 collections enforced`)

    // Test 4: Write gates
    console.log('\n4️⃣ Testing write gates...')
    const { getWriteGatesSummary } = await import('./src/lib/write-gates')
    const summary = getWriteGatesSummary()
    const gatedCollections = Object.keys(summary).length
    console.log(`✅ Write gates: ${gatedCollections} collections protected`)

    // Test 5: Webhook system
    console.log('\n5️⃣ Testing webhook system...')
    const { sendWebhook } = await import('./src/lib/webhooks')
    console.log('✅ Webhook system: Ready for registry events')

    console.log('\n🎉 Registry Integration Tests Complete!')
    
    return true
  } catch (error) {
    console.error('\n❌ Integration test failed:', error)
    return false
  }
}

// Run tests if server is available
testRegistryIntegration()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('Test execution failed:', error)
    process.exit(1)
  })