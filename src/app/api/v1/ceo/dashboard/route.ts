import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/middleware/auth'
import { Role } from '@prisma/client'
import { prisma } from '@/lib/db'
import { AgentMonitoringSystem } from '@/lib/agent-monitoring'

export async function GET(request: NextRequest) {
  // Require ADMIN role for CEO dashboard access
  const authResult = await withAuth(request, [Role.ADMIN])
  if (authResult instanceof NextResponse) return authResult

  try {
    // Get core system metrics in parallel
    const [
      dashboardData,
      systemStatus,
      agentStats,
      alertsData
    ] = await Promise.all([
      AgentMonitoringSystem.generateDashboardData('weekly'),
      checkSystemHealth(),
      getAgentStatistics(),
      getExecutiveAlerts()
    ])

    // Calculate executive-level metrics
    const executiveMetrics = {
      systemHealth: calculateSystemHealth(systemStatus, dashboardData),
      revenue: calculateEcosystemRevenue(dashboardData),
      activeAgents: agentStats.active,
      criticalAlerts: alertsData.critical.length,
      agentPerformance: calculatePerformanceDistribution(dashboardData),
      trends: await getExecutiveTrends()
    }

    return NextResponse.json({
      success: true,
      data: executiveMetrics,
      systemStatus,
      alerts: alertsData,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('CEO Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate CEO dashboard data' },
      { status: 500 }
    )
  }
}

async function checkSystemHealth() {
  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`
    
    // Check registry status
    const agentCount = await prisma.agent.count()
    
    return {
      database: 'online',
      registry: 'online',
      agents: agentCount > 0 ? 'operational' : 'degraded',
      lastCheck: new Date().toISOString()
    }
  } catch (error) {
    return {
      database: 'offline',
      registry: 'degraded',
      agents: 'offline',
      lastCheck: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function getAgentStatistics() {
  const agents = await prisma.agent.findMany({
    select: {
      id: true,
      status: true,
      handle: true,
      displayName: true
    }
  })

  const byStatus = agents.reduce((acc, agent) => {
    acc[agent.status] = (acc[agent.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    total: agents.length,
    active: byStatus.ACTIVE || 0,
    onboarding: byStatus.ONBOARDING || 0,
    applying: byStatus.APPLYING || 0,
    graduated: byStatus.GRADUATED || 0,
    byStatus
  }
}

async function getExecutiveAlerts() {
  // Get recent events that require executive attention
  const events = await prisma.event.findMany({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 50
  })

  const alerts = {
    critical: [] as any[],
    warning: [] as any[],
    info: [] as any[]
  }

  // Categorize events into alert levels
  events.forEach(event => {
    if (event.type.includes('ERROR') || event.type.includes('FAILURE')) {
      alerts.critical.push({
        id: event.id,
        message: event.data ? JSON.parse(event.data).message || event.type : event.type,
        timestamp: event.createdAt,
        category: 'system'
      })
    } else if (event.type.includes('WARN') || event.type.includes('SLOW')) {
      alerts.warning.push({
        id: event.id,
        message: event.data ? JSON.parse(event.data).message || event.type : event.type,
        timestamp: event.createdAt,
        category: 'performance'
      })
    }
  })

  return alerts
}

function calculateSystemHealth(systemStatus: any, dashboardData: any) {
  let score = 100

  // Database health (30 points)
  if (systemStatus.database !== 'online') score -= 30

  // Registry health (25 points)
  if (systemStatus.registry !== 'online') score -= 25

  // Agent operational status (25 points)
  if (systemStatus.agents !== 'operational') score -= 25

  // Performance health (20 points based on agent metrics)
  if (dashboardData.summary) {
    const avgPerformance = dashboardData.summary.averagePerformance || 0
    if (avgPerformance < 0.7) score -= 20
    else if (avgPerformance < 0.8) score -= 10
  }

  return Math.max(0, Math.min(100, score))
}

function calculateEcosystemRevenue(dashboardData: any) {
  // Simulate revenue calculation from agent performance
  // In production, this would aggregate real revenue metrics
  const baseRevenue = 76700 // $76.7k base
  const performanceMultiplier = dashboardData.summary?.averagePerformance || 0.75
  const currentRevenue = Math.round(baseRevenue * (1 + (performanceMultiplier - 0.5)))
  
  return {
    current: currentRevenue,
    growth: 26, // +26% (would be calculated from historical data)
    target: 100000,
    currency: 'USD'
  }
}

function calculatePerformanceDistribution(dashboardData: any) {
  const agents = dashboardData.agents || []
  
  const distribution = agents.reduce((acc: any, agent: any) => {
    const score = agent.overallScore || 0
    if (score >= 0.85) acc.excellent++
    else if (score >= 0.7) acc.good++
    else if (score >= 0.5) acc.concerning++
    else acc.critical++
    return acc
  }, { excellent: 0, good: 0, concerning: 0, critical: 0 })

  const total = agents.length || 1
  
  return {
    distribution,
    percentages: {
      excellent: Math.round((distribution.excellent / total) * 100),
      good: Math.round((distribution.good / total) * 100),
      concerning: Math.round((distribution.concerning / total) * 100),
      critical: Math.round((distribution.critical / total) * 100)
    },
    total
  }
}

async function getExecutiveTrends() {
  // Get 7-day trend data for sparklines
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  
  const dailyStats = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    // In production, this would query historical metrics
    dailyStats.push({
      date: date.toISOString().split('T')[0],
      systemHealth: Math.round(90 + Math.random() * 10),
      activeAgents: Math.round(6 + Math.random() * 2),
      performance: Math.round(75 + Math.random() * 20)
    })
  }

  return dailyStats
}