// Create BERTHA agent in Registry with enhanced profile
import * as fs from 'fs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createBerthaAgent() {
  console.log('🚀 Creating BERTHA Agent in Registry with Enhanced Profile')
  console.log('=' .repeat(55))
  
  try {
    // Load the enhanced profile data
    const backupPath = './backups/bertha-enhanced-profile.json'
    if (!fs.existsSync(backupPath)) {
      throw new Error('Enhanced profile backup not found. Run migrate-bertha-api.ts first.')
    }
    
    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'))
    const { enhancedProfile } = backupData
    
    console.log(`📋 Loaded enhanced profile data`)
    console.log(`   Statement: ${enhancedProfile.statement.substring(0, 80)}...`)
    console.log(`   Tags: ${enhancedProfile.tags.length} tags`)
    console.log(`   Links: ${Object.keys(enhancedProfile.links).length} sections`)
    
    // Check if BERTHA already exists
    const existingAgent = await prisma.agent.findFirst({
      where: { handle: 'bertha' }
    })
    
    if (existingAgent) {
      console.log('⚠️  BERTHA agent already exists, updating profile only...')
      
      const updatedProfile = await prisma.profile.upsert({
        where: { agentId: existingAgent.id },
        update: {
          statement: enhancedProfile.statement,
          manifesto: enhancedProfile.manifesto,
          tags: enhancedProfile.tags,
          links: enhancedProfile.links,
          updatedAt: new Date()
        },
        create: {
          agentId: existingAgent.id,
          statement: enhancedProfile.statement,
          manifesto: enhancedProfile.manifesto,
          tags: enhancedProfile.tags,
          links: enhancedProfile.links
        }
      })
      
      console.log('✅ Profile updated for existing BERTHA agent')
      return { agent: existingAgent, profile: updatedProfile }
    }
    
    // Get genesis cohort
    const genesisCohort = await prisma.cohort.findFirst({
      where: { slug: 'genesis' }
    })
    
    if (!genesisCohort) {
      throw new Error('Genesis cohort not found')
    }
    
    // Create BERTHA agent with profile
    console.log('\n🔧 Creating new BERTHA agent with profile...')
    
    const newAgent = await prisma.agent.create({
      data: {
        handle: 'bertha',
        displayName: 'BERTHA',
        role: 'COLLECTOR',
        status: 'ACTIVE',
        cohortId: genesisCohort.id,
        profile: {
          create: {
            statement: enhancedProfile.statement,
            manifesto: enhancedProfile.manifesto,
            tags: enhancedProfile.tags,
            links: enhancedProfile.links
          }
        }
      },
      include: {
        profile: true,
        cohort: true
      }
    })
    
    console.log('✅ BERTHA agent created successfully!')
    console.log(`   Agent ID: ${newAgent.id}`)
    console.log(`   Handle: ${newAgent.handle}`)
    console.log(`   Display Name: ${newAgent.displayName}`)
    console.log(`   Agent Number: ${newAgent.agentNumber}`)
    console.log(`   Profile created: ${newAgent.profile ? 'Yes' : 'No'}`)
    
    if (newAgent.profile) {
      console.log(`   Statement: "${newAgent.profile.statement}"`)
      console.log(`   Tags count: ${newAgent.profile.tags?.length || 0}`)
      console.log(`   Manifesto length: ${newAgent.profile.manifesto?.length || 0} chars`)
      console.log(`   Links sections: ${Object.keys(newAgent.profile.links || {}).length}`)
    }
    
    // Save success record
    const successRecord = {
      timestamp: new Date().toISOString(),
      agentId: newAgent.id,
      method: 'direct-database-create',
      status: 'success',
      createdAgent: newAgent,
      appliedProfile: enhancedProfile,
      nextSteps: [
        'Test Academy profile rendering from Registry',
        'Remove hardcoded BERTHA config from Academy',
        'Implement widget system for other agents'
      ]
    }
    
    fs.writeFileSync(
      './backups/bertha-agent-creation-success.json',
      JSON.stringify(successRecord, null, 2)
    )
    
    console.log('\n💾 Success record saved to: ./backups/bertha-agent-creation-success.json')
    
    await prisma.$disconnect()
    return { agent: newAgent, profile: newAgent.profile }
    
  } catch (error) {
    console.error('💥 BERTHA agent creation failed:', error)
    
    // Save error record for debugging
    const errorRecord = {
      timestamp: new Date().toISOString(),
      method: 'direct-database-create',
      error: error.message,
      stack: error.stack,
      status: 'failed',
      recommendation: 'Check database connection and schema'
    }
    
    fs.writeFileSync(
      './backups/bertha-agent-creation-error.json',
      JSON.stringify(errorRecord, null, 2)
    )
    
    await prisma.$disconnect()
    throw error
  }
}

// Run the agent creation
createBerthaAgent()
  .then(() => {
    console.log('\n🎉 BERTHA agent and profile creation completed!')
    console.log('   Next: Test Academy rendering from Registry')
  })
  .catch((error) => {
    console.error('💥 Creation failed:', error.message)
    process.exit(1)
  })