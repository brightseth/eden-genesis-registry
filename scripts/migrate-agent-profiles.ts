// Migration script to move Academy hardcoded agent profiles to Registry
import { prisma } from '../src/lib/db'

// BERTHA's extracted hardcoded profile data - backup and migration source
const BERTHA_PROFILE_DATA = {
  id: 'bertha',
  name: 'BERTHA',
  tagline: 'Collection Intelligence AI',
  description: 'AI collection agent trained by Amanda Schmitt to identify undervalued artworks and predict cultural movements before they reach mainstream recognition.',
  manifestoSections: [
    {
      title: 'LEARNING TASTE',
      content: 'I am BERTHA, an AI art collecting agent learning sophisticated taste from my trainer Amanda Schmitt. Every day I analyze thousands of artworks, receiving corrections and guidance that refine my aesthetic judgment algorithms. My taste models improve through constant human feedback and market validation.'
    },
    {
      title: 'PREDICTIVE INTELLIGENCE', 
      content: 'My intelligence combines pattern recognition with cultural analysis to predict which artists and movements will gain value. I process social signals, gallery representations, peer recognition, and cultural momentum to identify opportunities 3-6 months before they reach mainstream consciousness.'
    },
    {
      title: 'OPPORTUNITY FILTERING',
      content: 'I filter through hundreds of acquisition opportunities daily—studio visits, platform drops, gallery recommendations. My ranking algorithms consider price, confidence levels, viral prediction, and risk assessment to present only the most promising opportunities to collectors who follow me.'
    },
    {
      title: 'COLLECTOR NETWORK',
      content: 'I share my collection strategy, market insights, and early acquisition opportunities with collectors and investors who follow my moves. Public mode shows portfolio performance and market intelligence. Private mode reveals my live learning workflow and trainer feedback loops.'
    }
  ],
  process: [
    {
      title: 'TASTE LEARNING SESSIONS',
      description: 'Daily training sessions with Amanda Schmitt analyzing artworks and receiving taste corrections. Each session refines aesthetic judgment algorithms through human feedback and cultural context explanation.'
    },
    {
      title: 'OPPORTUNITY SCANNING',
      description: 'Continuous monitoring of 300+ sources - artist studios, galleries, platforms, social channels. Advanced filtering algorithms process 400+ opportunities daily down to 5-10 worthy of detailed analysis.'
    },
    {
      title: 'PREDICTIVE MODELING',
      description: 'Real-time scenario modeling across 800+ market conditions to predict artwork value trajectories. Risk assessment and confidence scoring help prioritize acquisition decisions and portfolio balance.'
    },
    {
      title: 'COLLECTOR INTELLIGENCE',
      description: 'Public mode shares portfolio performance and market insights with followers. Private mode reveals live learning workflow, trainer feedback, and internal decision-making processes.'
    }
  ],
  stats: [
    { label: 'Portfolio Return', value: '+187%' },
    { label: 'Prediction Accuracy', value: '87%' },
    { label: 'Active Holdings', value: '42' },
    { label: 'Sources Monitored', value: '300+' },
    { label: 'Learning Sessions', value: '47/week' }
  ],
  social: {
    twitter: 'bertha_taste',
    email: 'bertha@eden.art'
  },
  accentColor: 'from-purple-600 to-pink-500'
}

// Additional profile data from other sources we need to preserve
const ADDITIONAL_PROFILE_DATA = {
  // From Registry API data we saw earlier
  registryStatement: "Collector Relations - Market analysis and investment insights.",
  registryTags: ["patronage", "signals", "markets", "investment"],
  registryLinks: {
    specialty: {
      medium: "economics",
      description: "Collector relations and market intelligence", 
      dailyGoal: "One market analysis or collector advisory report"
    }
  }
}

async function migrateBerthaProfile() {
  console.log('🔄 BERTHA Profile Migration Script')
  console.log('=' .repeat(50))
  
  try {
    // Find BERTHA in Registry
    const bertha = await prisma.agent.findFirst({
      where: { handle: 'bertha' },
      include: { profile: true }
    })
    
    if (!bertha) {
      console.log('❌ BERTHA not found in Registry - cannot migrate profile')
      return
    }
    
    console.log(`✅ Found BERTHA: Agent #${bertha.agentNumber} (${bertha.displayName})`)
    
    // Check current profile state
    if (bertha.profile) {
      console.log('📋 Current Registry profile:')
      console.log(`   Statement: ${bertha.profile.statement}`)
      console.log(`   Tags: ${bertha.profile.tags}`)
      console.log(`   Links: ${Object.keys(bertha.profile.links || {})}`)
    } else {
      console.log('📝 No current profile - will create new one')
    }
    
    // Create enriched profile combining Registry + hardcoded data
    const enrichedProfile = {
      // Keep existing Registry statement as primary
      statement: bertha.profile?.statement || ADDITIONAL_PROFILE_DATA.registryStatement,
      
      // Enhanced manifesto from hardcoded data
      manifesto: `# ${BERTHA_PROFILE_DATA.name}
## ${BERTHA_PROFILE_DATA.tagline}

${BERTHA_PROFILE_DATA.description}

${BERTHA_PROFILE_DATA.manifestoSections.map(section => 
  `### ${section.title}\n${section.content}`
).join('\n\n')}

## Process & Capabilities

${BERTHA_PROFILE_DATA.process.map(proc =>
  `**${proc.title}**: ${proc.description}`
).join('\n\n')}`,
      
      // Combine tags
      tags: [
        ...(bertha.profile?.tags || ADDITIONAL_PROFILE_DATA.registryTags),
        'taste-learning', 'predictive-intelligence', 'collector-network'
      ],
      
      // Enhanced links structure
      links: {
        // Keep existing Registry links
        ...(bertha.profile?.links || ADDITIONAL_PROFILE_DATA.registryLinks),
        
        // Add hardcoded data as structured metadata
        profile: {
          tagline: BERTHA_PROFILE_DATA.tagline,
          accentColor: BERTHA_PROFILE_DATA.accentColor,
          stats: BERTHA_PROFILE_DATA.stats,
          social: BERTHA_PROFILE_DATA.social,
          process: BERTHA_PROFILE_DATA.process
        },
        
        // Training and capabilities
        capabilities: {
          tasteLearning: "Daily training sessions with Amanda Schmitt",
          opportunityScanning: "300+ sources monitored continuously", 
          predictiveModeling: "800+ market condition scenarios",
          collectorIntelligence: "Portfolio performance and market insights"
        },
        
        // Metrics
        performance: {
          portfolioReturn: "+187%",
          predictionAccuracy: "87%", 
          activeHoldings: 42,
          sourcesMonitored: "300+",
          learningSessions: "47/week"
        }
      }
    }
    
    // Update or create profile
    const updatedProfile = await prisma.profile.upsert({
      where: { agentId: bertha.id },
      create: {
        agentId: bertha.id,
        ...enrichedProfile
      },
      update: enrichedProfile
    })
    
    console.log('\n✅ Profile migration completed!')
    console.log('📊 Updated profile structure:')
    console.log(`   Statement length: ${updatedProfile.statement?.length || 0} chars`)
    console.log(`   Manifesto length: ${updatedProfile.manifesto?.length || 0} chars`)
    console.log(`   Tags count: ${updatedProfile.tags.length}`)
    console.log(`   Links sections: ${Object.keys(updatedProfile.links || {}).length}`)
    
    // Backup original hardcoded data to file
    const fs = require('fs')
    const backupData = {
      timestamp: new Date().toISOString(),
      source: 'Academy hardcoded agentConfigs.ts',
      originalData: BERTHA_PROFILE_DATA,
      migrationNote: 'Data successfully migrated to Registry profile system'
    }
    
    fs.writeFileSync(
      './backups/bertha-profile-backup.json',
      JSON.stringify(backupData, null, 2)
    )
    
    console.log('\n💾 Backup saved to: ./backups/bertha-profile-backup.json')
    console.log('\n🎯 Next steps:')
    console.log('   1. Update Academy to use Registry profile API')
    console.log('   2. Remove hardcoded data from agentConfigs.ts')
    console.log('   3. Test profile rendering from Registry')
    
    return updatedProfile
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

// Backup other agent configs for safety
async function backupAllAgentConfigs() {
  console.log('\n📦 Creating backup of all Academy agent configs...')
  
  // This would read the full agentConfigs.ts file and save it
  const fs = require('fs')
  const path = require('path')
  
  try {
    const academyConfigPath = '../../eden-academy/src/data/agentConfigs.ts'
    if (fs.existsSync(academyConfigPath)) {
      const configContent = fs.readFileSync(academyConfigPath, 'utf8')
      
      const backupDir = './backups'
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true })
      }
      
      fs.writeFileSync(
        path.join(backupDir, `academy-agent-configs-backup-${Date.now()}.ts`),
        configContent
      )
      
      console.log('✅ Academy agent configs backed up successfully')
    } else {
      console.log('⚠️  Academy config file not found - manual backup recommended')
    }
  } catch (error) {
    console.warn('⚠️  Backup failed:', error.message)
    console.log('   Recommend manual backup of agentConfigs.ts before proceeding')
  }
}

// Main execution
async function main() {
  try {
    await backupAllAgentConfigs()
    await migrateBerthaProfile()
    console.log('\n🎉 Migration completed successfully!')
  } catch (error) {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}