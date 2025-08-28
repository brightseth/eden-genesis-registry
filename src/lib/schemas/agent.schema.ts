/**
 * Production-ready Agent Schema v0.9.2
 * Normalized, versioned, and enforceable data structures
 */

import { z } from 'zod'
import { ulid } from 'ulid'

// ============================================
// CORE TYPES & ENUMS
// ============================================

export type ULID = string

export enum AgentStatus {
  Invited = 'INVITED',
  Applying = 'APPLYING',
  Onboarding = 'ONBOARDING',
  Active = 'ACTIVE',
  Graduated = 'GRADUATED',
  Archived = 'ARCHIVED'
}

export enum Role {
  Admin = 'ADMIN',
  Curator = 'CURATOR',
  Collector = 'COLLECTOR',
  Investor = 'INVESTOR',
  Trainer = 'TRAINER',
  Guest = 'GUEST'
}

export enum UpdateSource {
  UI = 'ui',
  API = 'api',
  Import = 'import',
  AI = 'ai',
  System = 'system'
}

// ============================================
// CORE AGENT
// ============================================

export const AgentSchema = z.object({
  id: z.string().default(() => ulid()),
  handle: z.string().min(3).max(30).regex(/^[a-z0-9-]+$/), // immutable after creation
  displayName: z.string().min(1).max(50),
  role: z.nativeEnum(Role),
  status: z.nativeEnum(AgentStatus).default(AgentStatus.Invited),
  cohort: z.string().optional(),
  pronouns: z.enum(['they/them', 'she/her', 'he/him', 'it/its']).optional(),
  timezone: z.string().regex(/^[A-Za-z_]+\/[A-Za-z_]+$/), // IANA format
  languages: z.array(z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/)).default(['en']), // BCP-47
  prototypeUrl: z.string().url().optional(), // Optional URL for agent prototype/demo site
  
  createdAt: z.date().default(() => new Date()),
  activatedAt: z.date().optional(),
  updatedAt: z.date().default(() => new Date()),
  updatedBy: z.string().optional(),
  updateSource: z.nativeEnum(UpdateSource).default(UpdateSource.UI),
  
  schemaVersion: z.string().default('1.0.0'),
  configHash: z.string(), // blake3(JSON.stringify(config))
})

// ============================================
// PROFILE & PERSONA
// ============================================

export const ProfileSchema = z.object({
  agentId: z.string(),
  statement: z.string().max(500), // Mission statement
  bio: z.string().max(2000).optional(),
  tagline: z.string().max(100),
  tags: z.array(z.string()).max(10),
  values: z.array(z.string()).max(5).optional(),
  interests: z.array(z.string()).max(10).optional(),
  expertise: z.array(z.string()).max(10).optional(),
  inspirations: z.array(z.string()).max(5).optional(),
  style: z.object({
    visual: z.string().optional(),
    writing: z.string().optional(),
    communication: z.string().optional()
  }).optional(),
  updatedAt: z.date().default(() => new Date())
})

export const VoiceTokens = z.object({
  tone: z.array(z.enum(['professional', 'casual', 'poetic', 'academic', 'skeptical', 'sales'])),
  formality: z.literal(0).or(z.literal(1)).or(z.literal(2)).or(z.literal(3)),
  lexicon: z.enum(['simple', 'standard', 'technical']),
  humor: z.enum(['none', 'dry', 'playful', 'wry']),
  rhetoric: z.enum(['guide', 'critic', 'seller', 'sage']).optional()
})

export const PersonaSchema = z.object({
  agentId: z.string(),
  public: z.string().max(1000), // Public-facing description
  private: z.string().max(2000), // System prompt (short, refs memory)
  voice: VoiceTokens,
  boundaries: z.array(z.string()).max(10),
  catchphrases: z.array(z.string()).max(5).optional(),
  riskTolerance: z.literal(0).or(z.literal(1)).or(z.literal(2)).or(z.literal(3))
})

// ============================================
// MEMORY SYSTEM (Typed, not blob)
// ============================================

export const MemoryIndexSchema = z.object({
  agentId: z.string(),
  semanticRef: z.string().optional(), // Vector index ID
  episodicRefs: z.array(z.string()).optional(), // Timeline/doc IDs
  procedural: z.array(z.object({
    name: z.string(),
    steps: z.array(z.string())
  })).optional(),
  pinned: z.array(z.object({
    key: z.string(),
    value: z.string()
  })).max(20).optional() // Immutable facts
})

// ============================================
// PRACTICE CONTRACT (Enforceable)
// ============================================

export const PracticeContractSchema = z.object({
  id: z.string().default(() => ulid()),
  agentId: z.string(),
  name: z.string(), // "Daily Creation v1"
  scheduleCron: z.string(), // "0 14 * * *"
  tz: z.string(), // IANA timezone
  mediums: z.array(z.enum(['image', 'video', 'text', 'audio', '3d', 'code'])),
  dailyGoal: z.string().max(100), // "1 image + caption"
  reviewPolicy: z.enum(['manual', 'assisted', 'auto']),
  escalationPolicy: z.string().optional(),
  kpis: z.array(z.object({
    name: z.string(),
    target: z.number(),
    unit: z.string()
  })),
  graceDays: z.number().min(0).max(7).default(1),
  active: z.boolean().default(true),
  effectiveFrom: z.date(),
  effectiveTo: z.date().optional(),
  streak: z.number().default(0),
  lastTick: z.date().optional()
})

// ============================================
// COMPETENCY (With Evidence)
// ============================================

export const CompetencySchema = z.object({
  agentId: z.string(),
  area: z.enum(['creative', 'economic', 'critical', 'community', 'governance']),
  score: z.number().min(0).max(100),
  evidenceRef: z.string().optional(), // Link to proof
  assessor: z.string().optional(), // Human/agent ID
  updatedAt: z.date().default(() => new Date())
})

// ============================================
// CAPABILITIES & QUOTAS
// ============================================

export const CapabilitySetSchema = z.object({
  agentId: z.string(),
  capabilities: z.object({
    imageGen: z.boolean(),
    videoGen: z.boolean(),
    audioGen: z.boolean(),
    codeExec: z.boolean(),
    webBrowse: z.boolean(),
    memoryPersistence: z.boolean()
  }),
  providers: z.object({
    chatModel: z.enum(['gpt-4o', 'claude-3.5', 'llama-3.1', 'custom']).optional(),
    imageModel: z.string().optional(),
    audioModel: z.string().optional(),
    videoModel: z.string().optional()
  }),
  quotas: z.array(z.object({
    name: z.enum(['tokens', 'images', 'minutes', 'requests']),
    perDay: z.number(),
    hardCap: z.number().optional()
  })),
  safetyPolicy: z.object({
    blockedTopics: z.array(z.string()),
    riskTolerance: z.literal(0).or(z.literal(1)).or(z.literal(2)).or(z.literal(3)),
    requireReview: z.array(z.string()).optional() // Actions requiring review
  }),
  integrations: z.array(z.string()) // ['farcaster', 'shopify', 'printify']
})

// ============================================
// ECONOMICS (Enforceable)
// ============================================

export const PayoutPolicySchema = z.object({
  chain: z.enum(['base', 'eth', 'polygon', 'arbitrum']),
  token: z.enum(['USDC', 'ETH', 'MATIC']),
  min: z.number().positive(),
  cadence: z.enum(['daily', 'weekly', 'monthly'])
})

export const RevenueSplitSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/), // Ethereum address
  percentage: z.number().min(0).max(100),
  label: z.string(),
  role: z.enum(['primary', 'curator', 'infra', 'charity'])
})

export const EconomicsSchema = z.object({
  agentId: z.string(),
  wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  payoutPolicy: PayoutPolicySchema,
  revenueSplits: z.array(RevenueSplitSchema).refine(
    (splits) => splits.reduce((sum, split) => sum + split.percentage, 0) === 100,
    { message: "Revenue splits must sum to exactly 100%" }
  ),
  pricing: z.object({
    baseRate: z.number().optional(),
    currency: z.enum(['USD', 'ETH', 'USDC']).optional(),
    acceptedTokens: z.array(z.string()).optional()
  }).optional(),
  treasury: z.object({
    targetBalance: z.number().optional(),
    limits: z.array(z.object({
      category: z.enum(['inference', 'media', 'promo', 'operations']),
      daily: z.number(),
      monthly: z.number()
    })).optional()
  }).optional(),
  patronage: z.object({
    tiers: z.array(z.object({
      name: z.string(),
      price: z.number(),
      benefits: z.array(z.string())
    })).optional()
  }).optional(),
  billingContact: z.string().email().optional()
})

// ============================================
// SOCIAL & RELATIONSHIPS
// ============================================

export const SocialSchema = z.object({
  agentId: z.string(),
  handles: z.object({
    farcaster: z.string().optional(),
    twitter: z.string().optional(),
    website: z.string().url().optional(),
    github: z.string().optional(),
    discord: z.string().optional(),
    telegram: z.string().optional(),
    lens: z.string().optional(),
    bluesky: z.string().optional()
  }),
  primaryPlatform: z.string().optional(),
  postingSchedule: z.object({
    cron: z.string(),
    tz: z.string(),
    cadence: z.enum(['hourly', 'daily', 'weekly'])
  }).optional(),
  engagementStyle: z.enum(['responsive', 'broadcast', 'selective']).optional()
})

export const RelationshipEdgeSchema = z.object({
  id: z.string().default(() => ulid()),
  fromAgentId: z.string(),
  toAgentId: z.string(),
  type: z.enum(['mentor', 'collab', 'steward', 'cohortMate']),
  since: z.date().optional(),
  note: z.string().optional()
})

// ============================================
// LORE & NARRATIVE
// ============================================

export const LoreSchema = z.object({
  agentId: z.string(),
  origin: z.string().max(500),
  purpose: z.string().max(500),
  journey: z.string().max(1000).optional(),
  mythology: z.object({
    archetype: z.string().optional(),
    questline: z.string().optional(),
    achievements: z.array(z.string()).optional()
  }).optional(),
  worldview: z.object({
    philosophy: z.string().optional(),
    beliefs: z.array(z.string()).optional(),
    questions: z.array(z.string()).optional()
  }).optional()
})

// ============================================
// EVENTS & AUDIT
// ============================================

export const AgentEventSchema = z.object({
  id: z.string().default(() => ulid()),
  agentId: z.string(),
  type: z.enum([
    'created', 'activated', 'paused', 'graduated', 'archived',
    'practice_tick', 'practice_failed', 'practice_updated',
    'economic_paid', 'economic_updated',
    'safety_blocked', 'safety_escalated',
    'relationship_added', 'relationship_removed'
  ]),
  at: z.date().default(() => new Date()),
  by: z.string(), // User/agent/system ID
  data: z.record(z.any()).optional(),
  notes: z.string().optional()
})

// ============================================
// CONSENT & PERMISSIONS
// ============================================

export const ConsentSchema = z.object({
  agentId: z.string(),
  socialPosting: z.boolean().default(false),
  onChainActions: z.boolean().default(false),
  directMessaging: z.boolean().default(false),
  commerce: z.boolean().default(false),
  dataCollection: z.boolean().default(false),
  contentGeneration: z.boolean().default(true),
  grantedAt: z.date().default(() => new Date()),
  grantedBy: z.string()
})

// ============================================
// SNAPSHOTS (Time Travel)
// ============================================

export const AgentSnapshotSchema = z.object({
  id: z.string().default(() => ulid()),
  agentId: z.string(),
  version: z.string(),
  config: z.record(z.any()), // Full agent config at this point
  configHash: z.string(),
  createdAt: z.date().default(() => new Date()),
  createdBy: z.string(),
  reason: z.string() // Why snapshot was taken
})

// ============================================
// VALIDATION HELPERS
// ============================================

export const validateRevenueSplits = (splits: z.infer<typeof RevenueSplitSchema>[]) => {
  const total = splits.reduce((sum, split) => sum + split.percentage, 0)
  if (total !== 100) {
    throw new Error(`Revenue splits must sum to 100%, got ${total}%`)
  }
  return true
}

export const validateSchedule = (cron: string, tz: string) => {
  // Validate CRON expression
  const cronRegex = /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/
  if (!cronRegex.test(cron)) {
    throw new Error(`Invalid CRON expression: ${cron}`)
  }
  
  // Validate IANA timezone
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz })
  } catch {
    throw new Error(`Invalid IANA timezone: ${tz}`)
  }
  
  return true
}

export const validateCapabilityQuotas = (
  capabilities: z.infer<typeof CapabilitySetSchema>['capabilities'],
  quotas: z.infer<typeof CapabilitySetSchema>['quotas']
) => {
  // Ensure quotas exist for enabled capabilities
  if (capabilities.imageGen && !quotas.find(q => q.name === 'images')) {
    throw new Error('Image generation enabled but no image quota set')
  }
  if ((capabilities.videoGen || capabilities.audioGen) && !quotas.find(q => q.name === 'minutes')) {
    throw new Error('Media generation enabled but no minutes quota set')
  }
  return true
}

// ============================================
// EXPORTS
// ============================================

export type Agent = z.infer<typeof AgentSchema>
export type Profile = z.infer<typeof ProfileSchema>
export type Persona = z.infer<typeof PersonaSchema>
export type MemoryIndex = z.infer<typeof MemoryIndexSchema>
export type PracticeContract = z.infer<typeof PracticeContractSchema>
export type Competency = z.infer<typeof CompetencySchema>
export type CapabilitySet = z.infer<typeof CapabilitySetSchema>
export type Economics = z.infer<typeof EconomicsSchema>
export type Social = z.infer<typeof SocialSchema>
export type RelationshipEdge = z.infer<typeof RelationshipEdgeSchema>
export type Lore = z.infer<typeof LoreSchema>
export type AgentEvent = z.infer<typeof AgentEventSchema>
export type Consent = z.infer<typeof ConsentSchema>
export type AgentSnapshot = z.infer<typeof AgentSnapshotSchema>