import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

// This will use the DATABASE_URL from environment
const prisma = new PrismaClient()

async function importData() {
  console.log('📥 Importing data to Supabase...')
  
  try {
    // Read the exported data
    const exportPath = path.join(process.cwd(), 'data', 'export-production.json')
    const exportData = JSON.parse(await fs.readFile(exportPath, 'utf-8'))
    
    console.log('📊 Data to import:')
    console.log(`   - Cohorts: ${exportData.data.cohorts.length}`)
    console.log(`   - Agents: ${exportData.data.agents.length}`)
    console.log(`   - Profiles: ${exportData.data.profiles.length}`)
    console.log(`   - Creations: ${exportData.data.creations.length}`)
    console.log(`   - Progress Checklists: ${exportData.data.progressChecklists.length}`)
    
    // Import in correct order (respecting foreign keys)
    
    // 1. Import Cohorts
    console.log('\n1️⃣ Importing cohorts...')
    for (const cohort of exportData.data.cohorts) {
      await prisma.cohort.upsert({
        where: { id: cohort.id },
        create: cohort,
        update: cohort
      })
    }
    console.log('   ✅ Cohorts imported')
    
    // 2. Import Agents
    console.log('\n2️⃣ Importing agents...')
    for (const agent of exportData.data.agents) {
      await prisma.agent.upsert({
        where: { id: agent.id },
        create: agent,
        update: agent
      })
    }
    console.log('   ✅ Agents imported')
    
    // 3. Import Profiles
    console.log('\n3️⃣ Importing profiles...')
    for (const profile of exportData.data.profiles) {
      await prisma.profile.upsert({
        where: { agentId: profile.agentId },
        create: profile,
        update: profile
      })
    }
    console.log('   ✅ Profiles imported')
    
    // 4. Import Creations
    console.log('\n4️⃣ Importing creations...')
    for (const creation of exportData.data.creations) {
      await prisma.creation.upsert({
        where: { id: creation.id },
        create: creation,
        update: creation
      })
    }
    console.log('   ✅ Creations imported')
    
    // 5. Import Progress Checklists
    console.log('\n5️⃣ Importing progress checklists...')
    for (const checklist of exportData.data.progressChecklists) {
      await prisma.progressChecklist.upsert({
        where: { id: checklist.id },
        create: checklist,
        update: checklist
      })
    }
    console.log('   ✅ Progress checklists imported')
    
    console.log('\n✨ All data imported successfully!')
    
    // Verify the import
    const counts = await Promise.all([
      prisma.agent.count(),
      prisma.creation.count()
    ])
    
    console.log('\n📊 Final database state:')
    console.log(`   - Agents: ${counts[0]}`)
    console.log(`   - Creations: ${counts[1]}`)
    
  } catch (error) {
    console.error('❌ Import failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importData()