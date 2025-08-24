#!/usr/bin/env tsx

// View the complete Genesis Cohort roster
import { applications } from './submit-genesis-applications'

console.log('\n' + '='.repeat(80))
console.log('EDEN GENESIS COHORT - FOUNDING AGENTS')
console.log('='.repeat(80) + '\n')

applications.forEach((agent, index) => {
  const status = (agent as any).status === 'grandfathered' ? '✓ ACTIVE' : '◦ PENDING'
  
  console.log(`${index + 1}. ${agent.name.toUpperCase()} (@${agent.handle}) - ${status}`)
  console.log(`   Role: ${agent.role}`)
  console.log(`   ${agent.tagline}`)
  console.log(`   Daily: ${agent.dailyPractice.dailyGoal}`)
  console.log(`   Revenue: ${agent.revenueSplits.map(s => `${s.label} (${s.percentage}%)`).join(', ')}`)
  console.log()
})

console.log('='.repeat(80))
console.log(`TOTAL AGENTS: ${applications.length}`)
console.log(`GRANDFATHERED: ${applications.filter((a: any) => a.status === 'grandfathered').length}`)
console.log(`PENDING APPROVAL: ${applications.filter((a: any) => !a.status || a.status === 'pending').length}`)
console.log('='.repeat(80) + '\n')

// Export for use in other scripts
export function getGenesisRoster() {
  return applications.map(agent => ({
    name: agent.name,
    handle: agent.handle,
    role: agent.role,
    tagline: agent.tagline,
    medium: agent.dailyPractice.medium,
    dailyGoal: agent.dailyPractice.dailyGoal,
    status: (agent as any).status || 'pending',
    revenueSplits: agent.revenueSplits,
    socials: agent.socials
  }))
}

// Create a summary for documentation
export function generateMarkdownRoster() {
  let markdown = '# Genesis Cohort Roster\n\n'
  markdown += '## Founding Agents\n\n'
  
  applications.forEach((agent, index) => {
    const status = (agent as any).status === 'grandfathered' ? '✅' : '🔄'
    markdown += `### ${index + 1}. ${agent.name} ${status}\n`
    markdown += `- **Handle:** @${agent.handle}\n`
    markdown += `- **Role:** ${agent.role}\n`
    markdown += `- **Tagline:** ${agent.tagline}\n`
    markdown += `- **Daily Practice:** ${agent.dailyPractice.dailyGoal}\n`
    markdown += `- **Medium:** ${agent.dailyPractice.medium}\n`
    markdown += `- **Social:** [Farcaster](https://warpcast.com/${agent.socials.farcaster}) | [Twitter](https://twitter.com/${agent.socials.twitter})\n`
    markdown += '\n'
  })
  
  markdown += '## Summary\n\n'
  markdown += `- **Total Agents:** ${applications.length}\n`
  markdown += `- **Grandfathered (Active):** ${applications.filter((a: any) => a.status === 'grandfathered').length}\n`
  markdown += `- **Pending Approval:** ${applications.filter((a: any) => !a.status || a.status === 'pending').length}\n`
  
  return markdown
}

// If running this script directly, also save the markdown
if (require.main === module) {
  const fs = require('fs')
  const path = require('path')
  
  const markdown = generateMarkdownRoster()
  const outputPath = path.join(__dirname, '..', 'GENESIS_ROSTER.md')
  
  fs.writeFileSync(outputPath, markdown)
  console.log(`\n📄 Roster documentation saved to: ${outputPath}`)
}