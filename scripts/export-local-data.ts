import { prisma } from '../src/lib/db'
import fs from 'fs/promises'
import path from 'path'

async function exportData() {
  console.log('📦 Exporting data from local database...')
  
  try {
    // Export all data
    const [cohorts, agents, profiles, creations, progressChecklists] = await Promise.all([
      prisma.cohort.findMany(),
      prisma.agent.findMany(),
      prisma.profile.findMany(),
      prisma.creation.findMany(),
      prisma.progressChecklist.findMany()
    ])
    
    const exportData = {
      timestamp: new Date().toISOString(),
      database: 'local-prisma-postgres',
      data: {
        cohorts,
        agents,
        profiles,
        creations,
        progressChecklists
      }
    }
    
    // Save to file
    const exportPath = path.join(process.cwd(), 'data', 'export-production.json')
    await fs.writeFile(exportPath, JSON.stringify(exportData, null, 2))
    
    console.log('✅ Data exported successfully!')
    console.log(`📄 Saved to: ${exportPath}`)
    console.log(`📊 Stats:`)
    console.log(`   - Cohorts: ${cohorts.length}`)
    console.log(`   - Agents: ${agents.length}`)
    console.log(`   - Profiles: ${profiles.length}`)
    console.log(`   - Creations: ${creations.length}`)
    console.log(`   - Progress Checklists: ${progressChecklists.length}`)
    
  } catch (error) {
    console.error('❌ Export failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

exportData()