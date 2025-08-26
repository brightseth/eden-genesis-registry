import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { profileSchema } from '@/lib/validations'
import { withAuth } from '@/middleware/auth'
import { logApiEvent } from '@/lib/audit'

// GET /api/v1/agents/:id/profile
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const profile = await prisma.profile.findUnique({
    where: { agentId: params.id }
  })
  
  if (!profile) {
    return NextResponse.json(
      { error: 'Profile not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(profile)
}

// PUT /api/v1/agents/:id/profile
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await withAuth(request)
  if (authResult instanceof NextResponse) return authResult
  
  const body = await request.json()
  const validation = profileSchema.safeParse(body)
  
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: validation.error },
      { status: 400 }
    )
  }
  
  try {
    const profile = await prisma.profile.upsert({
      where: { agentId: params.id },
      update: validation.data,
      create: {
        agentId: params.id,
        ...validation.data
      }
    })
    
    // Update checklist if statement is provided
    if (validation.data.statement) {
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
          const items = checklist.items as Array<Record<string, unknown>>
          const statementItem = items.find((item: Record<string, unknown>) => item.id === 'statement')
          if (statementItem) {
            statementItem.done = true
            const completedCount = items.filter((item: Record<string, unknown>) => item.done).length
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
    await logApiEvent('update', 'profile', params.id, validation.data, authResult.user.userId)
    
    return NextResponse.json(profile)
  } catch (error) {
    console.error('Failed to update profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}