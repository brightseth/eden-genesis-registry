import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/middleware/auth'
import { logApiEvent } from '@/lib/audit'
import { sendWebhook } from '@/lib/webhooks'
import { Role } from '@prisma/client'

// POST /api/v1/applications/:id/review (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await withAuth(request, Role.ADMIN)
  if (authResult instanceof NextResponse) return authResult
  
  const body = await request.json()
  const { status, agentId, reviewNotes } = body
  
  if (!['ACCEPTED', 'REJECTED'].includes(status)) {
    return NextResponse.json(
      { error: 'Invalid status. Must be ACCEPTED or REJECTED' },
      { status: 400 }
    )
  }
  
  try {
    const application = await prisma.application.update({
      where: { id: params.id },
      data: {
        status,
        agentId,
        reviewerId: authResult.user.userId,
        reviewNotes
      },
      include: {
        agent: true,
        reviewer: true
      }
    })
    
    // Log event
    await logApiEvent('review', 'application', application.id, { status, agentId, reviewNotes }, authResult.user.userId)
    
    // Send webhook
    await sendWebhook('application.reviewed', application)
    
    // If accepted with agent assignment, update agent status
    if (status === 'ACCEPTED' && agentId) {
      await prisma.agent.update({
        where: { id: agentId },
        data: { status: 'ONBOARDING' }
      })
      
      await sendWebhook('agent.updated', { id: agentId, status: 'ONBOARDING' })
    }
    
    return NextResponse.json(application)
  } catch (error) {
    console.error('Failed to review application:', error)
    return NextResponse.json(
      { error: 'Failed to review application' },
      { status: 500 }
    )
  }
}