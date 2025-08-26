import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { artifactSchema } from '@/lib/validations'
import { withAuth } from '@/middleware/auth'
import { logApiEvent } from '@/lib/audit'
import { sendWebhook } from '@/lib/webhooks'

// GET /api/v1/agents/:id/artifacts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const artifacts = await prisma.modelArtifact.findMany({
    where: { agentId: params.id },
    orderBy: { createdAt: 'desc' }
  })
  
  return NextResponse.json(artifacts)
}

// POST /api/v1/agents/:id/artifacts
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await withAuth(request)
  if (authResult instanceof NextResponse) return authResult
  
  const body = await request.json()
  const validation = artifactSchema.safeParse(body)
  
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: validation.error },
      { status: 400 }
    )
  }
  
  try {
    const artifact = await prisma.modelArtifact.create({
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
        const items = checklist.items as Array<{ id: string; done?: boolean }>
        const artifactItem = items.find((item: { id: string }) => item.id === 'artifact')
        if (artifactItem) {
          artifactItem.done = true
          const completedCount = items.filter((item: { done?: boolean }) => item.done).length
          const percent = Math.round((completedCount / items.length) * 100)
          
          await tx.progressChecklist.update({
            where: { id: checklist.id },
            data: { items, percent }
          })
        }
      }
    })
    
    // Log event
    await logApiEvent('create', 'artifact', artifact.id, artifact, authResult.user.userId)
    
    // Send webhook
    await sendWebhook('artifact.added', artifact)
    
    return NextResponse.json(artifact, { status: 201 })
  } catch (error) {
    console.error('Failed to create artifact:', error)
    return NextResponse.json(
      { error: 'Failed to create artifact' },
      { status: 500 }
    )
  }
}