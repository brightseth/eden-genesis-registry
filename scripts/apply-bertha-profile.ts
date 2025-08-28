// Apply BERTHA's enhanced profile to Registry via API
import * as fs from 'fs'

const REGISTRY_BASE_URL = 'http://localhost:3009/api/v1'

async function applyBerthaProfile() {
  console.log('🚀 Applying BERTHA Enhanced Profile to Registry')
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
    
    // Apply the enhanced profile via API
    console.log('\n📡 Updating profile via Registry API...')
    
    const response = await fetch(`${REGISTRY_BASE_URL}/agents/${agentId}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Note: In production this would need proper auth token
        'Authorization': 'Bearer admin-token'
      },
      body: JSON.stringify(enhancedProfile)
    })
    
    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ Profile update successful!')
      console.log(`   Agent: ${result.profile?.agent?.displayName || 'BERTHA'}`)
      console.log(`   Statement updated: ${result.profile?.statement ? 'Yes' : 'No'}`)
      console.log(`   Manifesto added: ${result.profile?.manifesto ? 'Yes' : 'No'}`)
      console.log(`   Tags count: ${result.profile?.tags?.length || 0}`)
      
      // Verify the update by fetching the profile
      console.log('\n🔍 Verifying profile update...')
      const verifyResponse = await fetch(`${REGISTRY_BASE_URL}/agents/${agentId}/profile`)
      
      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json()
        console.log('✅ Verification successful!')
        console.log(`   Statement: "${verifyData.statement}"`)
        console.log(`   Tags: [${verifyData.tags?.join(', ')}]`)
        console.log(`   Manifesto length: ${verifyData.manifesto?.length || 0} chars`)
      } else {
        console.log('⚠️  Verification failed, but update may have succeeded')
      }
      
      // Save success record
      const successRecord = {
        timestamp: new Date().toISOString(),
        agentId,
        status: 'success',
        appliedProfile: enhancedProfile,
        apiResponse: result,
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
      
    } else {
      console.log('❌ Profile update failed!')
      console.log(`   Status: ${response.status}`)
      console.log(`   Error: ${result.error || 'Unknown error'}`)
      
      if (result.details) {
        console.log(`   Details: ${JSON.stringify(result.details, null, 2)}`)
      }
      
      // For development, let's try a PATCH instead
      console.log('\n🔧 Trying PATCH method instead...')
      const patchResponse = await fetch(`${REGISTRY_BASE_URL}/agents/${agentId}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          manifesto: enhancedProfile.manifesto,
          tags: enhancedProfile.tags,
          links: enhancedProfile.links
        })
      })
      
      const patchResult = await patchResponse.json()
      
      if (patchResponse.ok) {
        console.log('✅ PATCH update successful!')
        console.log(`   Manifesto added: ${patchResult.profile?.manifesto ? 'Yes' : 'No'}`)
      } else {
        console.log('❌ PATCH also failed:', patchResult.error)
      }
    }
    
  } catch (error) {
    console.error('💥 Profile application failed:', error)
    
    // Save error record for debugging
    const errorRecord = {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      status: 'failed',
      recommendation: 'Check Registry API auth requirements and validation schema'
    }
    
    fs.writeFileSync(
      './backups/bertha-profile-migration-error.json',
      JSON.stringify(errorRecord, null, 2)
    )
    
    throw error
  }
}

// Run the profile application
applyBerthaProfile()
  .then(() => {
    console.log('\n🎉 BERTHA profile migration completed!')
    console.log('   Next: Test Academy rendering and remove hardcoded config')
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error.message)
    process.exit(1)
  })