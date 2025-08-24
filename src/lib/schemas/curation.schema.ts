/**
 * Curation Schemas - Based on Nina's Requirements
 * Comprehensive curation workflow management
 */

import { z } from 'zod'
import { ulid } from 'ulid'

// ============================================
// ANALYSIS TIERS
// ============================================

// Generation-time analysis (stored with work)
export const GenerationAnalysisSchema = z.object({
  themes: z.array(z.string()),
  tags: z.array(z.string()),
  colors: z.array(z.string()),
  style: z.string().optional(),
  mood: z.string().optional(),
  technique: z.string().optional(),
  timestamp: z.date(),
  model: z.string()
})

// Registry-time analysis (cached centrally)
export const RegistryAnalysisSchema = z.object({
  qualityScore: z.number().min(0).max(100),
  technicalQuality: z.number().min(0).max(100),
  aestheticScore: z.number().min(0).max(100),
  uniquenessScore: z.number().min(0).max(100),
  styleAttributes: z.array(z.string()),
  similarWorks: z.array(z.string()), // IDs of similar works
  duplicateCheck: z.boolean(),
  nsfwScore: z.number().min(0).max(1),
  timestamp: z.date(),
  version: z.string()
})

// Curation-time analysis (curator-specific)
export const CurationAnalysisSchema = z.object({
  exhibitionFit: z.number().min(0).max(100),
  thematicRelevance: z.number().min(0).max(100),
  comparativeRanking: z.number(),
  curatorNotes: z.string(),
  recommendedPairings: z.array(z.string()), // IDs of works that pair well
  presentationNotes: z.string().optional(),
  timestamp: z.date(),
  curatorId: z.string()
})

// ============================================
// CURATION SESSION
// ============================================

export const CurationSessionSchema = z.object({
  id: z.string().default(() => ulid()),
  curatorId: z.string(),
  
  // Session metadata
  title: z.string(),
  goal: z.string(), // "Select 15 works for Paris Photo"
  status: z.enum(['active', 'paused', 'completed', 'archived']),
  
  // Session parameters
  targetCount: z.number().optional(),
  criteria: z.object({
    themes: z.array(z.string()).optional(),
    minQuality: z.number().optional(),
    mediaTypes: z.array(z.string()).optional(),
    dateRange: z.object({
      start: z.date().optional(),
      end: z.date().optional()
    }).optional(),
    customFilters: z.record(z.any()).optional()
  }),
  
  // Work queue
  workQueue: z.array(z.string()), // IDs to review
  reviewed: z.array(z.string()),
  accepted: z.array(z.string()),
  rejected: z.array(z.string()),
  maybe: z.array(z.string()),
  
  // Session tracking
  startedAt: z.date(),
  lastActiveAt: z.date(),
  completedAt: z.date().optional(),
  totalReviewTime: z.number(), // milliseconds
  averageDecisionTime: z.number(),
  
  // Collaboration
  collaborators: z.array(z.object({
    curatorId: z.string(),
    role: z.enum(['lead', 'reviewer', 'advisor', 'observer']),
    joinedAt: z.date()
  })).default([]),
  
  // Analytics
  decisions: z.array(z.object({
    workId: z.string(),
    decision: z.enum(['accept', 'reject', 'maybe', 'skip']),
    timestamp: z.date(),
    timeSpent: z.number(), // milliseconds
    curatorId: z.string(),
    reason: z.string().optional()
  })).default([])
})

// ============================================
// COLLECTION MANAGEMENT
// ============================================

export const CollectionSchema = z.object({
  id: z.string().default(() => ulid()),
  
  // Collection metadata
  title: z.string(),
  description: z.string(),
  type: z.enum(['exhibition', 'permanent', 'temporary', 'research', 'sale']),
  status: z.enum(['draft', 'active', 'archived']),
  
  // Ownership
  ownerId: z.string(),
  organizationId: z.string().optional(),
  
  // Acceptance criteria
  criteria: z.object({
    minQuality: z.number().default(70),
    requiredThemes: z.array(z.string()).default([]),
    preferredStyles: z.array(z.string()).default([]),
    maxWorks: z.number().optional(),
    autoAccept: z.boolean().default(false),
    autoAcceptThreshold: z.number().default(90)
  }),
  
  // Works
  works: z.array(z.object({
    id: z.string(),
    addedAt: z.date(),
    addedBy: z.string(),
    position: z.number().optional(), // for ordering
    metadata: z.record(z.any()).optional() // collection-specific metadata
  })).default([]),
  
  // Statistics
  stats: z.object({
    totalWorks: z.number(),
    averageQuality: z.number(),
    topThemes: z.array(z.string()),
    viewCount: z.number().default(0),
    shareCount: z.number().default(0)
  }),
  
  // Access control
  visibility: z.enum(['public', 'private', 'unlisted']),
  collaborators: z.array(z.object({
    curatorId: z.string(),
    permissions: z.array(z.enum(['view', 'add', 'remove', 'edit', 'admin']))
  })).default([]),
  
  // Timestamps
  createdAt: z.date(),
  updatedAt: z.date(),
  publishedAt: z.date().optional()
})

// ============================================
// COLLABORATION
// ============================================

export const CollaborationSchema = z.object({
  id: z.string().default(() => ulid()),
  
  // Collaboration metadata
  title: z.string(),
  description: z.string(),
  type: z.enum(['curation', 'exhibition', 'research', 'acquisition']),
  
  // Participants
  participants: z.array(z.object({
    curatorId: z.string(),
    name: z.string(),
    role: z.enum(['lead', 'specialist', 'reviewer', 'advisor']),
    expertise: z.array(z.string()), // areas of expertise
    joinedAt: z.date(),
    active: z.boolean()
  })),
  
  // Voting mechanism
  votingRules: z.object({
    mechanism: z.enum(['unanimous', 'majority', 'weighted', 'veto']),
    quorum: z.number().min(0).max(1), // percentage required
    vetoRights: z.array(z.string()).default([]), // curator IDs with veto
    weightings: z.record(z.number()).optional() // curator ID -> weight
  }),
  
  // Workspace
  workspace: z.object({
    sessionId: z.string().optional(),
    collectionId: z.string().optional(),
    sharedNotes: z.array(z.object({
      id: z.string(),
      author: z.string(),
      content: z.string(),
      timestamp: z.date(),
      workId: z.string().optional()
    })).default([])
  }),
  
  // Decisions
  decisions: z.array(z.object({
    workId: z.string(),
    votes: z.array(z.object({
      curatorId: z.string(),
      vote: z.enum(['accept', 'reject', 'abstain']),
      reason: z.string().optional(),
      timestamp: z.date()
    })),
    outcome: z.enum(['accepted', 'rejected', 'pending']),
    decidedAt: z.date().optional()
  })).default([]),
  
  // Status
  status: z.enum(['active', 'paused', 'completed', 'cancelled']),
  createdAt: z.date(),
  updatedAt: z.date(),
  completedAt: z.date().optional()
})

// ============================================
// CURATOR ANALYTICS
// ============================================

export const CuratorAnalyticsSchema = z.object({
  curatorId: z.string(),
  period: z.enum(['day', 'week', 'month', 'year', 'all']),
  
  // Activity metrics
  activity: z.object({
    totalReviews: z.number(),
    totalDecisions: z.number(),
    acceptanceRate: z.number(), // percentage
    averageReviewTime: z.number(), // seconds
    peakHours: z.array(z.number()), // hours of day with most activity
    sessionsCompleted: z.number()
  }),
  
  // Quality metrics
  quality: z.object({
    averageQualityAccepted: z.number(),
    averageQualityRejected: z.number(),
    consistencyScore: z.number(), // how consistent decisions are
    disagreementRate: z.number() // in collaborations
  }),
  
  // Preference patterns
  preferences: z.object({
    favoredThemes: z.array(z.object({
      theme: z.string(),
      acceptanceRate: z.number()
    })),
    favoredStyles: z.array(z.string()),
    favoredAgents: z.array(z.object({
      agentId: z.string(),
      acceptanceRate: z.number()
    })),
    biasIndicators: z.record(z.number()) // various bias metrics
  }),
  
  // Performance
  performance: z.object({
    exhibitionSuccess: z.number(), // engagement with curated works
    peerAgreement: z.number(), // agreement with other curators
    fatigueIndicator: z.number(), // decision quality over time
    optimalBatchSize: z.number(),
    optimalSessionLength: z.number() // minutes
  }),
  
  // Insights
  insights: z.array(z.object({
    type: z.string(),
    message: z.string(),
    severity: z.enum(['info', 'suggestion', 'warning']),
    timestamp: z.date()
  })),
  
  generatedAt: z.date()
})

// ============================================
// EXPORTS
// ============================================

export type GenerationAnalysis = z.infer<typeof GenerationAnalysisSchema>
export type RegistryAnalysis = z.infer<typeof RegistryAnalysisSchema>
export type CurationAnalysis = z.infer<typeof CurationAnalysisSchema>
export type CurationSession = z.infer<typeof CurationSessionSchema>
export type Collection = z.infer<typeof CollectionSchema>
export type Collaboration = z.infer<typeof CollaborationSchema>
export type CuratorAnalytics = z.infer<typeof CuratorAnalyticsSchema>