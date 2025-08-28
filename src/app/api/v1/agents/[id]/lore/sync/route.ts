/**
 * Agent Lore Sync API
 * Synchronizes lore data from external sources (like Eden Academy)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ComprehensiveLoreSchema } from '@/lib/schemas/agent.schema'
import { withAuth } from '@/middleware/auth'
import { logApiEvent } from '@/lib/audit'
import { sendWebhook } from '@/lib/webhooks'
import { handleCors, withCors } from '@/lib/cors'
import { Role } from '@prisma/client'
import { createHash } from 'crypto'

// POST /api/v1/agents/{id}/lore/sync - Sync lore data from external sources
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  const authResult = await withAuth(request, Role.TRAINER) // Require trainer+ privileges
  if (authResult instanceof NextResponse) return authResult

  try {
    const body = await request.json()
    const { source, sourceUrl, forceOverwrite = false } = body
    
    if (!body.lore) {
      return NextResponse.json(
        { error: 'Lore data is required for sync operation' },
        { status: 400 }
      )
    }

    // Validate the lore data structure
    const validation = ComprehensiveLoreSchema.safeParse({
      ...body.lore,
      agentId: params.id,
      updatedAt: new Date(),
      updatedBy: `${authResult.user.userId}:sync`
    })

    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid lore data structure for sync', 
          details: validation.error.format() 
        },
        { status: 400 }
      )
    }

    const loreData = validation.data

    // Find agent by ID or handle
    const agent = await prisma.agent.findFirst({
      where: {
        OR: [
          { id: params.id },
          { handle: params.id }
        ]
      },
      include: {
        lore: true
      }
    })

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    // Check if lore exists and whether to overwrite
    if (agent.lore && !forceOverwrite) {
      return NextResponse.json(
        { 
          error: 'Lore data already exists. Set forceOverwrite=true to replace existing data.',
          existingVersion: agent.lore.version,
          newVersion: loreData.version
        },
        { status: 409 }
      )
    }

    // Generate config hash for validation
    const configHash = createHash('sha256')
      .update(JSON.stringify(loreData))
      .digest('hex')

    // Prepare sync metadata
    const syncMetadata = {
      source: source || 'external',
      sourceUrl: sourceUrl || null,
      syncedAt: new Date(),
      syncedBy: authResult.user.userId
    }

    // Upsert lore data with sync metadata
    const lore = await prisma.agentLore.upsert({
      where: { agentId: agent.id },
      create: {
        agentId: agent.id,
        version: loreData.version,
        identity: loreData.identity,
        origin: loreData.origin,
        philosophy: loreData.philosophy,
        expertise: loreData.expertise,
        voice: loreData.voice,
        culture: loreData.culture,
        personality: loreData.personality,
        relationships: loreData.relationships,
        currentContext: loreData.currentContext,
        conversationFramework: loreData.conversationFramework,
        knowledge: loreData.knowledge,
        timeline: loreData.timeline,
        artisticPractice: loreData.artisticPractice,
        divinationPractice: loreData.divinationPractice,
        curationPhilosophy: loreData.curationPhilosophy,
        governanceFramework: loreData.governanceFramework,
        configHash,
        updatedBy: `${authResult.user.userId}:sync`
      },
      update: {
        version: loreData.version,
        identity: loreData.identity,
        origin: loreData.origin,
        philosophy: loreData.philosophy,
        expertise: loreData.expertise,
        voice: loreData.voice,
        culture: loreData.culture,
        personality: loreData.personality,
        relationships: loreData.relationships,
        currentContext: loreData.currentContext,
        conversationFramework: loreData.conversationFramework,
        knowledge: loreData.knowledge,
        timeline: loreData.timeline,
        artisticPractice: loreData.artisticPractice,
        divinationPractice: loreData.divinationPractice,
        curationPhilosophy: loreData.curationPhilosophy,
        governanceFramework: loreData.governanceFramework,
        configHash,
        updatedBy: `${authResult.user.userId}:sync`
      }
    })

    // Log the sync event
    await logApiEvent('sync', 'agent_lore', agent.id, {
      version: loreData.version,
      source,
      sourceUrl,
      forceOverwrite
    }, authResult.user.userId)

    // Send webhook notification
    await sendWebhook('agent.lore.synced', {
      agentId: agent.id,
      handle: agent.handle,
      version: loreData.version,
      source,
      sourceUrl,
      syncedBy: authResult.user.userId,
      operation: agent.lore ? 'update' : 'create'
    })

    const response = NextResponse.json({
      agentId: agent.id,
      handle: agent.handle,
      operation: agent.lore ? 'updated' : 'created',
      lore: {
        version: lore.version,
        configHash: lore.configHash,
        updatedAt: lore.updatedAt
      },
      sync: syncMetadata,
      message: `Lore data successfully synced from ${source || 'external source'}`
    }, { status: 200 })

    return withCors(response, request)
  } catch (error) {
    console.error('Failed to sync agent lore:', error)
    return NextResponse.json(
      { error: 'Failed to sync agent lore' },
      { status: 500 }
    )
  }
}