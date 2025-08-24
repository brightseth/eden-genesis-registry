/**
 * Agent Lifecycle State Machine
 * Enforces valid state transitions with audit trail
 */

import { ulid } from 'ulid'
import { AgentStatus, UpdateSource, type AgentEvent } from './schemas/agent.schema'

// ============================================
// STATE TRANSITIONS
// ============================================

type StateTransition = {
  from: AgentStatus[]
  to: AgentStatus
  requires?: string[] // Required fields/conditions
  emits: string // Event type
  validate?: (agent: any) => boolean | string // Custom validation
}

const VALID_TRANSITIONS: StateTransition[] = [
  // Draft → Review
  {
    from: [AgentStatus.Draft],
    to: AgentStatus.PendingReview,
    requires: ['handle', 'displayName', 'statement', 'practiceContract'],
    emits: 'submitted_for_review',
    validate: (agent) => {
      if (!agent.profile?.statement) return 'Statement required for review'
      if (!agent.practiceContracts?.length) return 'At least one practice contract required'
      if (!agent.economics?.wallet) return 'Wallet address required'
      return true
    }
  },
  
  // Review → Active
  {
    from: [AgentStatus.PendingReview],
    to: AgentStatus.Active,
    requires: ['approvedBy', 'consent'],
    emits: 'activated',
    validate: (agent) => {
      if (!agent.consent?.contentGeneration) return 'Content generation consent required'
      if (!agent.capabilities) return 'Capabilities must be configured'
      return true
    }
  },
  
  // Review → Draft (rejected)
  {
    from: [AgentStatus.PendingReview],
    to: AgentStatus.Draft,
    requires: ['reviewNotes'],
    emits: 'review_rejected'
  },
  
  // Active → Paused
  {
    from: [AgentStatus.Active],
    to: AgentStatus.Paused,
    emits: 'paused',
    validate: (agent) => {
      // Check for active commitments
      if (agent.practiceContracts?.some((c: any) => c.streak > 30 && c.active)) {
        return 'Cannot pause agent with active streak > 30 days'
      }
      return true
    }
  },
  
  // Paused → Active
  {
    from: [AgentStatus.Paused],
    to: AgentStatus.Active,
    emits: 'resumed'
  },
  
  // Active → Graduated
  {
    from: [AgentStatus.Active],
    to: AgentStatus.Graduated,
    requires: ['completedMilestones'],
    emits: 'graduated',
    validate: (agent) => {
      // Check graduation requirements
      const minDays = 90
      const activeDays = agent.activatedAt 
        ? Math.floor((Date.now() - agent.activatedAt.getTime()) / (1000 * 60 * 60 * 24))
        : 0
      
      if (activeDays < minDays) return `Must be active for ${minDays} days (currently ${activeDays})`
      
      // Check competency scores
      const competencies = agent.competencies || []
      const avgScore = competencies.reduce((sum: number, c: any) => sum + c.score, 0) / competencies.length
      if (avgScore < 70) return `Average competency must be ≥70 (currently ${avgScore.toFixed(1)})`
      
      return true
    }
  },
  
  // Various → Archived
  {
    from: [AgentStatus.Draft, AgentStatus.Paused, AgentStatus.Graduated],
    to: AgentStatus.Archived,
    requires: ['archiveReason'],
    emits: 'archived'
  }
]

// ============================================
// STATE MACHINE CLASS
// ============================================

export class AgentLifecycle {
  private events: AgentEvent[] = []
  
  constructor(private agentId: string) {}
  
  /**
   * Check if a transition is valid
   */
  canTransition(from: AgentStatus, to: AgentStatus): boolean {
    return VALID_TRANSITIONS.some(t => 
      t.from.includes(from) && t.to === to
    )
  }
  
  /**
   * Get available transitions from current state
   */
  getAvailableTransitions(currentStatus: AgentStatus): AgentStatus[] {
    return VALID_TRANSITIONS
      .filter(t => t.from.includes(currentStatus))
      .map(t => t.to)
  }
  
  /**
   * Execute state transition with validation
   */
  async transition(
    agent: any,
    newStatus: AgentStatus,
    by: string,
    context: Record<string, any> = {}
  ): Promise<{ success: boolean; error?: string; event?: AgentEvent }> {
    const currentStatus = agent.status
    
    // Find matching transition
    const transition = VALID_TRANSITIONS.find(t =>
      t.from.includes(currentStatus) && t.to === newStatus
    )
    
    if (!transition) {
      return { 
        success: false, 
        error: `Invalid transition: ${currentStatus} → ${newStatus}` 
      }
    }
    
    // Check required fields
    if (transition.requires) {
      for (const field of transition.requires) {
        if (!context[field]) {
          return { 
            success: false, 
            error: `Missing required field: ${field}` 
          }
        }
      }
    }
    
    // Run custom validation
    if (transition.validate) {
      const validationResult = transition.validate(agent)
      if (validationResult !== true) {
        return { 
          success: false, 
          error: typeof validationResult === 'string' ? validationResult : 'Validation failed' 
        }
      }
    }
    
    // Create event
    const event: AgentEvent = {
      id: ulid(),
      agentId: this.agentId,
      type: transition.emits as any,
      at: new Date(),
      by,
      data: {
        from: currentStatus,
        to: newStatus,
        ...context
      }
    }
    
    this.events.push(event)
    
    return { success: true, event }
  }
  
  /**
   * Get transition history
   */
  getHistory(): AgentEvent[] {
    return this.events
  }
}

// ============================================
// PRACTICE CONTRACT ENFORCEMENT
// ============================================

export class PracticeContractManager {
  /**
   * Check if practice contract should tick
   */
  shouldTick(contract: any, now: Date = new Date()): boolean {
    if (!contract.active) return false
    if (contract.effectiveTo && now > contract.effectiveTo) return false
    
    // Parse cron and check if it's time
    // This is simplified - use a proper cron library in production
    const lastTick = contract.lastTick || contract.effectiveFrom
    const hoursSinceLastTick = (now.getTime() - lastTick.getTime()) / (1000 * 60 * 60)
    
    if (contract.scheduleCron.includes('* * *')) {
      return hoursSinceLastTick >= 24 // Daily
    } else if (contract.scheduleCron.includes('* *')) {
      return hoursSinceLastTick >= 1 // Hourly
    }
    
    return false
  }
  
  /**
   * Process practice tick
   */
  async tick(
    contract: any,
    completed: boolean,
    evidence?: string
  ): Promise<{ streak: number; status: 'success' | 'failed' | 'grace' }> {
    const now = new Date()
    
    if (completed) {
      // Success - increment streak
      return {
        streak: contract.streak + 1,
        status: 'success'
      }
    } else {
      // Check grace days
      const daysSinceLastTick = contract.lastTick 
        ? Math.floor((now.getTime() - contract.lastTick.getTime()) / (1000 * 60 * 60 * 24))
        : 0
      
      if (daysSinceLastTick <= contract.graceDays) {
        // Within grace period
        return {
          streak: contract.streak,
          status: 'grace'
        }
      } else {
        // Failed - reset streak
        return {
          streak: 0,
          status: 'failed'
        }
      }
    }
  }
  
  /**
   * Validate KPIs
   */
  validateKPIs(contract: any, metrics: Record<string, number>): boolean {
    for (const kpi of contract.kpis) {
      const actual = metrics[kpi.name] || 0
      if (actual < kpi.target) {
        return false
      }
    }
    return true
  }
}

// ============================================
// ECONOMIC INVARIANTS
// ============================================

export class EconomicValidator {
  /**
   * Validate revenue splits sum to 100%
   */
  static validateSplits(splits: any[]): boolean {
    const total = splits.reduce((sum, split) => sum + split.percentage, 0)
    return total === 100
  }
  
  /**
   * Validate wallet address checksum
   */
  static validateAddress(address: string): boolean {
    // EIP-55 checksum validation
    const regex = /^0x[a-fA-F0-9]{40}$/
    return regex.test(address)
  }
  
  /**
   * Check treasury limits
   */
  static checkTreasuryLimit(
    category: string,
    amount: number,
    limits: any[]
  ): { allowed: boolean; reason?: string } {
    const limit = limits.find(l => l.category === category)
    if (!limit) return { allowed: true }
    
    if (amount > limit.daily) {
      return { 
        allowed: false, 
        reason: `Exceeds daily limit of ${limit.daily} for ${category}` 
      }
    }
    
    return { allowed: true }
  }
  
  /**
   * Calculate payout amount
   */
  static calculatePayout(
    revenue: number,
    splits: any[],
    address: string
  ): number {
    const split = splits.find(s => s.address === address)
    if (!split) return 0
    
    return (revenue * split.percentage) / 100
  }
}

// ============================================
// CAPABILITY ENFORCER
// ============================================

export class CapabilityEnforcer {
  private usage: Map<string, number> = new Map()
  
  /**
   * Check if action is allowed
   */
  canPerform(
    action: string,
    capabilities: any,
    quotas: any[]
  ): { allowed: boolean; reason?: string } {
    // Map action to capability
    const capabilityMap: Record<string, string> = {
      'generate_image': 'imageGen',
      'generate_video': 'videoGen',
      'generate_audio': 'audioGen',
      'execute_code': 'codeExec',
      'browse_web': 'webBrowse'
    }
    
    const capability = capabilityMap[action]
    if (!capability) return { allowed: true } // Unknown action, allow by default
    
    // Check if capability is enabled
    if (!capabilities[capability]) {
      return { 
        allowed: false, 
        reason: `Capability ${capability} is not enabled` 
      }
    }
    
    // Check quotas
    const quotaMap: Record<string, string> = {
      'generate_image': 'images',
      'generate_video': 'minutes',
      'generate_audio': 'minutes',
      'execute_code': 'requests'
    }
    
    const quotaName = quotaMap[action]
    if (quotaName) {
      const quota = quotas.find(q => q.name === quotaName)
      if (quota) {
        const used = this.usage.get(`${action}_daily`) || 0
        if (used >= quota.perDay) {
          return { 
            allowed: false, 
            reason: `Daily quota exceeded for ${quotaName} (${used}/${quota.perDay})` 
          }
        }
      }
    }
    
    return { allowed: true }
  }
  
  /**
   * Record usage
   */
  recordUsage(action: string, amount: number = 1): void {
    const key = `${action}_daily`
    const current = this.usage.get(key) || 0
    this.usage.set(key, current + amount)
  }
  
  /**
   * Reset daily usage
   */
  resetDaily(): void {
    for (const key of this.usage.keys()) {
      if (key.endsWith('_daily')) {
        this.usage.delete(key)
      }
    }
  }
}

// ============================================
// CONSENT MANAGER
// ============================================

export class ConsentManager {
  /**
   * Check if action requires consent
   */
  static requiresConsent(action: string): string | null {
    const consentMap: Record<string, string> = {
      'post_social': 'socialPosting',
      'send_transaction': 'onChainActions',
      'send_dm': 'directMessaging',
      'list_product': 'commerce',
      'store_data': 'dataCollection'
    }
    
    return consentMap[action] || null
  }
  
  /**
   * Validate consent for action
   */
  static hasConsent(consent: any, action: string): boolean {
    const consentField = this.requiresConsent(action)
    if (!consentField) return true // No consent required
    
    return consent?.[consentField] === true
  }
}

// ============================================
// EXPORTS
// ============================================

export {
  AgentLifecycle,
  PracticeContractManager,
  EconomicValidator,
  CapabilityEnforcer,
  ConsentManager
}