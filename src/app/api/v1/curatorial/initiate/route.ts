import { NextRequest, NextResponse } from 'next/server'
import { CuratorialApprovalSystem } from '@/lib/curatorial-approval'
import { withAuth } from '@/middleware/auth'
import { Role } from '@prisma/client'

// POST /api/v1/curatorial/initiate
// Initiate curatorial review for an application (admin only)
export async function POST(request: NextRequest) {
  const authResult = await withAuth(request, Role.ADMIN)
  if (authResult instanceof NextResponse) return authResult

  try {
    const body = await request.json()
    const { applicationId, panelIds } = body

    // Validate required fields
    if (!applicationId || !panelIds || !Array.isArray(panelIds)) {
      return NextResponse.json(
        { error: 'Missing applicationId or panelIds array' },
        { status: 400 }
      )
    }

    // Validate panel size
    if (panelIds.length !== 3) {
      return NextResponse.json(
        { error: 'Panel must have exactly 3 curators' },
        { status: 400 }
      )
    }

    // Verify all panel members are curators
    const { prisma } = await import('@/lib/db')
    const curators = await prisma.user.findMany({
      where: {
        id: { in: panelIds },
        role: { in: [Role.CURATOR, Role.ADMIN] }
      }
    })

    if (curators.length !== panelIds.length) {
      return NextResponse.json(
        { error: 'All panel members must be curators or admins' },
        { status: 400 }
      )
    }

    // Initiate review
    await CuratorialApprovalSystem.initiateReview(applicationId, panelIds)

    return NextResponse.json({
      success: true,
      message: 'Curatorial review initiated successfully',
      applicationId,
      panelSize: panelIds.length,
      panel: curators.map(c => ({
        id: c.id,
        name: c.name || c.email,
        role: c.role
      })),
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Review initiation error:', error)
    
    if (error instanceof Error) {
      if (error.message === 'Application not found') {
        return NextResponse.json(
          { error: 'Application not found' },
          { status: 404 }
        )
      }
      if (error.message.includes('Panel must have exactly')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to initiate curatorial review' },
      { status: 500 }
    )
  }
}