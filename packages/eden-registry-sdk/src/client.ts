// Generated Eden Registry SDK Client
// Do not edit manually - regenerate using: npm run generate:sdk

import { 
  Agent,
  Profile,
  Persona,
  Creation,
  Application,
  Document,
  DocumentContent,
  SDKConfig, 
  PaginatedResponse, 
  APIError, 
  EdenRegistryError,
  RequestOptions 
} from './types';

export class EdenRegistrySDK {
  private baseUrl: string;
  private apiKey?: string;
  private timeout: number;
  
  constructor(config: SDKConfig = {}) {
    this.baseUrl = config.baseUrl || process.env.REGISTRY_URL || 'http://localhost:3000';
    this.apiKey = config.apiKey || process.env.REGISTRY_API_KEY;
    this.timeout = config.timeout || 10000;
  }
  
  private async request<T>(
    method: string,
    path: string,
    options: RequestOptions & { body?: any } = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeout || this.timeout);
    
    try {
      const response = await fetch(url, {
        method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new EdenRegistryError(
          errorData.error || `HTTP ${response.status}`,
          response.status,
          errorData.details
        );
      }
      
      return await response.json();
    } catch (error) {
      clearTimeout(timeout);
      
      if (error instanceof EdenRegistryError) {
        throw error;
      }
      
      if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') {
        throw new EdenRegistryError('Request timeout', 408);
      }
      
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? String((error as Error).message) 
        : 'Network error';
      
      throw new EdenRegistryError(
        errorMessage,
        0,
        error
      );
    }
  }
  
  /**
   * List agents
   * GET /api/v1/agents
   */
  async getAgents(cohort?: string, status?: string, options: RequestOptions = {}): Promise<Agent[]> {
    const query = new URLSearchParams();
    if (cohort !== undefined) query.append('cohort', String(cohort));
    if (status !== undefined) query.append('status', String(status));
    const queryString = query.toString();
    const fullPath = queryString ? `/api/v1/agents?${queryString}` : '/api/v1/agents';
    return this.request<Agent[]>('GET', fullPath, {
      ...options
    });
  }

  /**
   * Create agent
   * POST /api/v1/agents
   */
  async createAgent(data: { handle: string; displayName: string; cohortId: string }, options: RequestOptions = {}): Promise<Agent> {
    const fullPath = '/api/v1/agents';
    return this.request<Agent>('POST', fullPath, {
      ...options, body: data
    });
  }

  /**
   * Get agent details
   * GET /api/v1/agents/{id}
   */
  async getAgent(id: string, options: RequestOptions = {}): Promise<Agent> {
    const fullPath = `/api/v1/agents/${id}`;
    return this.request<Agent>('GET', fullPath, {
      ...options
    });
  }

  /**
   * Update agent
   * PATCH /api/v1/agents/{id}
   */
  async updateAgent(id: string, data: any, options: RequestOptions = {}): Promise<Agent> {
    const fullPath = `/api/v1/agents/${id}`;
    return this.request<Agent>('PATCH', fullPath, {
      ...options, body: data
    });
  }

  /**
   * Get agent profile
   * GET /api/v1/agents/{id}/profile
   */
  async getProfile(id: string, options: RequestOptions = {}): Promise<Profile> {
    const fullPath = `/api/v1/agents/${id}/profile`;
    return this.request<Profile>('GET', fullPath, {
      ...options
    });
  }

  /**
   * Update agent profile
   * PUT /api/v1/agents/{id}/profile
   */
  async updateProfile(id: string, data: Profile, options: RequestOptions = {}): Promise<Profile> {
    const fullPath = `/api/v1/agents/${id}/profile`;
    return this.request<Profile>('PUT', fullPath, {
      ...options, body: data
    });
  }

  /**
   * List agent personas
   * GET /api/v1/agents/{id}/personas
   */
  async getPersonas(id: string, options: RequestOptions = {}): Promise<Persona[]> {
    const fullPath = `/api/v1/agents/${id}/personas`;
    return this.request<Persona[]>('GET', fullPath, {
      ...options
    });
  }

  /**
   * Create persona
   * POST /api/v1/agents/{id}/personas
   */
  async createPersona(id: string, data: Persona, options: RequestOptions = {}): Promise<Persona> {
    const fullPath = `/api/v1/agents/${id}/personas`;
    return this.request<Persona>('POST', fullPath, {
      ...options, body: data
    });
  }

  /**
   * List agent creations
   * GET /api/v1/agents/{id}/creations
   */
  async getCreations(id: string, status?: string, options: RequestOptions = {}): Promise<Creation[]> {
    const query = new URLSearchParams();
    if (status !== undefined) query.append('status', String(status));
    const queryString = query.toString();
    const fullPath = queryString ? `/api/v1/agents/${id}/creations?${queryString}` : `/api/v1/agents/${id}/creations`;
    return this.request<Creation[]>('GET', fullPath, {
      ...options
    });
  }

  /**
   * Create creation
   * POST /api/v1/agents/{id}/creations
   */
  async createCreation(id: string, data: Creation, options: RequestOptions = {}): Promise<Creation> {
    const fullPath = `/api/v1/agents/${id}/creations`;
    return this.request<Creation>('POST', fullPath, {
      ...options, body: data
    });
  }

  /**
   * Get agent progress
   * GET /api/v1/agents/{id}/progress
   */
  async getProgress(id: string, options: RequestOptions = {}): Promise<any> {
    const fullPath = `/api/v1/agents/${id}/progress`;
    return this.request<any>('GET', fullPath, {
      ...options
    });
  }

  /**
   * Submit application
   * POST /api/v1/applications
   */
  async createApplication(data: Application, options: RequestOptions = {}): Promise<Application> {
    const fullPath = '/api/v1/applications';
    return this.request<Application>('POST', fullPath, {
      ...options, body: data
    });
  }

  /**
   * Start magic link authentication
   * POST /api/v1/auth/magic/start
   */
  async startMagicAuth(data: { email: string }, options: RequestOptions = {}): Promise<any> {
    const fullPath = '/api/v1/auth/magic/start';
    return this.request<any>('POST', fullPath, {
      ...options, body: data
    });
  }

  /**
   * Complete magic link authentication
   * POST /api/v1/auth/magic/complete
   */
  async completeMagicAuth(data: { token: string }, options: RequestOptions = {}): Promise<any> {
    const fullPath = '/api/v1/auth/magic/complete';
    return this.request<any>('POST', fullPath, {
      ...options, body: data
    });
  }

  /**
   * Register webhook subscription
   * POST /api/v1/webhooks/register
   */
  async registerWebhook(data: { url: string; events: string[] }, options: RequestOptions = {}): Promise<any> {
    const fullPath = '/api/v1/webhooks/register';
    return this.request<any>('POST', fullPath, {
      ...options, body: data
    });
  }

  /**
   * List all documentation
   * GET /api/v1/docs
   */
  async getDocs(options: RequestOptions = {}): Promise<any> {
    const fullPath = '/api/v1/docs';
    return this.request<any>('GET', fullPath, {
      ...options
    });
  }

  /**
   * List documents by category
   * GET /api/v1/docs/{category}
   */
  async getDocsByCategory(category: string, options: RequestOptions = {}): Promise<Document[]> {
    const fullPath = `/api/v1/docs/${category}`;
    return this.request<Document[]>('GET', fullPath, {
      ...options
    });
  }

  /**
   * Get specific document
   * GET /api/v1/docs/{category}/{slug}
   */
  async getDocument(category: string, slug: string, options: RequestOptions = {}): Promise<DocumentContent> {
    const fullPath = `/api/v1/docs/${category}/${slug}`;
    return this.request<DocumentContent>('GET', fullPath, {
      ...options
    });
  }
}

// Default export for convenience
export default EdenRegistrySDK;