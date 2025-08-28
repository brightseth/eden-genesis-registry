// Fix agent numbering to start from 0 for onchain registry compatibility
// This script ensures Abraham=#0, Solienne=#1, etc.

import { prisma } from '../src/lib/db'

async function fixAgentNumbering() {
  console.log('🔢 FIXING AGENT NUMBERING TO START FROM 0')
  console.log('=' .repeat(50))
  
  try {
    // Get all agents ordered by creation time to maintain chronological numbering
    const agents = await prisma.agent.findMany({
      orderBy: [
        { createdAt: 'asc' },
        { handle: 'asc' }
      ],
      select: {
        id: true,
        handle: true,
        displayName: true,
        agentNumber: true,
        createdAt: true
      }
    })

    console.log(`Found ${agents.length} agents to renumber:\n`)

    // Show current numbering
    console.log('CURRENT NUMBERING:')
    agents.forEach(agent => {
      console.log(`  #${agent.agentNumber}: ${agent.displayName} (@${agent.handle})`)
    })

    console.log('\nPROPOSED NEW NUMBERING (0-indexed):')
    agents.forEach((agent, index) => {
      console.log(`  #${index}: ${agent.displayName} (@${agent.handle}) ${index === agent.agentNumber ? '(no change)' : `(was #${agent.agentNumber})`}`)
    })

    // Apply the renumbering
    console.log('\n🔄 Applying sequential numbering starting from 0...')
    
    const updates = []
    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i]
      if (agent.agentNumber !== i) {
        const result = await prisma.agent.update({
          where: { id: agent.id },
          data: { agentNumber: i }
        })
        updates.push({
          agent: `${agent.displayName} (@${agent.handle})`,
          from: agent.agentNumber,
          to: i
        })
        console.log(`  ✅ Updated ${agent.displayName}: #${agent.agentNumber} → #${i}`)
      } else {
        console.log(`  ➖ No change for ${agent.displayName}: already #${i}`)
      }
    }

    // Update the sequence to continue from the next available number
    const nextNumber = agents.length
    await prisma.$executeRaw`SELECT setval('agent_number_seq', ${nextNumber}, false)`
    console.log(`\n🔄 Updated sequence to start from ${nextNumber} for next agent`)

    // Verify the changes
    console.log('\n🧪 VERIFYING FINAL STATE:')
    const updatedAgents = await prisma.agent.findMany({
      orderBy: { agentNumber: 'asc' },
      select: {
        agentNumber: true,
        handle: true,
        displayName: true
      }
    })

    updatedAgents.forEach(agent => {
      console.log(`  #${agent.agentNumber}: ${agent.displayName} (@${agent.handle})`)
    })

    // Check for any gaps or duplicates
    const numbers = updatedAgents.map(a => a.agentNumber).sort((a, b) => a - b)
    const expectedNumbers = Array.from({ length: updatedAgents.length }, (_, i) => i)
    
    const hasGaps = numbers.some((num, i) => num !== expectedNumbers[i])
    const hasDuplicates = new Set(numbers).size !== numbers.length

    console.log('\n📊 VALIDATION RESULTS:')
    console.log(`  Total agents: ${updatedAgents.length}`)
    console.log(`  Number range: ${numbers[0]} to ${numbers[numbers.length - 1]}`)
    console.log(`  Has gaps: ${hasGaps ? '❌ YES' : '✅ NO'}`)
    console.log(`  Has duplicates: ${hasDuplicates ? '❌ YES' : '✅ NO'}`)
    console.log(`  Sequential from 0: ${!hasGaps && numbers[0] === 0 ? '✅ YES' : '❌ NO'}`)

    if (updates.length > 0) {
      console.log(`\n🎉 Successfully updated ${updates.length} agents to sequential numbering!`)
      console.log('\nSUMMARY OF CHANGES:')
      updates.forEach(update => {
        console.log(`  ${update.agent}: #${update.from} → #${update.to}`)
      })
    } else {
      console.log('\n✨ No changes needed - agents already properly numbered!')
    }

    return {
      totalAgents: agents.length,
      changesApplied: updates.length,
      hasGaps,
      hasDuplicates,
      isSequential: !hasGaps && numbers[0] === 0
    }

  } catch (error) {
    console.error('❌ Failed to fix agent numbering:', error)
    throw error
  }
}

// Run the fix
fixAgentNumbering()
  .then((result) => {
    console.log('\n✨ Agent numbering fix completed!')
    console.log(`   ${result.totalAgents} agents processed`)
    console.log(`   ${result.changesApplied} agents renumbered`)
    console.log(`   Sequential from 0: ${result.isSequential ? '✅' : '❌'}`)
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Agent numbering fix failed:', error)
    process.exit(1)
  })