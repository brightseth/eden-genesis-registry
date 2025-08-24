import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyMagicLinkSchema } from '@/lib/validations'
import { generateToken } from '@/lib/auth'
import { logApiEvent } from '@/lib/audit'

// POST /api/v1/auth/magic/complete
export async function POST(request: NextRequest) {
  const body = await request.json()
  const validation = verifyMagicLinkSchema.safeParse(body)
  
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: validation.error },
      { status: 400 }
    )
  }
  
  const { token } = validation.data
  
  try {
    // Find invitation
    const invitation = await prisma.invitation.findUnique({
      where: { inviteToken: token }
    })
    
    if (!invitation) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }
    
    // Check expiration
    if (new Date() > invitation.expiresAt) {
      return NextResponse.json(
        { error: 'Token has expired' },
        { status: 401 }
      )
    }
    
    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: invitation.email }
    })
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: invitation.email,
          role: invitation.roleTarget,
          lastLoginAt: new Date()
        }
      })
    } else {
      // Update last login
      user = await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      })
    }
    
    // Mark invitation as accepted
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { acceptedAt: new Date() }
    })
    
    // Generate JWT
    const jwt = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })
    
    // Log event
    await logApiEvent('login', 'user', user.id, { method: 'magic_link' })
    
    return NextResponse.json({
      token: jwt,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Failed to complete magic link:', error)
    return NextResponse.json(
      { error: 'Failed to complete authentication' },
      { status: 500 }
    )
  }
}