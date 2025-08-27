import { NextRequest, NextResponse } from 'next/server'
import { AgentMonitoringSystem } from '@/lib/agent-monitoring'
import { withAuth } from '@/middleware/auth'
import { Role } from '@prisma/client'

// GET /api/v1/monitoring/agents
// Dashboard data for agent performance monitoring
export async function GET(request: NextRequest) {
  // Require ADMIN or CURATOR role for monitoring access
  const authResult = await withAuth(request, [Role.ADMIN, Role.CURATOR])
  if (authResult instanceof NextResponse) return authResult

  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') as 'daily' | 'weekly' | 'monthly' || 'weekly'
  const agentId = searchParams.get('agent')

  try {
    if (agentId) {
      // Get specific agent metrics
      const metrics = await AgentMonitoringSystem.generateMetrics(agentId, period)
      
      if (!metrics) {
        return NextResponse.json(
          { error: 'Agent not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        agent: metrics,
        timestamp: new Date().toISOString()
      })
    } else {
      // Get dashboard data for all agents
      const dashboard = await AgentMonitoringSystem.generateDashboardData(period)
      
      return NextResponse.json({
        dashboard,
        message: `Performance monitoring data for ${dashboard.totalAgents} agents`,
        generated: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('Agent monitoring error:', error)
    return NextResponse.json(
      { error: 'Failed to generate monitoring data' },
      { status: 500 }
    )
  }
}

// POST /api/v1/monitoring/agents/refresh
// Manually trigger metrics refresh for all agents
export async function POST(request: NextRequest) {
  const authResult = await withAuth(request, Role.ADMIN)
  if (authResult instanceof NextResponse) return authResult

  try {
    const body = await request.json()
    const period = body.period || 'weekly'
    
    // Generate fresh dashboard data (which stores metrics)
    const dashboard = await AgentMonitoringSystem.generateDashboardData(period)
    
    return NextResponse.json({
      success: true,
      message: `Refreshed monitoring data for ${dashboard.totalAgents} agents`,
      dashboard,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Monitoring refresh error:', error)
    return NextResponse.json(
      { error: 'Failed to refresh monitoring data' },
      { status: 500 }
    )
  }
}