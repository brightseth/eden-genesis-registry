import { prisma } from '../src/lib/db'

async function verifyAgentNumbering() {
  console.log('🔍 VERIFYING AGENT NUMBERING')
  console.log('=' .repeat(40))
  
  try {
    const agents = await prisma.agent.findMany({
      orderBy: { agentNumber: 'asc' },
      select: {
        agentNumber: true,
        handle: true,
        displayName: true
      }
    })

    console.log('\nCURRENT AGENT NUMBERING:')
    agents.forEach(agent => {
      console.log(`  #${agent.agentNumber}: ${agent.displayName} (@${agent.handle})`)
    })

    // Check for issues
    const numbers = agents.map(a => a.agentNumber).sort((a, b) => a - b)
    const expectedNumbers = Array.from({ length: agents.length }, (_, i) => i)
    
    const hasGaps = numbers.some((num, i) => num !== expectedNumbers[i])
    const hasDuplicates = new Set(numbers).size !== numbers.length
    const startsFromZero = numbers[0] === 0

    console.log('\n📊 VALIDATION RESULTS:')
    console.log(`  Total agents: ${agents.length}`)
    console.log(`  Number range: ${numbers[0]} to ${numbers[numbers.length - 1]}`)
    console.log(`  Starts from 0: ${startsFromZero ? '✅ YES' : '❌ NO'}`)
    console.log(`  Has gaps: ${hasGaps ? '❌ YES' : '✅ NO'}`)
    console.log(`  Has duplicates: ${hasDuplicates ? '❌ YES' : '✅ NO'}`)
    console.log(`  Sequential: ${!hasGaps && startsFromZero ? '✅ YES' : '❌ NO'}`)

    if (!hasGaps && startsFromZero && !hasDuplicates) {
      console.log('\n🎉 AGENT NUMBERING IS PERFECT!')
    } else {
      console.log('\n⚠️  Issues found in agent numbering')
    }

  } catch (error) {
    console.error('❌ Failed to verify agent numbering:', error)
  }
}

verifyAgentNumbering()