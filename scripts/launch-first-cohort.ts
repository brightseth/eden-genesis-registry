// Launch validation script for first cohort agents
import { prisma } from '../src/lib/db'
import { LaunchValidator } from '../src/lib/launch-validation'

async function validateFirstCohort() {
  console.log('🚀 FIRST COHORT LAUNCH VALIDATION')
  console.log('='.repeat(50))
  
  // Get all first cohort agents
  const agents = await prisma.agent.findMany({
    where: {
      cohort: { slug: 'genesis' },
      status: 'ACTIVE',
      agentNumber: { lte: 8 } // First 8 agents
    },
    include: {
      profile: true,
      creations: true,
      personas: true,
      checklists: true
    },
    orderBy: { agentNumber: 'asc' }
  })

  console.log(`Found ${agents.length} first cohort agents\n`)

  const results = []
  let readyCount = 0
  let totalScore = 0

  for (const agent of agents) {
    console.log(`\n🔍 Validating Agent #${agent.agentNumber}: ${agent.displayName} (@${agent.handle})`)
    console.log('-'.repeat(40))
    
    const validation = await LaunchValidator.validateAgentLaunch(agent.id)
    
    // Display results
    console.log(`Overall Score: ${validation.score.toFixed(1)}/100`)
    console.log(`Status: ${validation.status.toUpperCase()}`)
    console.log(`Ready to Launch: ${validation.isValid ? '✅ YES' : '❌ NO'}`)
    
    console.log('\nGate Analysis:')
    console.log(`  Demand: ${validation.gates.demand.score}/100 ${validation.gates.demand.passed ? '✅' : '❌'}`)
    console.log(`    ${validation.gates.demand.details}`)
    console.log(`  Retention: ${validation.gates.retention.score}/100 ${validation.gates.retention.passed ? '✅' : '❌'}`)
    console.log(`    ${validation.gates.retention.details}`)
    console.log(`  Efficiency: ${validation.gates.efficiency.score}/100 ${validation.gates.efficiency.passed ? '✅' : '❌'}`)
    console.log(`    ${validation.gates.efficiency.details}`)
    
    if (validation.recommendations.length > 0) {
      console.log('\nRecommendations:')
      validation.recommendations.forEach((rec, i) => {
        console.log(`  ${i + 1}. ${rec}`)
      })
    }

    results.push({
      agent: {
        agentNumber: agent.agentNumber,
        handle: agent.handle,
        displayName: agent.displayName,
        creations: agent.creations.length,
        hasProfile: !!agent.profile?.statement
      },
      validation
    })
    
    if (validation.isValid) readyCount++
    totalScore += validation.score
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 COHORT LAUNCH SUMMARY')
  console.log('='.repeat(50))
  console.log(`Total Agents: ${agents.length}`)
  console.log(`Ready to Launch: ${readyCount}/${agents.length} (${(readyCount/agents.length*100).toFixed(1)}%)`)
  console.log(`Average Score: ${(totalScore/agents.length).toFixed(1)}/100`)
  
  const excellent = results.filter(r => r.validation.status === 'excellent').length
  const good = results.filter(r => r.validation.status === 'good').length
  const concerning = results.filter(r => r.validation.status === 'concerning').length
  const critical = results.filter(r => r.validation.status === 'critical').length
  
  console.log(`\nStatus Distribution:`)
  console.log(`  Excellent: ${excellent}`)
  console.log(`  Good: ${good}`)
  console.log(`  Concerning: ${concerning}`)  
  console.log(`  Critical: ${critical}`)

  // Recommendations for cohort
  console.log('\n📋 COHORT RECOMMENDATIONS:')
  if (readyCount === agents.length) {
    console.log('🎉 ALL AGENTS READY FOR LAUNCH!')
    console.log('   The first cohort can proceed with full deployment.')
  } else {
    console.log(`🔧 ${agents.length - readyCount} agents need attention before launch:`)
    results.filter(r => !r.validation.isValid).forEach(r => {
      console.log(`   • ${r.agent.displayName}: Score ${r.validation.score.toFixed(1)}/100`)
      console.log(`     Priority actions: ${r.validation.recommendations.slice(0, 2).join(', ')}`)
    })
  }

  // Check for high performers
  const topPerformers = results.filter(r => r.validation.score >= 80).sort((a, b) => b.validation.score - a.validation.score)
  if (topPerformers.length > 0) {
    console.log(`\n⭐ TOP PERFORMERS (80+ scores):`)
    topPerformers.forEach(r => {
      console.log(`   ${r.agent.displayName} (@${r.agent.handle}): ${r.validation.score.toFixed(1)}/100`)
    })
  }

  return {
    totalAgents: agents.length,
    readyToLaunch: readyCount,
    averageScore: totalScore / agents.length,
    results
  }
}

// Run the validation
validateFirstCohort()
  .then((summary) => {
    console.log('\n✨ Launch validation completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Launch validation failed:', error)
    process.exit(1)
  })