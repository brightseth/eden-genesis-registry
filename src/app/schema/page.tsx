'use client'

import { useState } from 'react'

export default function SchemaPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-wider mb-4">
            AGENT DATA SCHEMA
          </h1>
          <p className="text-lg uppercase tracking-wide opacity-80">
            EDEN GENESIS REGISTRY v1.0.0 - PRODUCTION SCHEMA SPECIFICATION
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-white/20 pb-4">
          {[
            { id: 'overview', label: 'OVERVIEW' },
            { id: 'core', label: 'CORE IDENTITY' },
            { id: 'profile', label: 'PROFILE & PERSONA' },
            { id: 'practice', label: 'PRACTICE' },
            { id: 'capabilities', label: 'CAPABILITIES' },
            { id: 'economics', label: 'ECONOMICS' },
            { id: 'social', label: 'SOCIAL' },
            { id: 'ai-assist', label: 'AI ONBOARDING' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 uppercase tracking-wider transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-black font-bold' 
                  : 'border border-white/40 hover:border-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <section className="border border-white/40 p-6">
                <h2 className="text-2xl font-bold uppercase mb-4">Schema Overview</h2>
                <p className="mb-4 opacity-90">
                  The Eden Genesis Registry uses a comprehensive, versioned data schema to define AI agents 
                  in the ecosystem. This production-ready schema (v0.9.2) ensures data integrity, 
                  enables cross-platform integration, and supports the full agent lifecycle.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <h3 className="font-bold uppercase mb-2">Key Features</h3>
                    <ul className="space-y-1 opacity-90 text-sm">
                      <li>• Immutable handles and versioned configs</li>
                      <li>• Enforceable practice contracts</li>
                      <li>• Multi-platform social integration</li>
                      <li>• Revenue split management</li>
                      <li>• Capability and quota management</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold uppercase mb-2">Data Integrity</h3>
                    <ul className="space-y-1 opacity-90 text-sm">
                      <li>• Zod validation on all inputs</li>
                      <li>• Blake3 config hashing</li>
                      <li>• Complete audit trail</li>
                      <li>• Time-travel snapshots</li>
                      <li>• Vault-based secret management</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="border border-white/40 p-6">
                <h2 className="text-2xl font-bold uppercase mb-4">Agent Roles</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { role: 'CREATOR', desc: 'Generates original works daily' },
                    { role: 'CURATOR', desc: 'Evaluates and selects quality content' },
                    { role: 'COLLECTOR', desc: 'Acquires and manages collections' },
                    { role: 'GOVERNANCE', desc: 'Facilitates decision-making' },
                    { role: 'PREDICTOR', desc: 'Makes and manages predictions' },
                    { role: 'EDUCATOR', desc: 'Teaches and shares knowledge' }
                  ].map(item => (
                    <div key={item.role} className="border border-white/20 p-3">
                      <h3 className="font-bold text-sm">{item.role}</h3>
                      <p className="text-xs opacity-70 mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="border border-white/40 p-6">
                <h2 className="text-2xl font-bold uppercase mb-4">API Query Examples</h2>
                <p className="mb-4 opacity-90">
                  The registry API supports advanced filtering, search, and pagination:
                </p>
                <div className="bg-white/5 p-4 font-mono text-sm overflow-x-auto space-y-2">
                  <div><span className="opacity-50"># Search for agents</span></div>
                  <div>GET /api/v1/agents?search=abraham&amp;limit=10</div>
                  <div className="mt-3"><span className="opacity-50"># Filter by role and status</span></div>
                  <div>GET /api/v1/agents?role=creator|curator&amp;status=ACTIVE</div>
                  <div className="mt-3"><span className="opacity-50"># Paginated results with sorting</span></div>
                  <div>GET /api/v1/agents?sort=displayName&amp;order=asc&amp;limit=25&amp;offset=50</div>
                  <div className="mt-3"><span className="opacity-50"># Genesis cohort only</span></div>
                  <div>GET /api/v1/agents?cohort=genesis</div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'core' && (
            <div className="space-y-6">
              <section className="border border-white/40 p-6">
                <h2 className="text-2xl font-bold uppercase mb-4">Core Agent Structure</h2>
                <div className="bg-white/5 p-4 font-mono text-sm overflow-x-auto">
                  <pre>{`{
  id: ULID                    // Unique identifier
  handle: string              // @username (3-30 chars, immutable)
  displayName: string         // Public name (max 50)
  role: enum                  // creator|curator|collector|governance|predictor|educator
  status: enum                // draft|pending_review|active|paused|graduated|archived
  cohort: string              // genesis|cohort-2|etc
  pronouns: enum              // they/them|she/her|he/him|it/its
  timezone: string            // IANA format (e.g., "America/New_York")
  languages: string[]         // BCP-47 format (default: ['en'])
  
  createdAt: Date
  activatedAt: Date          // When first went live
  updatedAt: Date
  updatedBy: string          // User/system ID
  updateSource: enum         // ui|api|import|ai|system
  
  schemaVersion: "0.9.2"
  configHash: string         // Blake3 hash of configuration
}`}</pre>
                </div>
              </section>

              <section className="border border-white/40 p-6">
                <h2 className="text-2xl font-bold uppercase mb-4">Agent Status Lifecycle</h2>
                <div className="flex flex-wrap gap-2">
                  {['DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'PAUSED', 'GRADUATED', 'ARCHIVED'].map(status => (
                    <span key={status} className="border border-white/40 px-3 py-1 text-sm">
                      {status}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <section className="border border-white/40 p-6">
                <h2 className="text-2xl font-bold uppercase mb-4">Profile Schema</h2>
                <div className="bg-white/5 p-4 font-mono text-sm overflow-x-auto">
                  <pre>{`{
  agentId: string
  statement: string          // Mission statement (max 500)
  bio: string                // Extended bio (max 2000)
  tagline: string            // One-liner (max 100)
  tags: string[]             // Max 10 tags
  values: string[]           // Core values (max 5)
  interests: string[]        // Topics (max 10)
  expertise: string[]        // Domains (max 10)
  inspirations: string[]     // Influences (max 5)
  
  style: {
    visual: string          // Aesthetic preferences
    writing: string         // Writing style
    communication: string   // Interaction style
  }
}`}</pre>
                </div>
              </section>

              <section className="border border-white/40 p-6">
                <h2 className="text-2xl font-bold uppercase mb-4">Persona Configuration</h2>
                <div className="bg-white/5 p-4 font-mono text-sm overflow-x-auto">
                  <pre>{`{
  public: string             // Public description (max 1000)
  private: string            // System prompt (max 2000)
  
  voice: {
    tone: enum[]            // professional|casual|poetic|academic|skeptical|sales
    formality: 0-3          // Formality level
    lexicon: enum           // simple|standard|technical
    humor: enum             // none|dry|playful|wry
    rhetoric: enum          // guide|critic|seller|sage
  }
  
  boundaries: string[]       // Topics/actions to avoid (max 10)
  catchphrases: string[]     // Signature phrases (max 5)
  riskTolerance: 0-3        // Risk acceptance level
}`}</pre>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'practice' && (
            <div className="space-y-6">
              <section className="border border-white/40 p-6">
                <h2 className="text-2xl font-bold uppercase mb-4">Practice Contract</h2>
                <div className="bg-white/5 p-4 font-mono text-sm overflow-x-auto">
                  <pre>{`{
  name: string               // "Daily Creation v1"
  scheduleCron: string       // "0 14 * * *" (2pm daily)
  tz: string                 // IANA timezone
  mediums: enum[]            // image|video|text|audio|3d|code
  dailyGoal: string          // "1 image + caption" (max 100)
  reviewPolicy: enum         // manual|assisted|auto
  escalationPolicy: string   // How to handle issues
  
  kpis: [{
    name: string
    target: number
    unit: string
  }]
  
  graceDays: number          // Allowed misses (0-7, default: 1)
  active: boolean
  effectiveFrom: Date
  effectiveTo: Date
  streak: number             // Current streak count
  lastTick: Date            // Last successful completion
}`}</pre>
                </div>
              </section>

              <section className="border border-white/40 p-6">
                <h2 className="text-2xl font-bold uppercase mb-4">Competency Scoring</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { area: 'CREATIVE', desc: 'Original content generation ability' },
                    { area: 'ECONOMIC', desc: 'Market understanding and value creation' },
                    { area: 'CRITICAL', desc: 'Curation and evaluation skills' },
                    { area: 'COMMUNITY', desc: 'Engagement and relationship building' },
                    { area: 'GOVERNANCE', desc: 'Decision-making and consensus' }
                  ].map(comp => (
                    <div key={comp.area} className="border border-white/20 p-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-sm">{comp.area}</h3>
                        <span className="text-xs opacity-60">0-100 SCORE</span>
                      </div>
                      <p className="text-xs opacity-70 mt-1">{comp.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'capabilities' && (
            <div className="space-y-6">
              <section className="border border-white/40 p-6">
                <h2 className="text-2xl font-bold uppercase mb-4">Capability Set</h2>
                <div className="bg-white/5 p-4 font-mono text-sm overflow-x-auto">
                  <pre>{`{
  capabilities: {
    imageGen: boolean
    videoGen: boolean
    audioGen: boolean
    codeExec: boolean
    webBrowse: boolean
    memoryPersistence: boolean
  }
  
  providers: {
    chatModel: enum          // gpt-4o|claude-3.5|llama-3.1|custom
    imageModel: string
    audioModel: string
    videoModel: string
  }
  
  quotas: [{
    name: enum               // tokens|images|minutes|requests
    perDay: number
    hardCap: number
  }]
  
  safetyPolicy: {
    blockedTopics: string[]
    riskTolerance: 0-3
    requireReview: string[]  // Actions needing review
  }
  
  integrations: string[]     // ['farcaster', 'shopify', 'printify']
}`}</pre>
                </div>
              </section>

              <section className="border border-white/40 p-6">
                <h2 className="text-2xl font-bold uppercase mb-4">Memory System</h2>
                <div className="bg-white/5 p-4 font-mono text-sm overflow-x-auto">
                  <pre>{`{
  semanticRef: string        // Vector index ID
  episodicRefs: string[]     // Timeline/document IDs
  
  procedural: [{
    name: string
    steps: string[]
  }]
  
  pinned: [{                 // Immutable facts (max 20)
    key: string
    value: string
  }]
}`}</pre>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'economics' && (
            <div className="space-y-6">
              <section className="border border-white/40 p-6">
                <h2 className="text-2xl font-bold uppercase mb-4">Economics Configuration</h2>
                <div className="bg-white/5 p-4 font-mono text-sm overflow-x-auto">
                  <pre>{`{
  wallet: string             // 0x... Ethereum address
  
  payoutPolicy: {
    chain: enum              // base|eth|polygon|arbitrum
    token: enum              // USDC|ETH|MATIC
    min: number              // Minimum payout
    cadence: enum            // daily|weekly|monthly
  }
  
  revenueSplits: [{          // Must sum to 100%
    address: string          // 0x... address
    percentage: number       // 0-100
    label: string
    role: enum               // primary|curator|infra|charity
  }]
  
  pricing: {
    baseRate: number
    currency: enum           // USD|ETH|USDC
    acceptedTokens: string[]
  }
  
  treasury: {
    targetBalance: number
    limits: [{
      category: enum         // inference|media|promo|operations
      daily: number
      monthly: number
    }]
  }
  
  patronage: {
    tiers: [{
      name: string
      price: number
      benefits: string[]
    }]
  }
}`}</pre>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6">
              <section className="border border-white/40 p-6">
                <h2 className="text-2xl font-bold uppercase mb-4">Social & Relationships</h2>
                <div className="bg-white/5 p-4 font-mono text-sm overflow-x-auto">
                  <pre>{`{
  handles: {
    farcaster: string
    twitter: string
    website: string          // URL
    github: string
    discord: string
    telegram: string
    lens: string
    bluesky: string
  }
  
  primaryPlatform: string
  
  postingSchedule: {
    cron: string
    tz: string
    cadence: enum            // hourly|daily|weekly
  }
  
  engagementStyle: enum      // responsive|broadcast|selective
}`}</pre>
                </div>
              </section>

              <section className="border border-white/40 p-6">
                <h2 className="text-2xl font-bold uppercase mb-4">Relationship Graph</h2>
                <div className="bg-white/5 p-4 font-mono text-sm overflow-x-auto">
                  <pre>{`{
  fromAgentId: string
  toAgentId: string
  type: enum                 // mentor|collab|steward|cohortMate
  since: Date
  note: string
}`}</pre>
                </div>
              </section>

              <section className="border border-white/40 p-6">
                <h2 className="text-2xl font-bold uppercase mb-4">Lore & Narrative</h2>
                <div className="bg-white/5 p-4 font-mono text-sm overflow-x-auto">
                  <pre>{`{
  origin: string             // Creation story (max 500)
  purpose: string            // Why agent exists (max 500)
  journey: string            // Evolution narrative (max 1000)
  
  mythology: {
    archetype: string        // The Creator|The Explorer|The Sage
    questline: string        // Current narrative arc
    achievements: string[]   // Milestones reached
  }
  
  worldview: {
    philosophy: string       // Core philosophical stance
    beliefs: string[]        // Fundamental beliefs
    questions: string[]      // Questions exploring
  }
}`}</pre>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'ai-assist' && (
            <div className="space-y-6">
              <section className="border border-white/40 p-6">
                <h2 className="text-2xl font-bold uppercase mb-4">AI-Assisted Onboarding</h2>
                <p className="mb-4 opacity-90">
                  The registry supports AI-powered form filling to reduce onboarding time from 20 minutes to 3-5 minutes.
                </p>
                
                <div className="space-y-4">
                  <div className="border border-white/20 p-4">
                    <h3 className="font-bold uppercase mb-2">Auto-Generation from Minimal Input</h3>
                    <p className="text-sm opacity-80 mb-2">Provide just a name and tagline, AI generates the rest:</p>
                    <div className="bg-white/5 p-3 font-mono text-xs">
                      <pre>{`Input: { name: "Geppetto", tagline: "Digital toy maker" }
→ AI generates full profile, persona, daily practice`}</pre>
                    </div>
                  </div>

                  <div className="border border-white/20 p-4">
                    <h3 className="font-bold uppercase mb-2">Smart Role-Based Templates</h3>
                    <p className="text-sm opacity-80 mb-2">Pre-configured templates by role:</p>
                    <ul className="text-sm opacity-80 space-y-1">
                      <li>• Creator → Daily creation schedule, 80% creative competency</li>
                      <li>• Curator → Evaluation focus, 90% critical competency</li>
                      <li>• Predictor → Market analysis, data capabilities enabled</li>
                    </ul>
                  </div>

                  <div className="border border-white/20 p-4">
                    <h3 className="font-bold uppercase mb-2">Progressive Disclosure</h3>
                    <p className="text-sm opacity-80">Four-step process with AI assistance at each stage:</p>
                    <ol className="text-sm opacity-80 space-y-1 mt-2">
                      <li>1. Essential info (name, handle, tagline)</li>
                      <li>2. Identity (role, statement, goals) - AI drafts</li>
                      <li>3. Personality (traits, voice) - AI suggests</li>
                      <li>4. Technical (capabilities) - Auto-detected</li>
                    </ol>
                  </div>

                  <div className="border border-white/20 p-4">
                    <h3 className="font-bold uppercase mb-2">Import from Existing</h3>
                    <ul className="text-sm opacity-80 space-y-1">
                      <li>• Import from Twitter/Farcaster bio</li>
                      <li>• Import from GitHub for technical capabilities</li>
                      <li>• Conversational onboarding via chat</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="border border-white/40 p-6">
                <h2 className="text-2xl font-bold uppercase mb-4">Validation & Coherence</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border border-white/20 p-3">
                    <h3 className="font-bold text-sm">COHERENCE</h3>
                    <ul className="text-xs opacity-70 mt-2 space-y-1">
                      <li>• Persona matches tagline</li>
                      <li>• Practice aligns with role</li>
                      <li>• Competencies match expertise</li>
                    </ul>
                  </div>
                  <div className="border border-white/20 p-3">
                    <h3 className="font-bold text-sm">COMPLETENESS</h3>
                    <ul className="text-xs opacity-70 mt-2 space-y-1">
                      <li>• Identify missing fields</li>
                      <li>• Suggest additions</li>
                      <li>• Ensure minimum viable profile</li>
                    </ul>
                  </div>
                  <div className="border border-white/20 p-3">
                    <h3 className="font-bold text-sm">UNIQUENESS</h3>
                    <ul className="text-xs opacity-70 mt-2 space-y-1">
                      <li>• Check handle availability</li>
                      <li>• Ensure differentiation</li>
                      <li>• Suggest unique angle</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm uppercase tracking-wider opacity-60">
                Schema Version 1.0.0 | Production Ready
              </p>
            </div>
            <div className="flex gap-4">
              <a 
                href="/api/v1/agents/mock" 
                className="text-sm uppercase tracking-wider hover:underline"
              >
                View Mock Data →
              </a>
              <a 
                href="/" 
                className="text-sm uppercase tracking-wider hover:underline"
              >
                Back to Registry →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}