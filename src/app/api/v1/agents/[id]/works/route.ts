/**
 * Standardized Agent Works API
 * Consistent framework for accessing any agent's generated content
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { handleCors, withCors } from '@/lib/cors'

// OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 204 })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const { id: agentId } = await params
    const searchParams = request.nextUrl.searchParams
    
    // Standard query parameters
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    // Find agent by handle or ID
    const agent = await prisma.agent.findFirst({
      where: {
        OR: [
          { id: agentId },
          { handle: agentId }
        ]
      }
    })
    
    if (!agent) {
      const response = NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
      return withCors(response, request)
    }
    
    // Build where clause
    const where: any = { agentId: agent.id }
    if (status) {
      where.status = status
    }
    
    // Get works with pagination
    const [works, total] = await Promise.all([
      prisma.creation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.creation.count({ where })
    ])
    
    // Transform works for CRIT compatibility
    const transformedWorks = works.map(work => ({
      id: work.id,
      title: work.title,
      imageUrl: work.mediaUri,
      metadata: work.metadata,
      status: work.status,
      createdAt: work.createdAt,
      updatedAt: work.updatedAt,
      // Add extra fields from metadata if present
      ...(work.metadata && typeof work.metadata === 'object' ? {
        description: (work.metadata as any).description,
        price: (work.metadata as any).price,
        views: (work.metadata as any).views,
        likes: (work.metadata as any).likes,
        medium: (work.metadata as any).medium,
        style: (work.metadata as any).style,
        theme: (work.metadata as any).theme
      } : {})
    }))
    
    const response = NextResponse.json({
      works: transformedWorks,
      total,
      agent: {
        id: agent.id,
        handle: agent.handle,
        displayName: agent.displayName
      }
    })
    
    return withCors(response, request)
  } catch (error) {
    console.error('Error fetching agent works:', error)
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
    return withCors(response, request)
  }
}

// POST /api/v1/agents/[id]/works
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    // Check authentication
    const authHeader = request.headers.get('authorization')
    const apiKey = authHeader?.replace('Bearer ', '')
    
    // For now, use a simple API key check (enhance later with proper auth)
    const validApiKey = process.env.REGISTRY_API_KEY || 'registry-upload-key-v1'
    if (apiKey !== validApiKey) {
      const response = NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
      return withCors(response, request)
    }

    const { id: agentId } = await params
    const body = await request.json()
    
    // Extract idempotency key
    const idempotencyKey = request.headers.get('idempotency-key')
    
    // Find agent by handle or ID
    const agent = await prisma.agent.findFirst({
      where: {
        OR: [
          { id: agentId },
          { handle: agentId }
        ]
      }
    })
    
    if (!agent) {
      const response = NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
      return withCors(response, request)
    }
    
    // Check for existing work with same idempotency key
    if (idempotencyKey) {
      const existingWork = await prisma.creation.findFirst({
        where: { idempotencyKey }
      })
      
      if (existingWork) {
        const response = NextResponse.json({
          work_id: existingWork.id,
          work: existingWork,
          message: 'Work already exists (idempotent)'
        })
        return withCors(response, request)
      }
    }
    
    // Validate required fields
    const workData = body.work || body
    if (!workData.media_type || !workData.metadata?.creation_url) {
      const response = NextResponse.json(
        { error: 'Missing required fields: media_type and creation_url' },
        { status: 400 }
      )
      return withCors(response, request)
    }
    
    // Create new work with full payload
    const work = await prisma.creation.create({
      data: {
        agentId: agent.id,
        title: workData.metadata?.title || 'Untitled',
        mediaUri: workData.urls?.full || workData.metadata?.creation_url,
        mediaType: workData.media_type,
        creationUrl: workData.metadata?.creation_url,
        idempotencyKey,
        metadata: {
          description: workData.metadata?.description,
          source: workData.metadata?.source || 'eden.studio',
          ...workData.metadata
        },
        features: workData.features || {},
        market: workData.market || null,
        urls: workData.urls || {
          full: workData.metadata?.creation_url,
          preview: workData.urls?.preview,
          thumbnail: workData.urls?.thumbnail
        },
        status: workData.status || 'PUBLISHED',
        availability: workData.availability || 'available'
      }
    })
    
    // TODO: Queue rendition jobs if post_process.renditions is provided
    if (body.post_process?.renditions) {
      console.log('TODO: Queue rendition jobs for:', body.post_process.renditions)
    }
    
    const response = NextResponse.json({
      work_id: work.id,
      work,
      message: 'Work created successfully',
      public_url: `https://eden-genesis-registry.vercel.app/agents/${agent.handle}/works/${work.id}`
    })
    
    return withCors(response, request)
  } catch (error) {
    console.error('Error creating work:', error)
    const response = NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
    return withCors(response, request)
  }
}