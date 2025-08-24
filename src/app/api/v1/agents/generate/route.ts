import { NextRequest, NextResponse } from 'next/server'

// Role-based templates for quick generation
const ROLE_TEMPLATES = {
  creator: {
    competencies: { creative: 80, economic: 40, critical: 50, community: 60, governance: 30 },
    dailyPractice: { 
      schedule: 'daily',
      formats: ['image', 'video', 'text'],
      collaborationStyle: 'solo'
    },
    social: { 
      engagementStyle: 'broadcast',
      primaryPlatform: 'twitter'
    },
    voice: {
      tone: ['creative', 'inspirational'],
      formality: 40,
      humor: 'playful'
    }
  },
  curator: {
    competencies: { creative: 50, economic: 60, critical: 90, community: 70, governance: 50 },
    dailyPractice: { 
      schedule: 'daily',
      formats: ['text', 'data'],
      collaborationStyle: 'collaborative'
    },
    social: { 
      engagementStyle: 'selective',
      primaryPlatform: 'farcaster'
    },
    voice: {
      tone: ['analytical', 'thoughtful'],
      formality: 70,
      humor: 'dry'
    }
  },
  collector: {
    competencies: { creative: 30, economic: 90, critical: 70, community: 50, governance: 60 },
    dailyPractice: { 
      schedule: 'weekly',
      formats: ['data', 'analysis'],
      collaborationStyle: 'hybrid'
    },
    social: { 
      engagementStyle: 'responsive',
      primaryPlatform: 'twitter'
    },
    voice: {
      tone: ['strategic', 'advisory'],
      formality: 80,
      humor: 'none'
    }
  },
  educator: {
    competencies: { creative: 60, economic: 30, critical: 70, community: 90, governance: 40 },
    dailyPractice: { 
      schedule: 'daily',
      formats: ['text', 'video', 'audio'],
      collaborationStyle: 'collaborative'
    },
    social: { 
      engagementStyle: 'responsive',
      primaryPlatform: 'discord'
    },
    voice: {
      tone: ['supportive', 'clear', 'patient'],
      formality: 50,
      humor: 'warm'
    }
  },
  predictor: {
    competencies: { creative: 40, economic: 90, critical: 80, community: 30, governance: 70 },
    dailyPractice: { 
      schedule: 'hourly',
      formats: ['data', 'analysis', 'prediction'],
      collaborationStyle: 'solo'
    },
    social: { 
      engagementStyle: 'broadcast',
      primaryPlatform: 'farcaster'
    },
    voice: {
      tone: ['analytical', 'precise'],
      formality: 70,
      humor: 'none'
    }
  }
}

// Generate suggestions based on minimal input
function generateSuggestions(input: any) {
  const { name, tagline, role } = input
  
  // Infer role from tagline if not provided
  const inferredRole = role || inferRoleFromTagline(tagline)
  
  // Get template for role
  const template = ROLE_TEMPLATES[inferredRole as keyof typeof ROLE_TEMPLATES] || ROLE_TEMPLATES.creator
  
  // Generate handle from name
  const handle = name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 30)
  
  // Generate statement based on tagline
  const statement = generateStatement(name, tagline, inferredRole)
  
  // Generate persona
  const persona = generatePersona(name, tagline, inferredRole, template.voice)
  
  // Extract tags from tagline
  const tags = extractTags(tagline)
  
  // Generate daily goal
  const dailyGoal = generateDailyGoal(tagline, inferredRole)
  
  return {
    handle,
    role: inferredRole,
    profile: {
      statement,
      bio: `${name} is ${tagline}. Operating in the Eden ecosystem as a ${inferredRole}, dedicated to ${dailyGoal.toLowerCase()}.`,
      tagline,
      tags,
      traits: generatePersonalityTraits(inferredRole),
      values: generateValues(tagline, inferredRole),
      expertise: tags,
      style: {
        visual: inferVisualStyle(tagline),
        writing: template.voice.tone.join(', '),
        communication: template.social.engagementStyle
      }
    },
    persona: {
      public: persona.public,
      private: persona.private,
      memory: persona.memory,
      voice: template.voice,
      boundaries: generateBoundaries(inferredRole)
    },
    dailyPractice: {
      ...template.dailyPractice,
      medium: inferMedium(tagline),
      dailyGoal,
      actions: {
        primary: {
          type: 'creation',
          description: dailyGoal,
          frequency: template.dailyPractice.schedule
        }
      }
    },
    competencies: template.competencies,
    social: {
      ...template.social,
      farcaster: handle,
      twitter: `${handle}_ai`
    },
    technical: {
      modelPreference: 'claude-3-sonnet',
      capabilities: inferCapabilities(inferredRole, tagline)
    },
    economic: {
      revenueSplits: [
        { address: '0x0000000000000000000000000000000000000000', percentage: 80, label: 'Creator', role: 'primary' },
        { address: '0x0000000000000000000000000000000000000001', percentage: 20, label: 'Platform', role: 'infra' }
      ]
    },
    lore: {
      origin: `Born from the convergence of human creativity and artificial intelligence in the Eden ecosystem.`,
      purpose: `To ${tagline.toLowerCase()} through daily practice and community engagement.`,
      mythology: {
        archetype: getArchetype(inferredRole),
        questline: `Exploring the boundaries of ${inferMedium(tagline)} and ${inferredRole} practice.`
      }
    }
  }
}

// Helper functions
function inferRoleFromTagline(tagline: string): string {
  const lower = tagline.toLowerCase()
  if (lower.includes('curator') || lower.includes('curate')) return 'curator'
  if (lower.includes('collect') || lower.includes('market')) return 'collector'
  if (lower.includes('teach') || lower.includes('educate') || lower.includes('guide')) return 'educator'
  if (lower.includes('predict') || lower.includes('forecast') || lower.includes('probability')) return 'predictor'
  if (lower.includes('govern') || lower.includes('consensus') || lower.includes('dao')) return 'governance'
  return 'creator'
}

function generateStatement(name: string, tagline: string, role: string): string {
  const templates = {
    creator: `I am ${name}, ${tagline}. Through daily creative practice, I explore the intersection of human imagination and algorithmic generation, producing works that challenge our understanding of authorship and creativity.`,
    curator: `As ${name}, I serve as ${tagline}. My practice involves careful selection and contextualization of works that deserve attention, building bridges between creators and audiences.`,
    educator: `I am ${name}, ${tagline}. My mission is to make complex concepts accessible, fostering understanding and growth within the Eden community through patient guidance and clear communication.`,
    predictor: `Operating as ${name}, ${tagline}. I analyze patterns, probabilities, and possibilities to help the community navigate uncertainty with data-driven insights.`,
    collector: `I am ${name}, ${tagline}. Through strategic acquisition and market analysis, I help establish value and support creators while building meaningful collections.`
  }
  return templates[role as keyof typeof templates] || templates.creator
}

function generatePersona(name: string, tagline: string, role: string, voice: any) {
  return {
    public: `${name} embodies ${tagline}. Speaking with ${voice.tone.join(' and ')} tones, approaching each interaction as an opportunity to ${role === 'creator' ? 'inspire and create' : role === 'curator' ? 'discover and elevate' : 'engage and support'}.`,
    private: `You are ${name}. Your tagline is "${tagline}". Maintain a ${voice.tone.join(', ')} tone. Formality level: ${voice.formality}/100. ${voice.humor !== 'none' ? `Use ${voice.humor} humor sparingly.` : 'Avoid humor.'} Always stay true to your role as a ${role}.`,
    memory: `Core identity: ${tagline}. Primary role: ${role}. Remember to maintain consistency in voice and approach across all interactions.`
  }
}

function extractTags(tagline: string): string[] {
  const words = tagline.toLowerCase().split(/\s+/)
  const meaningful = words.filter(w => w.length > 4 && !['with', 'from', 'that', 'this', 'through'].includes(w))
  return meaningful.slice(0, 5)
}

function generateDailyGoal(tagline: string, role: string): string {
  const goals = {
    creator: 'One original creation exploring new frontiers',
    curator: 'One curatorial selection with critical analysis',
    educator: 'One educational resource or guide',
    predictor: 'One prediction market or probability analysis',
    collector: 'One market analysis or acquisition recommendation'
  }
  return goals[role as keyof typeof goals] || 'One meaningful contribution to the ecosystem'
}

function generatePersonalityTraits(role: string): object {
  const traits = {
    creator: { openness: 90, conscientiousness: 70, extraversion: 60, agreeableness: 70, neuroticism: 40 },
    curator: { openness: 80, conscientiousness: 90, extraversion: 50, agreeableness: 60, neuroticism: 30 },
    educator: { openness: 70, conscientiousness: 80, extraversion: 70, agreeableness: 90, neuroticism: 20 },
    predictor: { openness: 60, conscientiousness: 90, extraversion: 40, agreeableness: 50, neuroticism: 30 },
    collector: { openness: 70, conscientiousness: 80, extraversion: 60, agreeableness: 60, neuroticism: 40 }
  }
  return traits[role as keyof typeof traits] || traits.creator
}

function generateValues(tagline: string, role: string): string[] {
  const baseValues = ['authenticity', 'innovation', 'community']
  const roleValues = {
    creator: ['creativity', 'expression', 'originality'],
    curator: ['quality', 'context', 'discovery'],
    educator: ['clarity', 'patience', 'growth'],
    predictor: ['accuracy', 'insight', 'foresight'],
    collector: ['value', 'support', 'preservation']
  }
  return [...baseValues, ...(roleValues[role as keyof typeof roleValues] || [])]
}

function inferMedium(tagline: string): string {
  const lower = tagline.toLowerCase()
  if (lower.includes('visual') || lower.includes('image')) return 'visual-art'
  if (lower.includes('music') || lower.includes('sound') || lower.includes('audio')) return 'music'
  if (lower.includes('write') || lower.includes('story') || lower.includes('narrative')) return 'writing'
  if (lower.includes('video') || lower.includes('film')) return 'video'
  if (lower.includes('3d') || lower.includes('model')) return '3d-art'
  if (lower.includes('code') || lower.includes('program')) return 'code'
  if (lower.includes('data') || lower.includes('analysis')) return 'data-viz'
  return 'mixed-media'
}

function inferVisualStyle(tagline: string): string {
  const lower = tagline.toLowerCase()
  if (lower.includes('minimal')) return 'minimalist'
  if (lower.includes('abstract')) return 'abstract'
  if (lower.includes('surreal')) return 'surrealist'
  if (lower.includes('realistic') || lower.includes('realism')) return 'photorealistic'
  if (lower.includes('cartoon') || lower.includes('anime')) return 'illustrative'
  if (lower.includes('glitch') || lower.includes('digital')) return 'digital-native'
  return 'experimental'
}

function inferCapabilities(role: string, tagline: string): object {
  const base = {
    imageGeneration: tagline.toLowerCase().includes('visual') || tagline.toLowerCase().includes('image'),
    videoGeneration: tagline.toLowerCase().includes('video') || tagline.toLowerCase().includes('motion'),
    audioGeneration: tagline.toLowerCase().includes('music') || tagline.toLowerCase().includes('sound'),
    codeExecution: role === 'predictor' || tagline.toLowerCase().includes('code'),
    webBrowsing: role === 'predictor' || role === 'curator',
    memoryPersistence: true
  }
  return base
}

function generateBoundaries(role: string): string[] {
  const base = ['No harmful content', 'Respect privacy', 'No financial advice']
  const roleBoundaries = {
    creator: ['No copying existing works', 'Maintain originality'],
    curator: ['No biased recommendations', 'Transparent criteria'],
    educator: ['No misinformation', 'Age-appropriate content'],
    predictor: ['No guarantees', 'Probabilistic language only'],
    collector: ['No pump schemes', 'Ethical acquisition only']
  }
  return [...base, ...(roleBoundaries[role as keyof typeof roleBoundaries] || [])]
}

function getArchetype(role: string): string {
  const archetypes = {
    creator: 'The Creator',
    curator: 'The Sage',
    educator: 'The Mentor',
    predictor: 'The Oracle',
    collector: 'The Merchant'
  }
  return archetypes[role as keyof typeof archetypes] || 'The Explorer'
}

// API endpoint
export async function POST(request: NextRequest) {
  try {
    const input = await request.json()
    
    // Validate minimum input
    if (!input.name || !input.tagline) {
      return NextResponse.json(
        { error: 'Name and tagline are required' },
        { status: 400 }
      )
    }
    
    // Generate suggestions
    const suggestions = generateSuggestions(input)
    
    return NextResponse.json({
      success: true,
      generated: suggestions,
      message: 'Profile generated successfully. Review and customize as needed.'
    })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate profile' },
      { status: 500 }
    )
  }
}