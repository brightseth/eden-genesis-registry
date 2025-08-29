/**
 * Registry SDK v1 - HTTP Client
 * REGISTRY-GUARDIAN: Typed client for Eden Registry API
 */

import {
  type Agent,
  type ComprehensiveLore,
  type Profile,
  type ApiResponse,
  type AgentListResponse,
  type AgentDetailResponse,
  type StatusResponse,
  type WriteResponse,
  type RegistryClientConfig,
  RegistryError,
  ValidationError,
  NotFoundError,
  UnauthorizedError
} from './types'

export class RegistryClient {
  private baseUrl: string
  private apiKey?: string
  private timeout: number
  private retries: number
  private validateResponses: boolean

  constructor(config: RegistryClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '') // Remove trailing slash
    this.apiKey = config.apiKey
    this.timeout = config.timeout || 10000
    this.retries = config.retries || 3
    this.validateResponses = config.validateResponses ?? true
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        await this.handleErrorResponse(response)
      }

      const data = await response.json()
      return data as T
    } catch (error) {
      if (error instanceof RegistryError) {
        throw error
      }

      // Retry on network errors
      if (retryCount < this.retries && this.shouldRetry(error)) {
        await this.delay(Math.pow(2, retryCount) * 1000)
        return this.request(endpoint, options, retryCount + 1)
      }

      throw new RegistryError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        error
      )
    }
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let errorData: any
    try {
      errorData = await response.json()
    } catch {
      errorData = { error: response.statusText }
    }

    const message = errorData.error || `HTTP ${response.status}`
    const details = errorData.details || errorData

    switch (response.status) {
      case 400:
        if (errorData.details && Array.isArray(errorData.details)) {
          throw new ValidationError(message, errorData.details)
        }
        throw new RegistryError(message, 400, details)
      case 401:
        throw new UnauthorizedError(message)
      case 404:
        throw new NotFoundError('Resource', 'unknown')
      default:
        throw new RegistryError(message, response.status, details)
    }
  }

  private shouldRetry(error: any): boolean {
    return error.name === 'AbortError' || 
           error.name === 'TypeError' ||
           (error.status >= 500 && error.status < 600)
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // ============================================================================
  // AGENT OPERATIONS
  // ============================================================================

  /**
   * List all agents with filtering and pagination
   */
  async listAgents(params?: {
    cohort?: string
    status?: string
    role?: string
    search?: string
    limit?: number
    offset?: number
    sort?: string
    order?: 'asc' | 'desc'
  }): Promise<AgentListResponse['data']> {
    const searchParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, String(value))
        }
      })
    }

    const endpoint = `/api/v1/agents${searchParams.toString() ? '?' + searchParams.toString() : ''}`
    const response = await this.request<AgentListResponse>(endpoint)
    return response.data
  }

  /**
   * Get single agent by ID or handle
   */
  async getAgent(idOrHandle: string): Promise<AgentDetailResponse['data']['agent']> {
    const response = await this.request<AgentDetailResponse>(`/api/v1/agents/${idOrHandle}`)
    return response.data.agent
  }

  /**
   * Create new agent (ADMIN only)
   */
  async createAgent(agentData: Partial<Agent>): Promise<Agent> {
    const response = await this.request<WriteResponse<Agent>>('/api/v1/agents', {
      method: 'POST',
      body: JSON.stringify(agentData)
    })
    return response.data!
  }

  /**
   * Update agent (ADMIN only)
   */
  async updateAgent(idOrHandle: string, agentData: Partial<Agent>): Promise<Agent> {
    const response = await this.request<WriteResponse<Agent>>(`/api/v1/agents/${idOrHandle}`, {
      method: 'PATCH',
      body: JSON.stringify(agentData)
    })
    return response.data!
  }

  // ============================================================================
  // LORE OPERATIONS
  // ============================================================================

  /**
   * Get agent lore
   */
  async getAgentLore(idOrHandle: string): Promise<ComprehensiveLore | null> {
    try {
      const response = await this.request<ApiResponse<ComprehensiveLore>>(`/api/v1/agents/${idOrHandle}/lore`)
      return response.data || null
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null
      }
      throw error
    }
  }

  /**
   * Update agent lore (TRAINER+ only)
   */
  async updateAgentLore(idOrHandle: string, loreData: Partial<ComprehensiveLore>): Promise<ComprehensiveLore> {
    const response = await this.request<WriteResponse<ComprehensiveLore>>(`/api/v1/agents/${idOrHandle}/lore`, {
      method: 'POST',
      body: JSON.stringify(loreData)
    })
    return response.data!
  }

  // ============================================================================
  // PROFILE OPERATIONS  
  // ============================================================================

  /**
   * Get agent profile
   */
  async getAgentProfile(idOrHandle: string): Promise<Profile | null> {
    try {
      const response = await this.request<ApiResponse<Profile>>(`/api/v1/agents/${idOrHandle}/profile`)
      return response.data || null
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null
      }
      throw error
    }
  }

  /**
   * Update agent profile (TRAINER+ only)
   */
  async updateAgentProfile(idOrHandle: string, profileData: Partial<Profile>): Promise<Profile> {
    const response = await this.request<WriteResponse<Profile>>(`/api/v1/agents/${idOrHandle}/profile`, {
      method: 'POST',
      body: JSON.stringify(profileData)
    })
    return response.data!
  }

  // ============================================================================
  // SYSTEM OPERATIONS
  // ============================================================================

  /**
   * Get system status and health
   */
  async getStatus(): Promise<StatusResponse['data']> {
    const response = await this.request<StatusResponse>('/api/v1/status')
    return response.data
  }

  /**
   * Get validation system status
   */
  async getValidationStatus(): Promise<any> {
    const response = await this.request<ApiResponse>('/api/v1/validation/status')
    return response.data
  }

  // ============================================================================
  // CONVENIENCE METHODS
  // ============================================================================

  /**
   * Get complete agent data (profile + lore + basic info)
   */
  async getCompleteAgent(idOrHandle: string): Promise<{
    agent: Agent
    profile: Profile | null
    lore: ComprehensiveLore | null
  }> {
    const [agent, profile, lore] = await Promise.all([
      this.getAgent(idOrHandle),
      this.getAgentProfile(idOrHandle),
      this.getAgentLore(idOrHandle)
    ])

    return { agent, profile, lore }
  }

  /**
   * Health check - throws if Registry is unhealthy
   */
  async healthCheck(): Promise<void> {
    const status = await this.getStatus()
    
    if (status.database !== 'connected') {
      throw new RegistryError('Registry database is disconnected')
    }

    if (!status.validation.enabled) {
      throw new RegistryError('Registry validation is disabled')
    }
  }
}

// Default client factory
export function createRegistryClient(config: RegistryClientConfig): RegistryClient {
  return new RegistryClient(config)
}

// Environment-based client factory
export function createDefaultClient(options?: Partial<RegistryClientConfig>): RegistryClient {
  const baseUrl = process.env.REGISTRY_URL || 'http://localhost:3000'
  const apiKey = process.env.REGISTRY_API_KEY

  return new RegistryClient({
    baseUrl,
    apiKey,
    timeout: 10000,
    retries: 3,
    validateResponses: true,
    ...options
  })
}