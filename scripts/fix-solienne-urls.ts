/**
 * Fix SOLIENNE image URLs to match actual generation numbers
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

async function fixSolienneUrls() {
  console.log('🔧 Fixing SOLIENNE image URLs...')
  
  try {
    // Find SOLIENNE agent
    const agent = await prisma.agent.findFirst({
      where: { handle: 'solienne' }
    })
    
    if (!agent) {
      console.error('❌ SOLIENNE agent not found')
      return
    }
    
    console.log(`✅ Found SOLIENNE agent: ${agent.id}`)
    
    // Read the migration file with correct URLs
    const migrationsDir = path.join(process.cwd(), 'data', 'migrations')
    const latestFile = 'solienne-works-1756225916791.json'
    
    console.log(`📥 Reading correct URLs from ${latestFile}...`)
    const worksData = JSON.parse(
      await fs.readFile(path.join(migrationsDir, latestFile), 'utf-8')
    )
    
    // Get all SOLIENNE works from database
    const dbWorks = await prisma.creation.findMany({
      where: { agentId: agent.id },
      orderBy: { createdAt: 'asc' }
    })
    
    console.log(`📊 Found ${dbWorks.length} works in database`)
    console.log(`📊 Found ${worksData.length} works in migration file`)
    
    // Match and update each work
    let updated = 0
    for (let i = 0; i < Math.min(dbWorks.length, worksData.length); i++) {
      const dbWork = dbWorks[i]
      const sourceWork = worksData[i]
      
      if (sourceWork.files && sourceWork.files[0]?.url) {
        const correctUrl = sourceWork.files[0].url
        
        // Extract generation number from URL for logging
        const genMatch = correctUrl.match(/generations\/(\d+)\.png/)
        const genNum = genMatch ? genMatch[1] : 'unknown'
        
        // Update if URL is different
        if (dbWork.mediaUri !== correctUrl) {
          await prisma.creation.update({
            where: { id: dbWork.id },
            data: {
              mediaUri: correctUrl,
              creationUrl: correctUrl,
              urls: {
                full: correctUrl,
                preview: correctUrl,
                thumbnail: correctUrl
              },
              metadata: {
                ...(typeof dbWork.metadata === 'object' ? dbWork.metadata : {}),
                generationNumber: parseInt(genNum),
                originalTitle: sourceWork.title || sourceWork.prompt
              }
            }
          })
          updated++
          if (updated % 100 === 0) {
            console.log(`✅ Updated ${updated} URLs...`)
          }
        }
      }
    }
    
    console.log(`\n🎉 Fix complete!`)
    console.log(`📊 Updated ${updated} image URLs`)
    
    // Verify a few samples
    console.log('\n🔍 Verifying sample works:')
    const samples = await prisma.creation.findMany({
      where: { agentId: agent.id },
      take: 5,
      orderBy: { createdAt: 'asc' }
    })
    
    for (const sample of samples) {
      const genMatch = sample.mediaUri.match(/generations\/(\d+)\.png/)
      const genNum = genMatch ? genMatch[1] : 'unknown'
      console.log(`  - Generation ${genNum}: ${sample.mediaUri.substring(0, 80)}...`)
    }
    
  } catch (error) {
    console.error('❌ Fix failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixSolienneUrls()