import React from 'react'
import { BetaFeatureFlag } from '@/lib/schemas/prototype.schema'

interface FeatureFlagContext {
  agentHandle: string
  userRole?: string
  environment: string
  userId?: string
  sessionId?: string
}

export class BetaFeatureFlagService {
  private flags: Map<string, BetaFeatureFlag> = new Map()
  private environment: string

  constructor(environment: string = process.env.NODE_ENV || 'development') {
    this.environment = environment
  }

  /**
   * Load feature flags for an agent
   */
  async loadAgentFlags(agentHandle: string): Promise<void> {
    try {
      const response = await fetch(`/api/v1/agents/${agentHandle}/beta-flags`)
      if (response.ok) {
        const flags: BetaFeatureFlag[] = await response.json()
        
        flags.forEach(flag => {
          this.flags.set(`${agentHandle}:${flag.key}`, flag)
        })
      }
    } catch (error) {
      console.error('Failed to load agent flags:', error)
    }
  }

  /**
   * Check if a beta feature is enabled for given context
   */
  isEnabled(flagKey: string, context: FeatureFlagContext): boolean {
    const fullKey = `${context.agentHandle}:${flagKey}`
    const flag = this.flags.get(fullKey)
    
    if (!flag) {
      return false
    }

    // Check if flag is enabled
    if (!flag.enabled) {
      return false
    }

    // Check environment
    if (!flag.enabledEnvironments.includes(this.environment)) {
      return false
    }

    // Check rollout percentage (simple hash-based distribution)
    if (flag.rolloutPercentage < 100) {
      const hashInput = `${context.userId || context.sessionId || 'anonymous'}:${flagKey}`
      const hash = this.simpleHash(hashInput)
      const userPercentile = hash % 100
      
      if (userPercentile >= flag.rolloutPercentage) {
        return false
      }
    }

    return true
  }

  /**
   * Get all enabled flags for an agent in current context
   */
  getEnabledFlags(context: FeatureFlagContext): BetaFeatureFlag[] {
    const agentFlags: BetaFeatureFlag[] = []
    
    for (const [key, flag] of this.flags.entries()) {
      if (key.startsWith(`${context.agentHandle}:`)) {
        if (this.isEnabled(flag.key, context)) {
          agentFlags.push(flag)
        }
      }
    }
    
    return agentFlags
  }

  /**
   * Register a new beta feature flag
   */
  async registerFlag(flag: BetaFeatureFlag): Promise<void> {
    try {
      const response = await fetch(`/api/v1/agents/${flag.agentHandle}/beta-flags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flag)
      })

      if (response.ok) {
        this.flags.set(`${flag.agentHandle}:${flag.key}`, flag)
      }
    } catch (error) {
      console.error('Failed to register beta flag:', error)
      throw error
    }
  }

  /**
   * Toggle a feature flag
   */
  async toggleFlag(agentHandle: string, flagKey: string, enabled: boolean): Promise<void> {
    try {
      await fetch(`/api/v1/agents/${agentHandle}/beta-flags/${flagKey}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled })
      })

      // Update local cache
      const fullKey = `${agentHandle}:${flagKey}`
      const flag = this.flags.get(fullKey)
      if (flag) {
        flag.enabled = enabled
        this.flags.set(fullKey, flag)
      }
    } catch (error) {
      console.error('Failed to toggle flag:', error)
      throw error
    }
  }

  /**
   * Get feature flag with metadata
   */
  getFlag(agentHandle: string, flagKey: string): BetaFeatureFlag | null {
    return this.flags.get(`${agentHandle}:${flagKey}`) || null
  }

  /**
   * Simple hash function for rollout distribution
   */
  private simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  /**
   * Clean up expired or unused flags
   */
  async cleanupFlags(agentHandle: string, retentionDays: number = 90): Promise<number> {
    let cleaned = 0
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

    for (const [key, flag] of this.flags.entries()) {
      if (key.startsWith(`${agentHandle}:`)) {
        // Check if flag is old and disabled
        const flagAge = Date.now() - Date.parse(flag.metadata?.createdAt as string || '2025-01-01')
        const daysSinceCreation = flagAge / (1000 * 60 * 60 * 24)
        
        if (!flag.enabled && daysSinceCreation > retentionDays) {
          try {
            await fetch(`/api/v1/agents/${agentHandle}/beta-flags/${flag.key}`, {
              method: 'DELETE'
            })
            this.flags.delete(key)
            cleaned++
          } catch (error) {
            console.error(`Failed to cleanup flag ${flag.key}:`, error)
          }
        }
      }
    }

    return cleaned
  }
}

// Global instance
export const betaFeatureFlags = new BetaFeatureFlagService()

// React hook for using feature flags in components
export function useBetaFeatureFlag(flagKey: string, agentHandle: string, userId?: string) {
  const context: FeatureFlagContext = {
    agentHandle,
    environment: process.env.NODE_ENV || 'development',
    userId
  }

  return {
    isEnabled: betaFeatureFlags.isEnabled(flagKey, context),
    flag: betaFeatureFlags.getFlag(agentHandle, flagKey)
  }
}

// Utility function for conditional rendering based on beta flags
export function withBetaFlag<P extends object>(
  Component: React.ComponentType<P>,
  flagKey: string,
  agentHandle: string,
  fallback?: React.ComponentType<P>
) {
  return function BetaWrappedComponent(props: P) {
    const { isEnabled } = useBetaFeatureFlag(flagKey, agentHandle)
    
    if (!isEnabled) {
      return fallback ? React.createElement(fallback, props) : null
    }
    
    return React.createElement(Component, props)
  }
}