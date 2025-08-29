import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { PrototypeVersionSchema, AgentPrototypeCollectionSchema } from '@/lib/schemas/prototype.schema'
import { auth } from '@/lib/auth'

// Mock data store - in production this would be database-backed
const mockPrototypes: Record<string, any> = {
  miyomi: {
    agentHandle: 'miyomi',
    prototypes: [
      {
        id: 'miyomi-trading-v1-1',
        version: '1.0',
        title: 'Original Trading Dashboard',
        description: 'First implementation of MIYOMI trading interface with basic metrics',
        type: 'dashboard',
        status: 'archived',
        url: 'https://miyomi-v1.vercel.app',
        features: ['basic-metrics', 'position-tracking', 'simple-ui'],
        createdAt: '2025-07-15T10:00:00Z',
        archivedAt: '2025-08-15T10:00:00Z'
      },
      {
        id: 'miyomi-chat-v2-1',
        version: '2.0',
        title: 'Contrarian Chat Interface',
        description: 'Experimental chat-based trading advice interface',
        type: 'interface',
        status: 'archived',
        component: '@/prototypes/miyomi/chat-v2',
        features: ['chat-interface', 'contrarian-analysis', 'real-time-data'],
        createdAt: '2025-07-20T14:30:00Z',
        archivedAt: '2025-08-01T09:00:00Z'
      }
    ],
    experiments: [
      {
        id: 'miyomi-ai-advisor-exp',
        version: '3.0-beta',
        title: 'AI Trading Advisor Integration',
        description: 'Experimental integration with OpenAI for trading advice generation',
        type: 'api',
        status: 'experimental',
        component: '@/prototypes/miyomi/ai-advisor',
        features: ['openai-integration', 'advice-generation', 'risk-assessment'],
        createdAt: '2025-08-20T16:00:00Z'
      }
    ],
    archived: [
      {
        id: 'miyomi-legacy-v0-1',
        version: '0.1',
        title: 'Legacy Trading Bot',
        description: 'Original command-line trading bot before web interface',
        type: 'api',
        status: 'deprecated',
        features: ['cli-interface', 'basic-trading', 'csv-export'],
        createdAt: '2025-06-01T08:00:00Z',
        archivedAt: '2025-07-01T12:00:00Z'
      }
    ],
    activeExperiments: 1,
    totalPrototypes: 4,
    lastUpdated: '2025-08-28T12:00:00Z'
  },
  sue: {
    agentHandle: 'sue',
    prototypes: [
      {
        id: 'sue-curator-v1',
        version: '1.0',
        title: 'Basic Curator Interface',
        description: 'Initial curatorial analysis interface with simple scoring',
        type: 'dashboard',
        status: 'archived',
        features: ['basic-scoring', 'simple-analysis', 'manual-review'],
        createdAt: '2025-07-10T09:00:00Z',
        archivedAt: '2025-08-10T15:00:00Z'
      }
    ],
    experiments: [
      {
        id: 'sue-ai-curation-exp',
        version: '2.5-exp',
        title: 'AI-Enhanced Curatorial Analysis',
        description: 'Experimental deep learning integration for advanced cultural analysis',
        type: 'component',
        status: 'experimental',
        component: '@/prototypes/sue/ai-curation',
        features: ['ml-analysis', 'cultural-context', 'sentiment-analysis'],
        createdAt: '2025-08-25T11:00:00Z'
      }
    ],
    archived: [],
    activeExperiments: 1,
    totalPrototypes: 2,
    lastUpdated: '2025-08-28T14:30:00Z'
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id
    
    // Get agent data to convert ID to handle
    const agentHandle = agentId // Assuming ID is handle for now
    
    const collection = mockPrototypes[agentHandle] || {
      agentHandle,
      prototypes: [],
      experiments: [],
      archived: [],
      activeExperiments: 0,
      totalPrototypes: 0,
      lastUpdated: new Date().toISOString()
    }

    // Validate response structure
    const validatedCollection = AgentPrototypeCollectionSchema.parse(collection)
    
    return NextResponse.json(validatedCollection)
  } catch (error) {
    console.error('Failed to get agent prototypes:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve prototypes' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate request
    const user = await auth(request)
    if (!user || (user.role !== 'trainer' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const agentId = params.id
    const body = await request.json()
    
    // Validate prototype data
    const prototypeData = PrototypeVersionSchema.omit({ id: true, createdAt: true }).parse(body)
    
    const newPrototype: PrototypeVersion = {
      ...prototypeData,
      id: `${agentId}-${prototypeData.version}-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    // In production, save to database
    const agentHandle = agentId
    if (!mockPrototypes[agentHandle]) {
      mockPrototypes[agentHandle] = {
        agentHandle,
        prototypes: [],
        experiments: [],
        archived: [],
        activeExperiments: 0,
        totalPrototypes: 0,
        lastUpdated: new Date().toISOString()
      }
    }

    // Add to appropriate category based on status
    if (newPrototype.status === 'experimental') {
      mockPrototypes[agentHandle].experiments.push(newPrototype)
      mockPrototypes[agentHandle].activeExperiments++
    } else if (newPrototype.status === 'archived' || newPrototype.status === 'deprecated') {
      mockPrototypes[agentHandle].archived.push(newPrototype)
    } else {
      mockPrototypes[agentHandle].prototypes.push(newPrototype)
    }

    mockPrototypes[agentHandle].totalPrototypes++
    mockPrototypes[agentHandle].lastUpdated = new Date().toISOString()

    return NextResponse.json(newPrototype, { status: 201 })
  } catch (error) {
    console.error('Failed to create prototype:', error)
    return NextResponse.json(
      { error: 'Failed to create prototype' },
      { status: 500 }
    )
  }
}