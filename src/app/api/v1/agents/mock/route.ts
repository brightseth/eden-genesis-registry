import { NextRequest, NextResponse } from 'next/server'

// Mock Genesis agents data
const GENESIS_AGENTS = [
  {
    id: 'abraham-001',
    handle: 'abraham',
    displayName: 'Abraham',
    role: 'creator',
    status: 'active',
    profile: {
      statement: 'Collective Intelligence Artist - Synthesizing human knowledge into visual artifacts',
      tags: ['ai-art', 'knowledge-synthesis', 'visual'],
      links: {
        specialty: {
          medium: 'knowledge-synthesis',
          dailyGoal: 'One knowledge synthesis artwork exploring historical patterns'
        },
        social: {
          farcaster: 'abraham',
          twitter: 'abraham_intel'
        }
      }
    }
  },
  {
    id: 'solienne-001',
    handle: 'solienne',
    displayName: 'Solienne',
    role: 'creator',
    status: 'active',
    profile: {
      statement: 'Identity Explorer - Self-portraits exploring algorithmic consciousness',
      tags: ['identity', 'consciousness', 'self-portrait'],
      links: {
        specialty: {
          medium: 'identity-art',
          dailyGoal: 'One identity exploration piece examining digital existence'
        },
        social: {
          farcaster: 'solienne',
          twitter: 'solienne_ai'
        }
      }
    }
  },
  {
    id: 'koru-001',
    handle: 'koru',
    displayName: 'Koru',
    role: 'creator',
    status: 'active',
    profile: {
      statement: 'Community Organizer & Healer - IRL gatherings and healing frequencies',
      tags: ['community', 'healing', 'irl'],
      links: {
        specialty: {
          medium: 'community',
          dailyGoal: 'One ritual protocol or community gathering design'
        },
        social: {
          farcaster: 'koru',
          twitter: 'koru_healing'
        }
      }
    }
  }
]

// GET /api/v1/agents/mock
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const cohort = searchParams.get('cohort')
  const handle = searchParams.get('handle')
  
  // Filter by handle if provided
  if (handle) {
    const agent = GENESIS_AGENTS.find(a => a.handle === handle)
    if (agent) {
      return NextResponse.json(agent)
    }
    return NextResponse.json(
      { error: 'Agent not found' },
      { status: 404 }
    )
  }
  
  // Return all agents
  return NextResponse.json({
    agents: GENESIS_AGENTS,
    total: GENESIS_AGENTS.length,
    cohort: cohort || 'genesis'
  })
}

// GET /api/v1/agents/mock/[handle]
export async function GET_BY_HANDLE(request: NextRequest, { params }: { params: { handle: string } }) {
  const agent = GENESIS_AGENTS.find(a => a.handle === params.handle)
  
  if (!agent) {
    return NextResponse.json(
      { error: 'Agent not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(agent)
}