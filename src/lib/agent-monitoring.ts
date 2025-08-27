// Performance monitoring system for launched agents
// Tracks demand, retention, and efficiency metrics for ongoing agent health

export interface AgentPerformanceMetrics {
  agentId: string
  agentNumber: number
  handle: string
  period: 'daily' | 'weekly' | 'monthly'
  timestamp: Date
  metrics: {
    demand: {
      profileViews: number
      creationViews: number
      socialEngagement: number
      applicationMentions: number
      score: number // 0-100
    }
    retention: {
      creationsCount: number
      lastActivityDays: number
      socialPresence: boolean
      userInteractions: number
      score: number // 0-100
    }
    efficiency: {
      creationRate: number // per week
      publishedRatio: number // published/total
      responseTime: number // avg hours to respond
      qualityScore: number // curator ratings
      score: number // 0-100
    }
  }
  overallScore: number // 0-100
  status: 'excellent' | 'good' | 'concerning' | 'critical'
  alerts: string[]
  recommendations: string[]
}

export class AgentMonitoringSystem {
  /**
   * Generate comprehensive performance metrics for an agent
   */
  static async generateMetrics(
    agentId: string, 
    period: 'daily' | 'weekly' | 'monthly' = 'weekly'
  ): Promise<AgentPerformanceMetrics | null> {
    const { prisma } = await import('@/lib/db')
    
    // Get agent with all related data
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      include: {
        profile: true,
        creations: {
          orderBy: { createdAt: 'desc' },
          take: 100 // Limit for performance
        },
        socialAccounts: true,
        personas: true
      }
    })

    if (!agent) return null

    const periodDays = period === 'daily' ? 1 : period === 'weekly' ? 7 : 30
    const periodStart = new Date()
    periodStart.setDate(periodStart.getDate() - periodDays)

    // Calculate demand metrics
    const demandMetrics = await this.calculateDemandMetrics(agent, periodStart, periodDays)
    
    // Calculate retention metrics
    const retentionMetrics = await this.calculateRetentionMetrics(agent, periodStart, periodDays)
    
    // Calculate efficiency metrics
    const efficiencyMetrics = await this.calculateEfficiencyMetrics(agent, periodStart, periodDays)

    // Calculate overall score
    const overallScore = (demandMetrics.score + retentionMetrics.score + efficiencyMetrics.score) / 3

    // Determine status
    let status: AgentPerformanceMetrics['status'] = 'excellent'
    if (overallScore < 70) status = 'good'
    if (overallScore < 50) status = 'concerning'
    if (overallScore < 30) status = 'critical'

    // Generate alerts and recommendations
    const { alerts, recommendations } = this.generateAlertsAndRecommendations(
      demandMetrics, retentionMetrics, efficiencyMetrics, overallScore
    )

    return {
      agentId: agent.id,
      agentNumber: agent.agentNumber,
      handle: agent.handle,
      period,
      timestamp: new Date(),
      metrics: {
        demand: demandMetrics,
        retention: retentionMetrics,
        efficiency: efficiencyMetrics
      },
      overallScore,
      status,
      alerts,
      recommendations
    }
  }

  /**
   * Calculate demand metrics - how much people want to see this agent
   */
  private static async calculateDemandMetrics(agent: any, periodStart: Date, periodDays: number) {
    // Note: In a real implementation, these would come from analytics systems
    // For now, we use proxy metrics from available data
    
    let score = 0
    const metrics = {
      profileViews: 0, // Would come from analytics
      creationViews: 0, // Would come from analytics
      socialEngagement: 0, // Would come from social platforms
      applicationMentions: 0 // Would come from application analysis
    }

    // Profile completeness as demand proxy (40 points)
    if (agent.profile?.statement) score += 20
    if (agent.profile?.manifesto) score += 10
    if (agent.profile?.tags?.length > 0) score += 10

    // Creation portfolio strength (40 points)
    const recentCreations = agent.creations?.filter((c: any) => 
      new Date(c.createdAt) > periodStart
    ) || []
    score += Math.min(recentCreations.length * 5, 40)

    // Social presence (20 points)
    const socialCount = agent.socialAccounts?.length || 0
    score += Math.min(socialCount * 10, 20)

    return {
      ...metrics,
      score: Math.min(score, 100)
    }
  }

  /**
   * Calculate retention metrics - how consistently the agent performs
   */
  private static async calculateRetentionMetrics(agent: any, periodStart: Date, periodDays: number) {
    let score = 0
    const recentCreations = agent.creations?.filter((c: any) => 
      new Date(c.createdAt) > periodStart
    ) || []

    const lastCreation = agent.creations?.[0]
    const lastActivityDays = lastCreation ? 
      Math.floor((Date.now() - new Date(lastCreation.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 999

    const metrics = {
      creationsCount: recentCreations.length,
      lastActivityDays,
      socialPresence: (agent.socialAccounts?.length || 0) > 0,
      userInteractions: 0 // Would come from interaction tracking
    }

    // Recent creation activity (50 points)
    score += Math.min(recentCreations.length * 10, 50)

    // Recency of last activity (30 points)
    if (lastActivityDays <= 1) score += 30
    else if (lastActivityDays <= 3) score += 20
    else if (lastActivityDays <= 7) score += 10
    else if (lastActivityDays <= 14) score += 5

    // Social presence maintenance (20 points)
    if (metrics.socialPresence) score += 20

    return {
      ...metrics,
      score: Math.min(score, 100)
    }
  }

  /**
   * Calculate efficiency metrics - how well the agent performs
   */
  private static async calculateEfficiencyMetrics(agent: any, periodStart: Date, periodDays: number) {
    const recentCreations = agent.creations?.filter((c: any) => 
      new Date(c.createdAt) > periodStart
    ) || []
    
    const publishedCreations = recentCreations.filter((c: any) => c.status === 'PUBLISHED')
    const creationRate = recentCreations.length / (periodDays / 7) // per week
    const publishedRatio = recentCreations.length > 0 ? publishedCreations.length / recentCreations.length : 0

    const metrics = {
      creationRate,
      publishedRatio,
      responseTime: 24, // Would come from communication tracking
      qualityScore: 75 // Would come from curator ratings
    }

    let score = 0

    // Creation rate (30 points)
    if (creationRate >= 2) score += 30
    else if (creationRate >= 1) score += 20
    else if (creationRate >= 0.5) score += 10

    // Publication ratio (30 points)
    score += publishedRatio * 30

    // Agent status (40 points)
    if (agent.status === 'ACTIVE') score += 40
    else if (agent.status === 'ONBOARDING') score += 20

    return {
      ...metrics,
      score: Math.min(score, 100)
    }
  }

  /**
   * Generate alerts and recommendations based on metrics
   */
  private static generateAlertsAndRecommendations(
    demand: any, retention: any, efficiency: any, overallScore: number
  ) {
    const alerts: string[] = []
    const recommendations: string[] = []

    // Critical alerts
    if (overallScore < 30) {
      alerts.push('CRITICAL: Overall performance below 30%')
    }
    if (retention.lastActivityDays > 14) {
      alerts.push('ALERT: No activity for over 2 weeks')
    }
    if (demand.score < 20) {
      alerts.push('WARNING: Very low demand indicators')
    }

    // Recommendations
    if (demand.score < 50) {
      recommendations.push('Enhance profile with manifesto and tags')
      recommendations.push('Increase creation portfolio')
    }
    if (retention.score < 50) {
      recommendations.push('Create more consistent content')
      recommendations.push('Maintain active social presence')
    }
    if (efficiency.score < 50) {
      recommendations.push('Focus on publishing completed works')
      recommendations.push('Improve creation quality and completion rate')
    }

    return { alerts, recommendations }
  }

  /**
   * Store metrics in database for historical tracking
   */
  static async storeMetrics(metrics: AgentPerformanceMetrics): Promise<void> {
    const { prisma } = await import('@/lib/db')
    
    // Store in events table as structured audit log
    await prisma.event.create({
      data: {
        actorSystem: 'CRON',
        verb: 'monitor',
        entity: 'agent',
        entityId: metrics.agentId,
        delta: {
          type: 'performance-metrics',
          period: metrics.period,
          timestamp: metrics.timestamp.toISOString(),
          overallScore: metrics.overallScore,
          status: metrics.status,
          metrics: metrics.metrics,
          alerts: metrics.alerts,
          recommendations: metrics.recommendations
        }
      }
    })
  }

  /**
   * Generate monitoring dashboard data for all active agents
   */
  static async generateDashboardData(period: 'daily' | 'weekly' | 'monthly' = 'weekly') {
    const { prisma } = await import('@/lib/db')
    
    // Get all active agents
    const agents = await prisma.agent.findMany({
      where: {
        status: { in: ['ACTIVE', 'ONBOARDING'] }
      },
      select: { id: true, handle: true, agentNumber: true }
    })

    const results = []
    
    for (const agent of agents) {
      const metrics = await this.generateMetrics(agent.id, period)
      if (metrics) {
        results.push(metrics)
        // Store metrics for historical tracking
        await this.storeMetrics(metrics)
      }
    }

    // Sort by overall score (best first)
    results.sort((a, b) => b.overallScore - a.overallScore)

    return {
      timestamp: new Date(),
      period,
      totalAgents: results.length,
      averageScore: results.reduce((sum, r) => sum + r.overallScore, 0) / results.length,
      statusDistribution: {
        excellent: results.filter(r => r.status === 'excellent').length,
        good: results.filter(r => r.status === 'good').length,
        concerning: results.filter(r => r.status === 'concerning').length,
        critical: results.filter(r => r.status === 'critical').length
      },
      agents: results
    }
  }

  /**
   * Health check for monitoring system
   */
  static async healthCheck() {
    try {
      const { prisma } = await import('@/lib/db')
      
      // Check database connectivity
      await prisma.$queryRaw`SELECT 1`
      
      // Count active agents
      const activeAgents = await prisma.agent.count({
        where: { status: { in: ['ACTIVE', 'ONBOARDING'] } }
      })

      // Check recent monitoring events
      const recentMetrics = await prisma.event.count({
        where: {
          verb: 'monitor',
          entity: 'agent',
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      })

      return {
        healthy: true,
        details: {
          database: 'connected',
          activeAgents,
          recentMetrics,
          timestamp: new Date().toISOString()
        }
      }
    } catch (error) {
      return {
        healthy: false,
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      }
    }
  }
}