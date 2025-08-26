import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { updateProgressSchema } from '@/lib/validations'
import { withAuth } from '@/middleware/auth'
import { logApiEvent } from '@/lib/audit'
import { sendWebhook } from '@/lib/webhooks'

// GET /api/v1/agents/:id/progress
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const checklist = await prisma.progressChecklist.findFirst({
    where: { agentId: params.id }
  })
  
  if (!checklist) {
    return NextResponse.json(
      { error: 'Progress not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(checklist)
}

// POST /api/v1/agents/:id/progress/check
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await withAuth(request)
  if (authResult instanceof NextResponse) return authResult
  
  const body = await request.json()
  const validation = updateProgressSchema.safeParse(body)
  
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: validation.error },
      { status: 400 }
    )
  }
  
  try {
    const checklist = await prisma.progressChecklist.findFirst({
      where: { agentId: params.id }
    })
    
    if (!checklist) {
      return NextResponse.json(
        { error: 'Checklist not found' },
        { status: 404 }
      )
    }
    
    const items = checklist.items as Array<Record<string, unknown>>
    const item = items.find((i: Record<string, unknown>) => i.id === validation.data.itemId)
    
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }
    
    item.done = validation.data.done
    const completedCount = items.filter((i: Record<string, unknown>) => i.done).length
    const percent = Math.round((completedCount / items.length) * 100)
    
    const updated = await prisma.progressChecklist.update({
      where: { id: checklist.id },
      data: { items, percent }
    })
    
    // Log event
    await logApiEvent('update', 'progress', checklist.id, { itemId: validation.data.itemId, done: validation.data.done }, authResult.user.userId)
    
    // Send webhook
    await sendWebhook('progress.updated', {
      agentId: params.id,
      template: checklist.template,
      percent,
      updatedItem: validation.data
    })
    
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Failed to update progress:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}