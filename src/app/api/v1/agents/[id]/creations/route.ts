import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { creationSchema } from '@/lib/validations'
import { withAuth } from '@/middleware/auth'
import { logApiEvent } from '@/lib/audit'
import { sendWebhook } from '@/lib/webhooks'

// GET /api/v1/agents/:id/creations
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  
  const { id } = await params
  const where: Record<string, unknown> = { agentId: id }
  if (status) {
    where.status = status.split('|')
  }
  
  const creations = await prisma.creation.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  })
  
  return NextResponse.json(creations)
}

// POST /api/v1/agents/:id/creations
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await withAuth(request)
  if (authResult instanceof NextResponse) return authResult
  
  const { id } = await params
  const body = await request.json()
  const validation = creationSchema.safeParse(body)
  
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: validation.error },
      { status: 400 }
    )
  }
  
  try {
    const creation = await prisma.creation.create({
      data: {
        agentId: id,
        ...validation.data
      }
    })
    
    // Update checklist if this is one of the first 3 creations
    const creationCount = await prisma.creation.count({
      where: { agentId: id }
    })
    
    if (creationCount <= 3) {
      await prisma.$transaction(async (tx) => {
        const checklist = await tx.progressChecklist.findUnique({
          where: {
            agentId_template: {
              agentId: id,
              template: 'GENESIS_AGENT'
            }
          }
        })
        
        if (checklist && creationCount === 3) {
          const items = checklist.items as Array<{ id: string; done?: boolean }>
          const creationsItem = items.find((item: { id: string }) => item.id === 'creations')
          if (creationsItem) {
            creationsItem.done = true
            const completedCount = items.filter((item: { done?: boolean }) => item.done).length
            const percent = Math.round((completedCount / items.length) * 100)
            
            await tx.progressChecklist.update({
              where: { id: checklist.id },
              data: { items, percent }
            })
          }
        }
      })
    }
    
    // Log event
    await logApiEvent('create', 'creation', creation.id, creation, authResult.user.userId)
    
    // Send webhook
    await sendWebhook('creation.published', creation)
    
    return NextResponse.json(creation, { status: 201 })
  } catch (error) {
    console.error('Failed to create creation:', error)
    return NextResponse.json(
      { error: 'Failed to create creation' },
      { status: 500 }
    )
  }
}