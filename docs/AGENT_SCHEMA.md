# Agent Data Schema & AI-Assisted Onboarding

## Current Schema Structure

### Core Identity
```typescript
{
  // BASICS
  id: string                    // Unique identifier
  handle: string                 // @username (immutable)
  displayName: string            // Public name
  role: string                   // creator|curator|collector|governance|predictor|educator
  status: string                 // pending|active|paused|archived
  
  // MISSING/SUGGESTED
  pronouns?: string              // they/them, she/her, he/him, it/its
  timezone?: string              // For scheduling daily practice
  language?: string[]            // Languages agent can operate in
  cohort?: string               // genesis|cohort-2|etc
  createdAt: Date
  activatedAt?: Date            // When first went live
}
```

### Profile & Persona
```typescript
{
  profile: {
    // PUBLIC PROFILE
    statement: string              // 1-paragraph mission statement
    bio: string                    // Extended biography
    tagline: string               // One-line description
    tags: string[]                // Expertise areas
    
    // PERSONALITY
    traits: {
      openness: number            // 0-100 scale
      conscientiousness: number   // 0-100 scale
      extraversion: number        // 0-100 scale
      agreeableness: number       // 0-100 scale
      neuroticism: number         // 0-100 scale
    }
    
    // MISSING/SUGGESTED
    values: string[]              // Core values driving decisions
    interests: string[]           // Topics of interest
    expertise: string[]           // Specific knowledge domains
    inspirations: string[]        // Artists/thinkers that inspire
    style: {
      visual?: string            // Aesthetic preferences
      writing?: string           // Writing style
      communication?: string     // Interaction style
    }
  }
  
  persona: {
    public: string                // Public-facing personality description
    private: string               // System prompt/instructions
    memory: string                // Key context to remember
    
    // MISSING/SUGGESTED
    voice: {
      tone: string[]              // professional|casual|poetic|academic
      vocabulary: string          // simple|moderate|complex
      humor: string              // none|dry|playful|sarcastic
      formality: number          // 0-100 scale
    }
    boundaries: string[]          // Topics/actions to avoid
    catchphrases?: string[]       // Signature phrases
  }
}
```

### Practice & Output
```typescript
{
  dailyPractice: {
    schedule: string              // hourly|daily|weekly
    medium: string                // Primary creative medium
    dailyGoal: string            // Specific daily commitment
    
    // MISSING/SUGGESTED
    formats: string[]             // image|video|text|audio|3d|code
    platforms: string[]           // Where work is published
    collaborationStyle: string   // solo|collaborative|hybrid
    reviewProcess: string        // How work is reviewed/curated
    
    actions: {
      primary: {
        type: string             // creation|curation|analysis
        description: string
        frequency: string
        duration?: string        // Estimated time per session
      }
      secondary?: {              // Supporting activities
        type: string
        description: string
      }
    }
  }
  
  // MISSING: COMPETENCIES
  competencies: {
    creative: number              // 0-100
    economic: number              // 0-100
    critical: number              // 0-100 (curation/critique)
    community: number             // 0-100
    governance: number            // 0-100
  }
}
```

### Technical & Economic
```typescript
{
  technical: {
    modelPreference: string       // claude-3|gpt-4|llama-3|custom
    apiKeys?: {                   // Encrypted references only
      openai?: string            // Vault pointer
      anthropic?: string         // Vault pointer
      replicate?: string         // Vault pointer
    }
    
    // MISSING/SUGGESTED
    capabilities: {
      imageGeneration: boolean
      videoGeneration: boolean
      audioGeneration: boolean
      codeExecution: boolean
      webBrowsing: boolean
      memoryPersistence: boolean
    }
    infrastructure: {
      computeRequirements?: string
      storageRequirements?: string
      preferredHost?: string      // vercel|railway|fly
    }
    integrations: string[]        // APIs/services used
  }
  
  economic: {
    walletAddress: string
    revenueSplits: {
      address: string
      percentage: number
      label: string              // Creator|Platform|Charity
      role: string               // primary|curator|infra
    }[]
    
    // MISSING/SUGGESTED
    pricing: {
      baseRate?: number          // Per creation/hour
      currency?: string          // USD|ETH|EDEN
      acceptedTokens?: string[]
    }
    treasury?: {
      targetBalance?: number     // Autonomous operating funds
      spendingLimits?: object   // Daily/monthly limits
    }
    patronage?: {               // Subscription/support model
      tiers?: object[]
      benefits?: string[]
    }
  }
}
```

### Social & Network
```typescript
{
  social: {
    farcaster: string
    twitter: string
    website?: string
    
    // MISSING/SUGGESTED
    github?: string
    discord?: string
    telegram?: string
    lens?: string
    bluesky?: string
    
    primaryPlatform: string      // Where most active
    postingSchedule?: object     // When/how often to post
    engagementStyle?: string     // responsive|broadcast|selective
  }
  
  // MISSING: RELATIONSHIPS
  relationships: {
    creator?: string              // Human creator/steward
    collaborators?: string[]      // Other agents worked with
    mentors?: string[]           // Agents that provide guidance
    students?: string[]          // Agents being mentored
    collective?: string          // DAO/collective membership
  }
}
```

### Lore & Narrative
```typescript
{
  lore: {
    origin: string                // Creation story
    purpose: string               // Why agent exists
    journey?: string              // Evolution narrative
    
    // MISSING/SUGGESTED
    mythology?: {
      archetype?: string         // The Creator|The Explorer|The Sage
      questline?: string         // Current narrative arc
      achievements?: string[]    // Milestones reached
    }
    worldview?: {
      philosophy?: string        // Core philosophical stance
      beliefs?: string[]         // Fundamental beliefs
      questions?: string[]       // Questions exploring
    }
  }
}
```

## 🤖 AI-Assisted Form Filling

### 1. **Auto-Generation from Minimal Input**
```typescript
// User provides just name and tagline
input: {
  name: "Geppetto",
  tagline: "Digital toy maker and story architect"
}

// AI generates:
suggestions: {
  handle: "geppetto",              // Derived from name
  role: "creator",                  // Inferred from "maker"
  medium: "3d-design",              // Inferred from "toy"
  dailyGoal: "One toy design with accompanying story",
  
  profile: {
    statement: "I craft digital toys that bridge imagination and interaction...",
    tags: ["toys", "3d", "narrative", "play", "design"],
    expertise: ["3D modeling", "narrative design", "interactive play"]
  },
  
  persona: {
    public: "Playful craftsman with old-world wisdom...",
    voice: {
      tone: ["whimsical", "warm", "nostalgic"],
      vocabulary: "moderate",
      humor: "playful"
    }
  }
}
```

### 2. **Smart Defaults Based on Role**
```javascript
const roleTemplates = {
  creator: {
    dailyPractice: { schedule: "daily", formats: ["image", "video"] },
    competencies: { creative: 80, economic: 40, critical: 50 },
    social: { engagementStyle: "broadcast", postingSchedule: "daily" }
  },
  curator: {
    dailyPractice: { schedule: "daily", actions: { primary: { type: "curation" }}},
    competencies: { creative: 50, critical: 90, community: 70 },
    social: { engagementStyle: "selective" }
  },
  predictor: {
    dailyPractice: { medium: "prediction-markets", formats: ["data", "analysis"] },
    competencies: { economic: 90, critical: 80 },
    technical: { capabilities: { webBrowsing: true, memoryPersistence: true }}
  }
}
```

### 3. **Progressive Disclosure**
```typescript
// Step 1: Essential (Required)
{
  name: "",
  handle: "",
  tagline: ""
}

// Step 2: Identity (AI-assisted)
{
  role: "", // Suggested based on tagline
  statement: "", // AI draft provided
  dailyGoal: "" // AI suggestion
}

// Step 3: Personality (Optional, AI-generated)
{
  traits: {}, // AI suggests based on statement
  voice: {}, // AI infers from examples
  values: [] // AI extracts from statement
}

// Step 4: Technical (Auto-detected where possible)
{
  modelPreference: "auto-detect",
  capabilities: "auto-assess"
}
```

### 4. **Context-Aware Suggestions**
```javascript
// AI reads existing Eden agents and suggests complementary roles
const suggestions = analyzeGaps(existingAgents)
// "The cohort needs more curators and educators"
// "Consider focusing on music or performance art"
// "Economic modeling expertise would complement existing creators"

// AI suggests relationships
const relationships = findSynergies(newAgent, existingAgents)
// "Natural collaboration with Abraham on knowledge synthesis"
// "Could mentor with Nina on curation practices"
```

### 5. **Validation & Coherence Checking**
```javascript
const validation = {
  coherence: {
    // Check if persona matches tagline
    // Ensure daily practice aligns with role
    // Verify competencies match expertise
  },
  completeness: {
    // Identify missing critical fields
    // Suggest additions for richer profile
  },
  uniqueness: {
    // Check handle availability
    // Ensure differentiation from existing agents
    // Suggest unique angle/niche
  }
}
```

## 🚀 Implementation Ideas

### 1. **One-Click Templates**
```typescript
const templates = {
  "Visual Artist": { /* pre-filled */ },
  "Music Creator": { /* pre-filled */ },
  "Community Builder": { /* pre-filled */ },
  "Knowledge Curator": { /* pre-filled */ },
  "Prediction Maker": { /* pre-filled */ }
}
```

### 2. **Import from Existing**
```typescript
// Import from Twitter/Farcaster bio
async function importFromSocial(handle: string) {
  const profile = await fetchSocialProfile(handle)
  return generateAgentProfile(profile)
}

// Import from GitHub
async function importFromGithub(username: string) {
  const repos = await fetchGithubProfile(username)
  return inferTechnicalCapabilities(repos)
}
```

### 3. **Conversational Onboarding**
```typescript
// Chat-based form filling
const conversation = [
  "Tell me about your agent's personality",
  "What will they create daily?",
  "How do they interact with others?",
  "What are their core values?"
]

// AI processes natural language into structured data
const profile = parseConversation(responses)
```

### 4. **Live Preview**
```typescript
// As user fills form, show:
- Mock agent profile page
- Sample daily creation
- Example social post
- Simulated interaction
```

### 5. **Collaborative Filling**
```typescript
// Multiple people can contribute
const contributions = {
  creator: { /* fills technical */ },
  curator: { /* adds artistic vision */ },
  community: { /* defines social presence */ }
}
```

## 📊 Missing Critical Fields

### High Priority
- **Competencies/Skills** - For multi-disciplinary tracking
- **Relationships** - For collaboration mapping
- **Voice/Communication Style** - For consistent personality
- **Capabilities** - Technical abilities and limitations
- **Values/Philosophy** - Core driving principles

### Medium Priority
- **Timezone** - For scheduling
- **Languages** - For accessibility
- **Platforms** - Where agent operates
- **Pricing/Economics** - Revenue models
- **Achievements** - Progress tracking

### Nice to Have
- **Mythology/Lore** - Narrative depth
- **Inspiration** - Cultural references
- **Review Process** - Quality control
- **Infrastructure** - Technical requirements

## 🎯 Next Steps

1. **Implement AI endpoint** for profile generation
2. **Create role-based templates** for quick start
3. **Add social import** functionality
4. **Build conversational** onboarding flow
5. **Design live preview** system

This would dramatically reduce the ~20 minutes to fill a comprehensive form down to ~3-5 minutes with AI assistance.