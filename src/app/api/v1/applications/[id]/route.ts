import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
// import { withAuth } from '@/middleware/auth'
import { logApiEvent } from '@/lib/audit'

// PATCH /api/v1/applications/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  
  try {
    const application = await prisma.application.update({
      where: { id: params.id },
      data: {
        status: body.status || 'SUBMITTED',
        payload: body.payload
      }
    })
    
    // Log event
    await logApiEvent('update', 'application', application.id, body)
    
    return NextResponse.json(application)
  } catch (error) {
    console.error('Failed to update application:', error)
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    )
  }
}