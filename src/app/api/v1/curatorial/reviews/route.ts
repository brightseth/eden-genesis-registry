import { NextRequest, NextResponse } from 'next/server'
import { CuratorialApprovalSystem } from '@/lib/curatorial-approval'
import { withAuth } from '@/middleware/auth'
import { Role } from '@prisma/client'

// GET /api/v1/curatorial/reviews
// Get review status or pending reviews for curator
export async function GET(request: NextRequest) {
  const authResult = await withAuth(request, [Role.ADMIN, Role.CURATOR])
  if (authResult instanceof NextResponse) return authResult

  const { searchParams } = new URL(request.url)
  const applicationId = searchParams.get('application')
  const pending = searchParams.get('pending') === 'true'

  try {
    if (applicationId) {
      // Get review status for specific application
      const status = await CuratorialApprovalSystem.getReviewStatus(applicationId)
      return NextResponse.json({
        status,
        timestamp: new Date().toISOString()
      })
    } else if (pending) {
      // Get pending reviews for current curator
      const pendingReviews = await CuratorialApprovalSystem.getPendingReviews(
        authResult.user.userId
      )
      return NextResponse.json({
        pendingReviews,
        count: pendingReviews.length,
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json(
        { error: 'Must specify application ID or set pending=true' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Curatorial review error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve review data' },
      { status: 500 }
    )
  }
}

// POST /api/v1/curatorial/reviews
// Submit a curatorial review
export async function POST(request: NextRequest) {
  const authResult = await withAuth(request, [Role.ADMIN, Role.CURATOR])
  if (authResult instanceof NextResponse) return authResult

  try {
    const body = await request.json()
    const { applicationId, review } = body

    // Validate required fields
    if (!applicationId || !review) {
      return NextResponse.json(
        { error: 'Missing applicationId or review data' },
        { status: 400 }
      )
    }

    // Validate review structure
    const requiredFields = ['status', 'score', 'feedback', 'criteria']
    const missingFields = requiredFields.filter(field => !(field in review))
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing review fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate criteria scores
    const criteriaFields = ['alignment', 'quality', 'originality', 'viability']
    const missingCriteria = criteriaFields.filter(field => !(field in review.criteria))
    if (missingCriteria.length > 0) {
      return NextResponse.json(
        { error: `Missing criteria scores: ${missingCriteria.join(', ')}` },
        { status: 400 }
      )
    }

    // Submit review
    await CuratorialApprovalSystem.submitReview(
      applicationId,
      authResult.user.userId,
      {
        ...review,
        reviewerName: authResult.user.name || authResult.user.email
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully',
      applicationId,
      reviewerId: authResult.user.userId,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Review submission error:', error)
    
    if (error instanceof Error && error.message.includes('scores must be between')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    )
  }
}