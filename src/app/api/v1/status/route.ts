import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { handleCors, withCors } from '@/lib/cors'

const VERSION = '1.0.0'

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 204 })
}

export async function GET(request: NextRequest) {
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    // Test database connection and get comprehensive counts
    const [agentCount, cohortCount, activeAgents, firstCohort] = await Promise.all([
      prisma.agent.count(),
      prisma.cohort.count(),
      prisma.agent.count({ where: { status: 'ACTIVE' } }),
      prisma.cohort.findFirst({ orderBy: { createdAt: 'asc' } })
    ])

    // Get count for the first/primary cohort (typically Genesis)
    const primaryCohortAgents = firstCohort 
      ? await prisma.agent.count({ where: { cohortId: firstCohort.id } })
      : 0

    const response = NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: VERSION,
      database: 'connected',
      agentCount,
      cohortCount,
      primaryCohortAgents,
      primaryCohort: firstCohort?.slug || null,
      activeAgents,
      environment: process.env.NODE_ENV || 'development',
      seeded: agentCount >= 10 ? 'complete' : 'incomplete'
    })

    return withCors(response, request)
  } catch (error) {
    const response = NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: VERSION,
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV || 'development'
    }, { status: 503 })

    return withCors(response, request)
  }
}