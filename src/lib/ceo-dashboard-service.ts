/**
 * CEO Dashboard Service
 * Executive-level data aggregation and business logic
 */

import { registryClient } from '@/lib/registry-client'
import { AgentMonitoringSystem } from '@/lib/agent-monitoring'
import { ceoDashboardLogger } from '@/lib/logger'
import { 
  CEODashboardData, 
  ExecutiveMetrics, 
  AgentDistribution, 
  SystemStatus, 
  ExecutiveAlert,
  QuickAction
} from '@/types/ceo-dashboard'

export class CEODashboardService {
  /**
   * Generate complete CEO dashboard data
   */
  static async generateDashboardData(): Promise<CEODashboardData> {
    const startTime = Date.now()
    
    try {
      ceoDashboardLogger.info('Generating CEO dashboard data')
      
      const [
        systemStatus,
        agentMetrics,
        executiveMetrics
      ] = await Promise.all([
        this.getSystemStatus(),
        this.getAgentDistribution(),
        this.getExecutiveMetrics()
      ])

      const alerts = await this.generateExecutiveAlerts(systemStatus, agentMetrics)
      const quickActions = this.generateQuickActions()

      const dashboardData: CEODashboardData = {
        metrics: executiveMetrics,
        agentDistribution: agentMetrics,
        systemStatus,
        alerts,
        quickActions,
        lastUpdated: new Date().toISOString()
      }

      const processingTime = Date.now() - startTime
      ceoDashboardLogger.performanceMetrics({
        dashboardGenerationTime: processingTime,
        totalAgents: agentMetrics.total,
        totalAlerts: alerts.length,
        systemHealth: executiveMetrics.systemHealth
      })

      ceoDashboardLogger.info('CEO dashboard data generated successfully', {
        processingTimeMs: processingTime,
        agentCount: agentMetrics.total,
        alertCount: alerts.length
      })

      return dashboardData
    } catch (error) {
      ceoDashboardLogger.dashboardError(error as Error, {
        operation: 'generateDashboardData',
        processingTimeMs: Date.now() - startTime
      })
      throw new Error('Failed to generate CEO dashboard data')
    }
  }

  /**
   * Get system-wide health status
   */
  private static async getSystemStatus(): Promise<SystemStatus> {
    try {
      // Check Registry status
      const response = await fetch('/api/v1/status')
      const registryHealth = response.ok
      
      // Check monitoring system health  
      const monitoringHealth = await AgentMonitoringSystem.healthCheck()

      return {
        registry: registryHealth ? 'healthy' : 'down',
        academy: 'healthy', // Assume healthy for now
        gateway: 'healthy', // Assume healthy for now  
        database: monitoringHealth.healthy ? 'connected' : 'disconnected',
        overall: registryHealth && monitoringHealth.healthy ? 'healthy' : 'critical'
      }
    } catch (error) {
      return {
        registry: 'down',
        academy: 'down',
        gateway: 'down', 
        database: 'disconnected',
        overall: 'critical'
      }
    }
  }

  /**
   * Get agent performance distribution for executive view
   */
  private static async getAgentDistribution(): Promise<AgentDistribution> {
    try {
      const dashboard = await AgentMonitoringSystem.generateDashboardData('weekly')
      
      return {
        excellent: dashboard.statusDistribution.excellent,
        good: dashboard.statusDistribution.good,
        concerning: dashboard.statusDistribution.concerning,
        critical: dashboard.statusDistribution.critical,
        total: dashboard.totalAgents
      }
    } catch (error) {
      console.error('Failed to get agent distribution:', error)
      return {
        excellent: 0,
        good: 0,
        concerning: 0,
        critical: 0,
        total: 0
      }
    }
  }

  /**
   * Calculate executive-level metrics
   */
  private static async getExecutiveMetrics(): Promise<ExecutiveMetrics> {
    try {
      const [statusResponse, agentDashboard] = await Promise.all([
        fetch('/api/v1/status'),
        AgentMonitoringSystem.generateDashboardData('weekly')
      ])

      let systemHealth = 100
      if (!statusResponse.ok) systemHealth -= 50
      if (agentDashboard.averageScore < 70) systemHealth -= 30
      if (agentDashboard.statusDistribution.critical > 0) systemHealth -= 20

      // Mock revenue data - in production this would come from billing/analytics
      const mockRevenue = {
        total: 45000,
        growth: 12.5
      }

      return {
        systemHealth: Math.max(0, systemHealth),
        totalRevenue: mockRevenue.total,
        revenueGrowth: mockRevenue.growth,
        activeAgents: agentDashboard.statusDistribution.excellent + agentDashboard.statusDistribution.good,
        criticalAlerts: agentDashboard.statusDistribution.critical,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Failed to calculate executive metrics:', error)
      return {
        systemHealth: 0,
        totalRevenue: 0,
        revenueGrowth: 0,
        activeAgents: 0,
        criticalAlerts: 999,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Generate executive-level alerts based on system and agent data
   */
  private static async generateExecutiveAlerts(
    systemStatus: SystemStatus, 
    agentDistribution: AgentDistribution
  ): Promise<ExecutiveAlert[]> {
    const alerts: ExecutiveAlert[] = []

    // System alerts
    if (systemStatus.overall === 'critical') {
      alerts.push({
        id: 'system-critical',
        severity: 'critical',
        category: 'performance',
        title: 'SYSTEM CRITICAL',
        description: 'Multiple services are experiencing issues. Immediate attention required.',
        actionRequired: true,
        timestamp: new Date().toISOString()
      })
    }

    // Agent performance alerts
    if (agentDistribution.critical > 0) {
      alerts.push({
        id: 'agents-critical',
        severity: 'critical',
        category: 'agent',
        title: 'AGENT PERFORMANCE CRITICAL',
        description: `${agentDistribution.critical} agents require immediate intervention.`,
        actionRequired: true,
        timestamp: new Date().toISOString()
      })
    }

    // Revenue alerts (mock data)
    const revenueGrowth = 12.5 // Would come from real analytics
    if (revenueGrowth < 0) {
      alerts.push({
        id: 'revenue-decline',
        severity: 'warning',
        category: 'revenue',
        title: 'REVENUE DECLINE',
        description: `Revenue growth is negative at ${revenueGrowth.toFixed(1)}%. Review agent monetization strategies.`,
        actionRequired: true,
        timestamp: new Date().toISOString()
      })
    }

    // Database performance alert
    if (systemStatus.database !== 'connected') {
      alerts.push({
        id: 'database-issues',
        severity: 'critical',
        category: 'performance',
        title: 'DATABASE CONNECTIVITY',
        description: 'Database connection issues detected. System reliability at risk.',
        actionRequired: true,
        timestamp: new Date().toISOString()
      })
    }

    return alerts.slice(0, 5) // Limit to 5 most critical alerts
  }

  /**
   * Generate executive quick actions
   */
  private static generateQuickActions(): QuickAction[] {
    return [
      // Launch actions
      {
        id: 'launch-control',
        category: 'launch',
        title: 'LAUNCH CONTROL',
        description: 'Staged rollout management',
        url: '/admin/launch'
      },
      {
        id: 'deploy-feature',
        category: 'launch',
        title: 'DEPLOY FEATURE',
        description: 'Feature flag controls',
        action: () => console.log('Deploy feature action')
      },

      // Monitor actions
      {
        id: 'system-monitor',
        category: 'monitor',
        title: 'SYSTEM MONITOR',
        description: 'Real-time metrics',
        url: '/api/v1/monitoring/agents'
      },
      {
        id: 'performance-review',
        category: 'monitor', 
        title: 'PERFORMANCE REVIEW',
        description: 'Agent analytics',
        action: () => console.log('Performance review action')
      },

      // Create actions
      {
        id: 'create-agent',
        category: 'create',
        title: 'CREATE AGENT',
        description: 'New agent onboarding',
        url: '/admin'
      },
      {
        id: 'create-cohort',
        category: 'create',
        title: 'CREATE COHORT',
        description: 'Cohort management',
        action: () => console.log('Create cohort action')
      },

      // Escalate actions
      {
        id: 'emergency-stop',
        category: 'escalate',
        title: 'EMERGENCY STOP',
        description: 'System-wide halt',
        action: () => confirm('Are you sure you want to initiate emergency stop?')
      },
      {
        id: 'incident-response',
        category: 'escalate',
        title: 'INCIDENT RESPONSE',
        description: 'Crisis management',
        action: () => console.log('Incident response action')
      }
    ]
  }

  /**
   * Refresh dashboard data
   */
  static async refreshDashboard(): Promise<CEODashboardData> {
    // Force refresh of monitoring data
    try {
      await fetch('/api/v1/monitoring/agents/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period: 'weekly' })
      })
    } catch (error) {
      console.warn('Failed to refresh monitoring data:', error)
    }

    return this.generateDashboardData()
  }

  /**
   * Get historical trend data for executive metrics
   */
  static async getHistoricalTrends(days: number = 30): Promise<{
    dates: string[]
    systemHealth: number[]
    activeAgents: number[]
    revenue: number[]
  }> {
    // Mock historical data - in production this would query time-series data
    const dates = Array.from({ length: days }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (days - 1 - i))
      return date.toISOString().split('T')[0]
    })

    return {
      dates,
      systemHealth: dates.map(() => Math.floor(Math.random() * 20) + 80),
      activeAgents: dates.map(() => Math.floor(Math.random() * 3) + 6),
      revenue: dates.map(() => Math.floor(Math.random() * 5000) + 40000)
    }
  }
}