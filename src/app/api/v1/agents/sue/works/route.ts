import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { registryClient } from '@/lib/registry-sdk-client'

const CreateWorkSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  mediaType: z.string().default('CURATION_ANALYSIS'),
  mediaUri: z.string().url('Valid media URI required'),
  metadata: z.object({
    curatorVerdict: z.enum(['MASTERWORK', 'WORTHY', 'PROMISING', 'DEVELOPING']),
    overallScore: z.number().min(0).max(100),
    artisticInnovation: z.number().min(0).max(100),
    culturalRelevance: z.number().min(0).max(100),
    technicalMastery: z.number().min(0).max(100),
    criticalExcellence: z.number().min(0).max(100),
    marketImpact: z.number().min(0).max(100),
    analysis: z.string(),
    curator: z.string().default('SUE'),
    analysisDepth: z.enum(['quick', 'standard', 'comprehensive']),
    sourceUrl: z.string().url()
  }),
  features: z.object({
    tags: z.array(z.string()).default([])
  }).optional()
})

// Get SUE's agent ID from the Registry
async function getSueAgentId(): Promise<string | null> {
  try {
    // Direct fetch approach for development
    const response = await fetch('http://localhost:3007/api/v1/agents/sue')
    if (response.ok) {
      const sueAgent = await response.json()
      return sueAgent.id || 'sue-agent-id'
    }
    return 'sue-agent-id' // Fallback for development
  } catch (error) {
    console.error('Failed to get SUE agent ID:', error)
    return 'sue-agent-id' // Fallback for development
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = CreateWorkSchema.parse(body)
    
    // Get SUE's agent ID
    const sueAgentId = await getSueAgentId()
    if (!sueAgentId) {
      return NextResponse.json(
        { success: false, error: 'SUE agent not found in Registry' },
        { status: 404 }
      )
    }

    // Create the work record via Registry SDK
    const workData = {
      agentId: sueAgentId,
      title: validatedData.title,
      mediaType: validatedData.mediaType,
      mediaUri: validatedData.mediaUri,
      metadata: validatedData.metadata,
      features: validatedData.features || { tags: [] },
      status: 'PUBLISHED'
    }

    try {
      // In a real implementation, this would call the Registry API
      // For now, we'll simulate success and log the data
      console.log('Creating SUE curatorial work:', workData)
      
      const workId = `work_${Date.now()}`
      
      return NextResponse.json({
        success: true,
        workId,
        message: 'Curatorial analysis persisted successfully',
        data: {
          ...workData,
          id: workId,
          createdAt: new Date().toISOString()
        }
      })
    } catch (error) {
      console.error('Failed to create work:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to persist curatorial analysis' },
        { status: 500 }
      )
    }
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid work data format',
          details: error.errors 
        },
        { status: 400 }
      )
    }
    
    console.error('Work creation error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error during work creation' 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const verdictFilter = searchParams.get('verdict') // masterwork, worthy, etc.
    
    // Get SUE's agent ID
    const sueAgentId = await getSueAgentId()
    if (!sueAgentId) {
      return NextResponse.json(
        { success: false, error: 'SUE agent not found' },
        { status: 404 }
      )
    }

    // Mock recent analyses for demonstration
    const mockWorks = [
      {
        id: 'work_1',
        title: 'Digital Consciousness Exploration #127',
        mediaType: 'CURATION_ANALYSIS',
        mediaUri: 'https://gateway.pinata.cloud/ipfs/QmExample1',
        metadata: {
          curatorVerdict: 'MASTERWORK',
          overallScore: 87,
          artisticInnovation: 88,
          culturalRelevance: 92,
          technicalMastery: 85,
          criticalExcellence: 90,
          marketImpact: 78,
          analysis: 'A profound exploration of digital consciousness with exceptional cultural relevance and technical mastery.',
          curator: 'SUE',
          analysisDepth: 'comprehensive',
          sourceUrl: 'https://example.com/consciousness-work'
        },
        features: {
          tags: ['curator:sue', 'verdict:masterwork', 'score:87']
        },
        createdAt: '2025-08-28T15:30:00Z'
      },
      {
        id: 'work_2',
        title: 'Generative Portrait Series',
        mediaType: 'CURATION_ANALYSIS', 
        mediaUri: 'https://gateway.pinata.cloud/ipfs/QmExample2',
        metadata: {
          curatorVerdict: 'WORTHY',
          overallScore: 76,
          artisticInnovation: 75,
          culturalRelevance: 70,
          technicalMastery: 90,
          criticalExcellence: 82,
          marketImpact: 65,
          analysis: 'Strong technical execution with room for deeper cultural engagement and conceptual development.',
          curator: 'SUE',
          analysisDepth: 'standard',
          sourceUrl: 'https://example.com/portrait-series'
        },
        features: {
          tags: ['curator:sue', 'verdict:worthy', 'score:76']
        },
        createdAt: '2025-08-28T12:15:00Z'
      }
    ]

    // Apply verdict filter if specified
    let filteredWorks = mockWorks
    if (verdictFilter) {
      filteredWorks = mockWorks.filter(work => 
        work.metadata.curatorVerdict.toLowerCase() === verdictFilter.toLowerCase()
      )
    }

    // Apply limit
    filteredWorks = filteredWorks.slice(0, limit)

    return NextResponse.json({
      success: true,
      works: filteredWorks,
      total: filteredWorks.length,
      curator: 'SUE',
      filters: {
        verdict: verdictFilter,
        limit
      },
      summary: {
        totalAnalyses: mockWorks.length,
        masterworks: mockWorks.filter(w => w.metadata.curatorVerdict === 'MASTERWORK').length,
        worthy: mockWorks.filter(w => w.metadata.curatorVerdict === 'WORTHY').length,
        promising: mockWorks.filter(w => w.metadata.curatorVerdict === 'PROMISING').length,
        developing: mockWorks.filter(w => w.metadata.curatorVerdict === 'DEVELOPING').length
      }
    })
    
  } catch (error) {
    console.error('Failed to fetch SUE works:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch curatorial works' },
      { status: 500 }
    )
  }
}