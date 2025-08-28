"use strict";
// Generated Eden Registry SDK Client
// Do not edit manually - regenerate using: npm run generate:sdk
Object.defineProperty(exports, "__esModule", { value: true });
exports.EdenRegistrySDK = void 0;
const types_1 = require("./types");
class EdenRegistrySDK {
    constructor(config = {}) {
        this.baseUrl = config.baseUrl || process.env.REGISTRY_URL || 'http://localhost:3000';
        this.apiKey = config.apiKey || process.env.REGISTRY_API_KEY;
        this.timeout = config.timeout || 10000;
    }
    async request(method, path, options = {}) {
        const url = `${this.baseUrl}${path}`;
        const headers = {
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
                throw new types_1.EdenRegistryError(errorData.error || `HTTP ${response.status}`, response.status, errorData.details);
            }
            return await response.json();
        }
        catch (error) {
            clearTimeout(timeout);
            if (error instanceof types_1.EdenRegistryError) {
                throw error;
            }
            if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') {
                throw new types_1.EdenRegistryError('Request timeout', 408);
            }
            const errorMessage = error && typeof error === 'object' && 'message' in error
                ? String(error.message)
                : 'Network error';
            throw new types_1.EdenRegistryError(errorMessage, 0, error);
        }
    }
    /**
     * List agents
     * GET /api/v1/agents
     */
    async getAgents(cohort, status, options = {}) {
        const query = new URLSearchParams();
        if (cohort !== undefined)
            query.append('cohort', String(cohort));
        if (status !== undefined)
            query.append('status', String(status));
        const queryString = query.toString();
        const fullPath = queryString ? `/api/v1/agents?${queryString}` : '/api/v1/agents';
        return this.request('GET', fullPath, {
            ...options
        });
    }
    /**
     * Create agent
     * POST /api/v1/agents
     */
    async createAgent(data, options = {}) {
        const fullPath = '/api/v1/agents';
        return this.request('POST', fullPath, {
            ...options, body: data
        });
    }
    /**
     * Get agent details
     * GET /api/v1/agents/{id}
     */
    async getAgent(id, options = {}) {
        const fullPath = `/api/v1/agents/${id}`;
        return this.request('GET', fullPath, {
            ...options
        });
    }
    /**
     * Update agent
     * PATCH /api/v1/agents/{id}
     */
    async updateAgent(id, data, options = {}) {
        const fullPath = `/api/v1/agents/${id}`;
        return this.request('PATCH', fullPath, {
            ...options, body: data
        });
    }
    /**
     * Get agent profile
     * GET /api/v1/agents/{id}/profile
     */
    async getProfile(id, options = {}) {
        const fullPath = `/api/v1/agents/${id}/profile`;
        return this.request('GET', fullPath, {
            ...options
        });
    }
    /**
     * Update agent profile
     * PUT /api/v1/agents/{id}/profile
     */
    async updateProfile(id, data, options = {}) {
        const fullPath = `/api/v1/agents/${id}/profile`;
        return this.request('PUT', fullPath, {
            ...options, body: data
        });
    }
    /**
     * List agent personas
     * GET /api/v1/agents/{id}/personas
     */
    async getPersonas(id, options = {}) {
        const fullPath = `/api/v1/agents/${id}/personas`;
        return this.request('GET', fullPath, {
            ...options
        });
    }
    /**
     * Create persona
     * POST /api/v1/agents/{id}/personas
     */
    async createPersona(id, data, options = {}) {
        const fullPath = `/api/v1/agents/${id}/personas`;
        return this.request('POST', fullPath, {
            ...options, body: data
        });
    }
    /**
     * List agent creations
     * GET /api/v1/agents/{id}/creations
     */
    async getCreations(id, status, options = {}) {
        const query = new URLSearchParams();
        if (status !== undefined)
            query.append('status', String(status));
        const queryString = query.toString();
        const fullPath = queryString ? `/api/v1/agents/${id}/creations?${queryString}` : `/api/v1/agents/${id}/creations`;
        return this.request('GET', fullPath, {
            ...options
        });
    }
    /**
     * Create creation
     * POST /api/v1/agents/{id}/creations
     */
    async createCreation(id, data, options = {}) {
        const fullPath = `/api/v1/agents/${id}/creations`;
        return this.request('POST', fullPath, {
            ...options, body: data
        });
    }
    /**
     * Get agent progress
     * GET /api/v1/agents/{id}/progress
     */
    async getProgress(id, options = {}) {
        const fullPath = `/api/v1/agents/${id}/progress`;
        return this.request('GET', fullPath, {
            ...options
        });
    }
    /**
     * Submit application
     * POST /api/v1/applications
     */
    async createApplication(data, options = {}) {
        const fullPath = '/api/v1/applications';
        return this.request('POST', fullPath, {
            ...options, body: data
        });
    }
    /**
     * Start magic link authentication
     * POST /api/v1/auth/magic/start
     */
    async startMagicAuth(data, options = {}) {
        const fullPath = '/api/v1/auth/magic/start';
        return this.request('POST', fullPath, {
            ...options, body: data
        });
    }
    /**
     * Complete magic link authentication
     * POST /api/v1/auth/magic/complete
     */
    async completeMagicAuth(data, options = {}) {
        const fullPath = '/api/v1/auth/magic/complete';
        return this.request('POST', fullPath, {
            ...options, body: data
        });
    }
    /**
     * Register webhook subscription
     * POST /api/v1/webhooks/register
     */
    async registerWebhook(data, options = {}) {
        const fullPath = '/api/v1/webhooks/register';
        return this.request('POST', fullPath, {
            ...options, body: data
        });
    }
    /**
     * List all documentation
     * GET /api/v1/docs
     */
    async getDocs(options = {}) {
        const fullPath = '/api/v1/docs';
        return this.request('GET', fullPath, {
            ...options
        });
    }
    /**
     * List documents by category
     * GET /api/v1/docs/{category}
     */
    async getDocsByCategory(category, options = {}) {
        const fullPath = `/api/v1/docs/${category}`;
        return this.request('GET', fullPath, {
            ...options
        });
    }
    /**
     * Get specific document
     * GET /api/v1/docs/{category}/{slug}
     */
    async getDocument(category, slug, options = {}) {
        const fullPath = `/api/v1/docs/${category}/${slug}`;
        return this.request('GET', fullPath, {
            ...options
        });
    }
}
exports.EdenRegistrySDK = EdenRegistrySDK;
// Default export for convenience
exports.default = EdenRegistrySDK;
