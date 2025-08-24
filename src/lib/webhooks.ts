import { prisma } from './db'
import crypto from 'crypto'

interface WebhookPayload {
  event: string
  data: any
  timestamp: string
}

export async function sendWebhook(eventType: string, data: any) {
  const subscriptions = await prisma.webhookSubscription.findMany({
    where: {
      active: true,
      events: {
        has: eventType
      }
    }
  })

  const payload: WebhookPayload = {
    event: eventType,
    data,
    timestamp: new Date().toISOString()
  }

  const deliveries = await Promise.all(
    subscriptions.map(async (subscription) => {
      const signature = generateSignature(payload, subscription.secret)
      
      const delivery = await prisma.webhookDelivery.create({
        data: {
          subscriptionId: subscription.id,
          eventType,
          payload: payload as any,
          status: 'pending'
        }
      })

      // Send webhook asynchronously
      sendWebhookRequest(subscription.url, payload, signature, delivery.id)
      
      return delivery
    })
  )

  return deliveries
}

function generateSignature(payload: WebhookPayload, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(JSON.stringify(payload))
  return hmac.digest('hex')
}

async function sendWebhookRequest(
  url: string,
  payload: WebhookPayload,
  signature: string,
  deliveryId: string
) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Eden-Signature': signature
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      await prisma.webhookDelivery.update({
        where: { id: deliveryId },
        data: {
          status: 'success',
          deliveredAt: new Date()
        }
      })
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
  } catch (error) {
    await prisma.webhookDelivery.update({
      where: { id: deliveryId },
      data: {
        status: 'failed',
        lastError: error instanceof Error ? error.message : 'Unknown error',
        attempts: {
          increment: 1
        }
      }
    })
  }
}

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}