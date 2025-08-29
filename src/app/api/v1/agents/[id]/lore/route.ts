/**
 * Agent Lore API Endpoints
 * Comprehensive personality, history, and knowledge data for Eden Academy agents
 * REGISTRY-GUARDIAN: This is the authoritative source for all agent lore data
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ComprehensiveLoreSchema, LoreUpdateSchema, type ComprehensiveLore } from '@/lib/schemas/agent.schema'
import { withAuth } from '@/middleware/auth'
import { logApiEvent } from '@/lib/audit'
import { sendRegistryWebhook, type RegistryWebhookData } from '@/lib/webhooks'
import { handleCors, withCors } from '@/lib/cors'
import { validateWithGates, createValidationMiddleware } from '@/lib/validation-gates'
import { assertWritePermission, WriteOperation } from '@/lib/write-gates'
import { Role } from '@prisma/client'
import { createHash } from 'crypto'

// OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 204 })
}

// GET /api/v1/agents/{id}/lore - Retrieve comprehensive lore data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    const { id } = await params
    // Find agent by ID or handle
    const agent = await prisma.agent.findFirst({
      where: {
        OR: [
          { id: id },
          { handle: id }
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

    if (!agent.lore) {
      return NextResponse.json(
        { error: 'No lore data available for this agent' },
        { status: 404 }
      )
    }

    // Return the lore data with metadata
    const response = NextResponse.json({
      agentId: agent.id,
      handle: agent.handle,
      displayName: agent.displayName,
      lore: {
        version: agent.lore.version,
        identity: agent.lore.identity,
        origin: agent.lore.origin,
        philosophy: agent.lore.philosophy,
        expertise: agent.lore.expertise,
        voice: agent.lore.voice,
        culture: agent.lore.culture,
        personality: agent.lore.personality,
        relationships: agent.lore.relationships,
        currentContext: agent.lore.currentContext,
        conversationFramework: agent.lore.conversationFramework,
        knowledge: agent.lore.knowledge,
        timeline: agent.lore.timeline,
        // Specialized extensions
        artisticPractice: agent.lore.artisticPractice,
        divinationPractice: agent.lore.divinationPractice,
        curationPhilosophy: agent.lore.curationPhilosophy,
        governanceFramework: agent.lore.governanceFramework,
        // Metadata
        configHash: agent.lore.configHash,
        updatedBy: agent.lore.updatedBy,
        updatedAt: agent.lore.updatedAt
      },
      createdAt: agent.lore.createdAt,
      updatedAt: agent.lore.updatedAt
    })

    return withCors(response, request)
  } catch (error) {
    console.error('Failed to retrieve agent lore:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve agent lore' },
      { status: 500 }
    )
  }
}

// PUT /api/v1/agents/{id}/lore - Create or completely replace lore data
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  const authResult = await withAuth(request) // Get auth info
  if (authResult instanceof NextResponse) return authResult

  try {
    const { id } = await params
    const body = await request.json()
    
    // Check write permissions for lore
    try {
      assertWritePermission('lore', WriteOperation.UPDATE, {
        userId: authResult.user.userId,
        userRole: authResult.user.role as Role,
        agentId: id,
        operation: WriteOperation.UPDATE,
        collection: 'lore'
      })
    } catch (error) {
      return NextResponse.json(
        { 
          error: 'Access denied', 
          details: error instanceof Error ? error.message : 'Insufficient permissions for lore updates'
        },
        { status: 403 }
      )
    }
    
    // Validate lore data with progressive gates
    const validationResult = validateWithGates<ComprehensiveLore>('lore', body, {
      agentId: id,
      userId: authResult.user.userId
    })

    if (!validationResult.valid) {
      return NextResponse.json(
        { 
          error: 'Invalid lore data',
          details: validationResult.errors,
          level: validationResult.level
        },
        { status: 400 }
      )
    }

    const loreData = {
      ...validationResult.data,
      agentId: id,
      updatedAt: new Date(),
      updatedBy: authResult.user.userId
    }

    // Log warnings if any
    if (validationResult.warnings?.length) {
      console.warn(`⚠️ Lore validation warnings for agent ${id}:`, validationResult.warnings)
    }

    // Find agent by ID or handle
    const agent = await prisma.agent.findFirst({
      where: {
        OR: [
          { id: id },
          { handle: id }
        ]
      }
    })

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    // Generate config hash for validation
    const configHash = createHash('sha256')
      .update(JSON.stringify(loreData))
      .digest('hex')

    // Create or update lore data
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
        updatedBy: authResult.user.userId
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
        updatedBy: authResult.user.userId
      }
    })

    // TEMP: Skip audit logging for Abraham sync debugging
    // await logApiEvent('update', 'agent_lore', agent.id, { version: loreData.version }, authResult.user.userId)

    // Send registry webhook for lore update
    await sendRegistryWebhook('registry:lore.updated', {
      agentId: agent.id,
      operation: 'update',
      collection: 'lore',
      after: lore,
      userId: authResult.user.userId,
      timestamp: new Date().toISOString()
    })

    const response = NextResponse.json({
      agentId: agent.id,
      handle: agent.handle,
      lore,
      message: 'Lore data successfully updated'
    }, { status: 200 })

    return withCors(response, request)
  } catch (error) {
    console.error('Failed to update agent lore:', error)
    return NextResponse.json(
      { error: 'Failed to update agent lore' },
      { status: 500 }
    )
  }
}

// PATCH /api/v1/agents/{id}/lore - Partially update lore data
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  const authResult = await withAuth(request, Role.TRAINER) // Require trainer+ privileges  
  if (authResult instanceof NextResponse) return authResult

  try {
    const { id } = await params
    const body = await request.json()
    
    // Validate partial update structure
    const validation = LoreUpdateSchema.safeParse({
      ...body,
      updatedBy: authResult.user.userId
    })

    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid lore update data', 
          details: validation.error.format() 
        },
        { status: 400 }
      )
    }

    const updateData = validation.data

    // Find agent by ID or handle
    const agent = await prisma.agent.findFirst({
      where: {
        OR: [
          { id: id },
          { handle: id }
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

    if (!agent.lore) {
      return NextResponse.json(
        { error: 'No existing lore data to update. Use PUT to create initial lore data.' },
        { status: 404 }
      )
    }

    // Merge the updates with existing data
    const mergedData = {
      ...agent.lore,
      ...updateData,
      updatedBy: authResult.user.userId
    }

    // Generate new config hash
    const configHash = createHash('sha256')
      .update(JSON.stringify(mergedData))
      .digest('hex')

    // Update the lore data
    const lore = await prisma.agentLore.update({
      where: { agentId: agent.id },
      data: {
        ...updateData,
        configHash,
        updatedBy: authResult.user.userId
      }
    })

    // Log the event
    await logApiEvent('patch', 'agent_lore', agent.id, updateData, authResult.user.userId)

    // Send webhook notification
    await sendWebhook('agent.lore.patched', {
      agentId: agent.id,
      handle: agent.handle,
      updatedFields: Object.keys(updateData),
      updatedBy: authResult.user.userId
    })

    const response = NextResponse.json({
      agentId: agent.id,
      handle: agent.handle,
      lore,
      message: 'Lore data successfully updated'
    }, { status: 200 })

    return withCors(response, request)
  } catch (error) {
    console.error('Failed to patch agent lore:', error)
    return NextResponse.json(
      { error: 'Failed to patch agent lore' },
      { status: 500 }
    )
  }
}

// DELETE /api/v1/agents/{id}/lore - Remove lore data (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  const authResult = await withAuth(request, Role.ADMIN) // Admin only
  if (authResult instanceof NextResponse) return authResult

  try {
    const { id } = await params
    // Find agent by ID or handle
    const agent = await prisma.agent.findFirst({
      where: {
        OR: [
          { id: id },
          { handle: id }
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

    if (!agent.lore) {
      return NextResponse.json(
        { error: 'No lore data to delete' },
        { status: 404 }
      )
    }

    // Delete the lore data
    await prisma.agentLore.delete({
      where: { agentId: agent.id }
    })

    // Log the event
    await logApiEvent('delete', 'agent_lore', agent.id, null, authResult.user.userId)

    // Send webhook notification
    await sendWebhook('agent.lore.deleted', {
      agentId: agent.id,
      handle: agent.handle,
      deletedBy: authResult.user.userId
    })

    const response = NextResponse.json({
      agentId: agent.id,
      handle: agent.handle,
      message: 'Lore data successfully deleted'
    }, { status: 200 })

    return withCors(response, request)
  } catch (error) {
    console.error('Failed to delete agent lore:', error)
    return NextResponse.json(
      { error: 'Failed to delete agent lore' },
      { status: 500 }
    )
  }
}