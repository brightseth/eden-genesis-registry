import { Agent, Profile, Persona, Creation, Application, Document, DocumentContent, SDKConfig, RequestOptions } from './types';
export declare class EdenRegistrySDK {
    private baseUrl;
    private apiKey?;
    private timeout;
    constructor(config?: SDKConfig);
    private request;
    /**
     * List agents
     * GET /api/v1/agents
     */
    getAgents(cohort?: string, status?: string, options?: RequestOptions): Promise<Agent[]>;
    /**
     * Create agent
     * POST /api/v1/agents
     */
    createAgent(data: {
        handle: string;
        displayName: string;
        cohortId: string;
    }, options?: RequestOptions): Promise<Agent>;
    /**
     * Get agent details
     * GET /api/v1/agents/{id}
     */
    getAgent(id: string, options?: RequestOptions): Promise<Agent>;
    /**
     * Update agent
     * PATCH /api/v1/agents/{id}
     */
    updateAgent(id: string, data: any, options?: RequestOptions): Promise<Agent>;
    /**
     * Get agent profile
     * GET /api/v1/agents/{id}/profile
     */
    getProfile(id: string, options?: RequestOptions): Promise<Profile>;
    /**
     * Update agent profile
     * PUT /api/v1/agents/{id}/profile
     */
    updateProfile(id: string, data: Profile, options?: RequestOptions): Promise<Profile>;
    /**
     * List agent personas
     * GET /api/v1/agents/{id}/personas
     */
    getPersonas(id: string, options?: RequestOptions): Promise<Persona[]>;
    /**
     * Create persona
     * POST /api/v1/agents/{id}/personas
     */
    createPersona(id: string, data: Persona, options?: RequestOptions): Promise<Persona>;
    /**
     * List agent creations
     * GET /api/v1/agents/{id}/creations
     */
    getCreations(id: string, status?: string, options?: RequestOptions): Promise<Creation[]>;
    /**
     * Create creation
     * POST /api/v1/agents/{id}/creations
     */
    createCreation(id: string, data: Creation, options?: RequestOptions): Promise<Creation>;
    /**
     * Get agent progress
     * GET /api/v1/agents/{id}/progress
     */
    getProgress(id: string, options?: RequestOptions): Promise<any>;
    /**
     * Submit application
     * POST /api/v1/applications
     */
    createApplication(data: Application, options?: RequestOptions): Promise<Application>;
    /**
     * Start magic link authentication
     * POST /api/v1/auth/magic/start
     */
    startMagicAuth(data: {
        email: string;
    }, options?: RequestOptions): Promise<any>;
    /**
     * Complete magic link authentication
     * POST /api/v1/auth/magic/complete
     */
    completeMagicAuth(data: {
        token: string;
    }, options?: RequestOptions): Promise<any>;
    /**
     * Register webhook subscription
     * POST /api/v1/webhooks/register
     */
    registerWebhook(data: {
        url: string;
        events: string[];
    }, options?: RequestOptions): Promise<any>;
    /**
     * List all documentation
     * GET /api/v1/docs
     */
    getDocs(options?: RequestOptions): Promise<any>;
    /**
     * List documents by category
     * GET /api/v1/docs/{category}
     */
    getDocsByCategory(category: string, options?: RequestOptions): Promise<Document[]>;
    /**
     * Get specific document
     * GET /api/v1/docs/{category}/{slug}
     */
    getDocument(category: string, slug: string, options?: RequestOptions): Promise<DocumentContent>;
}
export default EdenRegistrySDK;
