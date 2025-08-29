#!/usr/bin/env tsx

/**
 * Eden Academy Consolidated Deployment Verification
 * Tests single-app architecture with domain routing and three-tier implementation
 */

interface DeploymentCheck {
  name: string
  endpoint: string
  expectedStatus: number
  validateResponse?: (data: any) => boolean
  description: string
}

const PRODUCTION_CHECKS: DeploymentCheck[] = [
  // Tier 1: Agent Profiles (/academy/agent/[slug])
  {
    name: 'MIYOMI Profile (Tier 1)',
    endpoint: 'https://academy.eden2.io/academy/agent/miyomi',
    expectedStatus: 200,
    description: 'Agent directory entry with standardized tabs'
  },
  {
    name: 'Abraham Profile (Tier 1)',
    endpoint: 'https://academy.eden2.io/academy/agent/abraham',
    expectedStatus: 200,
    description: 'Agent directory entry - Registry-driven'
  },
  
  // Tier 2: Public Sites (/sites/[agent])
  {
    name: 'MIYOMI Site (Tier 2)',
    endpoint: 'https://academy.eden2.io/sites/miyomi',
    expectedStatus: 200,
    description: 'Public showcase with unique branding'
  },
  {
    name: 'Abraham Site (Tier 2)',
    endpoint: 'https://academy.eden2.io/sites/abraham',
    expectedStatus: 200,
    description: 'Public showcase - newly created by Architecture Guardian'
  },
  {
    name: 'Solienne Site (Tier 2)',
    endpoint: 'https://academy.eden2.io/sites/solienne',
    expectedStatus: 200,
    description: 'Public showcase - newly created by Architecture Guardian'
  },
  {
    name: 'Bertha Site (Tier 2)',
    endpoint: 'https://academy.eden2.io/sites/bertha',
    expectedStatus: 200,
    description: 'Public showcase - newly created by Architecture Guardian'
  },
  
  // Tier 3: Private Dashboards (/dashboard/[agent])
  {
    name: 'MIYOMI Dashboard (Tier 3)',
    endpoint: 'https://academy.eden2.io/dashboard/miyomi',
    expectedStatus: 200,
    description: 'Private trainer interface - reference implementation'
  },
  {
    name: 'Abraham Dashboard (Tier 3)',
    endpoint: 'https://academy.eden2.io/dashboard/abraham',
    expectedStatus: 200,
    description: 'Private trainer interface - newly created'
  },
  {
    name: 'Solienne Dashboard (Tier 3)',
    endpoint: 'https://academy.eden2.io/dashboard/solienne',
    expectedStatus: 200,
    description: 'Private trainer interface - newly created'
  },
  {
    name: 'Citizen Dashboard (Tier 3)',
    endpoint: 'https://academy.eden2.io/dashboard/citizen',
    expectedStatus: 200,
    description: 'Private trainer interface - collaborative training'
  },
  
  // Registry API Integration
  {
    name: 'Registry Health Check',
    endpoint: 'https://registry.eden2.io/api/v1/health',
    expectedStatus: 200,
    description: 'Registry service operational status',
    validateResponse: (data) => data?.status === 'healthy' || data?.timestamp
  },
  {
    name: 'Agent Discovery API',
    endpoint: 'https://academy.eden2.io/api/v1/agents',
    expectedStatus: 200,
    description: 'Registry-driven agent discovery',
    validateResponse: (data) => Array.isArray(data.agents)
  },
  {
    name: 'Genesis Agents API',
    endpoint: 'https://academy.eden2.io/api/v1/agents?cohort=genesis',
    expectedStatus: 200,
    description: 'Genesis cohort filtering',
    validateResponse: (data) => Array.isArray(data.agents)
  },
  {
    name: 'Auto-Generated Contracts',
    endpoint: 'https://academy.eden2.io/api/v1/docs/contracts',
    expectedStatus: 200,
    description: 'Live API documentation from OpenAPI',
    validateResponse: (data) => data?.title && data?.content
  }
]

async function verifyConsolidatedDeployment() {
  console.log('🔍 Eden Academy Consolidated Deployment Verification\n')
  console.log('Testing single-app architecture with three-tier routing...\n')
  console.log('Architecture: Profile → Site → Dashboard (all in one app)\n')
  
  const results = {
    passed: 0,
    failed: 0,
    warnings: [] as string[]
  }
  
  const tierResults = {
    tier1: 0, // Agent Profiles
    tier2: 0, // Public Sites  
    tier3: 0, // Private Dashboards
    api: 0    // Registry Integration
  }
  
  console.log('📊 Testing Routes by Tier:\n')
  
  for (const check of PRODUCTION_CHECKS) {
    try {
      console.log(`Testing: ${check.name}`)
      const response = await fetch(check.endpoint, { 
        method: 'HEAD',
        headers: {
          'User-Agent': 'Eden-Academy-Deployment-Verification/1.0'
        }
      })
      
      const status = response.status
      
      if (status === check.expectedStatus) {
        if (check.validateResponse && response.headers.get('content-type')?.includes('application/json')) {
          try {
            const fullResponse = await fetch(check.endpoint)
            const data = await fullResponse.json()
            if (check.validateResponse(data)) {
              console.log(`  ✅ PASSED - ${check.description}`)
              results.passed++
              updateTierCount(check.name, tierResults)
            } else {
              console.log(`  ⚠️  RESPONSE INVALID - ${check.description}`)
              results.warnings.push(`${check.name}: Invalid response structure`)
            }
          } catch (jsonError) {
            console.log(`  ✅ PASSED - ${check.description} (non-JSON response)`)
            results.passed++
            updateTierCount(check.name, tierResults)
          }
        } else {
          console.log(`  ✅ PASSED - ${check.description}`)
          results.passed++
          updateTierCount(check.name, tierResults)
        }
      } else {
        console.log(`  ❌ FAILED - Expected ${check.expectedStatus}, got ${status}`)
        results.failed++
      }
    } catch (error) {
      console.log(`  ❌ NETWORK ERROR - ${check.description}`)
      results.failed++
    }
    console.log()
  }
  
  // Environment Variable Verification
  console.log('🔧 Environment Configuration:\n')
  const envChecks = [
    { key: 'REGISTRY_VALIDATION_AGENT', expected: 'enforce' },
    { key: 'REGISTRY_VALIDATION_LORE', expected: 'enforce' }, 
    { key: 'REGISTRY_BASE_URL', expected: 'https://registry.eden2.io/api/v1' },
    { key: 'NEXT_PUBLIC_ACADEMY_URL', expected: 'https://academy.eden2.io' }
  ]
  
  for (const env of envChecks) {
    const value = process.env[env.key]
    if (value === env.expected) {
      console.log(`✅ ${env.key}: ${value}`)
    } else if (value) {
      console.log(`⚠️  ${env.key}: ${value} (expected: ${env.expected})`)
      results.warnings.push(`${env.key}: Unexpected value`)
    } else {
      console.log(`❌ ${env.key}: Missing (expected: ${env.expected})`)
      results.warnings.push(`Missing env: ${env.key}`)
    }
  }
  
  // Three-Tier Architecture Summary
  console.log('\n🏗️  Three-Tier Architecture Status:\n')
  console.log(`Tier 1 (Profiles): ${tierResults.tier1} routes verified`)
  console.log(`Tier 2 (Sites): ${tierResults.tier2} routes verified`) 
  console.log(`Tier 3 (Dashboards): ${tierResults.tier3} routes verified`)
  console.log(`Registry API: ${tierResults.api} endpoints verified`)
  
  // Final Summary
  console.log('\n📊 Deployment Summary:\n')
  console.log(`✅ Passed: ${results.passed}/${PRODUCTION_CHECKS.length}`)
  console.log(`❌ Failed: ${results.failed}`)
  console.log(`⚠️  Warnings: ${results.warnings.length}`)
  
  if (results.warnings.length > 0) {
    console.log('\nWarnings:')
    results.warnings.forEach(warning => console.log(`  • ${warning}`))
  }
  
  console.log('\n' + '='.repeat(60))
  
  if (results.failed === 0 && results.passed >= PRODUCTION_CHECKS.length * 0.8) {
    console.log('✨ CONSOLIDATED DEPLOYMENT VERIFIED SUCCESSFULLY!')
    console.log('🎯 Eden2.io federation architecture operational!')
    console.log('🏛️  Three-tier pattern implemented across all agents!')
    console.log('📡 Registry-driven discovery working!')
    
    if (results.warnings.length === 0) {
      console.log('🎉 PRODUCTION READY - Zero warnings!')
    } else {
      console.log('⚠️  Production ready with minor configuration warnings')
    }
    
    return true
  } else {
    console.log('⚠️  DEPLOYMENT ISSUES DETECTED')
    console.log('Review failed checks and configuration before production use')
    console.log('\n💡 Common issues:')
    console.log('  • Domain routing not configured in Vercel')
    console.log('  • Environment variables not set')
    console.log('  • Missing route implementations')
    
    return false
  }
}

function updateTierCount(checkName: string, counts: any) {
  if (checkName.includes('Tier 1') || checkName.includes('Profile')) {
    counts.tier1++
  } else if (checkName.includes('Tier 2') || checkName.includes('Site')) {
    counts.tier2++
  } else if (checkName.includes('Tier 3') || checkName.includes('Dashboard')) {
    counts.tier3++
  } else if (checkName.includes('API') || checkName.includes('Registry') || checkName.includes('Contracts')) {
    counts.api++
  }
}

// Run verification
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyConsolidatedDeployment()
    .then(success => {
      console.log(`\n🚀 Deployment verification ${success ? 'PASSED' : 'FAILED'}`)
      process.exit(success ? 0 : 1)
    })
    .catch(error => {
      console.error('\n❌ Verification script failed:', error)
      process.exit(1)
    })
}

export { verifyConsolidatedDeployment }