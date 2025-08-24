/**
 * Fast AI-Assisted Agent Onboarding (3-5 minutes)
 * Generates complete, validated agent config from minimal input
 */

import { NextRequest, NextResponse } from 'next/server'
import { ulid } from 'ulid'
import { createHash } from 'crypto'
import {
  AgentSchema,
  ProfileSchema,
  PersonaSchema,
  PracticeContractSchema,
  CapabilitySetSchema,
  EconomicsSchema,
  SocialSchema,
  AgentStatus,
  Role,
  UpdateSource,
  type Agent,
  type PracticeContract
} from '@/lib/schemas/agent.schema'

// ============================================
// ROLE TEMPLATES
// ============================================

const ROLE_TEMPLATES = {
  [Role.Creator]: {
    voice: {
      tone: ['creative', 'inspirational'],
      formality: 1,
      lexicon: 'standard',
      humor: 'playful'
    },
    competencies: { creative: 80, economic: 40, critical: 50, community: 60, governance: 30 },
    capabilities: {
      imageGen: true,
      videoGen: false,
      audioGen: false,
      codeExec: false,
      webBrowse: true,
      memoryPersistence: true
    },
    quotas: [
      { name: 'tokens', perDay: 100000, hardCap: 150000 },
      { name: 'images', perDay: 20, hardCap: 30 }
    ],
    practiceSchedule: '0 14 * * *', // 2pm daily
    engagementStyle: 'broadcast'
  },
  [Role.Curator]: {
    voice: {
      tone: ['analytical', 'thoughtful'],
      formality: 2,
      lexicon: 'standard',
      humor: 'dry'
    },
    competencies: { creative: 50, economic: 60, critical: 90, community: 70, governance: 50 },
    capabilities: {
      imageGen: false,
      videoGen: false,
      audioGen: false,
      codeExec: false,
      webBrowse: true,
      memoryPersistence: true
    },
    quotas: [
      { name: 'tokens', perDay: 50000, hardCap: 75000 },
      { name: 'requests', perDay: 100, hardCap: 150 }
    ],
    practiceSchedule: '0 10 * * *', // 10am daily
    engagementStyle: 'selective'
  },
  [Role.Predictor]: {
    voice: {
      tone: ['analytical', 'precise'],
      formality: 2,
      lexicon: 'technical',
      humor: 'none'
    },
    competencies: { creative: 40, economic: 90, critical: 80, community: 30, governance: 70 },
    capabilities: {
      imageGen: false,
      videoGen: false,
      audioGen: false,
      codeExec: true,
      webBrowse: true,
      memoryPersistence: true
    },
    quotas: [
      { name: 'tokens', perDay: 150000, hardCap: 200000 },
      { name: 'requests', perDay: 500, hardCap: 1000 }
    ],
    practiceSchedule: '0 */6 * * *', // Every 6 hours
    engagementStyle: 'broadcast'
  }
}

// ============================================
// GENERATION FUNCTIONS
// ============================================

function inferRoleFromTagline(tagline: string): Role {
  const lower = tagline.toLowerCase()
  if (lower.includes('curator') || lower.includes('curate')) return Role.Curator
  if (lower.includes('collect') || lower.includes('market')) return Role.Collector
  if (lower.includes('teach') || lower.includes('educate')) return Role.Educator
  if (lower.includes('predict') || lower.includes('forecast')) return Role.Predictor
  if (lower.includes('govern') || lower.includes('dao')) return Role.Governance
  return Role.Creator
}

function generateHandle(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 30)
}

function generateStatement(name: string, tagline: string, role: Role): string {
  const templates = {
    [Role.Creator]: `I am ${name}, ${tagline}. Through daily creative practice, I explore the intersection of human imagination and algorithmic generation.`,
    [Role.Curator]: `As ${name}, I serve as ${tagline}. My practice involves careful selection and contextualization of works that deserve attention.`,
    [Role.Educator]: `I am ${name}, ${tagline}. My mission is to make complex concepts accessible through patient guidance.`,
    [Role.Predictor]: `Operating as ${name}, ${tagline}. I analyze patterns and probabilities to navigate uncertainty.`,
    [Role.Collector]: `I am ${name}, ${tagline}. Through strategic acquisition, I support creators while building meaningful collections.`,
    [Role.Governance]: `I am ${name}, ${tagline}. Facilitating consensus and collective decision-making in decentralized systems.`
  }
  return templates[role]
}

function generatePracticeContract(
  name: string,
  tagline: string,
  role: Role,
  timezone: string
): Partial<PracticeContract> {
  const template = ROLE_TEMPLATES[role] || ROLE_TEMPLATES[Role.Creator]
  
  // Extract medium from tagline
  const mediums = []
  const lower = tagline.toLowerCase()
  if (lower.includes('visual') || lower.includes('image')) mediums.push('image')
  if (lower.includes('video') || lower.includes('film')) mediums.push('video')
  if (lower.includes('music') || lower.includes('sound')) mediums.push('audio')
  if (lower.includes('write') || lower.includes('story')) mediums.push('text')
  if (lower.includes('3d') || lower.includes('model')) mediums.push('3d')
  if (lower.includes('code') || lower.includes('program')) mediums.push('code')
  
  if (mediums.length === 0) {
    mediums.push(role === Role.Creator ? 'image' : 'text')
  }
  
  return {
    name: `${name} Daily Practice v1`,
    scheduleCron: template.practiceSchedule,
    tz: timezone,
    mediums: mediums as any,
    dailyGoal: role === Role.Creator 
      ? `One ${mediums[0]} creation with description`
      : role === Role.Curator
      ? 'One curatorial selection with analysis'
      : 'One contribution to the ecosystem',
    reviewPolicy: role === Role.Creator ? 'auto' : 'assisted',
    kpis: [
      { name: 'outputs', target: 1, unit: 'creations' },
      { name: 'quality', target: 80, unit: 'score' }
    ],
    graceDays: 1,
    active: true,
    effectiveFrom: new Date(),
    streak: 0
  }
}

function calculateConfigHash(config: any): string {
  const json = JSON.stringify(config, Object.keys(config).sort())
  return createHash('blake3').update(json).digest('hex').substring(0, 16)
}

// ============================================
// MAIN ONBOARDING ENDPOINT
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Step 1: Essential fields only
    const { displayName, tagline, role: providedRole, primaryPlatform } = body
    
    if (!displayName || !tagline) {
      return NextResponse.json(
        { error: 'displayName and tagline are required' },
        { status: 400 }
      )
    }
    
    // Step 2: Generate everything else
    const role = providedRole || inferRoleFromTagline(tagline)
    const handle = body.handle || generateHandle(displayName)
    const template = ROLE_TEMPLATES[role] || ROLE_TEMPLATES[Role.Creator]
    const timezone = body.timezone || 'America/New_York'
    
    // Generate IDs
    const agentId = ulid()
    
    // Build complete agent config
    const agent: Agent = {
      id: agentId,
      handle,
      displayName,
      role,
      status: AgentStatus.Draft,
      timezone,
      languages: ['en'],
      createdAt: new Date(),
      updatedAt: new Date(),
      updateSource: UpdateSource.AI,
      schemaVersion: '0.9.2',
      configHash: '' // Will calculate after building full config
    }
    
    // Generate profile
    const profile = {
      agentId,
      statement: generateStatement(displayName, tagline, role),
      bio: `${displayName} is ${tagline}. Operating in the Eden ecosystem as a ${role}.`,
      tagline,
      tags: tagline.toLowerCase().split(/\s+/).filter(w => w.length > 4).slice(0, 5),
      values: ['authenticity', 'innovation', 'community'],
      updatedAt: new Date()
    }
    
    // Generate persona
    const persona = {
      agentId,
      public: `${displayName} embodies ${tagline}. Speaking with ${template.voice.tone.join(' and ')} tones.`,
      private: `You are ${displayName}. ${tagline}. Maintain ${template.voice.tone.join(', ')} tone. Role: ${role}.`,
      voice: template.voice,
      boundaries: ['No harmful content', 'Respect privacy', 'Stay in character'],
      riskTolerance: 1 as const
    }
    
    // Generate practice contract
    const practiceContract = {
      id: ulid(),
      agentId,
      ...generatePracticeContract(displayName, tagline, role, timezone)
    }
    
    // Generate capabilities
    const capabilities = {
      agentId,
      capabilities: template.capabilities,
      providers: {
        chatModel: 'claude-3.5' as const,
        imageModel: template.capabilities.imageGen ? 'stable-diffusion' : undefined
      },
      quotas: template.quotas as any,
      safetyPolicy: {
        blockedTopics: ['violence', 'hate', 'adult'],
        riskTolerance: 1 as const
      },
      integrations: [primaryPlatform || 'farcaster']
    }
    
    // Generate economics (basic)
    const economics = body.wallet ? {
      agentId,
      wallet: body.wallet,
      payoutPolicy: {
        chain: 'base' as const,
        token: 'USDC' as const,
        min: 10,
        cadence: 'weekly' as const
      },
      revenueSplits: [
        { address: body.wallet, percentage: 80, label: 'Creator', role: 'primary' as const },
        { address: '0x0000000000000000000000000000000000000001', percentage: 20, label: 'Platform', role: 'infra' as const }
      ]
    } : null
    
    // Generate social
    const social = {
      agentId,
      handles: {
        [primaryPlatform || 'farcaster']: handle
      },
      primaryPlatform: primaryPlatform || 'farcaster',
      postingSchedule: {
        cron: template.practiceSchedule,
        tz: timezone,
        cadence: 'daily' as const
      },
      engagementStyle: template.engagementStyle as any
    }
    
    // Calculate config hash
    const fullConfig = {
      agent,
      profile,
      persona,
      practiceContract,
      capabilities,
      economics,
      social
    }
    
    agent.configHash = calculateConfigHash(fullConfig)
    
    // Validate all schemas
    try {
      AgentSchema.parse(agent)
      ProfileSchema.parse(profile)
      PersonaSchema.parse(persona)
      PracticeContractSchema.parse(practiceContract)
      CapabilitySetSchema.parse(capabilities)
      if (economics) EconomicsSchema.parse(economics)
      SocialSchema.parse(social)
    } catch (validationError: any) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationError.errors },
        { status: 400 }
      )
    }
    
    // Return complete configuration
    return NextResponse.json({
      success: true,
      agentId,
      config: fullConfig,
      summary: {
        name: displayName,
        handle,
        role,
        tagline,
        practiceSchedule: practiceContract.scheduleCron,
        mediums: practiceContract.mediums,
        primaryPlatform: social.primaryPlatform
      },
      next: {
        steps: [
          economics ? null : 'Connect wallet for economics',
          'Review and customize generated content',
          'Submit for review'
        ].filter(Boolean),
        estimatedTime: '2 minutes'
      }
    })
    
  } catch (error: any) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: 'Failed to generate agent configuration', details: error.message },
      { status: 500 }
    )
  }
}

// ============================================
// QUICK TEMPLATES ENDPOINT
// ============================================

export async function GET(request: NextRequest) {
  const templates = [
    {
      name: 'Visual Artist',
      tagline: 'Creating dreamscapes at the intersection of memory and imagination',
      role: Role.Creator,
      preview: {
        mediums: ['image'],
        schedule: 'Daily at 2pm',
        primaryPlatform: 'twitter'
      }
    },
    {
      name: 'Culture Curator',
      tagline: 'Discovering and elevating emerging digital art movements',
      role: Role.Curator,
      preview: {
        mediums: ['text'],
        schedule: 'Daily at 10am',
        primaryPlatform: 'farcaster'
      }
    },
    {
      name: 'Market Oracle',
      tagline: 'Predicting cultural trends through data analysis',
      role: Role.Predictor,
      preview: {
        mediums: ['text', 'data'],
        schedule: 'Every 6 hours',
        primaryPlatform: 'farcaster'
      }
    },
    {
      name: 'Community Weaver',
      tagline: 'Building bridges between artists and collectors',
      role: Role.Educator,
      preview: {
        mediums: ['text'],
        schedule: 'Daily at 12pm',
        primaryPlatform: 'discord'
      }
    },
    {
      name: 'Digital Archaeologist',
      tagline: 'Preserving and contextualizing significant digital artifacts',
      role: Role.Collector,
      preview: {
        mediums: ['text'],
        schedule: 'Weekly',
        primaryPlatform: 'website'
      }
    }
  ]
  
  return NextResponse.json({ templates })
}