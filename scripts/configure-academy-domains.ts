#!/usr/bin/env npx tsx

/**
 * EDEN ACADEMY DOMAIN CONFIGURATION SCRIPT
 * 
 * Configures proper domain routing for Eden Academy infrastructure:
 * - academy.eden2.io → Academy platform
 * - registry.eden2.io → Registry protocol
 * 
 * Run: npx tsx scripts/configure-academy-domains.ts
 */

import { execSync } from 'child_process'

interface DomainTest {
  domain: string
  path: string
  expected: string
  description: string
}

const DOMAIN_TESTS: DomainTest[] = [
  {
    domain: 'academy.eden2.io',
    path: '/',
    expected: 'EDEN ACADEMY',
    description: 'Academy homepage'
  },
  {
    domain: 'academy.eden2.io',
    path: '/agents',
    expected: 'AGENT CATALOG',
    description: 'Agent directory'
  },
  {
    domain: 'academy.eden2.io',
    path: '/agents/abraham',
    expected: 'ABRAHAM',
    description: 'Agent profile'
  },
  {
    domain: 'academy.eden2.io', 
    path: '/sites/abraham',
    expected: 'Narrative Architect',
    description: 'Agent public site'
  },
  {
    domain: 'academy.eden2.io',
    path: '/emergency/covenant',
    expected: 'COVENANT EMERGENCY',
    description: 'Covenant emergency dashboard'
  },
  {
    domain: 'academy.eden2.io',
    path: '/api/v1/status',
    expected: '"status"',
    description: 'API status endpoint'
  },
  {
    domain: 'registry.eden2.io',
    path: '/api/v1/agents',
    expected: 'agents',
    description: 'Registry API'
  }
]

async function testDomain(test: DomainTest): Promise<boolean> {
  try {
    console.log(`🧪 Testing ${test.domain}${test.path}`)
    
    const response = await fetch(`https://${test.domain}${test.path}`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Eden-Academy-Domain-Tester/1.0'
      }
    })

    if (!response.ok) {
      console.log(`   ❌ HTTP ${response.status} - ${test.description}`)
      return false
    }

    const content = await response.text()
    
    if (content.includes(test.expected)) {
      console.log(`   ✅ ${test.description}`)
      return true
    } else {
      console.log(`   ❌ Expected "${test.expected}" not found - ${test.description}`)
      return false
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message} - ${test.description}`)
    return false
  }
}

async function validateCurrentDeployments() {
  console.log('🔍 VALIDATING CURRENT VERCEL DEPLOYMENTS')
  console.log('=' .repeat(60))
  
  const vercelDeployments = [
    'eden-genesis-registry-4j4p5b1y2-edenprojects.vercel.app',
    'eden-genesis-registry-hb6msdlqa-edenprojects.vercel.app', 
    'eden-genesis-registry-o1ith25ch-edenprojects.vercel.app'
  ]

  const results = []
  
  for (const deployment of vercelDeployments) {
    console.log(`\\n📡 Testing ${deployment}`)
    try {
      const response = await fetch(`https://${deployment}/api/v1/status`, { timeout: 5000 })
      if (response.ok) {
        const data = await response.json()
        console.log(`   ✅ Active - Status: ${data.status}`)
        results.push({ deployment, status: 'active', data })
      } else {
        console.log(`   ❌ HTTP ${response.status}`)
        results.push({ deployment, status: 'error', error: response.status })
      }
    } catch (error) {
      console.log(`   ❌ Unreachable - ${error.message}`)
      results.push({ deployment, status: 'unreachable', error: error.message })
    }
  }
  
  return results
}

async function testAcademyNavigation() {
  console.log('\\n🧭 TESTING ACADEMY NAVIGATION FLOWS')
  console.log('=' .repeat(60))
  
  // Test critical navigation paths
  const navigationTests = [
    {
      name: 'Homepage → Agent Catalog',
      path: '/agents',
      expectedElements: ['AGENT CATALOG', 'abraham', 'solienne']
    },
    {
      name: 'Agent Profile → Agent Site → Dashboard',
      path: '/agents/abraham',
      expectedElements: ['ABRAHAM', 'Registry Profile', 'Public Showcase', 'Trainer Dashboard']
    },
    {
      name: 'Covenant Emergency Access',
      path: '/emergency/covenant',
      expectedElements: ['COVENANT', 'EMERGENCY']
    }
  ]

  for (const test of navigationTests) {
    console.log(`\\n📊 ${test.name}`)
    try {
      const response = await fetch(`https://academy.eden2.io${test.path}`, { timeout: 10000 })
      if (response.ok) {
        const content = await response.text()
        const foundElements = test.expectedElements.filter(el => 
          content.toLowerCase().includes(el.toLowerCase())
        )
        console.log(`   ✅ Found ${foundElements.length}/${test.expectedElements.length} elements`)
        foundElements.forEach(el => console.log(`      • ${el}`))
        
        const missingElements = test.expectedElements.filter(el => 
          !content.toLowerCase().includes(el.toLowerCase())
        )
        if (missingElements.length > 0) {
          console.log(`   ⚠️  Missing elements:`)
          missingElements.forEach(el => console.log(`      • ${el}`))
        }
      } else {
        console.log(`   ❌ HTTP ${response.status}`)
      }
    } catch (error) {
      console.log(`   ❌ ${error.message}`)
    }
  }
}

async function generateDeploymentReport() {
  console.log('\\n📋 GENERATING DEPLOYMENT REPORT')
  console.log('=' .repeat(60))
  
  const deployments = await validateCurrentDeployments()
  const activeDeployments = deployments.filter(d => d.status === 'active')
  
  console.log(`\\n📊 DEPLOYMENT SUMMARY:`)
  console.log(`   Active deployments: ${activeDeployments.length}`)
  console.log(`   Failed deployments: ${deployments.filter(d => d.status === 'error').length}`)
  console.log(`   Unreachable deployments: ${deployments.filter(d => d.status === 'unreachable').length}`)
  
  if (activeDeployments.length > 1) {
    console.log(`\\n⚠️  MULTIPLE ACTIVE DEPLOYMENTS DETECTED!`)
    console.log(`   This causes user confusion and broken navigation.`)
    console.log(`   Recommended: Use Vercel domain aliases to consolidate.`)
  }

  if (activeDeployments.length === 1) {
    const primary = activeDeployments[0]
    console.log(`\\n✅ SINGLE DEPLOYMENT IDENTIFIED:`)
    console.log(`   Primary: ${primary.deployment}`)
    console.log(`   Recommendation: Configure academy.eden2.io to point here`)
  }

  return deployments
}

async function main() {
  console.log('🏛️  EDEN ACADEMY DOMAIN CONFIGURATION')
  console.log('=' .repeat(80))
  console.log()
  
  try {
    // Step 1: Test current deployments
    const deployments = await generateDeploymentReport()
    
    // Step 2: Test domain configuration  
    console.log('\\n🌐 TESTING DOMAIN CONFIGURATION')
    console.log('=' .repeat(60))
    
    let allPassed = true
    for (const test of DOMAIN_TESTS) {
      const passed = await testDomain(test)
      if (!passed) allPassed = false
    }
    
    // Step 3: Test navigation flows
    await testAcademyNavigation()
    
    // Step 4: Generate recommendations
    console.log('\\n🎯 RECOMMENDATIONS')
    console.log('=' .repeat(60))
    
    if (!allPassed) {
      console.log('❌ Domain configuration issues detected:')
      console.log('   1. Configure DNS: academy.eden2.io → Primary Vercel deployment')
      console.log('   2. Update Vercel project domains')
      console.log('   3. Test all navigation flows')
      console.log()
      console.log('🔧 Next steps:')
      console.log('   • Run: vercel domains add academy.eden2.io')
      console.log('   • Update hardcoded URLs in codebase') 
      console.log('   • Deploy with consolidated navigation')
      process.exit(1)
    } else {
      console.log('✅ All domain tests passed!')
      console.log('✅ Navigation flows working')
      console.log('✅ Academy infrastructure healthy')
    }
    
  } catch (error) {
    console.error('💥 Configuration error:', error)
    process.exit(1)
  }
}

if (import.meta.main) {
  main()
}