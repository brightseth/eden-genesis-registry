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
    // Test database connection and get agent count
    const [agentCount, cohortCount] = await Promise.all([
      prisma.agent.count(),
      prisma.cohort.count()
    ])

    const response = NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: VERSION,
      database: 'connected',
      agentCount,
      cohortCount,
      environment: process.env.NODE_ENV || 'development'
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