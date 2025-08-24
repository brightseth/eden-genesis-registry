import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { applicationSchema } from '@/lib/validations'
import { sendEmail, getApplicationConfirmationEmail } from '@/lib/email'
import { logApiEvent } from '@/lib/audit'

// POST /api/v1/applications (unauthenticated)
export async function POST(request: NextRequest) {
  const body = await request.json()
  const validation = applicationSchema.safeParse(body)
  
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: validation.error },
      { status: 400 }
    )
  }
  
  try {
    const application = await prisma.application.create({
      data: {
        ...validation.data,
        status: 'DRAFT'
      }
    })
    
    // Send confirmation email
    const emailContent = getApplicationConfirmationEmail(
      validation.data.applicantName,
      validation.data.track
    )
    await sendEmail({
      to: validation.data.applicantEmail,
      ...emailContent
    })
    
    // Log event
    await logApiEvent('create', 'application', application.id, application)
    
    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    console.error('Failed to create application:', error)
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    )
  }
}