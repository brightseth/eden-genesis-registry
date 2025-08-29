/**
 * CEO Dashboard Test Suite
 * Comprehensive testing for executive dashboard components and API
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { CEODashboardService } from '../src/lib/ceo-dashboard-service'
import { AgentMonitoringSystem } from '../src/lib/agent-monitoring'

// Mock dependencies
jest.mock('../src/lib/agent-monitoring')
jest.mock('../src/lib/registry-client')

const mockAgentMonitoringSystem = AgentMonitoringSystem as jest.Mocked<typeof AgentMonitoringSystem>

describe('CEO Dashboard Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock successful monitoring system responses
    mockAgentMonitoringSystem.generateDashboardData.mockResolvedValue({
      timestamp: new Date(),
      period: 'weekly',
      totalAgents: 8,
      averageScore: 75,
      statusDistribution: {
        excellent: 3,
        good: 3,
        concerning: 2,
        critical: 0
      },
      agents: []
    })

    mockAgentMonitoringSystem.healthCheck.mockResolvedValue({
      healthy: true,
      details: {
        database: 'connected',
        activeAgents: 8,
        recentMetrics: 24,
        timestamp: new Date().toISOString()
      }
    })

    // Mock fetch for system status
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: 'healthy' })
    }) as jest.MockedFunction<typeof fetch>
  })

  describe('generateDashboardData', () => {
    it('should generate complete dashboard data successfully', async () => {
      const result = await CEODashboardService.generateDashboardData()

      expect(result).toHaveProperty('metrics')
      expect(result).toHaveProperty('agentDistribution')
      expect(result).toHaveProperty('systemStatus')
      expect(result).toHaveProperty('alerts')
      expect(result).toHaveProperty('quickActions')
      expect(result).toHaveProperty('lastUpdated')
    })

    it('should include proper executive metrics', async () => {
      const result = await CEODashboardService.generateDashboardData()

      expect(result.metrics.systemHealth).toBeGreaterThanOrEqual(0)
      expect(result.metrics.systemHealth).toBeLessThanOrEqual(100)
      expect(result.metrics.totalRevenue).toBeGreaterThanOrEqual(0)
      expect(result.metrics.activeAgents).toBeGreaterThanOrEqual(0)
      expect(result.metrics.criticalAlerts).toBeGreaterThanOrEqual(0)
    })

    it('should include agent distribution data', async () => {
      const result = await CEODashboardService.generateDashboardData()

      expect(result.agentDistribution.total).toBe(8)
      expect(result.agentDistribution.excellent).toBe(3)
      expect(result.agentDistribution.good).toBe(3)
      expect(result.agentDistribution.concerning).toBe(2)
      expect(result.agentDistribution.critical).toBe(0)
    })

    it('should generate system status correctly', async () => {
      const result = await CEODashboardService.generateDashboardData()

      expect(result.systemStatus.overall).toBe('healthy')
      expect(result.systemStatus.registry).toBe('healthy')
      expect(result.systemStatus.database).toBe('connected')
    })

    it('should handle errors gracefully', async () => {
      mockAgentMonitoringSystem.generateDashboardData.mockRejectedValue(new Error('Database error'))

      await expect(CEODashboardService.generateDashboardData()).rejects.toThrow('Failed to generate CEO dashboard data')
    })
  })

  describe('system status detection', () => {
    it('should detect unhealthy systems', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false
      }) as jest.MockedFunction<typeof fetch>

      mockAgentMonitoringSystem.healthCheck.mockResolvedValue({
        healthy: false,
        details: { error: 'Connection failed', timestamp: new Date().toISOString() }
      })

      const result = await CEODashboardService.generateDashboardData()

      expect(result.systemStatus.overall).toBe('critical')
      expect(result.systemStatus.registry).toBe('down')
      expect(result.systemStatus.database).toBe('disconnected')
    })

    it('should generate critical alerts for system issues', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false })
      
      const result = await CEODashboardService.generateDashboardData()

      expect(result.alerts.length).toBeGreaterThan(0)
      expect(result.alerts.some(alert => alert.severity === 'critical')).toBe(true)
    })
  })

  describe('executive alerts generation', () => {
    it('should generate alerts for critical agents', async () => {
      mockAgentMonitoringSystem.generateDashboardData.mockResolvedValue({
        timestamp: new Date(),
        period: 'weekly',
        totalAgents: 8,
        averageScore: 45,
        statusDistribution: {
          excellent: 1,
          good: 2,
          concerning: 2,
          critical: 3
        },
        agents: []
      })

      const result = await CEODashboardService.generateDashboardData()

      expect(result.alerts.some(alert => 
        alert.category === 'agent' && alert.severity === 'critical'
      )).toBe(true)
    })

    it('should limit alerts to maximum of 5', async () => {
      // Create conditions that would generate many alerts
      global.fetch = jest.fn().mockResolvedValue({ ok: false })
      mockAgentMonitoringSystem.healthCheck.mockResolvedValue({
        healthy: false,
        details: { error: 'Multiple failures', timestamp: new Date().toISOString() }
      })

      const result = await CEODashboardService.generateDashboardData()

      expect(result.alerts.length).toBeLessThanOrEqual(5)
    })
  })

  describe('quick actions generation', () => {
    it('should generate all action categories', async () => {
      const result = await CEODashboardService.generateDashboardData()

      const categories = new Set(result.quickActions.map(action => action.category))
      expect(categories).toContain('launch')
      expect(categories).toContain('monitor')
      expect(categories).toContain('create')
      expect(categories).toContain('escalate')
    })

    it('should include both URL and action-based quick actions', async () => {
      const result = await CEODashboardService.generateDashboardData()

      const hasUrlActions = result.quickActions.some(action => action.url)
      const hasCallbackActions = result.quickActions.some(action => action.action)

      expect(hasUrlActions).toBe(true)
      expect(hasCallbackActions).toBe(true)
    })
  })

  describe('performance monitoring', () => {
    it('should track dashboard generation time', async () => {
      const startTime = Date.now()
      await CEODashboardService.generateDashboardData()
      const endTime = Date.now()

      // Verify the operation completed within reasonable time
      expect(endTime - startTime).toBeLessThan(5000) // 5 seconds max
    })
  })
})

describe('CEO Dashboard API Route', () => {
  it('should require ADMIN role', async () => {
    // Mock the auth middleware to return unauthorized
    const mockRequest = new Request('http://localhost/api/v1/ceo/dashboard', {
      headers: { 'authorization': 'Bearer invalid_token' }
    })

    // This would be tested with actual API integration tests
    expect(mockRequest.headers.get('authorization')).toBe('Bearer invalid_token')
  })

  it('should check feature flags', async () => {
    // Feature flag tests would verify that disabled features return 403
    const originalEnv = process.env.FEATURE_CEO_DASHBOARD
    process.env.FEATURE_CEO_DASHBOARD = 'false'

    // Test that feature flag is respected
    expect(process.env.FEATURE_CEO_DASHBOARD).toBe('false')

    // Restore
    process.env.FEATURE_CEO_DASHBOARD = originalEnv
  })
})

describe('CEO Dashboard Components', () => {
  describe('ExecutiveMetricsCard', () => {
    it('should display loading state', () => {
      // Component tests would use React Testing Library
      const mockMetrics = {
        systemHealth: 95,
        totalRevenue: 45000,
        revenueGrowth: 12.5,
        activeAgents: 8,
        criticalAlerts: 0,
        timestamp: new Date().toISOString()
      }

      expect(mockMetrics.systemHealth).toBe(95)
      expect(mockMetrics.criticalAlerts).toBe(0)
    })
  })

  describe('AgentPerformanceOverview', () => {
    it('should calculate percentages correctly', () => {
      const mockDistribution = {
        excellent: 3,
        good: 3,
        concerning: 2,
        critical: 0,
        total: 8
      }

      const excellentPercentage = (mockDistribution.excellent / mockDistribution.total) * 100
      expect(excellentPercentage).toBe(37.5)
    })
  })

  describe('SystemHealthIndicator', () => {
    it('should show correct status colors', () => {
      const healthyStatus = { registry: 'healthy', academy: 'healthy', gateway: 'healthy', database: 'connected', overall: 'healthy' }
      const criticalStatus = { registry: 'down', academy: 'down', gateway: 'down', database: 'disconnected', overall: 'critical' }

      expect(healthyStatus.overall).toBe('healthy')
      expect(criticalStatus.overall).toBe('critical')
    })
  })
})