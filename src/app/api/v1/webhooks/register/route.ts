import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { webhookSubscriptionSchema } from '@/lib/validations'
import { withAuth } from '@/middleware/auth'
import { generateInviteToken } from '@/lib/auth'
import { logApiEvent } from '@/lib/audit'

// POST /api/v1/webhooks/register
export async function POST(request: NextRequest) {
  const authResult = await withAuth(request)
  if (authResult instanceof NextResponse) return authResult
  
  const body = await request.json()
  const validation = webhookSubscriptionSchema.safeParse(body)
  
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: validation.error },
      { status: 400 }
    )
  }
  
  try {
    // Generate webhook secret
    const secret = generateInviteToken()
    
    const subscription = await prisma.webhookSubscription.create({
      data: {
        ...validation.data,
        secret
      }
    })
    
    // Log event
    await logApiEvent('create', 'webhook_subscription', subscription.id, subscription, authResult.user.userId)
    
    return NextResponse.json({
      id: subscription.id,
      secret,
      events: subscription.events
    }, { status: 201 })
  } catch (error) {
    console.error('Failed to register webhook:', error)
    return NextResponse.json(
      { error: 'Failed to register webhook' },
      { status: 500 }
    )
  }
}