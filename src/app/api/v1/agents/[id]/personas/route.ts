import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { personaSchema } from '@/lib/validations'
import { withAuth } from '@/middleware/auth'
import { logApiEvent } from '@/lib/audit'
import { sendWebhook } from '@/lib/webhooks'

// GET /api/v1/agents/:id/personas
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const personas = await prisma.persona.findMany({
    where: { agentId: params.id },
    orderBy: { createdAt: 'desc' }
  })
  
  return NextResponse.json(personas)
}

// POST /api/v1/agents/:id/personas
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await withAuth(request)
  if (authResult instanceof NextResponse) return authResult
  
  const body = await request.json()
  const validation = personaSchema.safeParse(body)
  
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: validation.error },
      { status: 400 }
    )
  }
  
  try {
    const persona = await prisma.persona.create({
      data: {
        agentId: params.id,
        ...validation.data
      }
    })
    
    // Update checklist
    await prisma.$transaction(async (tx) => {
      const checklist = await tx.progressChecklist.findUnique({
        where: {
          agentId_template: {
            agentId: params.id,
            template: 'GENESIS_AGENT'
          }
        }
      })
      
      if (checklist) {
        const items = checklist.items as any[]
        const personaItem = items.find((item: any) => item.id === 'persona')
        if (personaItem) {
          personaItem.done = true
          const completedCount = items.filter((item: any) => item.done).length
          const percent = Math.round((completedCount / items.length) * 100)
          
          await tx.progressChecklist.update({
            where: { id: checklist.id },
            data: { items, percent }
          })
        }
      }
    })
    
    // Log event
    await logApiEvent('create', 'persona', persona.id, persona, authResult.user.userId)
    
    // Send webhook
    await sendWebhook('persona.created', persona)
    
    return NextResponse.json(persona, { status: 201 })
  } catch (error) {
    console.error('Failed to create persona:', error)
    return NextResponse.json(
      { error: 'Failed to create persona' },
      { status: 500 }
    )
  }
}