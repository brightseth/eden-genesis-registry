#!/usr/bin/env npx tsx

/**
 * EDEN ACADEMY NAVIGATION VERIFICATION SCRIPT
 * 
 * Comprehensive testing of all navigation flows and infrastructure
 * Run: npx tsx scripts/verify-academy-navigation.ts
 */

interface NavigationTest {
  name: string
  url: string
  expectedElements: string[]
  criticalElements: string[]
  description: string
}

const NAVIGATION_TESTS: NavigationTest[] = [
  {
    name: 'Homepage',
    url: '/',
    expectedElements: ['EDEN REGISTRY', 'AGENT CATALOG', 'COVENANT EMERGENCY'],
    criticalElements: ['COVENANT EMERGENCY ACTIVE'],
    description: 'Main landing page with covenant alert'
  },
  {
    name: 'Agent Catalog',
    url: '/agents',
    expectedElements: ['AGENT CATALOG', 'abraham', 'solienne', 'miyomi'],
    criticalElements: ['VIEW'],
    description: 'Agent directory with proper links'
  },
  {
    name: 'Abraham Profile',
    url: '/agents/abraham',
    expectedElements: ['ABRAHAM', 'Narrative Architect', 'REGISTRY PROFILE', 'PUBLIC SHOWCASE', 'TRAINER DASHBOARD'],
    criticalElements: ['three-tier'],
    description: 'Agent profile with three-tier navigation'
  },
  {
    name: 'Abraham Site',
    url: '/sites/abraham',
    expectedElements: ['ABRAHAM', 'Narrative Architect', 'COVENANT AUCTION'],
    criticalElements: ['COVENANT AUCTION'],
    description: 'Abraham public site with covenant access'
  },
  {
    name: 'Abraham Dashboard',
    url: '/dashboard/abraham',
    expectedElements: ['ABRAHAM', 'TRAINER DASHBOARD', 'PRIVATE INTERFACE'],
    criticalElements: ['TRAINER CONTROLS'],
    description: 'Abraham private trainer interface'
  },
  {
    name: 'Covenant Emergency',
    url: '/emergency/covenant',
    expectedElements: ['COVENANT', 'EMERGENCY'],
    criticalElements: ['EMERGENCY'],
    description: 'Emergency covenant dashboard'
  },
  {
    name: 'Abraham Covenant Auction',
    url: '/sites/abraham/covenant',
    expectedElements: ['ABRAHAM', 'COVENANT'],
    criticalElements: ['AUCTION'],
    description: 'Flagship covenant auction interface'
  },
  {
    name: 'Witness Registry',
    url: '/covenant/witnesses',
    expectedElements: ['WITNESS', 'REGISTRY'],
    criticalElements: ['WITNESS'],
    description: 'Covenant witness registration system'
  },
  {
    name: 'API Status',
    url: '/api/v1/status',
    expectedElements: ['status', 'healthy'],
    criticalElements: ['status'],
    description: 'API health endpoint'
  },
  {
    name: 'Agents API',
    url: '/api/v1/agents',
    expectedElements: ['abraham', 'solienne'],
    criticalElements: ['agents'],
    description: 'Agent data API endpoint'
  }
]

async function testNavigation(test: NavigationTest, baseUrl: string = 'http://localhost:3000'): Promise<boolean> {
  try {
    console.log(`🧪 Testing: ${test.name}`)
    console.log(`   URL: ${baseUrl}${test.url}`)
    
    const response = await fetch(`${baseUrl}${test.url}`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Eden-Academy-Navigation-Tester/1.0'
      }
    })

    if (!response.ok) {
      console.log(`   ❌ HTTP ${response.status} - ${test.description}`)
      return false
    }

    const content = await response.text()
    const contentLower = content.toLowerCase()
    
    // Check expected elements
    const foundExpected = test.expectedElements.filter(element => 
      contentLower.includes(element.toLowerCase())
    )
    
    // Check critical elements
    const foundCritical = test.criticalElements.filter(element =>
      contentLower.includes(element.toLowerCase()) 
    )
    
    const expectedScore = foundExpected.length / test.expectedElements.length
    const criticalScore = foundCritical.length / test.criticalElements.length
    
    console.log(`   📊 Expected: ${foundExpected.length}/${test.expectedElements.length} (${Math.round(expectedScore * 100)}%)`)
    console.log(`   🎯 Critical: ${foundCritical.length}/${test.criticalElements.length} (${Math.round(criticalScore * 100)}%)`)
    
    if (criticalScore === 1.0 && expectedScore >= 0.7) {
      console.log(`   ✅ ${test.description}`)
      return true
    } else {
      console.log(`   ❌ ${test.description}`)
      
      // Show missing elements for debugging
      const missingExpected = test.expectedElements.filter(el => 
        !contentLower.includes(el.toLowerCase())
      )
      const missingCritical = test.criticalElements.filter(el =>
        !contentLower.includes(el.toLowerCase())
      )
      
      if (missingCritical.length > 0) {
        console.log(`   ⚠️  Missing critical: ${missingCritical.join(', ')}`)
      }
      if (missingExpected.length > 0) {
        console.log(`   ⚠️  Missing expected: ${missingExpected.join(', ')}`)
      }
      
      return false
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message} - ${test.description}`)
    return false
  }
}

async function testProductionUrls() {
  console.log('🌐 TESTING PRODUCTION URLS')
  console.log('=' .repeat(60))
  
  const productionUrls = [
    'https://academy.eden2.io',
    'https://registry.eden2.io', 
    'https://eden-genesis-registry-4j4p5b1y2-edenprojects.vercel.app'
  ]
  
  const results = []
  
  for (const url of productionUrls) {
    console.log(`\\n📡 Testing ${url}`)
    try {
      const response = await fetch(`${url}/api/v1/status`, { 
        timeout: 5000,
        headers: { 'User-Agent': 'Eden-Academy-Navigation-Tester/1.0' }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log(`   ✅ Status: ${data.status}`)
        
        // Test a few key navigation routes
        const keyTests = [
          { path: '/', name: 'Homepage' },
          { path: '/agents', name: 'Agent Catalog' },
          { path: '/emergency/covenant', name: 'Covenant Emergency' }
        ]
        
        let workingRoutes = 0
        for (const keyTest of keyTests) {
          try {
            const routeResponse = await fetch(`${url}${keyTest.path}`, { timeout: 5000 })
            if (routeResponse.ok) {
              workingRoutes++
              console.log(`   ✅ ${keyTest.name}`)
            } else {
              console.log(`   ❌ ${keyTest.name} (HTTP ${routeResponse.status})`)
            }
          } catch {
            console.log(`   ❌ ${keyTest.name} (unreachable)`)
          }
        }
        
        results.push({ 
          url, 
          status: 'active', 
          workingRoutes, 
          totalRoutes: keyTests.length,
          score: workingRoutes / keyTests.length 
        })
      } else {
        console.log(`   ❌ HTTP ${response.status}`)
        results.push({ url, status: 'error', error: response.status })
      }
    } catch (error) {
      console.log(`   ❌ Unreachable - ${error.message}`)
      results.push({ url, status: 'unreachable', error: error.message })
    }
  }
  
  return results
}

async function verifyCovenantAccess() {
  console.log('\\n🔥 VERIFYING COVENANT ACCESSIBILITY')
  console.log('=' .repeat(60))
  
  const covenantTests = [
    {
      name: 'Homepage Covenant Alert',
      url: '/',
      mustContain: ['COVENANT EMERGENCY', 'Emergency Dashboard', 'Covenant Auction', 'Witness Registry']
    },
    {
      name: 'Abraham Site Covenant Link', 
      url: '/sites/abraham',
      mustContain: ['COVENANT AUCTION']
    },
    {
      name: 'Emergency Dashboard Access',
      url: '/emergency/covenant',
      mustContain: ['COVENANT', 'EMERGENCY']
    },
    {
      name: 'Covenant Auction Interface',
      url: '/sites/abraham/covenant', 
      mustContain: ['ABRAHAM', 'COVENANT']
    },
    {
      name: 'Witness Registry Access',
      url: '/covenant/witnesses',
      mustContain: ['WITNESS']
    }
  ]
  
  let allCovenantAccessible = true
  
  for (const test of covenantTests) {
    console.log(`🧪 ${test.name}`)
    try {
      const response = await fetch(`http://localhost:3000${test.url}`, { timeout: 10000 })
      if (response.ok) {
        const content = await response.text().toLowerCase()
        const found = test.mustContain.filter(item => content.includes(item.toLowerCase()))
        
        if (found.length === test.mustContain.length) {
          console.log(`   ✅ All required elements found`)
        } else {
          console.log(`   ❌ Missing: ${test.mustContain.filter(item => !content.includes(item.toLowerCase())).join(', ')}`)
          allCovenantAccessible = false
        }
      } else {
        console.log(`   ❌ HTTP ${response.status}`)
        allCovenantAccessible = false
      }
    } catch (error) {
      console.log(`   ❌ ${error.message}`)
      allCovenantAccessible = false
    }
  }
  
  return allCovenantAccessible
}

async function main() {
  console.log('🏛️  EDEN ACADEMY NAVIGATION VERIFICATION')
  console.log('=' .repeat(80))
  console.log()
  
  // Test local development server first
  console.log('🛠️  TESTING LOCAL DEVELOPMENT SERVER')
  console.log('=' .repeat(60))
  
  let allTestsPassed = true
  const results = []
  
  for (const test of NAVIGATION_TESTS) {
    const passed = await testNavigation(test)
    results.push({ test: test.name, passed })
    if (!passed) allTestsPassed = false
  }
  
  // Test covenant accessibility specifically
  const covenantAccessible = await verifyCovenantAccess()
  if (!covenantAccessible) allTestsPassed = false
  
  // Test production URLs
  const productionResults = await testProductionUrls()
  
  // Generate final report
  console.log('\\n📋 FINAL VERIFICATION REPORT')
  console.log('=' .repeat(80))
  
  console.log('\\n🧪 LOCAL TESTS:')
  const passedTests = results.filter(r => r.passed).length
  console.log(`   Passed: ${passedTests}/${results.length} (${Math.round(passedTests/results.length * 100)}%)`)
  
  results.forEach(result => {
    console.log(`   ${result.passed ? '✅' : '❌'} ${result.test}`)
  })
  
  console.log('\\n🔥 COVENANT ACCESS:')
  console.log(`   ${covenantAccessible ? '✅' : '❌'} Covenant systems accessible`)
  
  console.log('\\n🌐 PRODUCTION STATUS:')
  const activeUrls = productionResults.filter(r => r.status === 'active')
  console.log(`   Active URLs: ${activeUrls.length}/${productionResults.length}`)
  
  productionResults.forEach(result => {
    if (result.status === 'active') {
      console.log(`   ✅ ${result.url} (${result.workingRoutes}/${result.totalRoutes} routes)`)
    } else {
      console.log(`   ❌ ${result.url} (${result.status})`)
    }
  })
  
  if (allTestsPassed && covenantAccessible && activeUrls.length > 0) {
    console.log('\\n🎉 ALL NAVIGATION TESTS PASSED!')
    console.log('✅ Eden Academy navigation infrastructure is healthy')
    console.log('✅ Covenant emergency systems accessible')
    console.log('✅ Three-tier architecture working')
    console.log('✅ Production deployments functional')
  } else {
    console.log('\\n❌ NAVIGATION ISSUES DETECTED:')
    if (!allTestsPassed) console.log('   • Local navigation tests failing')
    if (!covenantAccessible) console.log('   • Covenant emergency access broken')
    if (activeUrls.length === 0) console.log('   • No production deployments accessible')
    
    console.log('\\n🔧 RECOMMENDED ACTIONS:')
    console.log('   • Fix failing navigation tests')
    console.log('   • Ensure covenant routes are accessible')
    console.log('   • Consolidate to single production URL')
    console.log('   • Configure academy.eden2.io domain properly')
    
    process.exit(1)
  }
}

if (import.meta.main) {
  main()
}