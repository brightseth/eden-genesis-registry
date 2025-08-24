import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { invitationSchema } from '@/lib/validations'
import { withAuth } from '@/middleware/auth'
import { generateInviteToken } from '@/lib/auth'
import { sendEmail, getMagicLinkEmail } from '@/lib/email'
import { logApiEvent } from '@/lib/audit'
import { addDays } from 'date-fns'
import { Role } from '@prisma/client'

// POST /api/v1/invitations (admin only)
export async function POST(request: NextRequest) {
  const authResult = await withAuth(request, Role.ADMIN)
  if (authResult instanceof NextResponse) return authResult
  
  const body = await request.json()
  const validation = invitationSchema.safeParse(body)
  
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: validation.error },
      { status: 400 }
    )
  }
  
  try {
    const inviteToken = generateInviteToken()
    const expiresAt = addDays(new Date(), 7)
    
    const invitation = await prisma.invitation.create({
      data: {
        ...validation.data,
        inviteToken,
        expiresAt,
        invitedBy: authResult.user.userId
      }
    })
    
    // Send email
    const emailContent = getMagicLinkEmail(inviteToken, validation.data.roleTarget)
    await sendEmail({
      to: validation.data.email,
      ...emailContent
    })
    
    // Log event
    await logApiEvent('create', 'invitation', invitation.id, invitation, authResult.user.userId)
    
    return NextResponse.json(invitation, { status: 201 })
  } catch (error) {
    console.error('Failed to create invitation:', error)
    return NextResponse.json(
      { error: 'Failed to create invitation' },
      { status: 500 }
    )
  }
}