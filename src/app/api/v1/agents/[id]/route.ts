import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { updateAgentSchema } from '@/lib/validations'
import { withAuth } from '@/middleware/auth'
import { logApiEvent } from '@/lib/audit'
import { sendRegistryWebhook, type RegistryWebhookData } from '@/lib/webhooks'
import { handleCors, withCors } from '@/lib/cors'
import { assertWritePermission, WriteOperation } from '@/lib/write-gates'
import { Role } from '@prisma/client'

// OPTIONS handler
export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 204 })
}

// GET /api/v1/agents/:id (accepts both ID and handle)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  // Try to find by ID first, then by handle
  const agent = await prisma.agent.findFirst({
    where: {
      OR: [
        { id: params.id },
        { handle: params.id }
      ]
    },
    include: {
      cohort: true,
      profile: true,
      lore: true,
      personas: true,
      artifacts: true,
      creations: {
        orderBy: { createdAt: 'desc' },
        take: 10
      },
      trainers: {
        include: {
          trainer: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      },
      socialAccounts: true,
      checklists: true
    }
  })
  
  if (!agent) {
    return NextResponse.json(
      { error: 'Agent not found' },
      { status: 404 }
    )
  }
  
  const response = NextResponse.json(agent)
  return withCors(response, request)
}

// PATCH /api/v1/agents/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await withAuth(request)
  if (authResult instanceof NextResponse) return authResult
  
  const body = await request.json()
  const validation = updateAgentSchema.safeParse(body)
  
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: validation.error },
      { status: 400 }
    )
  }

  // Check write permissions
  try {
    // Special handling for status updates (ADMIN only)
    if (validation.data.status) {
      assertWritePermission('agent_status', WriteOperation.UPDATE, {
        userId: authResult.user.userId,
        userRole: authResult.user.role as Role,
        agentId: params.id,
        operation: WriteOperation.UPDATE,
        collection: 'agent_status'
      })
    } else {
      // Regular agent updates (TRAINER+)
      assertWritePermission('agent', WriteOperation.UPDATE, {
        userId: authResult.user.userId,
        userRole: authResult.user.role as Role,
        agentId: params.id,
        operation: WriteOperation.UPDATE,
        collection: 'agent'
      })
    }
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Access denied', 
        details: error instanceof Error ? error.message : 'Insufficient permissions'
      },
      { status: 403 }
    )
  }
  
  try {
    const agent = await prisma.agent.update({
      where: { id: params.id },
      data: validation.data,
      include: {
        cohort: true,
        profile: true
      }
    })
    
    // Log event
    await logApiEvent('update', 'agent', agent.id, validation.data, authResult.user.userId)
    
    // Send registry webhook
    const webhookEvent = validation.data.status ? 'registry:agent.status_changed' : 'registry:agent.updated'
    await sendRegistryWebhook(webhookEvent, {
      agentId: agent.id,
      operation: 'update',
      collection: 'agent',
      after: agent,
      userId: authResult.user.userId,
      timestamp: new Date().toISOString()
    })
    
    const response = NextResponse.json(agent)
  return withCors(response, request)
  } catch (error) {
    console.error('Failed to update agent:', error)
    return NextResponse.json(
      { error: 'Failed to update agent' },
      { status: 500 }
    )
  }
}

// DELETE /api/v1/agents/:id (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await withAuth(request, Role.ADMIN)
  if (authResult instanceof NextResponse) return authResult
  
  try {
    await prisma.agent.delete({
      where: { id: params.id }
    })
    
    // Log event
    await logApiEvent('delete', 'agent', params.id, null, authResult.user.userId)
    
    // Send webhook
    await sendWebhook('agent.deleted', { id: params.id })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete agent:', error)
    return NextResponse.json(
      { error: 'Failed to delete agent' },
      { status: 500 }
    )
  }
}