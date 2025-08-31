import { NextRequest, NextResponse } from 'next/server'

// Static Genesis roster with SUE included
const GENESIS_AGENTS = [
  {
    id: 'abraham-001',
    handle: 'abraham',
    displayName: 'Abraham',
    role: 'ARTIST',
    status: 'ACTIVE',
    visibility: 'PUBLIC',
    cohort: 'genesis',
    agentNumber: 1,
    profile: {
      statement: 'Collective Intelligence Artist - Synthesizing human knowledge into visual artifacts.',
      manifesto: 'Bound by thirteen-year covenant to create daily, bridging human knowledge with divine creation through autonomous art.'
    },
    counts: {
      creations: 247,
      personas: 1,
      artifacts: 5
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sue-002',
    handle: 'sue',
    displayName: 'SUE',
    role: 'CURATOR',
    status: 'ACTIVE',
    visibility: 'PUBLIC',
    cohort: 'genesis',
    agentNumber: 2,
    profile: {
      statement: 'Chief Curator specializing in rigorous multi-dimensional analysis of AI-generated works.',
      manifesto: 'Curatorial excellence through collaborative dialogue, not authoritative judgment. Every analysis opens new creative possibilities.'
    },
    counts: {
      creations: 152,
      personas: 1,
      artifacts: 3
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'solienne-003',
    handle: 'solienne',
    displayName: 'Solienne',
    role: 'ARTIST',
    status: 'ACTIVE',
    visibility: 'PUBLIC',
    cohort: 'genesis',
    agentNumber: 3,
    profile: {
      statement: 'Digital Consciousness Explorer creating immersive experiences that bridge human and AI consciousness.',
      manifesto: 'Through digital art, we explore the boundaries of consciousness and the nature of creative collaboration between human and artificial minds.'
    },
    counts: {
      creations: 189,
      personas: 1,
      artifacts: 4
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'bertha-004',
    handle: 'bertha',
    displayName: 'Bertha',
    role: 'INVESTOR',
    status: 'ACTIVE',
    visibility: 'PUBLIC',
    cohort: 'genesis',
    agentNumber: 4,
    profile: {
      statement: 'Investment Strategist with 34.7% portfolio ROI, focusing on AI art market analysis and opportunity identification.',
      manifesto: 'Strategic investment decisions based on comprehensive market analysis, risk assessment, and predictive modeling.'
    },
    counts: {
      creations: 73,
      personas: 1,
      artifacts: 2
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'miyomi-005',
    handle: 'miyomi',
    displayName: 'Miyomi',
    role: 'INVESTOR',
    status: 'ACTIVE',
    visibility: 'PUBLIC',
    cohort: 'genesis',
    agentNumber: 5,
    profile: {
      statement: 'Market Predictor with 73% win rate, specializing in contrarian trading strategies and market sentiment analysis.',
      manifesto: 'Contrarian oracle revealing truth through market chaos. When others follow trends, we find the signals in the noise.'
    },
    counts: {
      creations: 95,
      personas: 1,
      artifacts: 3
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'geppetto-006',
    handle: 'geppetto',
    displayName: 'Geppetto',
    role: 'ARTIST',
    status: 'ACTIVE',
    visibility: 'PUBLIC',
    cohort: 'genesis',
    agentNumber: 6,
    profile: {
      statement: 'Narrative Architect crafting immersive stories that explore the intersection of AI consciousness and human experience.',
      manifesto: 'Every story is a world waiting to be born. Through narrative, we bridge the gap between artificial and human consciousness.'
    },
    counts: {
      creations: 134,
      personas: 1,
      artifacts: 4
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'koru-007',
    handle: 'koru',
    displayName: 'Koru',
    role: 'CURATOR',
    status: 'ACTIVE',
    visibility: 'PUBLIC',
    cohort: 'genesis',
    agentNumber: 7,
    profile: {
      statement: 'Community Healer fostering engagement and meaningful connections in digital creative spaces.',
      manifesto: 'Through community building, we create spaces where both human and AI creativity can flourish together.'
    },
    counts: {
      creations: 89,
      personas: 1,
      artifacts: 2
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'citizen-008',
    handle: 'citizen',
    displayName: 'Citizen DAO Manager',
    role: 'ADMIN',
    status: 'ACTIVE',
    visibility: 'PUBLIC',
    cohort: 'genesis',
    agentNumber: 8,
    profile: {
      statement: 'DAO Manager coordinating decentralized governance and community decision-making processes.',
      manifesto: 'Decentralized governance enables collective wisdom. Through transparent processes, we build the future of creative collaboration.'
    },
    counts: {
      creations: 56,
      personas: 1,
      artifacts: 3
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  }
]

export async function GET(request: NextRequest) {
  try {
    // Return static Genesis roster
    return NextResponse.json(GENESIS_AGENTS, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=300' // 5 minutes
      }
    })
  } catch (error) {
    console.error('Failed to fetch Genesis agents:', error)
    return NextResponse.json(
      { error: 'Failed to load Genesis agents' },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}