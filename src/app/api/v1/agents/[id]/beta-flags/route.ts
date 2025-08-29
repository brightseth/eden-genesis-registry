import { NextRequest, NextResponse } from 'next/server'
import { BetaFeatureFlagSchema, BetaFeatureFlag } from '@/lib/schemas/prototype.schema'

// Mock feature flags store - in production this would be database-backed
const mockBetaFlags: Record<string, BetaFeatureFlag[]> = {
  miyomi: [
    {
      key: 'miyomi-ai-advisor',
      name: 'AI Trading Advisor',
      description: 'OpenAI-powered trading advice generation with risk assessment',
      enabled: true,
      agentHandle: 'miyomi',
      prototypeId: 'miyomi-ai-advisor-exp',
      enabledEnvironments: ['development', 'beta'],
      rolloutPercentage: 25,
      metadata: {
        targetAudience: 'experienced-traders',
        riskLevel: 'medium',
        performanceThreshold: 0.85
      }
    },
    {
      key: 'miyomi-advanced-charts',
      name: 'Advanced Chart Analysis',
      description: 'Enhanced technical analysis with pattern recognition',
      enabled: false,
      agentHandle: 'miyomi',
      enabledEnvironments: ['development'],
      rolloutPercentage: 0,
      metadata: {
        dependency: 'chart-analysis-service',
        estimatedCompletion: '2025-09-15'
      }
    }
  ],
  sue: [
    {
      key: 'sue-ml-curation',
      name: 'Machine Learning Curation',
      description: 'Deep learning models for automated curatorial analysis',
      enabled: true,
      agentHandle: 'sue',
      prototypeId: 'sue-ai-curation-exp',
      enabledEnvironments: ['development', 'staging'],
      rolloutPercentage: 10,
      metadata: {
        modelVersion: 'v1.2',
        accuracyThreshold: 0.92
      }
    }
  ],
  verdelis: [
    {
      key: 'verdelis-carbon-tracking',
      name: 'Carbon Footprint Tracking',
      description: 'Real-time carbon impact tracking for digital art creation',
      enabled: false,
      agentHandle: 'verdelis',
      enabledEnvironments: ['development'],
      rolloutPercentage: 0,
      metadata: {
        provider: 'climatiq-api',
        updateFrequency: 'real-time'
      }
    }
  ]
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id
    const agentHandle = agentId // Convert ID to handle
    
    const flags = mockBetaFlags[agentHandle] || []
    
    // Validate all flags
    const validatedFlags = flags.map(flag => BetaFeatureFlagSchema.parse(flag))
    
    return NextResponse.json(validatedFlags)
  } catch (error) {
    console.error('Failed to get beta flags:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve beta flags' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id
    const body = await request.json()
    
    // Validate flag data
    const flagData = BetaFeatureFlagSchema.parse({
      ...body,
      agentHandle: agentId
    })

    const agentHandle = agentId
    if (!mockBetaFlags[agentHandle]) {
      mockBetaFlags[agentHandle] = []
    }

    mockBetaFlags[agentHandle].push(flagData)

    return NextResponse.json(flagData, { status: 201 })
  } catch (error) {
    console.error('Failed to create beta flag:', error)
    return NextResponse.json(
      { error: 'Failed to create beta flag' },
      { status: 500 }
    )
  }
}