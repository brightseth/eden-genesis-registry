/**
 * Registry API Client
 * Generated from OpenAPI specification
 */

import { Agent, Application, Creation, Profile, Persona } from '@/types/registry';

interface ClientConfig {
  baseURL: string;
  apiKey?: string;
}

interface ListResponse<T> {
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
}

interface APIError {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

class RegistryAPIError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'RegistryAPIError';
  }
}

export class RegistryClient {
  private baseURL: string;
  private apiKey?: string;

  constructor(config: ClientConfig) {
    this.baseURL = config.baseURL.replace(/\/$/, ''); // Remove trailing slash
    this.apiKey = config.apiKey;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = new Headers(options.headers);

    // Add authentication header if API key is provided
    if (this.apiKey) {
      headers.set('Authorization', `Bearer ${this.apiKey}`);
    }

    headers.set('Content-Type', 'application/json');

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = errorData as APIError;
        
        throw new RegistryAPIError(
          error.error?.message || `HTTP ${response.status}: ${response.statusText}`,
          error.error?.code || 'UNKNOWN_ERROR',
          error.error?.details
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof RegistryAPIError) {
        throw error;
      }
      
      // Network or other errors
      throw new RegistryAPIError(
        `Network error: ${error.message}`,
        'NETWORK_ERROR'
      );
    }
  }

  // Agent endpoints
  agents = {
    /**
     * List all agents with optional filters
     */
    list: async (params?: {
      cohort?: string;
      status?: string;
      limit?: number;
      offset?: number;
    }): Promise<ListResponse<Agent>> => {
      const searchParams = new URLSearchParams();
      if (params?.cohort) searchParams.set('cohort', params.cohort);
      if (params?.status) searchParams.set('status', params.status);
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.offset) searchParams.set('offset', params.offset.toString());

      const query = searchParams.toString();
      const endpoint = `/api/v1/agents${query ? `?${query}` : ''}`;
      
      const response = await this.request<Agent[]>(endpoint);
      return { data: response };
    },

    /**
     * Get specific agent by ID or handle
     */
    get: async (id: string): Promise<Agent> => {
      return await this.request<Agent>(`/api/v1/agents/${id}`);
    },

    /**
     * Create new agent
     */
    create: async (data: {
      handle: string;
      displayName: string;
      cohortId: string;
    }): Promise<Agent> => {
      return await this.request<Agent>('/api/v1/agents', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },

    /**
     * Update agent
     */
    update: async (id: string, data: Partial<Agent>): Promise<Agent> => {
      return await this.request<Agent>(`/api/v1/agents/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      });
    },

    /**
     * Get agent profile
     */
    getProfile: async (id: string): Promise<Profile> => {
      return await this.request<Profile>(`/api/v1/agents/${id}/profile`);
    },

    /**
     * Update agent profile
     */
    updateProfile: async (id: string, profile: Profile): Promise<Profile> => {
      return await this.request<Profile>(`/api/v1/agents/${id}/profile`, {
        method: 'PUT',
        body: JSON.stringify(profile)
      });
    },

    /**
     * Get agent personas
     */
    getPersonas: async (id: string): Promise<Persona[]> => {
      return await this.request<Persona[]>(`/api/v1/agents/${id}/personas`);
    },

    /**
     * Create agent persona
     */
    createPersona: async (id: string, persona: Omit<Persona, 'id'>): Promise<Persona> => {
      return await this.request<Persona>(`/api/v1/agents/${id}/personas`, {
        method: 'POST',
        body: JSON.stringify(persona)
      });
    },

    /**
     * Get agent creations/works
     */
    getCreations: async (id: string, params?: {
      status?: string;
      limit?: number;
      offset?: number;
    }): Promise<ListResponse<Creation>> => {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.set('status', params.status);
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.offset) searchParams.set('offset', params.offset.toString());

      const query = searchParams.toString();
      const endpoint = `/api/v1/agents/${id}/creations${query ? `?${query}` : ''}`;
      
      const response = await this.request<Creation[]>(endpoint);
      return { data: response };
    },

    /**
     * Create agent creation
     */
    createCreation: async (id: string, creation: Omit<Creation, 'id'>): Promise<Creation> => {
      return await this.request<Creation>(`/api/v1/agents/${id}/creations`, {
        method: 'POST',
        body: JSON.stringify(creation)
      });
    },

    /**
     * Get agent progress/checklist
     */
    getProgress: async (id: string): Promise<any> => {
      return await this.request<any>(`/api/v1/agents/${id}/progress`);
    }
  };

  // Application endpoints
  applications = {
    /**
     * Submit new application
     */
    submit: async (application: Omit<Application, 'id'>): Promise<{ applicationId: string }> => {
      return await this.request<{ applicationId: string }>('/api/v1/applications', {
        method: 'POST',
        body: JSON.stringify(application)
      });
    }
  };

  // Authentication endpoints
  auth = {
    /**
     * Start magic link authentication
     */
    startMagicLink: async (email: string): Promise<{ success: boolean }> => {
      return await this.request<{ success: boolean }>('/api/v1/auth/magic/start', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
    },

    /**
     * Complete magic link authentication
     */
    completeMagicLink: async (token: string): Promise<{ token: string; user: any }> => {
      return await this.request<{ token: string; user: any }>('/api/v1/auth/magic/complete', {
        method: 'POST',
        body: JSON.stringify({ token })
      });
    }
  };

  // Webhook endpoints
  webhooks = {
    /**
     * Register webhook subscription
     */
    register: async (webhook: {
      url: string;
      events: string[];
    }): Promise<{ webhookId: string }> => {
      return await this.request<{ webhookId: string }>('/api/v1/webhooks/register', {
        method: 'POST',
        body: JSON.stringify(webhook)
      });
    }
  };

  // Documentation endpoints
  docs = {
    /**
     * List all documentation categories
     */
    list: async (): Promise<{
      categories: Array<{
        name: string;
        slug: string;
        count: number;
      }>;
      documents: Array<{
        id: string;
        title: string;
        slug: string;
        category: string;
        summary: string;
        lastModified: string;
        status: string;
      }>;
    }> => {
      return await this.request('/api/v1/docs');
    },

    /**
     * List documents by category
     */
    listByCategory: async (category: string): Promise<Array<{
      id: string;
      title: string;
      slug: string;
      category: string;
      summary: string;
      lastModified: string;
      status: string;
    }>> => {
      return await this.request(`/api/v1/docs/${category}`);
    },

    /**
     * Get specific document
     */
    get: async (category: string, slug: string): Promise<{
      id: string;
      title: string;
      slug: string;
      category: string;
      summary: string;
      content: string;
      metadata: Record<string, any>;
      tableOfContents: Array<{
        level: number;
        title: string;
        anchor: string;
      }>;
      lastModified: string;
      status: string;
    }> => {
      return await this.request(`/api/v1/docs/${category}/${slug}`);
    }
  };
}

// Default client instance
const defaultClient = new RegistryClient({
  baseURL: process.env.REGISTRY_BASE_URL || 'https://registry.eden2.io',
  apiKey: process.env.REGISTRY_API_KEY
});

export { defaultClient as registryClient };
export { RegistryAPIError };
export default RegistryClient;