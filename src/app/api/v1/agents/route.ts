import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createAgentSchema } from '@/lib/validations'
import { withAuth } from '@/middleware/auth'
import { logApiEvent } from '@/lib/audit'
import { sendWebhook } from '@/lib/webhooks'
import { CHECKLIST_TEMPLATES } from '@/lib/progress'
import { handleCors, withCors } from '@/lib/cors'
import { ChecklistTemplate, Role } from '@prisma/client'

// OPTIONS /api/v1/agents
export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 204 })
}

// GET /api/v1/agents
export async function GET(request: NextRequest) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  const { searchParams } = new URL(request.url)
  const cohort = searchParams.get('cohort')
  const status = searchParams.get('status')
  const role = searchParams.get('role')
  const search = searchParams.get('search')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')
  const sort = searchParams.get('sort') || 'createdAt'
  const order = searchParams.get('order') === 'desc' ? 'desc' : 'asc'
  
  const where: any = {}
  let cohortSlug = cohort
  
  // Cohort filter
  if (cohort) {
    const cohortRecord = await prisma.cohort.findUnique({
      where: { slug: cohort }
    })
    if (cohortRecord) {
      where.cohortId = cohortRecord.id
    }
  }
  
  // Status filter (pipe-separated for multiple)
  if (status) {
    where.status = { in: status.split('|') }
  }
  
  // Role filter (pipe-separated for multiple)
  if (role) {
    where.role = { in: role.split('|') }
  }
  
  // Search filter (searches handle, displayName, and profile statement)
  if (search) {
    const searchTerm = `%${search.toLowerCase()}%`
    where.OR = [
      { handle: { contains: search, mode: 'insensitive' } },
      { displayName: { contains: search, mode: 'insensitive' } },
      { 
        profile: {
          statement: { contains: search, mode: 'insensitive' }
        }
      }
    ]
  }
  
  // Build orderBy
  const orderBy: any = {}
  if (sort === 'handle') {
    orderBy.handle = order
  } else if (sort === 'displayName') {
    orderBy.displayName = order
  } else if (sort === 'status') {
    orderBy.status = order
  } else if (sort === 'role') {
    orderBy.role = order
  } else {
    orderBy.createdAt = order
  }
  
  // Execute query with pagination
  const [agents, totalCount] = await Promise.all([
    prisma.agent.findMany({
      where,
      include: {
        cohort: true,
        profile: true,
        checklists: true,
        _count: {
          select: {
            creations: true,
            personas: true,
            artifacts: true
          }
        }
      },
      orderBy,
      take: Math.min(limit, 100), // Cap at 100
      skip: offset
    }),
    prisma.agent.count({ where })
  ])
  
  // Return consistent envelope format with pagination
  const response = NextResponse.json({
    agents: agents.map(agent => ({
      ...agent,
      cohort: agent.cohort.slug,
      counts: agent._count
    })),
    total: agents.length,
    totalCount,
    hasMore: offset + agents.length < totalCount,
    pagination: {
      limit,
      offset,
      total: totalCount,
      pages: Math.ceil(totalCount / limit),
      currentPage: Math.floor(offset / limit) + 1
    },
    filters: {
      cohort: cohortSlug,
      status,
      role,
      search,
      sort,
      order
    }
  })
  
  return withCors(response, request)
}

// POST /api/v1/agents (admin only)
export async function POST(request: NextRequest) {
  const authResult = await withAuth(request, Role.ADMIN)
  if (authResult instanceof NextResponse) return authResult
  
  const body = await request.json()
  const validation = createAgentSchema.safeParse(body)
  
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: validation.error },
      { status: 400 }
    )
  }
  
  try {
    const agent = await prisma.agent.create({
      data: validation.data,
      include: {
        cohort: true
      }
    })
    
    // Create default checklist
    await prisma.progressChecklist.create({
      data: {
        agentId: agent.id,
        template: ChecklistTemplate.GENESIS_AGENT,
        items: CHECKLIST_TEMPLATES[ChecklistTemplate.GENESIS_AGENT],
        percent: 0
      }
    })
    
    // Log event
    await logApiEvent('create', 'agent', agent.id, agent, authResult.user.userId)
    
    // Send webhook
    await sendWebhook('agent.created', agent)
    
    return NextResponse.json(agent, { status: 201 })
  } catch (error) {
    console.error('Failed to create agent:', error)
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    )
  }
}