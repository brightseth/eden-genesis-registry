import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logApiEvent } from '@/lib/audit'
import { sendWebhook } from '@/lib/webhooks'

// POST /api/v1/applications/experimental
// Handles experimental forms with flexible data structures
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Basic validation for experimental forms - very flexible
    if (!body.applicantName || !body.applicantEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: applicantName, applicantEmail' },
        { status: 400 }
      )
    }

    // Create application with experimental flag
    const application = await prisma.application.create({
      data: {
        applicantEmail: body.applicantEmail,
        applicantName: body.applicantName,
        track: body.track || 'TRAINER', // Default to TRAINER for experimental forms
        payload: {
          ...body.payload,
          experimental: true,
          source: body.source || 'experimental-form',
          timestamp: new Date().toISOString()
        },
        status: 'SUBMITTED' // Experimental forms go straight to review
      }
    })
    
    // Log experimental application
    await logApiEvent('create', 'application', application.id, {
      ...application,
      type: 'experimental'
    })
    
    // Send webhook for experimental applications
    await sendWebhook('application.experimental', {
      ...application,
      experimental: true
    })
    
    return NextResponse.json({
      ...application,
      experimental: true,
      message: 'Experimental application submitted successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Failed to create experimental application:', error)
    
    // For experimental forms, be more forgiving with errors
    if (error instanceof Error && error.message.includes('constraint')) {
      return NextResponse.json(
        { 
          error: 'Application data conflicts with existing records',
          message: 'This may be due to experimental data fields. Please contact support.',
          experimental: true
        },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    )
  }
}

// GET /api/v1/applications/experimental
// Retrieve experimental applications for review
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const includeExperimental = searchParams.get('experimental') === 'true'
  
  try {
    let where = {}
    
    if (includeExperimental) {
      // Query for experimental applications using JSONB contains
      where = {
        OR: [
          {
            payload: {
              path: ['experimental'],
              equals: true
            }
          },
          {
            payload: {
              path: ['source'],
              string_contains: 'experimental'
            }
          }
        ]
      }
    }
    
    const applications = await prisma.application.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit for performance
    })
    
    return NextResponse.json({
      applications: applications.map(app => ({
        ...app,
        experimental: app.payload && typeof app.payload === 'object' && 
                     (app.payload as any).experimental === true
      })),
      total: applications.length,
      message: includeExperimental ? 'Experimental applications included' : 'Standard applications only'
    })
  } catch (error) {
    console.error('Failed to get experimental applications:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve applications' },
      { status: 500 }
    )
  }
}