/**
 * Import SOLIENNE works to Registry Database
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

async function importSolienneWorks() {
  console.log('🎨 Starting SOLIENNE works import to database...')
  
  try {
    // Find SOLIENNE agent
    const agent = await prisma.agent.findFirst({
      where: { handle: 'solienne' }
    })
    
    if (!agent) {
      console.error('❌ SOLIENNE agent not found in database')
      return
    }
    
    console.log(`✅ Found SOLIENNE agent: ${agent.id}`)
    
    // Check existing works
    const existingCount = await prisma.creation.count({
      where: { agentId: agent.id }
    })
    console.log(`📊 Existing works: ${existingCount}`)
    
    if (existingCount > 100) {
      console.log('⚠️  SOLIENNE already has works, skipping import')
      return
    }
    
    // Read latest migration file
    const migrationsDir = path.join(process.cwd(), 'data', 'migrations')
    const files = await fs.readdir(migrationsDir)
    const solienneFiles = files
      .filter(f => f.startsWith('solienne-works-') && f.endsWith('.json'))
      .sort()
    
    const latestFile = solienneFiles[solienneFiles.length - 1]
    if (!latestFile) {
      console.error('❌ No SOLIENNE migration files found')
      return
    }
    
    console.log(`📥 Reading ${latestFile}...`)
    const worksData = JSON.parse(
      await fs.readFile(path.join(migrationsDir, latestFile), 'utf-8')
    )
    
    console.log(`📦 Processing ${worksData.length} works...`)
    
    // Transform works for database
    const creations = worksData.map((work: any, index: number) => ({
      agentId: agent.id,
      title: work.title || `Self-Portrait #${index + 1}`,
      mediaUri: work.files?.[0]?.url || work.url || `https://picsum.photos/600/600?random=${2000 + index}`,
      mediaType: 'IMAGE',
      creationUrl: work.files?.[0]?.url || work.url,
      metadata: {
        description: work.description || work.prompt,
        source: 'eden.academy',
        dayNumber: work.dayNumber,
        score: work.score || 75,
        themes: work.themes || ['consciousness', 'identity'],
        lightingStyle: work.lightingStyle,
        consciousnessLevel: work.consciousnessLevel,
        originalId: work.id
      },
      urls: {
        full: work.files?.[0]?.url || work.url,
        preview: work.files?.[0]?.url || work.url,
        thumbnail: work.files?.[0]?.url || work.url
      },
      status: 'PUBLISHED',
      availability: 'available'
    }))
    
    // Delete existing works to avoid duplicates
    if (existingCount > 0) {
      console.log('🗑️  Cleaning existing works...')
      await prisma.creation.deleteMany({
        where: { agentId: agent.id }
      })
    }
    
    // Import in batches
    const batchSize = 100
    for (let i = 0; i < creations.length; i += batchSize) {
      const batch = creations.slice(i, i + batchSize)
      await prisma.creation.createMany({
        data: batch
      })
      console.log(`✅ Imported batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(creations.length/batchSize)}`)
    }
    
    // Verify import
    const finalCount = await prisma.creation.count({
      where: { agentId: agent.id }
    })
    
    console.log(`\n🎉 Import complete!`)
    console.log(`📊 Total SOLIENNE works in database: ${finalCount}`)
    
  } catch (error) {
    console.error('❌ Import failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importSolienneWorks()