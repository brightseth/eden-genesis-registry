/**
 * Direct Import Script - Bypass API for bulk import
 * Imports migrated Academy works directly to Registry file system
 */

import fs from 'fs/promises'
import path from 'path'
import { CreationSchema, type Creation } from '@/lib/schemas/creation.schema'

async function directImport() {
  console.log('🔄 Starting direct import of migrated works...')
  
  const migrationsDir = path.join(process.cwd(), 'data', 'migrations')
  const worksDir = path.join(process.cwd(), 'data', 'works')
  await fs.mkdir(worksDir, { recursive: true })
  
  // Find latest migration files (sorted by timestamp)
  const files = await fs.readdir(migrationsDir)
  const abrahamFiles = files.filter(f => f.startsWith('abraham-works-') && f.endsWith('.json')).sort()
  const solienneFiles = files.filter(f => f.startsWith('solienne-works-') && f.endsWith('.json')).sort()
  
  const abrahamFile = abrahamFiles[abrahamFiles.length - 1] // Latest file
  const solienneFile = solienneFiles[solienneFiles.length - 1] // Latest file
  
  if (abrahamFile) {
    console.log(`📚 Importing Abraham works from ${abrahamFile}`)
    const abrahamData = await fs.readFile(path.join(migrationsDir, abrahamFile), 'utf-8')
    const abrahamWorks = JSON.parse(abrahamData)
    
    // Transform and validate each work
    const validWorks = abrahamWorks.map((work: any) => ({
      ...work,
      description: work.description || undefined, // Convert null to undefined
      createdAt: new Date(work.createdAt),
      publishedAt: new Date(work.publishedAt),
      updatedAt: new Date(work.updatedAt)
    })).filter((work: any) => {
      const validation = CreationSchema.safeParse(work)
      if (!validation.success) {
        console.log(`❌ Invalid work: ${work.id} - ${validation.error.message}`)
        return false
      }
      return true
    })
    
    await fs.writeFile(
      path.join(worksDir, 'abraham-001.json'),
      JSON.stringify(validWorks, null, 2)
    )
    console.log(`✅ Imported ${validWorks.length} Abraham works`)
  }
  
  if (solienneFile) {
    console.log(`🪞 Importing Solienne works from ${solienneFile}`)
    const solienneData = await fs.readFile(path.join(migrationsDir, solienneFile), 'utf-8')
    const solienneWorks = JSON.parse(solienneData)
    
    // Transform and validate each work
    const validWorks = solienneWorks.map((work: any) => ({
      ...work,
      description: work.description || undefined, // Convert null to undefined
      createdAt: new Date(work.createdAt),
      publishedAt: new Date(work.publishedAt),
      updatedAt: new Date(work.updatedAt)
    })).filter((work: any) => {
      const validation = CreationSchema.safeParse(work)
      if (!validation.success) {
        console.log(`❌ Invalid work: ${work.id} - ${validation.error.message}`)
        return false
      }
      return true
    })
    
    await fs.writeFile(
      path.join(worksDir, 'solienne-001.json'),
      JSON.stringify(validWorks, null, 2)
    )
    console.log(`✅ Imported ${validWorks.length} Solienne works`)
  }
  
  console.log('✅ Direct import complete')
}

directImport().catch(console.error)