// Direct database migration for BERTHA profile to Registry
// Bypasses API auth for admin migration task
import * as fs from 'fs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function applyBerthaProfileDirectDB() {
  console.log('🚀 Applying BERTHA Enhanced Profile to Registry (Direct DB)')
  console.log('=' .repeat(50))
  
  try {
    // Load the enhanced profile data
    const backupPath = './backups/bertha-enhanced-profile.json'
    if (!fs.existsSync(backupPath)) {
      throw new Error('Enhanced profile backup not found. Run migrate-bertha-api.ts first.')
    }
    
    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'))
    const { agentId, enhancedProfile } = backupData
    
    console.log(`📋 Loaded enhanced profile for agent: ${agentId}`)
    console.log(`   Statement: ${enhancedProfile.statement.substring(0, 80)}...`)
    console.log(`   Tags: ${enhancedProfile.tags.length} tags`)
    console.log(`   Links: ${Object.keys(enhancedProfile.links).length} sections`)
    
    // Apply the enhanced profile via direct DB
    console.log('\n🔧 Updating profile via direct database access...')
    
    const updatedProfile = await prisma.profile.upsert({
      where: { agentId },
      update: {
        statement: enhancedProfile.statement,
        manifesto: enhancedProfile.manifesto,
        tags: enhancedProfile.tags,
        links: enhancedProfile.links,
        updatedAt: new Date()
      },
      create: {
        agentId,
        statement: enhancedProfile.statement,
        manifesto: enhancedProfile.manifesto,
        tags: enhancedProfile.tags,
        links: enhancedProfile.links
      },
      include: {
        agent: {
          select: {
            displayName: true,
            handle: true
          }
        }
      }
    })
    
    console.log('✅ Profile update successful!')
    console.log(`   Agent: ${updatedProfile.agent?.displayName || 'BERTHA'}`)
    console.log(`   Statement updated: ${updatedProfile.statement ? 'Yes' : 'No'}`)
    console.log(`   Manifesto added: ${updatedProfile.manifesto ? 'Yes' : 'No'}`)
    console.log(`   Tags count: ${updatedProfile.tags?.length || 0}`)
    
    // Verify the update by fetching the profile
    console.log('\n🔍 Verifying profile update...')
    const verifyProfile = await prisma.profile.findUnique({
      where: { agentId },
      include: {
        agent: {
          select: {
            displayName: true,
            handle: true
          }
        }
      }
    })
    
    if (verifyProfile) {
      console.log('✅ Verification successful!')
      console.log(`   Statement: "${verifyProfile.statement}"`)
      console.log(`   Tags: [${verifyProfile.tags?.join(', ')}]`)
      console.log(`   Manifesto length: ${verifyProfile.manifesto?.length || 0} chars`)
      console.log(`   Links sections: ${Object.keys(verifyProfile.links || {}).length}`)
    } else {
      console.log('⚠️  Verification failed - profile not found')
    }
    
    // Save success record
    const successRecord = {
      timestamp: new Date().toISOString(),
      agentId,
      method: 'direct-database',
      status: 'success',
      appliedProfile: enhancedProfile,
      verificationResult: verifyProfile,
      nextSteps: [
        'Test Academy profile rendering from Registry',
        'Remove hardcoded BERTHA config from Academy',
        'Implement widget system for other agents'
      ]
    }
    
    fs.writeFileSync(
      './backups/bertha-profile-migration-success.json',
      JSON.stringify(successRecord, null, 2)
    )
    
    console.log('\n💾 Success record saved to: ./backups/bertha-profile-migration-success.json')
    
    await prisma.$disconnect()
    return successRecord
    
  } catch (error) {
    console.error('💥 Profile migration failed:', error)
    
    // Save error record for debugging
    const errorRecord = {
      timestamp: new Date().toISOString(),
      method: 'direct-database',
      error: error.message,
      stack: error.stack,
      status: 'failed',
      recommendation: 'Check database connection and profile data structure'
    }
    
    fs.writeFileSync(
      './backups/bertha-profile-migration-error.json',
      JSON.stringify(errorRecord, null, 2)
    )
    
    await prisma.$disconnect()
    throw error
  }
}

// Run the profile migration
applyBerthaProfileDirectDB()
  .then(() => {
    console.log('\n🎉 BERTHA profile migration completed!')
    console.log('   Next: Test Academy rendering and remove hardcoded config')
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error.message)
    process.exit(1)
  })