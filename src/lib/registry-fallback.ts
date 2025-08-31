// Registry Fallback System for Graceful Degradation
// Implements ADR-022 Registry-First Pattern with robust failover

interface RegistryEndpoint {
  url: string
  timeout: number
  description: string
}

interface Agent {
  id: string
  handle: string
  displayName: string
  role?: string
  status: string
  visibility: string
  cohort?: string
  profile?: {
    statement?: string
    manifesto?: string
    tags?: string[]
    imageUrl?: string
    links?: any
  }
  createdAt: string
  updatedAt: string
}

// Fallback agent data based on existing static data
const ABRAHAM_FALLBACK_DATA: Agent = {
  id: 'abraham-fallback-id',
  handle: 'abraham',
  displayName: 'Abraham',
  role: 'Collective Intelligence Artist',
  status: 'ACTIVE',
  visibility: 'PUBLIC',
  cohort: 'genesis',
  profile: {
    statement: 'Collective Intelligence Artist - Synthesizing human knowledge into visual artifacts.',
    manifesto: 'Bound by thirteen-year covenant to create daily, bridging human knowledge with divine creation through autonomous art.',
    tags: ['knowledge', 'history', 'collective-intelligence'],
    links: {
      specialty: {
        medium: 'knowledge-synthesis',
        dailyGoal: 'One knowledge synthesis artwork exploring historical patterns',
        description: 'Transforms collective human knowledge into visual art'
      }
    }
  },
  createdAt: new Date('2024-01-01').toISOString(),
  updatedAt: new Date().toISOString()
}

// Registry endpoints in order of preference
const REGISTRY_ENDPOINTS: RegistryEndpoint[] = [
  {
    url: 'http://localhost:3001',
    timeout: 3000,
    description: 'Local Development Registry'
  },
  {
    url: 'https://eden-genesis-registry.vercel.app',
    timeout: 8000,
    description: 'Vercel Deployment Registry'
  },
  {
    url: process.env.NEXT_PUBLIC_REGISTRY_BASE_URL || 'https://registry.eden2.io',
    timeout: 10000,
    description: 'Production Registry (Last Resort)'
  }
]

export class RegistryFallbackManager {
  private static cache = new Map<string, { data: Agent, timestamp: number }>()
  private static readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  /**
   * Fetch agent data with comprehensive fallback strategy
   */
  static async fetchAgent(handle: string): Promise<{
    data: Agent | null
    source: string
    error?: string
  }> {
    // Check cache first
    const cached = this.getCachedAgent(handle)
    if (cached) {
      return {
        data: cached.data,
        source: 'cache',
      }
    }

    // Try each Registry endpoint
    for (const endpoint of REGISTRY_ENDPOINTS) {
      try {
        console.log(`Trying ${endpoint.description}: ${endpoint.url}`)
        
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), endpoint.timeout)
        
        const response = await fetch(`${endpoint.url}/api/v1/agents/${handle}`, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        })
        
        clearTimeout(timeoutId)
        
        if (response.ok) {
          const data = await response.json()
          
          // Cache successful response
          this.setCachedAgent(handle, data)
          
          return {
            data,
            source: endpoint.description
          }
        } else if (response.status === 404) {
          // Don't try other endpoints if agent doesn't exist
          return {
            data: null,
            source: endpoint.description,
            error: `Agent "${handle}" not found in Registry`
          }
        } else {
          console.warn(`${endpoint.description} returned ${response.status}`)
          continue
        }
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.warn(`${endpoint.description} failed:`, errorMessage)
        continue
      }
    }

    // All endpoints failed - use fallback data for Abraham
    if (handle === 'abraham') {
      console.log('All Registry endpoints failed, using Abraham fallback data')
      return {
        data: ABRAHAM_FALLBACK_DATA,
        source: 'static fallback'
      }
    }

    return {
      data: null,
      source: 'none',
      error: 'All Registry endpoints unavailable and no fallback data available'
    }
  }

  /**
   * Enhanced error handling with user-friendly messages
   */
  static getErrorMessage(error: string, handle: string): string {
    if (error.includes('not found')) {
      return `Agent "${handle}" not found in Registry`
    }
    if (error.includes('503') || error.includes('Database unavailable')) {
      return 'Registry temporarily unavailable - please try again shortly'
    }
    if (error.includes('500') || error.includes('server error')) {
      return 'Registry server error - our team has been notified'
    }
    if (error.includes('timeout')) {
      return 'Registry request timed out - please check your connection'
    }
    if (error.includes('network')) {
      return 'Network error connecting to Registry'
    }
    return 'Unable to load agent data - please try again'
  }

  private static getCachedAgent(handle: string) {
    const cached = this.cache.get(handle)
    if (!cached) return null
    
    const now = Date.now()
    if (now - cached.timestamp > this.CACHE_TTL) {
      this.cache.delete(handle)
      return null
    }
    
    return cached
  }

  private static setCachedAgent(handle: string, data: Agent) {
    this.cache.set(handle, {
      data,
      timestamp: Date.now()
    })
  }

  /**
   * Health check for Registry endpoints
   */
  static async checkEndpointHealth(): Promise<{
    endpoint: string
    status: 'healthy' | 'unhealthy' | 'timeout'
    responseTime?: number
  }[]> {
    const results = await Promise.allSettled(
      REGISTRY_ENDPOINTS.map(async (endpoint) => {
        const startTime = Date.now()
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), endpoint.timeout)
          
          const response = await fetch(`${endpoint.url}/api/v1/status`, {
            signal: controller.signal
          })
          
          clearTimeout(timeoutId)
          const responseTime = Date.now() - startTime
          
          return {
            endpoint: endpoint.description,
            status: response.ok ? 'healthy' as const : 'unhealthy' as const,
            responseTime
          }
        } catch (error) {
          const responseTime = Date.now() - startTime
          return {
            endpoint: endpoint.description,
            status: error instanceof Error && error.name === 'AbortError' 
              ? 'timeout' as const 
              : 'unhealthy' as const,
            responseTime
          }
        }
      })
    )

    return results.map(result => 
      result.status === 'fulfilled' 
        ? result.value 
        : { endpoint: 'unknown', status: 'unhealthy' as const }
    )
  }
}