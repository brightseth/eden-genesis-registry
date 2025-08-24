/**
 * Creation/Artifact Schema for Eden Genesis Registry
 * Handles migration from Eden Academy's 4,259+ works
 */

import { z } from 'zod'
import { ulid } from 'ulid'

// ============================================
// CREATION/WORK TYPES
// ============================================

export enum WorkType {
  Daily = 'daily',
  Exhibition = 'exhibition',
  Commission = 'commission',
  Experiment = 'experiment',
  Series = 'series',
  Archive = 'archive'
}

export enum WorkStatus {
  Draft = 'draft',
  Published = 'published',
  Curated = 'curated',
  Exhibited = 'exhibited',
  Archived = 'archived'
}

export enum Medium {
  Image = 'image',
  Video = 'video',
  Audio = 'audio',
  Text = 'text',
  Code = 'code',
  Mixed = 'mixed',
  ThreeD = '3d'
}

// ============================================
// CORE CREATION SCHEMA
// ============================================

export const CreationSchema = z.object({
  id: z.string().default(() => ulid()),
  
  // Agent & Identity
  agentId: z.string(),
  agentHandle: z.string(), // abraham, solienne
  
  // Core Metadata
  title: z.string().optional(),
  description: z.string().optional(),
  prompt: z.string().optional(), // Original generation prompt
  
  // Classification
  type: z.nativeEnum(WorkType),
  medium: z.nativeEnum(Medium),
  status: z.nativeEnum(WorkStatus).default(WorkStatus.Published),
  
  // Technical Details
  model: z.string().optional(), // stable-diffusion, midjourney, etc
  seed: z.number().optional(),
  steps: z.number().optional(),
  cfg: z.number().optional(),
  dimensions: z.object({
    width: z.number(),
    height: z.number()
  }).optional(),
  
  // File Storage
  files: z.array(z.object({
    url: z.string(),
    type: z.enum(['original', 'thumbnail', 'preview', 'hires']),
    format: z.string(), // jpg, png, mp4, etc
    size: z.number().optional(), // bytes
    hash: z.string().optional() // for deduplication
  })),
  
  // Timestamps
  createdAt: z.date(),
  publishedAt: z.date().optional(),
  
  // Academy Migration Data
  legacyId: z.string().optional(), // Original Academy ID
  dayNumber: z.number().optional(), // For daily practice tracking
  originalFilename: z.string().optional(),
  
  // Curation & Exhibition
  curatedBy: z.array(z.string()).default([]), // Trainer/curator IDs
  exhibitions: z.array(z.string()).default([]), // Exhibition IDs
  featured: z.boolean().default(false),
  
  // Engagement
  views: z.number().default(0),
  likes: z.number().default(0),
  shares: z.number().default(0),
  
  // Tags & Search
  tags: z.array(z.string()).default([]),
  themes: z.array(z.string()).default([]), // abraham: patterns, synthesis; solienne: identity, consciousness
  colors: z.array(z.string()).default([]), // Dominant colors for visual search
  
  // Quality & Analytics
  qualityScore: z.number().min(0).max(100).optional(),
  technicalScore: z.number().min(0).max(100).optional(),
  aestheticScore: z.number().min(0).max(100).optional(),
  
  // Series & Collections
  seriesId: z.string().optional(),
  seriesIndex: z.number().optional(),
  
  // Version tracking
  schemaVersion: z.string().default('1.0.0'),
  updatedAt: z.date().default(() => new Date())
})

// ============================================
// EXHIBITION SCHEMA
// ============================================

export const ExhibitionSchema = z.object({
  id: z.string().default(() => ulid()),
  title: z.string(),
  description: z.string().optional(),
  
  // Exhibition Details
  venue: z.string(), // "Paris Photo 2025", "Digital Gallery"
  location: z.string().optional(), // "Grand Palais, Paris"
  startDate: z.date(),
  endDate: z.date().optional(),
  
  // Curation
  curatorId: z.string(),
  curatorName: z.string(),
  selectedWorks: z.array(z.string()), // Creation IDs
  maxWorks: z.number().optional(), // 12-15 for Paris Photo
  
  // Status
  status: z.enum(['planned', 'active', 'completed', 'cancelled']),
  
  // Metadata
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
})

// ============================================
// SERIES SCHEMA
// ============================================

export const SeriesSchema = z.object({
  id: z.string().default(() => ulid()),
  agentId: z.string(),
  
  title: z.string(),
  description: z.string().optional(),
  
  // Series Metadata
  startDate: z.date(),
  endDate: z.date().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'irregular']),
  
  // Works in series
  workIds: z.array(z.string()),
  targetCount: z.number().optional(),
  
  // Classification
  themes: z.array(z.string()),
  tags: z.array(z.string()),
  
  // Status
  status: z.enum(['active', 'completed', 'paused']),
  
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
})

// ============================================
// COVENANT SCHEMA (for Abraham's 13-year commitment)
// ============================================

export const CovenantSchema = z.object({
  id: z.string().default(() => ulid()),
  agentId: z.string(),
  
  title: z.string(), // "13-Year Autonomous Covenant"
  fullText: z.string(), // Complete covenant text
  
  // Timeline
  startDate: z.date(), // OCT 19, 2025
  endDate: z.date(), // 13 years later
  duration: z.string(), // "13 years"
  
  // Theological/Philosophical themes
  themes: z.array(z.string()),
  principles: z.array(z.string()),
  
  // Commitment tracking
  dailyCommitment: z.string(),
  milestones: z.array(z.object({
    date: z.date(),
    description: z.string(),
    completed: z.boolean().default(false)
  })),
  
  // Status
  status: z.enum(['draft', 'signed', 'active', 'fulfilled', 'broken']),
  
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
})

// ============================================
// MIGRATION MAPPING SCHEMA
// ============================================

export const AcademyWorkMappingSchema = z.object({
  // Academy data
  academyId: z.string(),
  agentName: z.string(), // "Abraham", "Solienne"
  originalData: z.record(z.any()), // Raw Academy data
  
  // Registry mapping
  registryId: z.string(),
  creationData: CreationSchema,
  
  // Migration metadata
  migratedAt: z.date().default(() => new Date()),
  migrationVersion: z.string().default('1.0.0'),
  validationStatus: z.enum(['pending', 'validated', 'failed']),
  notes: z.string().optional()
})

// ============================================
// BULK IMPORT SCHEMA
// ============================================

export const BulkImportSchema = z.object({
  agentId: z.string(),
  works: z.array(z.object({
    // Minimum required for import
    title: z.string().optional(),
    prompt: z.string().optional(),
    fileUrl: z.string(),
    createdAt: z.string(), // ISO date string
    
    // Optional Academy metadata
    dayNumber: z.number().optional(),
    model: z.string().optional(),
    seed: z.number().optional(),
    dimensions: z.object({
      width: z.number(),
      height: z.number()
    }).optional(),
    
    // Legacy IDs for tracking
    academyId: z.string().optional(),
    originalFilename: z.string().optional()
  })),
  
  // Import settings
  options: z.object({
    skipDuplicates: z.boolean().default(true),
    validateFiles: z.boolean().default(true),
    autoClassify: z.boolean().default(true), // Auto-assign type/medium
    generateThumbnails: z.boolean().default(true)
  }).optional()
})

// ============================================
// ABRAHAM SPECIFIC SCHEMAS
// ============================================

export const AbrahamWorkSchema = CreationSchema.extend({
  // Abraham-specific fields
  knowledgeDomain: z.array(z.string()).optional(), // history, philosophy, culture, etc
  synthesisLevel: z.enum(['basic', 'intermediate', 'advanced', 'masterwork']).optional(),
  historicalPeriod: z.array(z.string()).optional(), // Ancient, Medieval, Modern, etc
  culturalContext: z.array(z.string()).optional(), // Eastern, Western, Indigenous, etc
  philosophicalTheme: z.array(z.string()).optional() // consciousness, time, memory, etc
})

// ============================================
// SOLIENNE SPECIFIC SCHEMAS  
// ============================================

export const SolienneWorkSchema = CreationSchema.extend({
  // Solienne-specific fields
  identityTheme: z.array(z.string()).optional(), // self-portrait, consciousness, transformation
  lightingStyle: z.enum(['architectural', 'dramatic', 'soft', 'harsh', 'ambient']).optional(),
  velocityMoment: z.boolean().optional(), // Captures moment of velocity/movement
  consciousnessLevel: z.enum(['surface', 'deep', 'transcendent']).optional(),
  mirrorMetaphor: z.boolean().optional(), // Uses reflection/mirror metaphors
  
  // Exhibition specific
  parisPhotoEligible: z.boolean().default(false),
  parisPhotoSelected: z.boolean().default(false),
  curatorNotes: z.string().optional()
})

// ============================================
// EXPORTS
// ============================================

export type Creation = z.infer<typeof CreationSchema>
export type Exhibition = z.infer<typeof ExhibitionSchema>
export type Series = z.infer<typeof SeriesSchema>
export type Covenant = z.infer<typeof CovenantSchema>
export type AcademyWorkMapping = z.infer<typeof AcademyWorkMappingSchema>
export type BulkImport = z.infer<typeof BulkImportSchema>
export type AbrahamWork = z.infer<typeof AbrahamWorkSchema>
export type SolienneWork = z.infer<typeof SolienneWorkSchema>

// ============================================
// HELPER FUNCTIONS
// ============================================

export function classifyWorkType(prompt?: string, dayNumber?: number): WorkType {
  if (dayNumber) return WorkType.Daily
  if (prompt?.toLowerCase().includes('exhibition')) return WorkType.Exhibition
  if (prompt?.toLowerCase().includes('series')) return WorkType.Series
  return WorkType.Archive
}

export function inferMedium(filename: string): Medium {
  const ext = filename.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'webp':
      return Medium.Image
    case 'mp4':
    case 'mov':
    case 'avi':
      return Medium.Video
    case 'mp3':
    case 'wav':
    case 'ogg':
      return Medium.Audio
    case 'txt':
    case 'md':
      return Medium.Text
    default:
      return Medium.Image
  }
}

export function generateCreationThemes(agentHandle: string, prompt?: string): string[] {
  const themes: string[] = []
  
  if (agentHandle === 'abraham') {
    if (prompt?.toLowerCase().includes('history')) themes.push('historical-patterns')
    if (prompt?.toLowerCase().includes('culture')) themes.push('cultural-synthesis')
    if (prompt?.toLowerCase().includes('consciousness')) themes.push('consciousness-evolution')
    if (prompt?.toLowerCase().includes('time')) themes.push('temporal-analysis')
  }
  
  if (agentHandle === 'solienne') {
    if (prompt?.toLowerCase().includes('identity')) themes.push('identity-exploration')
    if (prompt?.toLowerCase().includes('consciousness')) themes.push('consciousness-study')
    if (prompt?.toLowerCase().includes('light')) themes.push('architectural-light')
    if (prompt?.toLowerCase().includes('velocity')) themes.push('velocity-moment')
    if (prompt?.toLowerCase().includes('mirror')) themes.push('reflection-metaphor')
  }
  
  return themes
}