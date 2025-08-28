import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { LaunchValidator } from '@/lib/launch-validation'
import { withAuth } from '@/middleware/auth'
import { Role } from '@prisma/client'
import { logApiEvent } from '@/lib/audit'

// POST /api/v1/agents/launch
// Launch validation and approval for agents
export async function POST(request: NextRequest) {
  const authResult = await withAuth(request, [Role.ADMIN, Role.CURATOR])
  if (authResult instanceof NextResponse) return authResult

  try {
    const body = await request.json()
    const { agentId, force = false } = body

    if (!agentId) {
      return NextResponse.json(
        { error: 'Missing agentId' },
        { status: 400 }
      )
    }

    // Get agent details
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      include: {
        profile: true,
        cohort: true
      }
    })

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    // Run launch validation
    const validation = await LaunchValidator.validateAgentLaunch(agentId)
    
    // Check if launch should proceed
    const shouldLaunch = force || validation.isValid
    
    if (shouldLaunch) {
      // Update agent status to ACTIVE (if not already)
      if (agent.status !== 'ACTIVE') {
        await prisma.agent.update({
          where: { id: agentId },
          data: { 
            status: 'ACTIVE',
            visibility: 'PUBLIC' // Make public on launch
          }
        })
      }
      
      // Log launch event
      await logApiEvent('launch', 'agent', agentId, {
        validation,
        forced: force,
        launchedBy: authResult.user.userId
      }, authResult.user.userId)

      return NextResponse.json({
        success: true,
        message: `Agent ${agent.handle} launched successfully`,
        agent: {
          id: agent.id,
          handle: agent.handle,
          displayName: agent.displayName,
          agentNumber: agent.agentNumber
        },
        validation,
        launched: true,
        forced: force
      })
    } else {
      return NextResponse.json({
        success: false,
        message: `Agent ${agent.handle} failed launch validation`,
        agent: {
          id: agent.id,
          handle: agent.handle,
          displayName: agent.displayName,
          agentNumber: agent.agentNumber
        },
        validation,
        launched: false,
        recommendations: validation.recommendations
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Launch validation error:', error)
    return NextResponse.json(
      { error: 'Failed to validate agent launch' },
      { status: 500 }
    )
  }
}

// GET /api/v1/agents/launch
// Get launch validation results for agents
export async function GET(request: NextRequest) {
  const authResult = await withAuth(request, [Role.ADMIN, Role.CURATOR])
  if (authResult instanceof NextResponse) return authResult

  const { searchParams } = new URL(request.url)
  const agentId = searchParams.get('agent')
  const cohort = searchParams.get('cohort')

  try {
    if (agentId) {
      // Validate specific agent
      const validation = await LaunchValidator.validateAgentLaunch(agentId)
      
      const agent = await prisma.agent.findUnique({
        where: { id: agentId },
        select: {
          id: true,
          handle: true,
          displayName: true,
          agentNumber: true,
          status: true,
          cohort: { select: { slug: true } }
        }
      })

      return NextResponse.json({
        agent,
        validation,
        timestamp: new Date().toISOString()
      })
    } else {
      // Validate all agents in cohort
      const where = cohort ? {
        cohort: { slug: cohort }
      } : {
        status: { in: ['ACTIVE', 'ONBOARDING'] }
      }

      const agents = await prisma.agent.findMany({
        where,
        select: {
          id: true,
          handle: true,
          displayName: true,
          agentNumber: true,
          status: true,
          cohort: { select: { slug: true } }
        },
        orderBy: { agentNumber: 'asc' }
      })

      // Validate each agent
      const validations = await Promise.all(
        agents.map(async (agent) => {
          const validation = await LaunchValidator.validateAgentLaunch(agent.id)
          return {
            agent,
            validation
          }
        })
      )

      // Summary statistics
      const summary = {
        totalAgents: validations.length,
        readyToLaunch: validations.filter(v => v.validation.isValid).length,
        needsWork: validations.filter(v => !v.validation.isValid).length,
        averageScore: validations.reduce((sum, v) => sum + v.validation.score, 0) / validations.length
      }

      return NextResponse.json({
        summary,
        validations,
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('Launch validation error:', error)
    return NextResponse.json(
      { error: 'Failed to get launch validation' },
      { status: 500 }
    )
  }
}