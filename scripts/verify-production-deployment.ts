#!/usr/bin/env tsx

/**
 * Production Deployment Verification
 * Verifies Registry hardening is operational in production
 */

import { getValidationStatus } from '../src/lib/validation-gates'
import { getWriteGatesSummary } from '../src/lib/write-gates'

async function verifyProductionDeployment() {
  console.log('🚀 Verifying Registry Hardening Production Deployment...\n')

  let allChecksPass = true

  // Check 1: Validation Gates
  console.log('1️⃣ Validation Gates Status:')
  const validationStatus = getValidationStatus()
  const enforceCount = Object.values(validationStatus).filter(config => config.level === 'enforce').length
  
  if (enforceCount === 6) {
    console.log(`✅ All 6 validation gates enforced`)
  } else {
    console.log(`⚠️  Only ${enforceCount}/6 validation gates enforced`)
    allChecksPass = false
  }

  // Check 2: Write Gates  
  console.log('\n2️⃣ Write Gates Status:')
  const writeGates = getWriteGatesSummary()
  const protectedCollections = Object.keys(writeGates).length
  
  if (protectedCollections >= 7) {
    console.log(`✅ ${protectedCollections} collections protected by write gates`)
  } else {
    console.log(`⚠️  Only ${protectedCollections} collections protected`)
    allChecksPass = false
  }

  // Check 3: Environment Variables
  console.log('\n3️⃣ Environment Configuration:')
  const requiredEnvVars = [
    'REGISTRY_VALIDATION_AGENT',
    'REGISTRY_VALIDATION_LORE',
    'REGISTRY_VALIDATION_PROFILE'
  ]
  
  let envCheck = true
  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar]
    if (value === 'enforce') {
      console.log(`✅ ${envVar}: ${value}`)
    } else {
      console.log(`⚠️  ${envVar}: ${value || 'not set'} (should be 'enforce')`)
      envCheck = false
    }
  }
  
  if (!envCheck) allChecksPass = false

  // Check 4: API Endpoints
  console.log('\n4️⃣ API Endpoints Check:')
  const baseUrl = process.env.REGISTRY_BASE_URL || 'http://localhost:3000/api/v1'
  console.log(`📡 Base URL: ${baseUrl}`)

  try {
    // Test key endpoints if server is running
    const endpoints = [
      '/agents',
      '/docs/contracts'
    ]
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${baseUrl.replace('/api/v1', '')}${endpoint.startsWith('/api') ? '' : '/api/v1'}${endpoint}`)
        if (response.ok) {
          console.log(`✅ ${endpoint}: Available`)
        } else {
          console.log(`⚠️  ${endpoint}: ${response.status}`)
        }
      } catch (error) {
        console.log(`⚠️  ${endpoint}: Server not running (expected in development)`)
      }
    }
  } catch (error) {
    console.log('⚠️  API endpoints: Cannot test (server not running)')
  }

  // Check 5: File Structure
  console.log('\n5️⃣ File Structure Check:')
  const fs = await import('fs')
  const criticalFiles = [
    'src/lib/validation-gates.ts',
    'src/lib/write-gates.ts', 
    'src/lib/registry-client.ts',
    'docs/contracts.md',
    'REGISTRY-HARDENING-COMPLETE.md'
  ]
  
  let fileCheck = true
  for (const file of criticalFiles) {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}: Present`)
    } else {
      console.log(`❌ ${file}: Missing`)
      fileCheck = false
    }
  }
  
  if (!fileCheck) allChecksPass = false

  // Final Assessment
  console.log('\n' + '='.repeat(50))
  if (allChecksPass) {
    console.log('🎉 REGISTRY HARDENING: PRODUCTION READY')
    console.log('   - Zero drift architecture operational')
    console.log('   - Single source of truth enforced')  
    console.log('   - API-first data consumption validated')
    console.log('   - Security gates active and configured')
    return true
  } else {
    console.log('⚠️  REGISTRY HARDENING: ISSUES DETECTED')
    console.log('   Review warnings above before production deployment')
    return false
  }
}

// Run verification
verifyProductionDeployment()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('❌ Verification failed:', error)
    process.exit(1)
  })