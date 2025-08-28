// Validate Registry-as-Protocol architecture implementation
// Ensures proper separation of concerns and data flow

import { prisma } from '../src/lib/db'

async function validateRegistryArchitecture() {
  console.log('🏗️  REGISTRY-AS-PROTOCOL ARCHITECTURE VALIDATION')
  console.log('=' .repeat(60))

  const results = {
    agentNumbering: { valid: false, details: '' },
    apiEndpoints: { valid: false, details: '' },
    dataIntegrity: { valid: false, details: '' },
    schemaConsistency: { valid: false, details: '' }
  }

  try {
    // 1. Validate Agent Numbering (0-indexed, sequential)
    console.log('\n1️⃣ VALIDATING AGENT NUMBERING SYSTEM')
    console.log('-'.repeat(40))
    
    const agents = await prisma.agent.findMany({
      orderBy: { agentNumber: 'asc' },
      select: {
        id: true,
        agentNumber: true,
        handle: true,
        displayName: true,
        createdAt: true
      }
    })

    const agentNumbers = agents.map(a => a.agentNumber).sort((a, b) => a - b)
    const expectedSequence = Array.from({ length: agents.length }, (_, i) => i)
    const isSequential = agentNumbers.every((num, i) => num === expectedSequence[i])
    const startsFromZero = agents.length > 0 && agentNumbers[0] === 0
    
    console.log(`   Total Agents: ${agents.length}`)
    console.log(`   Number Range: ${agentNumbers[0]} to ${agentNumbers[agentNumbers.length - 1]}`)
    console.log(`   Starts from 0: ${startsFromZero ? '✅ YES' : '❌ NO'}`)
    console.log(`   Sequential: ${isSequential ? '✅ YES' : '❌ NO'}`)
    
    if (agents.length > 0) {
      console.log('\n   Agent Numbering:')
      agents.slice(0, 8).forEach(agent => { // Show first 8 (genesis cohort)
        console.log(`     #${agent.agentNumber}: ${agent.displayName} (@${agent.handle})`)
      })
      if (agents.length > 8) {
        console.log(`     ... and ${agents.length - 8} more`)
      }
    }

    results.agentNumbering.valid = startsFromZero && isSequential
    results.agentNumbering.details = `${agents.length} agents, ${startsFromZero && isSequential ? 'properly numbered 0-' + (agents.length - 1) : 'numbering issues detected'}`

    // 2. Validate API Endpoints Structure
    console.log('\n2️⃣ VALIDATING API ENDPOINT STRUCTURE')
    console.log('-'.repeat(40))
    
    const fs = require('fs')
    const path = require('path')
    
    const apiPath = './src/app/api/v1'
    const expectedEndpoints = [
      'agents/route.ts',
      'applications/route.ts',
      'agents/[id]/profile/route.ts',
      'agents/[id]/creations/route.ts',
      'webhooks/register/route.ts'
    ]
    
    let foundEndpoints = 0
    console.log('   Checking critical API endpoints:')
    
    for (const endpoint of expectedEndpoints) {
      const fullPath = path.join(apiPath, endpoint)
      const exists = fs.existsSync(fullPath)
      console.log(`     ${exists ? '✅' : '❌'} ${endpoint}`)
      if (exists) foundEndpoints++
    }
    
    results.apiEndpoints.valid = foundEndpoints === expectedEndpoints.length
    results.apiEndpoints.details = `${foundEndpoints}/${expectedEndpoints.length} critical endpoints found`

    // 3. Validate Data Integrity
    console.log('\n3️⃣ VALIDATING DATA INTEGRITY')
    console.log('-'.repeat(40))
    
    // Check for required relationships
    const agentProfileCount = await prisma.agent.count({
      where: {
        profile: { isNot: null }
      }
    })
    
    const agentCreationCount = await prisma.creation.count()
    const applicationCount = await prisma.application.count()
    const cohortCount = await prisma.cohort.count()
    
    console.log(`   Agents with Profiles: ${agentProfileCount}/${agents.length}`)
    console.log(`   Total Creations: ${agentCreationCount}`)
    console.log(`   Total Applications: ${applicationCount}`)
    console.log(`   Total Cohorts: ${cohortCount}`)
    
    // Check for orphaned records
    const orphanedCreations = await prisma.creation.count({
      where: {
        agent: null
      }
    })
    
    console.log(`   Orphaned Creations: ${orphanedCreations}`)
    
    const dataIntegrityValid = orphanedCreations === 0
    results.dataIntegrity.valid = dataIntegrityValid
    results.dataIntegrity.details = `${orphanedCreations} orphaned records, ${agentProfileCount} profiled agents`

    // 4. Schema Consistency Check
    console.log('\n4️⃣ VALIDATING SCHEMA CONSISTENCY')
    console.log('-'.repeat(40))
    
    // Check enum consistency
    const agentRoles = await prisma.agent.groupBy({
      by: ['role'],
      _count: { role: true }
    })
    
    const agentStatuses = await prisma.agent.groupBy({
      by: ['status'],
      _count: { status: true }
    })
    
    console.log('   Agent Roles:')
    agentRoles.forEach(role => {
      console.log(`     ${role.role}: ${role._count.role} agents`)
    })
    
    console.log('   Agent Statuses:')
    agentStatuses.forEach(status => {
      console.log(`     ${status.status}: ${status._count.status} agents`)
    })
    
    // Check for valid enum values (these should match Prisma schema)
    const validRoles = ['ADMIN', 'CURATOR', 'COLLECTOR', 'INVESTOR', 'TRAINER', 'GUEST', 'CREATOR', 'RESEARCHER', 'COMMUNITY', 'EDUCATOR', 'EXPERIMENTAL']
    const validStatuses = ['INVITED', 'APPLYING', 'ONBOARDING', 'ACTIVE', 'GRADUATED', 'ARCHIVED']
    
    const invalidRoles = agentRoles.filter(r => !validRoles.includes(r.role))
    const invalidStatuses = agentStatuses.filter(s => !validStatuses.includes(s.status))
    
    const schemaConsistent = invalidRoles.length === 0 && invalidStatuses.length === 0
    results.schemaConsistency.valid = schemaConsistent
    results.schemaConsistency.details = `${invalidRoles.length + invalidStatuses.length} invalid enum values found`
    
    if (invalidRoles.length > 0) {
      console.log('   ❌ Invalid roles found:', invalidRoles.map(r => r.role))
    }
    if (invalidStatuses.length > 0) {
      console.log('   ❌ Invalid statuses found:', invalidStatuses.map(s => s.status))
    }

    // Overall Assessment
    console.log('\n' + '='.repeat(60))
    console.log('📊 REGISTRY-AS-PROTOCOL ASSESSMENT')
    console.log('='.repeat(60))
    
    const validationResults = [
      { name: 'Agent Numbering', ...results.agentNumbering },
      { name: 'API Endpoints', ...results.apiEndpoints },
      { name: 'Data Integrity', ...results.dataIntegrity },
      { name: 'Schema Consistency', ...results.schemaConsistency }
    ]
    
    validationResults.forEach(result => {
      console.log(`${result.valid ? '✅' : '❌'} ${result.name}: ${result.details}`)
    })
    
    const overallValid = validationResults.every(r => r.valid)
    const passedTests = validationResults.filter(r => r.valid).length
    
    console.log(`\nOverall Status: ${overallValid ? '✅ FULLY COMPLIANT' : `⚠️ ${passedTests}/${validationResults.length} TESTS PASSED`}`)
    
    if (!overallValid) {
      console.log('\n🔧 RECOMMENDED ACTIONS:')
      if (!results.agentNumbering.valid) {
        console.log('   • Run: npx tsx scripts/fix-agent-numbering.ts')
      }
      if (!results.apiEndpoints.valid) {
        console.log('   • Verify all required API routes exist')
      }
      if (!results.dataIntegrity.valid) {
        console.log('   • Clean up orphaned records')
      }
      if (!results.schemaConsistency.valid) {
        console.log('   • Fix invalid enum values in database')
      }
    } else {
      console.log('\n🎉 REGISTRY ARCHITECTURE IS FULLY COMPLIANT!')
      console.log('   Ready to serve as definitive source of truth')
    }

    return {
      overallValid,
      passedTests,
      totalTests: validationResults.length,
      results: validationResults
    }

  } catch (error) {
    console.error('❌ Architecture validation failed:', error)
    throw error
  }
}

// Run the validation
validateRegistryArchitecture()
  .then((summary) => {
    console.log(`\n✨ Architecture validation completed: ${summary.passedTests}/${summary.totalTests} tests passed`)
    process.exit(summary.overallValid ? 0 : 1)
  })
  .catch((error) => {
    console.error('💥 Validation failed:', error)
    process.exit(1)
  })