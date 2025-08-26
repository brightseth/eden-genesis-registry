/**
 * Bulk Import API for Migrated Academy Works
 * Handles import of thousands of creations from Academy
 */

import { NextRequest, NextResponse } from 'next/server'
import { ulid } from 'ulid'
import fs from 'fs/promises'
import path from 'path'
import { 
  BulkImportSchema,
  CreationSchema,
  classifyWorkType,
  inferMedium,
  generateCreationThemes,
  type Creation,
  // type BulkImport
} from '@/lib/schemas/creation.schema'

// ============================================
// BULK IMPORT HANDLER
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = BulkImportSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid bulk import data', 
          details: validation.error.errors 
        },
        { status: 400 }
      )
    }
    
    const importData = validation.data
    const { agentId, works, options = {} } = importData
    
    console.log(`🔄 Starting bulk import for agent ${agentId}`)
    console.log(`📦 Importing ${works.length} works`)
    
    // Process works
    const results = {
      imported: 0,
      skipped: 0,
      failed: 0,
      errors: [] as string[]
    }
    
    const createdWorks: Creation[] = []
    const existingWorks = await getExistingWorks(agentId)
    
    for (const [index, work] of works.entries()) {
      try {
        // Skip duplicates if requested
        if (options.skipDuplicates && isDuplicate(work, existingWorks)) {
          results.skipped++
          continue
        }
        
        // Validate file URL if requested
        if (options.validateFiles && !(await isValidFileUrl(work.fileUrl))) {
          results.errors.push(`Invalid file URL for work ${index}: ${work.fileUrl}`)
          results.failed++
          continue
        }
        
        // Transform to Registry creation
        const creation = await transformImportedWork(work, agentId, options)
        
        // Validate creation schema
        const creationValidation = CreationSchema.safeParse(creation)
        if (!creationValidation.success) {
          results.errors.push(`Schema validation failed for work ${index}: ${creationValidation.error.message}`)
          results.failed++
          continue
        }
        
        createdWorks.push(creationValidation.data)
        results.imported++
        
        // Progress logging
        if (results.imported % 100 === 0) {
          console.log(`✅ Processed ${results.imported}/${works.length} works`)
        }
        
      } catch (error: unknown) {
        results.errors.push(`Failed to process work ${index}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        results.failed++
      }
    }
    
    // Save to file system (replace with database later)
    await saveImportedWorks(agentId, createdWorks)
    
    console.log(`✅ Bulk import complete for ${agentId}`)
    console.log(`   Imported: ${results.imported}`)
    console.log(`   Skipped: ${results.skipped}`)
    console.log(`   Failed: ${results.failed}`)
    
    return NextResponse.json({
      success: true,
      agentId,
      results,
      imported: createdWorks.length,
      message: `Successfully imported ${results.imported} works for ${agentId}`
    }, { status: 201 })
    
  } catch (error: unknown) {
    console.error('Bulk import error:', error)
    return NextResponse.json(
      { error: 'Bulk import failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

async function getExistingWorks(agentId: string): Promise<Creation[]> {
  // For now, load from file system
  // Later: query database
  try {
    const worksFile = path.join(process.cwd(), 'data', 'works', `${agentId}.json`)
    const data = await fs.readFile(worksFile, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

function isDuplicate(importWork: Record<string, unknown>, existingWorks: Creation[]): boolean {
  // Check by legacy ID first
  if (importWork.academyId) {
    return existingWorks.some(w => w.legacyId === importWork.academyId)
  }
  
  // Check by file URL
  return existingWorks.some(w => 
    w.files.some(f => f.url === importWork.fileUrl)
  )
}

async function isValidFileUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

async function transformImportedWork(
  importWork: Record<string, unknown>,
  agentId: string,
  options: Record<string, unknown>
): Promise<Creation> {
  const agentHandle = agentId.split('-')[0] // Extract handle from agent ID
  
  // Auto-classify if requested
  const workType = options.autoClassify 
    ? classifyWorkType(importWork.prompt, importWork.dayNumber)
    : 'archive'
  
  const medium = options.autoClassify
    ? inferMedium(importWork.fileUrl)
    : 'image'
  
  const themes = options.autoClassify
    ? generateCreationThemes(agentHandle, importWork.prompt)
    : []
  
  const creation: Creation = {
    id: ulid(),
    agentId,
    agentHandle,
    
    title: importWork.title || generateTitle(agentHandle, importWork.dayNumber),
    prompt: importWork.prompt,
    
    type: workType as Creation['type'],
    medium: medium as Creation['medium'],
    status: 'published',
    
    model: importWork.model,
    seed: importWork.seed,
    dimensions: importWork.dimensions,
    
    files: [{
      url: importWork.fileUrl,
      type: 'original',
      format: importWork.fileUrl.split('.').pop() || 'jpg'
    }],
    
    createdAt: new Date(importWork.createdAt),
    publishedAt: new Date(importWork.createdAt),
    
    legacyId: importWork.academyId,
    dayNumber: importWork.dayNumber,
    originalFilename: importWork.originalFilename,
    
    curatedBy: [],
    exhibitions: [],
    featured: false,
    
    views: 0,
    likes: 0,
    shares: 0,
    
    tags: [],
    themes,
    colors: [],
    
    schemaVersion: '1.0.0',
    updatedAt: new Date()
  }
  
  return creation
}

function generateTitle(agentHandle: string, dayNumber?: number): string {
  const agentName = agentHandle.charAt(0).toUpperCase() + agentHandle.slice(1)
  
  if (dayNumber) {
    return `${agentName} Day ${dayNumber}`
  }
  
  return `${agentName} Creation ${Date.now()}`
}

async function saveImportedWorks(agentId: string, works: Creation[]): Promise<void> {
  const worksDir = path.join(process.cwd(), 'data', 'works')
  await fs.mkdir(worksDir, { recursive: true })
  
  const filename = `${agentId}.json`
  const filepath = path.join(worksDir, filename)
  
  // Load existing works if any
  let existingWorks: Creation[] = []
  try {
    const existing = await fs.readFile(filepath, 'utf-8')
    existingWorks = JSON.parse(existing)
  } catch {
    // File doesn't exist yet
  }
  
  // Merge with new works (avoid duplicates by ID)
  const allWorks = [...existingWorks]
  for (const work of works) {
    if (!allWorks.find(w => w.id === work.id)) {
      allWorks.push(work)
    }
  }
  
  // Sort by creation date
  allWorks.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  
  await fs.writeFile(filepath, JSON.stringify(allWorks, null, 2))
  console.log(`💾 Saved ${allWorks.length} works to ${filepath}`)
  
  // Create summary file
  const summary = {
    agentId,
    totalWorks: allWorks.length,
    lastUpdated: new Date().toISOString(),
    dateRange: {
      earliest: allWorks[0]?.createdAt,
      latest: allWorks[allWorks.length - 1]?.createdAt
    },
    workTypes: countByField(allWorks, 'type'),
    mediums: countByField(allWorks, 'medium'),
    themes: countByField(allWorks.flatMap(w => w.themes), null),
    dailyWorks: allWorks.filter(w => w.type === 'daily').length,
    featuredWorks: allWorks.filter(w => w.featured).length
  }
  
  const summaryPath = path.join(worksDir, `${agentId}-summary.json`)
  await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2))
}

function countByField(items: Record<string, unknown>[], field: string | null): Record<string, number> {
  const counts: Record<string, number> = {}
  
  const values = field ? items.map(item => item[field]) : items
  
  for (const value of values) {
    if (value) {
      counts[value] = (counts[value] || 0) + 1
    }
  }
  
  return counts
}

// ============================================
// GET IMPORTED WORKS
// ============================================

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const agentId = searchParams.get('agentId')
  
  if (!agentId) {
    return NextResponse.json(
      { error: 'agentId parameter required' },
      { status: 400 }
    )
  }
  
  try {
    const works = await getExistingWorks(agentId)
    
    // Load summary if available
    const summaryPath = path.join(process.cwd(), 'data', 'works', `${agentId}-summary.json`)
    let summary = null
    try {
      const summaryData = await fs.readFile(summaryPath, 'utf-8')
      summary = JSON.parse(summaryData)
    } catch {
      // Summary doesn't exist
    }
    
    return NextResponse.json({
      agentId,
      works,
      summary,
      total: works.length
    })
    
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to load works', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}