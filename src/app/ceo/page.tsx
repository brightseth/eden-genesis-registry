'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ExecutiveMetrics from '@/components/ceo/executive-metrics'
import AgentPerformanceOverview from '@/components/ceo/agent-performance-overview'
import QuickActionsPanel from '@/components/ceo/quick-actions-panel'
import ExecutiveAlerts from '@/components/ceo/executive-alerts'
import { CEODashboardData, SystemStatus, AlertsData } from '@/types/ceo-dashboard'

interface APIResponse {
  success: boolean
  data: CEODashboardData
  systemStatus: SystemStatus
  alerts: AlertsData
  timestamp: string
}

export default function CEODashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<CEODashboardData | null>(null)
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [alerts, setAlerts] = useState<AlertsData | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboard()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadDashboard, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const res = await fetch('/api/v1/ceo/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login')
          return
        }
        throw new Error(`Dashboard API error: ${res.status}`)
      }

      const response: APIResponse = await res.json()
      
      setData(response.data)
      setSystemStatus(response.systemStatus)
      setAlerts(response.alerts)
      setLastUpdated(response.timestamp)
      setError(null)
      setLoading(false)
    } catch (err) {
      console.error('Failed to load CEO dashboard:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
      setLoading(false)
    }
  }

  const handleQuickAction = (actionId: string) => {
    console.log(`CEO Dashboard: Action triggered - ${actionId}`)
    // Could add analytics tracking here
  }

  const formatLastUpdated = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      })
    } catch {
      return 'Unknown'
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-black border border-red-400 rounded-none p-8 max-w-md">
          <h1 className="text-xl font-['Helvetica_Neue'] font-bold uppercase tracking-wider text-red-400 mb-4">
            DASHBOARD ERROR
          </h1>
          <p className="text-white font-['Helvetica_Neue'] mb-6">
            {error}
          </p>
          <button
            onClick={loadDashboard}
            className="w-full bg-black border border-red-400 text-red-400 py-2 px-4 
                     font-['Helvetica_Neue'] font-bold uppercase tracking-wider
                     hover:bg-red-400 hover:text-black transition-all duration-200"
          >
            RETRY
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-['Helvetica_Neue'] font-bold uppercase tracking-wider text-white">
                CEO DASHBOARD
              </h1>
              <div className="text-sm font-['Helvetica_Neue'] text-gray-400 mt-1">
                EDEN ACADEMY • EXECUTIVE COMMAND CENTER
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-['Helvetica_Neue'] font-bold uppercase tracking-wider text-gray-400">
                LAST UPDATE
              </div>
              <div className="text-sm font-['Helvetica_Neue'] text-white">
                {lastUpdated ? formatLastUpdated(lastUpdated) : '--:--:--'}
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                <span className="text-xs font-['Helvetica_Neue'] text-gray-500">
                  {loading ? 'UPDATING' : 'LIVE'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Executive Metrics */}
        <ExecutiveMetrics data={data} loading={loading} />

        {/* Agent Performance Overview */}
        <AgentPerformanceOverview 
          performance={data?.agentPerformance || null} 
          loading={loading} 
        />

        {/* Quick Actions and System Status */}
        <QuickActionsPanel onAction={handleQuickAction} />

        {/* Executive Alerts */}
        <ExecutiveAlerts alerts={alerts} loading={loading} />
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 bg-black mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center text-xs font-['Helvetica_Neue'] text-gray-500">
            <div>
              EDEN ACADEMY REGISTRY • VERSION 2.0 • STATUS: OPERATIONAL
            </div>
            <div className="flex items-center space-x-4">
              <span>AUTO-REFRESH: 30s</span>
              <span>•</span>
              <span>SECURITY: ACTIVE</span>
              <span>•</span>
              <span>MONITORING: ENABLED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}