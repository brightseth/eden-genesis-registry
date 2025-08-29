import { PrototypeVersion, AgentPrototypeCollection, BetaFeatureFlag } from '@/lib/schemas/prototype.schema'
import { registryClient } from '@/lib/registry-sdk-client'

interface BetaConfig {
  maxPrototypesPerAgent: number
  retentionPeriodDays: number
  enabledEnvironments: string[]
  autoArchiveThresholdDays: number
}

export class BetaPrototypeManager {
  private config: BetaConfig

  constructor(config: BetaConfig = {
    maxPrototypesPerAgent: 20,
    retentionPeriodDays: 365,
    enabledEnvironments: ['development', 'staging', 'beta'],
    autoArchiveThresholdDays: 90
  }) {
    this.config = config
  }

  /**
   * Get all prototypes for an agent with categorization
   */
  async getAgentPrototypes(agentHandle: string): Promise<AgentPrototypeCollection> {
    try {
      const response = await fetch(`/api/v1/agents/${agentHandle}/prototypes`)
      if (!response.ok) {
        throw new Error(`Failed to fetch prototypes: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch agent prototypes:', error)
      return this.getDefaultCollection(agentHandle)
    }
  }

  /**
   * Register a new prototype version
   */
  async registerPrototype(agentHandle: string, prototype: Omit<PrototypeVersion, 'id' | 'createdAt'>): Promise<PrototypeVersion> {
    const newPrototype: PrototypeVersion = {
      ...prototype,
      id: `${agentHandle}-${prototype.version}-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    try {
      const response = await fetch(`/api/v1/agents/${agentHandle}/prototypes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPrototype)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to register prototype: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Failed to register prototype:', error)
      throw error
    }
  }

  /**
   * Archive old prototype versions
   */
  async archivePrototype(agentHandle: string, prototypeId: string, reason?: string): Promise<void> {
    try {
      await fetch(`/api/v1/agents/${agentHandle}/prototypes/${prototypeId}/archive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          archivedAt: new Date().toISOString(),
          reason: reason || 'Manual archive'
        })
      })
    } catch (error) {
      console.error('Failed to archive prototype:', error)
      throw error
    }
  }

  /**
   * Get feature flags for beta features
   */
  async getBetaFeatureFlags(agentHandle: string): Promise<BetaFeatureFlag[]> {
    try {
      const response = await fetch(`/api/v1/agents/${agentHandle}/beta-flags`)
      if (!response.ok) {
        return []
      }
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch beta flags:', error)
      return []
    }
  }

  /**
   * Toggle beta feature flag
   */
  async toggleBetaFlag(agentHandle: string, flagKey: string, enabled: boolean): Promise<void> {
    try {
      await fetch(`/api/v1/agents/${agentHandle}/beta-flags/${flagKey}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled })
      })
    } catch (error) {
      console.error('Failed to toggle beta flag:', error)
      throw error
    }
  }

  /**
   * Get prototype component by ID for embedding
   */
  async getPrototypeComponent(agentHandle: string, prototypeId: string): Promise<React.ComponentType | null> {
    try {
      // Dynamic import of prototype component
      const componentModule = await import(`@/prototypes/${agentHandle}/${prototypeId}`)
      return componentModule.default || componentModule[prototypeId]
    } catch (error) {
      console.error('Failed to load prototype component:', error)
      return null
    }
  }

  /**
   * Cleanup old prototypes based on retention policy
   */
  async cleanupOldPrototypes(agentHandle: string): Promise<{ archived: number, deleted: number }> {
    const collection = await this.getAgentPrototypes(agentHandle)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionPeriodDays)

    let archived = 0
    let deleted = 0

    // Archive prototypes older than autoArchiveThresholdDays
    const autoArchiveCutoff = new Date()
    autoArchiveCutoff.setDate(autoArchiveCutoff.getDate() - this.config.autoArchiveThresholdDays)

    for (const prototype of collection.prototypes) {
      const createdDate = new Date(prototype.createdAt)
      
      if (createdDate < autoArchiveCutoff && prototype.status === 'experimental') {
        await this.archivePrototype(agentHandle, prototype.id, 'Auto-archived due to age')
        archived++
      }
    }

    return { archived, deleted }
  }

  /**
   * Generate prototype navigation structure for agent profile integration
   */
  getPrototypeNavigation(collection: AgentPrototypeCollection): {
    hasActivePrototypes: boolean
    experimentalCount: number
    archivedCount: number
    featuredPrototype?: PrototypeVersion
  } {
    const activePrototypes = collection.prototypes.filter(p => p.status === 'active')
    const experimentalPrototypes = collection.experiments
    const archivedPrototypes = collection.archived

    return {
      hasActivePrototypes: activePrototypes.length > 0,
      experimentalCount: experimentalPrototypes.length,
      archivedCount: archivedPrototypes.length,
      featuredPrototype: activePrototypes[0] // Most recent active prototype
    }
  }

  private getDefaultCollection(agentHandle: string): AgentPrototypeCollection {
    return {
      agentHandle,
      prototypes: [],
      experiments: [],
      archived: [],
      activeExperiments: 0,
      totalPrototypes: 0,
      lastUpdated: new Date().toISOString()
    }
  }
}

export const betaPrototypeManager = new BetaPrototypeManager()