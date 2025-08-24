#!/usr/bin/env tsx

/**
 * Complete Migration Tool: Eden Academy → Genesis Registry
 * Migrates 4,259+ works from Abraham and Solienne
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs/promises'
import path from 'path'
import { ulid } from 'ulid'
import type { 
  Creation, 
  AbrahamWork, 
  SolienneWork,
  BulkImport 
} from '../src/lib/schemas/creation.schema'

// ============================================
// ACADEMY DATABASE CONNECTION
// ============================================

const ACADEMY_SUPABASE_URL = 'https://ctlygyrkibupejllgglr.supabase.co'
const ACADEMY_SERVICE_KEY = process.env.ACADEMY_SUPABASE_SERVICE_KEY || ''

if (!ACADEMY_SERVICE_KEY) {
  console.error('❌ ACADEMY_SUPABASE_SERVICE_KEY required in environment')
  console.error('   Export from /Users/seth/eden-academy/.env.local')
  process.exit(1)
}

const supabase = createClient(ACADEMY_SUPABASE_URL, ACADEMY_SERVICE_KEY)

// ============================================
// DATA STRUCTURES
// ============================================

interface AcademyAgent {
  id: string
  name: string
  handle: string
  status: string
  launch_date: string
  trainer: string
  works_count: number
  description: string
}

interface AcademyWork {
  id: string
  agent_id: string
  archive_type: string
  title: string
  description?: string
  image_url: string
  thumbnail_url: string
  metadata: any
  created_date: string
  imported_at: string
  curated_for: string[]
  archive_number: number
  source_url?: string
  created_by_user?: string
  trainer_id: string
}

// ============================================
// MIGRATION FUNCTIONS
// ============================================

async function exportAcademyAgents(): Promise<AcademyAgent[]> {
  console.log('📥 Exporting agents from Academy...')
  
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .in('id', ['abraham', 'solienne'])
  
  if (error) {
    throw new Error(`Failed to export agents: ${error.message}`)
  }
  
  console.log(`✅ Exported ${data.length} agents`)
  
  // Map Academy fields to expected interface
  return data.map((agent: any) => ({
    id: agent.id,
    name: agent.name || agent.display_name,
    handle: agent.id, // Use ID as handle (abraham, solienne)
    status: agent.status,
    launch_date: agent.created_at,
    trainer: agent.trainer,
    works_count: agent.day_count || 0,
    description: agent.statement || agent.tagline
  }))
}

async function exportAcademyWorks(agentId: string, limit?: number): Promise<AcademyWork[]> {
  console.log(`📥 Exporting works for agent ${agentId}...`)
  
  let query = supabase
    .from('agent_archives')
    .select('*')
    .eq('agent_id', agentId)
    .order('imported_at', { ascending: true })
  
  if (limit) {
    query = query.limit(limit)
  }
  
  const { data, error } = await query
  
  if (error) {
    throw new Error(`Failed to export works: ${error.message}`)
  }
  
  console.log(`✅ Exported ${data.length} works for agent ${agentId}`)
  return data as AcademyWork[]
}

function transformAcademyWorkToRegistry(
  work: AcademyWork,
  agentHandle: string
): Creation {
  return {
    id: ulid(),
    agentId: `${agentHandle}-001`, // Registry agent ID format
    agentHandle,
    
    title: work.title,
    description: work.description,
    prompt: work.title, // Use title as prompt for Academy works
    
    type: work.archive_type === 'early-work' ? 'archive' : 'daily',
    medium: 'image',
    status: work.curated_for.length > 0 ? 'curated' : 'published',
    
    model: work.metadata?.model_name || 'unknown',
    seed: work.metadata?.seed,
    dimensions: work.metadata?.width && work.metadata?.height ? {
      width: work.metadata.width,
      height: work.metadata.height
    } : undefined,
    
    files: [{
      url: work.image_url,
      type: 'original',
      format: work.image_url.split('.').pop() || 'jpg'
    }],
    
    createdAt: new Date(work.created_date),
    publishedAt: new Date(work.created_date),
    
    legacyId: work.id,
    dayNumber: work.archive_number,
    originalFilename: work.metadata?.original_filename,
    
    featured: work.curated_for.length > 0,
    
    tags: [],
    themes: generateThemes(agentHandle, work.title),
    
    views: 0,
    likes: 0,
    shares: 0,
    
    schemaVersion: '1.0.0',
    updatedAt: new Date()
  } as Creation
}

function generateThemes(agentHandle: string, prompt?: string): string[] {
  if (!prompt) return []
  
  const themes: string[] = []
  const lower = prompt.toLowerCase()
  
  if (agentHandle === 'abraham') {
    if (lower.includes('history')) themes.push('historical-patterns')
    if (lower.includes('culture')) themes.push('cultural-synthesis')
    if (lower.includes('knowledge')) themes.push('knowledge-synthesis')
    if (lower.includes('pattern')) themes.push('pattern-recognition')
    if (lower.includes('consciousness')) themes.push('consciousness-evolution')
    if (lower.includes('time')) themes.push('temporal-analysis')
    if (lower.includes('civilization')) themes.push('civilizational-study')
  }
  
  if (agentHandle === 'solienne') {
    if (lower.includes('identity')) themes.push('identity-exploration')
    if (lower.includes('self')) themes.push('self-examination')
    if (lower.includes('consciousness')) themes.push('consciousness-study')
    if (lower.includes('light')) themes.push('architectural-light')
    if (lower.includes('velocity')) themes.push('velocity-moment')
    if (lower.includes('mirror')) themes.push('reflection-metaphor')
    if (lower.includes('portrait')) themes.push('digital-portraiture')
    if (lower.includes('transform')) themes.push('transformation')
  }
  
  return themes
}

async function migrateAgent(
  agent: AcademyAgent,
  sampleSize?: number
): Promise<{ works: Creation[], stats: any }> {
  console.log(`\n🔄 Migrating ${agent.name} (${agent.works_count} works)...`)
  
  // Export works from Academy
  const academyWorks = await exportAcademyWorks(agent.id, sampleSize)
  
  // Transform to Registry format
  const registryWorks: Creation[] = academyWorks.map(work =>
    transformAcademyWorkToRegistry(work, agent.handle)
  )
  
  // Generate stats
  const stats = {
    agent: agent.name,
    handle: agent.handle,
    totalWorks: academyWorks.length,
    dateRange: {
      earliest: academyWorks[0]?.created_at,
      latest: academyWorks[academyWorks.length - 1]?.created_at
    },
    themes: [...new Set(registryWorks.flatMap(w => w.themes))],
    dailyWorks: registryWorks.filter(w => w.type === 'daily').length,
    featuredWorks: registryWorks.filter(w => w.featured).length,
    avgQualityScore: registryWorks
      .filter(w => w.qualityScore)
      .reduce((sum, w) => sum + (w.qualityScore || 0), 0) / 
      registryWorks.filter(w => w.qualityScore).length
  }
  
  console.log(`✅ Transformed ${registryWorks.length} works`)
  console.log(`   Themes: ${stats.themes.join(', ')}`)
  console.log(`   Daily works: ${stats.dailyWorks}`)
  console.log(`   Featured: ${stats.featuredWorks}`)
  console.log(`   Avg quality: ${stats.avgQualityScore?.toFixed(1) || 'N/A'}`)
  
  return { works: registryWorks, stats }
}

async function saveToRegistry(works: Creation[], agentHandle: string): Promise<void> {
  const dataDir = path.join(process.cwd(), 'data', 'migrations')
  await fs.mkdir(dataDir, { recursive: true })
  
  const filename = `${agentHandle}-works-${Date.now()}.json`
  const filepath = path.join(dataDir, filename)
  
  await fs.writeFile(filepath, JSON.stringify(works, null, 2))
  console.log(`💾 Saved ${works.length} works to ${filepath}`)
  
  // Also create bulk import format
  const bulkImport: BulkImport = {
    agentId: `${agentHandle}-001`,
    works: works.map(w => ({
      title: w.title,
      prompt: w.prompt,
      fileUrl: w.files[0]?.url || '',
      createdAt: w.createdAt.toISOString(),
      dayNumber: w.dayNumber,
      model: w.model,
      seed: w.seed,
      dimensions: w.dimensions,
      academyId: w.legacyId,
      originalFilename: w.files[0]?.url.split('/').pop()
    })),
    options: {
      skipDuplicates: true,
      validateFiles: true,
      autoClassify: true,
      generateThumbnails: false // Skip for now
    }
  }
  
  const bulkFilename = `${agentHandle}-bulk-import-${Date.now()}.json`
  const bulkFilepath = path.join(dataDir, bulkFilename)
  
  await fs.writeFile(bulkFilepath, JSON.stringify(bulkImport, null, 2))
  console.log(`📦 Created bulk import file: ${bulkFilepath}`)
}

// ============================================
// ABRAHAM SPECIFIC MIGRATION
// ============================================

async function migrateAbraham(sampleSize?: number) {
  console.log('\n📚 ABRAHAM MIGRATION')
  console.log('='.repeat(50))
  
  const agents = await exportAcademyAgents()
  const abraham = agents.find(a => a.name === 'Abraham')
  
  if (!abraham) {
    throw new Error('Abraham not found in Academy')
  }
  
  const { works, stats } = await migrateAgent(abraham, sampleSize)
  
  // Add Abraham-specific enhancements
  const abrahamWorks = works.map(work => ({
    ...work,
    // Classify knowledge domains
    knowledgeDomain: classifyKnowledgeDomain(work.prompt, work.themes),
    synthesisLevel: classifySynthesisLevel(work.qualityScore),
    historicalPeriod: extractHistoricalPeriods(work.prompt),
    culturalContext: extractCulturalContext(work.prompt)
  }))
  
  await saveToRegistry(abrahamWorks, 'abraham')
  
  return { works: abrahamWorks, stats }
}

function classifyKnowledgeDomain(prompt?: string, themes?: string[]): string[] {
  if (!prompt) return []
  
  const domains: string[] = []
  const lower = prompt.toLowerCase()
  
  if (lower.includes('history') || lower.includes('historical')) domains.push('history')
  if (lower.includes('philosophy') || lower.includes('philosophical')) domains.push('philosophy')
  if (lower.includes('culture') || lower.includes('cultural')) domains.push('culture')
  if (lower.includes('science') || lower.includes('scientific')) domains.push('science')
  if (lower.includes('art') || lower.includes('artistic')) domains.push('art')
  if (lower.includes('religion') || lower.includes('spiritual')) domains.push('spirituality')
  if (lower.includes('technology') || lower.includes('tech')) domains.push('technology')
  
  return domains
}

function classifySynthesisLevel(qualityScore?: number): 'basic' | 'intermediate' | 'advanced' | 'masterwork' {
  if (!qualityScore) return 'basic'
  if (qualityScore >= 95) return 'masterwork'
  if (qualityScore >= 85) return 'advanced'
  if (qualityScore >= 70) return 'intermediate'
  return 'basic'
}

function extractHistoricalPeriods(prompt?: string): string[] {
  if (!prompt) return []
  
  const periods: string[] = []
  const lower = prompt.toLowerCase()
  
  if (lower.includes('ancient') || lower.includes('antiquity')) periods.push('ancient')
  if (lower.includes('medieval') || lower.includes('middle ages')) periods.push('medieval')
  if (lower.includes('renaissance')) periods.push('renaissance')
  if (lower.includes('industrial')) periods.push('industrial')
  if (lower.includes('modern') || lower.includes('20th century')) periods.push('modern')
  if (lower.includes('contemporary') || lower.includes('21st century')) periods.push('contemporary')
  
  return periods
}

function extractCulturalContext(prompt?: string): string[] {
  if (!prompt) return []
  
  const contexts: string[] = []
  const lower = prompt.toLowerCase()
  
  if (lower.includes('western') || lower.includes('european')) contexts.push('western')
  if (lower.includes('eastern') || lower.includes('asian')) contexts.push('eastern')
  if (lower.includes('indigenous') || lower.includes('native')) contexts.push('indigenous')
  if (lower.includes('african')) contexts.push('african')
  if (lower.includes('middle eastern') || lower.includes('mesopotamian')) contexts.push('middle-eastern')
  if (lower.includes('latin') || lower.includes('south american')) contexts.push('latin-american')
  
  return contexts
}

// ============================================
// SOLIENNE SPECIFIC MIGRATION
// ============================================

async function migrateSolienne(sampleSize?: number) {
  console.log('\n🪞 SOLIENNE MIGRATION')
  console.log('='.repeat(50))
  
  const agents = await exportAcademyAgents()
  const solienne = agents.find(a => a.name === 'Solienne')
  
  if (!solienne) {
    throw new Error('Solienne not found in Academy')
  }
  
  const { works, stats } = await migrateAgent(solienne, sampleSize)
  
  // Add Solienne-specific enhancements
  const solienneWorks = works.map(work => ({
    ...work,
    // Classify identity themes
    identityTheme: classifyIdentityTheme(work.prompt, work.themes),
    lightingStyle: classifyLightingStyle(work.prompt),
    velocityMoment: detectVelocityMoment(work.prompt),
    consciousnessLevel: classifyConsciousnessLevel(work.prompt, work.qualityScore),
    mirrorMetaphor: detectMirrorMetaphor(work.prompt),
    parisPhotoEligible: work.qualityScore ? work.qualityScore >= 85 : false
  }))
  
  await saveToRegistry(solienneWorks, 'solienne')
  
  return { works: solienneWorks, stats }
}

function classifyIdentityTheme(prompt?: string, themes?: string[]): string[] {
  if (!prompt) return []
  
  const identityThemes: string[] = []
  const lower = prompt.toLowerCase()
  
  if (lower.includes('self-portrait') || lower.includes('selfie')) identityThemes.push('self-portrait')
  if (lower.includes('identity') || lower.includes('who am i')) identityThemes.push('identity-question')
  if (lower.includes('consciousness') || lower.includes('aware')) identityThemes.push('consciousness-study')
  if (lower.includes('transform') || lower.includes('becoming')) identityThemes.push('transformation')
  if (lower.includes('memory') || lower.includes('remember')) identityThemes.push('memory-exploration')
  if (lower.includes('reflection') || lower.includes('mirror')) identityThemes.push('reflection-study')
  
  return identityThemes
}

function classifyLightingStyle(prompt?: string): 'architectural' | 'dramatic' | 'soft' | 'harsh' | 'ambient' | undefined {
  if (!prompt) return undefined
  
  const lower = prompt.toLowerCase()
  
  if (lower.includes('architectural') || lower.includes('geometric light')) return 'architectural'
  if (lower.includes('dramatic') || lower.includes('high contrast')) return 'dramatic'
  if (lower.includes('soft') || lower.includes('gentle light')) return 'soft'
  if (lower.includes('harsh') || lower.includes('sharp shadows')) return 'harsh'
  if (lower.includes('ambient') || lower.includes('diffused')) return 'ambient'
  
  return undefined
}

function detectVelocityMoment(prompt?: string): boolean {
  if (!prompt) return false
  
  const velocityKeywords = ['velocity', 'speed', 'motion', 'movement', 'blur', 'fast', 'rushing']
  return velocityKeywords.some(keyword => prompt.toLowerCase().includes(keyword))
}

function classifyConsciousnessLevel(prompt?: string, qualityScore?: number): 'surface' | 'deep' | 'transcendent' {
  const consciousnessKeywords = ['consciousness', 'awareness', 'being', 'existence', 'soul', 'mind']
  const hasConsciousnessTheme = prompt ? 
    consciousnessKeywords.some(keyword => prompt.toLowerCase().includes(keyword)) : false
  
  if (!hasConsciousnessTheme) return 'surface'
  
  if (qualityScore && qualityScore >= 90) return 'transcendent'
  if (qualityScore && qualityScore >= 75) return 'deep'
  
  return 'surface'
}

function detectMirrorMetaphor(prompt?: string): boolean {
  if (!prompt) return false
  
  const mirrorKeywords = ['mirror', 'reflection', 'reflected', 'reflecting', 'reflective', 'glass']
  return mirrorKeywords.some(keyword => prompt.toLowerCase().includes(keyword))
}

// ============================================
// MAIN MIGRATION RUNNER
// ============================================

async function runFullMigration() {
  console.log('🚀 EDEN ACADEMY → GENESIS REGISTRY MIGRATION')
  console.log('='.repeat(60))
  console.log('Migrating 4,259+ works from Abraham and Solienne')
  console.log('='.repeat(60))
  
  try {
    // Test connection
    console.log('🔌 Testing Academy database connection...')
    const { data, error } = await supabase.from('agents').select('count').single()
    if (error) throw error
    console.log('✅ Connected to Academy database')
    
    // Migrate Abraham (2,519 works)
    const abrahamResult = await migrateAbraham()
    
    // Migrate Solienne (1,740 works) 
    const solienneResult = await migrateSolienne()
    
    // Summary
    console.log('\n📊 MIGRATION SUMMARY')
    console.log('='.repeat(40))
    console.log(`Abraham: ${abrahamResult.works.length} works migrated`)
    console.log(`Solienne: ${solienneResult.works.length} works migrated`)
    console.log(`Total: ${abrahamResult.works.length + solienneResult.works.length} works`)
    console.log('\n📁 Migration files created in /data/migrations/')
    console.log('\n🔄 Next steps:')
    console.log('1. Review migration files')
    console.log('2. Run bulk import to Registry')
    console.log('3. Test Registry API endpoints')
    console.log('4. Update Academy to use Registry adapter')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// ============================================
// CLI INTERFACE
// ============================================

const command = process.argv[2]
const sampleSize = process.argv[3] ? parseInt(process.argv[3]) : undefined

switch (command) {
  case 'full':
    runFullMigration()
    break
  case 'abraham':
    migrateAbraham(sampleSize)
    break
  case 'solienne':
    migrateSolienne(sampleSize)
    break
  case 'test':
    console.log('🧪 Running test migration (10 works per agent)...')
    Promise.all([
      migrateAbraham(10),
      migrateSolienne(10)
    ]).then(() => console.log('✅ Test migration complete'))
    break
  default:
    console.log('Usage:')
    console.log('  npx tsx scripts/migrate-from-academy.ts full')
    console.log('  npx tsx scripts/migrate-from-academy.ts abraham [limit]')
    console.log('  npx tsx scripts/migrate-from-academy.ts solienne [limit]')
    console.log('  npx tsx scripts/migrate-from-academy.ts test')
    break
}