/**
 * CEO Dashboard Main Component
 * Executive-level system overview with HELVETICA brand standards
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExecutiveMetricsCard } from './executive-metrics'
import { AgentPerformanceOverview } from './agent-performance-overview'
import { SystemHealthIndicator } from './system-health-indicator'
import { QuickActionsPanel } from './quick-actions-panel'
import { ExecutiveAlertsPanel } from './executive-alerts'
import { TrendVisualization } from './trend-visualization'
import { CEODashboardData } from '@/types/ceo-dashboard'
import { ceoDashboardLogger } from '@/lib/logger'

export default function CEODashboard() {
  const [dashboardData, setDashboardData] = useState<CEODashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [refreshing, setRefreshing] = useState(false)

  const loadDashboard = async (forceRefresh = false) => {
    try {
      setRefreshing(forceRefresh)
      
      // Use API endpoint instead of direct service call for production
      const endpoint = forceRefresh ? '/api/v1/ceo/dashboard/refresh' : '/api/v1/ceo/dashboard'
      const method = forceRefresh ? 'POST' : 'GET'
      
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authentication token required')
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to load dashboard data')
      }

      const result = await response.json()
      setDashboardData(result.data)
      setLastRefresh(new Date())

      ceoDashboardLogger.info('CEO dashboard data loaded successfully', {
        forceRefresh,
        agentCount: result.data.agentDistribution.total,
        systemHealth: result.data.metrics.systemHealth
      })
      
    } catch (error) {
      ceoDashboardLogger.dashboardError(error as Error, {
        operation: 'loadDashboard',
        forceRefresh
      })
      
      // Set error state for user feedback
      setDashboardData(null)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadDashboard()

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      loadDashboard()
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    loadDashboard(true)
  }

  // Error state
  if (!loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-black text-white font-['Helvetica_Neue'] flex items-center justify-center">
        <Card className="bg-black border-red-400 max-w-md">
          <CardHeader>
            <CardTitle className="text-red-400 font-bold uppercase tracking-wider font-['Helvetica_Neue'] text-center">
              DASHBOARD ERROR
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-400 font-['Helvetica_Neue']">
              Failed to load CEO dashboard data. Check authentication and system status.
            </p>
            <Button
              onClick={() => loadDashboard()}
              className="bg-red-400 text-black hover:bg-red-300 font-bold uppercase tracking-wider font-['Helvetica_Neue']"
            >
              RETRY
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white font-['Helvetica_Neue']">
      {/* Header */}
      <div className="border-b border-gray-800 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-wider text-white font-['Helvetica_Neue']">
              CEO DASHBOARD
            </h1>
            <p className="text-gray-400 text-sm font-['Helvetica_Neue'] mt-1">
              Executive Overview • Eden Academy Registry
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400 font-['Helvetica_Neue']">
                LAST UPDATED
              </div>
              <div className="text-sm text-white font-['Helvetica_Neue']">
                {lastRefresh.toLocaleTimeString()}
              </div>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              className="bg-black border-gray-800 text-white hover:bg-white hover:text-black font-bold uppercase tracking-wider text-xs font-['Helvetica_Neue']"
            >
              {refreshing ? 'REFRESHING...' : 'REFRESH'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Executive Metrics Row */}
        <div className="mb-8">
          <ExecutiveMetricsCard 
            metrics={dashboardData?.metrics || {
              systemHealth: 0,
              totalRevenue: 0,
              revenueGrowth: 0,
              activeAgents: 0,
              criticalAlerts: 0,
              timestamp: new Date().toISOString()
            }}
            loading={loading}
          />
        </div>

        {/* Trend Visualization Row */}
        <div className="mb-8">
          <TrendVisualization days={7} height={60} />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Performance & Health */}
          <div className="space-y-8">
            <AgentPerformanceOverview 
              distribution={dashboardData?.agentDistribution || {
                excellent: 0,
                good: 0,
                concerning: 0,
                critical: 0,
                total: 0
              }}
              loading={loading}
            />
            
            <SystemHealthIndicator 
              status={dashboardData?.systemStatus || {
                registry: 'down',
                academy: 'down',
                gateway: 'down',
                database: 'disconnected',
                overall: 'critical'
              }}
              loading={loading}
            />
          </div>

          {/* Middle Column: Alerts */}
          <div>
            <ExecutiveAlertsPanel 
              alerts={dashboardData?.alerts || []}
              loading={loading}
            />
          </div>

          {/* Right Column: Quick Actions */}
          <div>
            <QuickActionsPanel 
              actions={dashboardData?.quickActions || []}
              loading={loading}
            />
          </div>
        </div>

        {/* Executive Summary Footer */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <Card className="bg-black border-gray-800">
            <CardHeader>
              <CardTitle className="text-white font-bold uppercase tracking-wider font-['Helvetica_Neue'] text-center">
                EXECUTIVE SUMMARY
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-white mb-2 font-['Helvetica_Neue']">
                    {dashboardData?.agentDistribution.total || 0}
                  </div>
                  <div className="text-sm font-bold uppercase tracking-wider text-gray-400 font-['Helvetica_Neue']">
                    TOTAL AGENTS
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400 mb-2 font-['Helvetica_Neue']">
                    {dashboardData ? 
                      Math.round(((dashboardData.agentDistribution.excellent + dashboardData.agentDistribution.good) / dashboardData.agentDistribution.total) * 100) : 0
                    }%
                  </div>
                  <div className="text-sm font-bold uppercase tracking-wider text-gray-400 font-['Helvetica_Neue']">
                    PERFORMING WELL
                  </div>
                </div>
                <div>
                  <div className={`text-2xl font-bold mb-2 font-['Helvetica_Neue'] ${
                    dashboardData?.systemStatus.overall === 'healthy' ? 'text-green-400' :
                    dashboardData?.systemStatus.overall === 'degraded' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {dashboardData?.systemStatus.overall.toUpperCase() || 'UNKNOWN'}
                  </div>
                  <div className="text-sm font-bold uppercase tracking-wider text-gray-400 font-['Helvetica_Neue']">
                    SYSTEM STATUS
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm font-bold uppercase tracking-wider font-['Helvetica_Neue']">
            EDEN ACADEMY • EXECUTIVE DASHBOARD • REAL-TIME MONITORING
          </p>
          <p className="text-gray-600 text-xs uppercase tracking-wider font-['Helvetica_Neue'] mt-2">
            AGENT PERFORMANCE • SYSTEM HEALTH • REVENUE ANALYTICS
          </p>
        </div>
      </div>
    </div>
  )
}