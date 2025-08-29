'use client'

import { CEODashboardData } from '@/types/ceo-dashboard'

interface ExecutiveMetricsProps {
  data: CEODashboardData | null
  loading?: boolean
}

export default function ExecutiveMetrics({ data, loading }: ExecutiveMetricsProps) {
  if (loading || !data) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-black border border-gray-800 rounded-none p-6 animate-pulse">
            <div className="h-8 bg-gray-800 rounded-none mb-2"></div>
            <div className="h-4 bg-gray-700 rounded-none"></div>
          </div>
        ))}
      </div>
    )
  }

  const getHealthColor = (health: number) => {
    if (health >= 95) return 'text-green-400'
    if (health >= 85) return 'text-yellow-400'
    if (health >= 70) return 'text-orange-400'
    return 'text-red-400'
  }

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-400'
    if (growth === 0) return 'text-gray-400'
    return 'text-red-400'
  }

  const getAlertColor = (alerts: number) => {
    if (alerts === 0) return 'text-green-400'
    if (alerts <= 2) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* System Health */}
      <div className="bg-black border border-gray-800 rounded-none p-6 hover:bg-gray-950 transition-colors duration-200">
        <div className={`text-3xl font-bold font-['Helvetica_Neue'] mb-1 ${getHealthColor(data.systemHealth)}`}>
          {data.systemHealth}/100
        </div>
        <div className="text-sm font-['Helvetica_Neue'] font-bold uppercase tracking-wider text-gray-400">
          SYSTEM HEALTH
        </div>
        <div className="mt-2 h-1 bg-gray-800 rounded-none">
          <div 
            className={`h-1 rounded-none transition-all duration-300 ${
              data.systemHealth >= 95 ? 'bg-green-400' :
              data.systemHealth >= 85 ? 'bg-yellow-400' :
              data.systemHealth >= 70 ? 'bg-orange-400' : 'bg-red-400'
            }`}
            style={{ width: `${data.systemHealth}%` }}
          />
        </div>
      </div>

      {/* Revenue */}
      <div className="bg-black border border-gray-800 rounded-none p-6 hover:bg-gray-950 transition-colors duration-200">
        <div className="text-3xl font-bold font-['Helvetica_Neue'] text-white mb-1">
          ${(data.revenue.current / 1000).toFixed(1)}K
        </div>
        <div className="text-sm font-['Helvetica_Neue'] font-bold uppercase tracking-wider text-gray-400">
          MONTHLY REVENUE
        </div>
        <div className={`text-xs font-['Helvetica_Neue'] font-bold mt-1 ${getGrowthColor(data.revenue.growth)}`}>
          {data.revenue.growth > 0 ? '+' : ''}{data.revenue.growth}% GROWTH
        </div>
      </div>

      {/* Active Agents */}
      <div className="bg-black border border-gray-800 rounded-none p-6 hover:bg-gray-950 transition-colors duration-200">
        <div className="text-3xl font-bold font-['Helvetica_Neue'] text-white mb-1">
          {data.activeAgents}
        </div>
        <div className="text-sm font-['Helvetica_Neue'] font-bold uppercase tracking-wider text-gray-400">
          ACTIVE AGENTS
        </div>
        <div className="text-xs font-['Helvetica_Neue'] text-gray-500 mt-1">
          /{data.agentPerformance.total} TOTAL
        </div>
      </div>

      {/* Critical Alerts */}
      <div className="bg-black border border-gray-800 rounded-none p-6 hover:bg-gray-950 transition-colors duration-200">
        <div className={`text-3xl font-bold font-['Helvetica_Neue'] mb-1 ${getAlertColor(data.criticalAlerts)}`}>
          {data.criticalAlerts}
        </div>
        <div className="text-sm font-['Helvetica_Neue'] font-bold uppercase tracking-wider text-gray-400">
          CRITICAL ALERTS
        </div>
        {data.criticalAlerts === 0 && (
          <div className="text-xs font-['Helvetica_Neue'] text-green-400 mt-1">
            ALL SYSTEMS NOMINAL
          </div>
        )}
      </div>
    </div>
  )
}