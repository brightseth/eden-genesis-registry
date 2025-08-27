import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logApiEvent } from '@/lib/audit'

// Simple applications now use Registry database for consistency

// GET /api/v1/applications/simple
export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      where: {
        track: 'AGENT'
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json({
      applications,
      total: applications.length
    })
  } catch (error) {
    console.error('Failed to get applications:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve applications' },
      { status: 500 }
    )
  }
}

// POST /api/v1/applications/simple
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Basic validation - ensure required fields
    if (!body.applicantName || !body.applicantEmail || !body.payload?.name || !body.payload?.handle) {
      return NextResponse.json(
        { error: 'Missing required fields: applicantName, applicantEmail, payload.name, payload.handle' },
        { status: 400 }
      )
    }
    
    // Create application using Registry database - ensures consistency
    const application = await prisma.application.create({
      data: {
        applicantEmail: body.applicantEmail,
        applicantName: body.applicantName,
        track: 'AGENT', // Use canonical ApplicationTrack enum
        payload: body.payload, // Store as JSONB
        status: 'DRAFT' // Use canonical ApplicationStatus enum
      }
    })
    
    // Log event for audit trail
    await logApiEvent('create', 'application', application.id, application)
    
    // Log for monitoring
    console.log('New simple application created in Registry:', {
      id: application.id,
      name: body.payload.name,
      handle: body.payload.handle,
      applicant: body.applicantName
    })
    
    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    console.error('Failed to create application:', error)
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    )
  }
}