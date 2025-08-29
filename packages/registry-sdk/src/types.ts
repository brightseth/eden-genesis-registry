/**
 * Registry SDK v1 - Typed DTOs
 * REGISTRY-GUARDIAN: Single source of truth for all type definitions
 * Export types from agent.schema.ts to maintain consistency
 */

// Re-export all types from the canonical schema
export {
  // Core agent types
  type Agent,
  type Profile,
  type Persona,
  type MemoryIndex,
  type PracticeContract,
  type Competency,
  type CapabilitySet,
  type Economics,
  type Social,
  type RelationshipEdge,

  // Comprehensive lore types
  type ComprehensiveLore,
  type LoreUpdate,
  type LoreIdentity,
  type LoreOrigin,
  type LorePhilosophy,
  type LoreExpertise,
  type LoreVoice,
  type LoreCulture,
  type LorePersonality,
  type LoreRelationships,
  type LoreCurrentContext,
  type LoreConversationFramework,
  type LoreKnowledge,
  type LoreTimeline,
  type ArtisticPractice,
  type DivinationPractice,
  type CurationPhilosophy,
  type GovernanceFramework,

  // Legacy compatibility
  type Lore,

  // Event & audit types
  type AgentEvent,
  type Consent,
  type AgentSnapshot,

  // Enums
  AgentStatus,
  Role,
  UpdateSource
} from '../../../src/lib/schemas/agent.schema'

// API Response wrappers
export interface ApiResponse<T = any> {
  status: 'success' | 'error'
  data?: T
  error?: string
  details?: any
  timestamp: string
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Agent list response with counts
export interface AgentListResponse extends ApiResponse {
  data: {
    agents: Agent[]
    total: number
    totalCount: number
    hasMore: boolean
    pagination: {
      limit: number
      offset: number
      total: number
      pages: number
      currentPage: number
    }
    filters: {
      cohort: string | null
      status: string | null
      role: string | null
      search: string | null
      sort: string
      order: string
    }
  }
}

// Agent detail response with all relations
export interface AgentDetailResponse extends ApiResponse {
  data: {
    agent: Agent & {
      profile?: Profile
      lore?: ComprehensiveLore
      persona?: Persona
      economics?: Economics
      social?: Social
      capabilities?: CapabilitySet
      practices?: PracticeContract[]
      competencies?: Competency[]
      events?: AgentEvent[]
      relationships?: RelationshipEdge[]
      _count: {
        creations: number
        personas: number
        artifacts: number
      }
    }
  }
}

// Status response for health checks
export interface StatusResponse extends ApiResponse {
  data: {
    service: string
    version: string
    uptime: number
    database: 'connected' | 'disconnected'
    validation: {
      enabled: boolean
      collections: Record<string, {
        level: 'off' | 'warn' | 'enforce'
        healthy: boolean
      }>
    }
    metrics: {
      agents: {
        total: number
        active: number
        graduated: number
      }
      requests: {
        total24h: number
        errors24h: number
        avgResponseTime: number
      }
    }
  }
}

// Write operation responses
export interface WriteResponse<T = any> extends ApiResponse<T> {
  operation: 'create' | 'update' | 'delete'
  resourceId: string
  webhook?: {
    sent: boolean
    event: string
    timestamp: string
  }
}

// Webhook event types
export interface WebhookEvent {
  id: string
  event: string
  timestamp: string
  data: {
    agentId: string
    operation: 'create' | 'update' | 'delete'
    collection: 'agent' | 'lore' | 'profile' | 'persona' | 'economics'
    before?: any
    after?: any
    userId?: string
  }
}

// Client configuration
export interface RegistryClientConfig {
  baseUrl: string
  apiKey?: string
  timeout?: number
  retries?: number
  validateResponses?: boolean
  webhookUrl?: string
  rateLimitBuffer?: number
}

// Error types
export class RegistryError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: any
  ) {
    super(message)
    this.name = 'RegistryError'
  }
}

export class ValidationError extends RegistryError {
  constructor(message: string, public errors: any[]) {
    super(message, 400, errors)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends RegistryError {
  constructor(resource: string, id: string) {
    super(`${resource} with ID ${id} not found`, 404)
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends RegistryError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401)
    this.name = 'UnauthorizedError'
  }
}