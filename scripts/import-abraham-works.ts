/**
 * Import Abraham Works Script
 * Imports Abraham's works from bulk-import files via Registry API
 */

import fs from 'fs/promises'
import path from 'path'

interface BulkWork {
  title: string
  prompt: string
  fileUrl: string
  createdAt: string
  dayNumber?: number
  model: string
  academyId: string
  originalFilename: string
}

interface BulkImport {
  agentId: string
  works: BulkWork[]
}

async function importAbrahamWorks() {
  console.log('📦 Importing Abraham works to Registry database...')
  
  const migrationsDir = path.join(process.cwd(), 'data', 'migrations')
  
  // Find latest Abraham bulk import file
  const files = await fs.readdir(migrationsDir)
  const abrahamBulkFiles = files
    .filter(f => f.startsWith('abraham-bulk-import-') && f.endsWith('.json'))
    .sort()
  
  const latestBulkFile = abrahamBulkFiles[abrahamBulkFiles.length - 1]
  
  if (!latestBulkFile) {
    console.log('❌ No Abraham bulk import files found')
    return
  }
  
  console.log(`📥 Reading bulk import file: ${latestBulkFile}`)
  const bulkData = JSON.parse(
    await fs.readFile(path.join(migrationsDir, latestBulkFile), 'utf-8')
  ) as BulkImport
  
  console.log(`📊 Found ${bulkData.works.length} works to import for agent: ${bulkData.agentId}`)
  
  const API_BASE = 'http://localhost:3005'
  const API_KEY = process.env.REGISTRY_API_KEY || 'registry-upload-key-v1'
  
  let imported = 0
  let skipped = 0
  let errors = 0
  
  for (const [index, work] of bulkData.works.entries()) {
    try {
      const workPayload = {
        media_type: 'image',
        metadata: {
          title: work.title,
          description: work.prompt,
          creation_url: work.fileUrl,
          source: 'eden.academy',
          dayNumber: work.dayNumber,
          model: work.model,
          academyId: work.academyId,
          originalFilename: work.originalFilename
        },
        urls: {
          full: work.fileUrl,
          preview: work.fileUrl,
          thumbnail: work.fileUrl
        },
        status: 'PUBLISHED'
      }
      
      const response = await fetch(`${API_BASE}/api/v1/agents/abraham/works`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'Idempotency-Key': `academy-${work.academyId}`
        },
        body: JSON.stringify({ work: workPayload })
      })
      
      if (response.ok) {
        const result = await response.json()
        imported++
        if ((index + 1) % 50 === 0) {
          console.log(`   ✅ Imported ${index + 1}/${bulkData.works.length} works`)
        }
      } else {
        const error = await response.text()
        if (response.status === 409 || error.includes('idempotent')) {
          skipped++
        } else {
          console.log(`   ❌ Failed to import work ${work.academyId}: ${response.status} - ${error}`)
          errors++
        }
      }
    } catch (error) {
      console.log(`   ❌ Error importing work ${work.academyId}:`, error)
      errors++
    }
    
    // Small delay to avoid overwhelming the API
    if (index % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  
  console.log(`\n📊 Abraham Import Summary:`)
  console.log(`   ✅ Imported: ${imported}`)
  console.log(`   ⏭️  Skipped (already exists): ${skipped}`)
  console.log(`   ❌ Errors: ${errors}`)
  console.log(`   📦 Total processed: ${imported + skipped + errors}`)
  
  console.log('\n✅ Abraham bulk import complete!')
}

importAbrahamWorks().catch(console.error)