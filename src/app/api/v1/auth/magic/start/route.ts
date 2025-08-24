import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { magicLinkSchema } from '@/lib/validations'
import { generateInviteToken } from '@/lib/auth'
import { sendEmail, getMagicLinkEmail } from '@/lib/email'
import { addDays } from 'date-fns'

// POST /api/v1/auth/magic/start
export async function POST(request: NextRequest) {
  const body = await request.json()
  const validation = magicLinkSchema.safeParse(body)
  
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: validation.error },
      { status: 400 }
    )
  }
  
  const { email } = validation.data
  
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please request an invitation.' },
        { status: 404 }
      )
    }
    
    // Create magic link invitation
    const inviteToken = generateInviteToken()
    const expiresAt = addDays(new Date(), 7)
    
    await prisma.invitation.create({
      data: {
        email,
        roleTarget: user.role,
        inviteToken,
        expiresAt
      }
    })
    
    // Send email
    const emailContent = getMagicLinkEmail(inviteToken, user.role)
    await sendEmail({
      to: email,
      ...emailContent
    })
    
    return NextResponse.json({
      message: 'Magic link sent to your email'
    })
  } catch (error) {
    console.error('Failed to send magic link:', error)
    return NextResponse.json(
      { error: 'Failed to send magic link' },
      { status: 500 }
    )
  }
}