export type Include = Array<'profile' | 'personas' | 'artifacts' | 'creations' | 'progress'>

export interface Agent {
  id: string
  handle: string
  displayName: string
  role?: string
  cohort: string
  status: 'INVITED' | 'APPLYING' | 'ONBOARDING' | 'ACTIVE' | 'GRADUATED' | 'ARCHIVED'
  visibility: 'PUBLIC' | 'INTERNAL' | 'PRIVATE'
  profile?: Profile
  personas?: Persona[]
  artifacts?: ModelArtifact[]
  creations?: Creation[]
  progress?: ProgressChecklist
}

export interface Profile {
  statement?: string
  manifesto?: string
  tags: string[]
  links?: Record<string, any>
}

export interface Persona {
  id: string
  name: string
  version: string
  prompt: string
  alignmentNotes?: string
  privacy: 'INTERNAL' | 'PUBLIC'
}

export interface ModelArtifact {
  id: string
  kind: 'TEXT_MODEL' | 'IMAGE_MODEL' | 'LORA' | 'CKPT' | 'VAE' | 'TOKENIZER'
  version: string
  storageUri: string
  hash?: string
  sizeBytes?: bigint
  license?: string
  visibility: 'PUBLIC' | 'INTERNAL' | 'PRIVATE'
  notes?: string
}

export interface Creation {
  id: string
  title: string
  mediaUri?: string
  metadata?: Record<string, any>
  status: 'DRAFT' | 'CURATED' | 'PUBLISHED' | 'ARCHIVED'
  createdAt: string
}

export interface ProgressChecklist {
  id: string
  template: 'GENESIS_AGENT' | 'TRAINER' | 'CURATOR' | 'COLLECTOR' | 'INVESTOR'
  items: ChecklistItem[]
  percent: number
}

export interface ChecklistItem {
  id: string
  label: string
  required: boolean
  done: boolean
  actorRole?: string
}

export interface ListAgentsResponse {
  items: Agent[]
  nextCursor?: string
}

export interface Application {
  applicantEmail: string
  applicantName: string
  track: 'AGENT' | 'TRAINER' | 'CURATOR' | 'COLLECTOR' | 'INVESTOR'
  payload: {
    experience?: string
    portfolio?: string
    statement: string
    referral?: string
  }
}

export interface WebhookSubscription {
  url: string
  events: string[]
}

export class EdenRegistryClient {
  constructor(
    private baseUrl: string,
    private apiKey: string
  ) {}

  private async req<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(this.baseUrl + path, {
      ...init,
      headers: {
        'x-eden-api-key': this.apiKey,
        'content-type': 'application/json',
        'accept': 'application/json',
        ...(init?.headers || {})
      }
    })
    
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`)
    }
    
    return res.json() as Promise<T>
  }

  // Agent methods
  async listAgents(params: {
    cohort?: string
    status?: string | string[]
    include?: Include
    limit?: number
    cursor?: string
  } = {}): Promise<ListAgentsResponse> {
    const q = new URLSearchParams()
    if (params.cohort) q.set('cohort', params.cohort)
    if (params.status) {
      const statusStr = Array.isArray(params.status) 
        ? params.status.join('|') 
        : params.status
      q.set('status', statusStr)
    }
    if (params.include?.length) q.set('include', params.include.join(','))
    if (params.limit) q.set('limit', String(params.limit))
    if (params.cursor) q.set('cursor', params.cursor)
    
    return this.req<ListAgentsResponse>(`/api/v1/agents?${q.toString()}`)
  }

  async getAgent(handleOrId: string, include?: Include): Promise<Agent> {
    const q = include?.length ? `?include=${include.join(',')}` : ''
    return this.req<Agent>(`/api/v1/agents/${encodeURIComponent(handleOrId)}${q}`)
  }

  async updateAgent(id: string, data: Partial<Agent>): Promise<Agent> {
    return this.req<Agent>(`/api/v1/agents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  }

  // Profile methods
  async getAgentProfile(agentId: string): Promise<Profile> {
    return this.req<Profile>(`/api/v1/agents/${agentId}/profile`)
  }

  async updateAgentProfile(agentId: string, profile: Partial<Profile>): Promise<Profile> {
    return this.req<Profile>(`/api/v1/agents/${agentId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(profile)
    })
  }

  // Persona methods
  async listPersonas(agentId: string): Promise<Persona[]> {
    return this.req<Persona[]>(`/api/v1/agents/${agentId}/personas`)
  }

  async createPersona(agentId: string, persona: Omit<Persona, 'id'>): Promise<Persona> {
    return this.req<Persona>(`/api/v1/agents/${agentId}/personas`, {
      method: 'POST',
      body: JSON.stringify(persona)
    })
  }

  // Artifact methods
  async listArtifacts(agentId: string): Promise<ModelArtifact[]> {
    return this.req<ModelArtifact[]>(`/api/v1/agents/${agentId}/artifacts`)
  }

  async createArtifact(agentId: string, artifact: Omit<ModelArtifact, 'id'>): Promise<ModelArtifact> {
    return this.req<ModelArtifact>(`/api/v1/agents/${agentId}/artifacts`, {
      method: 'POST',
      body: JSON.stringify(artifact)
    })
  }

  // Creation methods
  async listCreations(agentId: string, status?: string | string[]): Promise<Creation[]> {
    const q = new URLSearchParams()
    if (status) {
      const statusStr = Array.isArray(status) ? status.join('|') : status
      q.set('status', statusStr)
    }
    const query = q.toString() ? `?${q.toString()}` : ''
    return this.req<Creation[]>(`/api/v1/agents/${agentId}/creations${query}`)
  }

  async createCreation(agentId: string, creation: Omit<Creation, 'id' | 'createdAt'>): Promise<Creation> {
    return this.req<Creation>(`/api/v1/agents/${agentId}/creations`, {
      method: 'POST',
      body: JSON.stringify(creation)
    })
  }

  // Progress methods
  async getProgress(agentId: string): Promise<ProgressChecklist> {
    return this.req<ProgressChecklist>(`/api/v1/agents/${agentId}/progress`)
  }

  async updateProgress(agentId: string, itemId: string, done: boolean): Promise<ProgressChecklist> {
    return this.req<ProgressChecklist>(`/api/v1/agents/${agentId}/progress/check`, {
      method: 'POST',
      body: JSON.stringify({ itemId, done })
    })
  }

  // Application methods
  async submitApplication(application: Application): Promise<{ id: string }> {
    return this.req<{ id: string }>('/api/v1/applications', {
      method: 'POST',
      body: JSON.stringify(application)
    })
  }

  // Webhook methods
  async registerWebhook(subscription: WebhookSubscription): Promise<{ id: string; secret: string }> {
    return this.req<{ id: string; secret: string }>('/api/v1/webhooks/register', {
      method: 'POST',
      body: JSON.stringify(subscription)
    })
  }

  // Dashboard methods
  async getDashboardProgress(cohort?: string): Promise<any> {
    const q = cohort ? `?cohort=${cohort}` : ''
    return this.req<any>(`/api/v1/dashboard/progress${q}`)
  }
}