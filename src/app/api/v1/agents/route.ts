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
  
  const where: any = {}
  let cohortSlug = cohort
  
  if (cohort) {
    const cohortRecord = await prisma.cohort.findUnique({
      where: { slug: cohort }
    })
    if (cohortRecord) {
      where.cohortId = cohortRecord.id
    }
  }
  
  if (status) {
    where.status = { in: status.split('|') }
  }
  
  const agents = await prisma.agent.findMany({
    where,
    include: {
      cohort: true,
      profile: true,
      checklists: true
    }
  })
  
  // Return consistent envelope format
  const response = NextResponse.json({
    agents: agents.map(agent => ({
      ...agent,
      cohort: agent.cohort.slug
    })),
    total: agents.length,
    cohort: cohortSlug
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