'use client'

import { AlertsData, ExecutiveAlert } from '@/types/ceo-dashboard'

interface ExecutiveAlertsProps {
  alerts: AlertsData | null
  loading?: boolean
}

export default function ExecutiveAlerts({ alerts, loading }: ExecutiveAlertsProps) {
  if (loading || !alerts) {
    return (
      <div className="bg-black border border-gray-800 rounded-none p-6">
        <div className="h-6 bg-gray-800 rounded-none mb-4 animate-pulse"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-gray-800 rounded-none animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  const allAlerts = [
    ...alerts.critical.map(alert => ({ ...alert, severity: 'critical' as const })),
    ...alerts.warning.map(alert => ({ ...alert, severity: 'warning' as const })),
    ...alerts.info.map(alert => ({ ...alert, severity: 'info' as const }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const getSeverityColor = (severity: ExecutiveAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'border-red-400 text-red-400'
      case 'warning': return 'border-yellow-400 text-yellow-400'
      case 'info': return 'border-blue-400 text-blue-400'
      default: return 'border-gray-400 text-gray-400'
    }
  }

  const getSeverityIcon = (severity: ExecutiveAlert['severity']) => {
    switch (severity) {
      case 'critical': return '●'
      case 'warning': return '▲'
      case 'info': return '◆'
      default: return '○'
    }
  }

  const getCategoryLabel = (category: ExecutiveAlert['category']) => {
    switch (category) {
      case 'system': return 'SYS'
      case 'performance': return 'PERF'
      case 'revenue': return 'REV'
      case 'agent': return 'AGENT'
      default: return 'OTHER'
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(timestamp).getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return new Date(timestamp).toLocaleDateString()
  }

  return (
    <div className="bg-black border border-gray-800 rounded-none p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-['Helvetica_Neue'] font-bold uppercase tracking-wider text-white">
          EXECUTIVE ALERTS
        </h2>
        <div className="flex space-x-4 text-xs font-['Helvetica_Neue'] font-bold uppercase tracking-wider">
          {alerts.critical.length > 0 && (
            <span className="text-red-400">
              {alerts.critical.length} CRITICAL
            </span>
          )}
          {alerts.warning.length > 0 && (
            <span className="text-yellow-400">
              {alerts.warning.length} WARNING
            </span>
          )}
        </div>
      </div>

      {allAlerts.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-green-400 text-lg font-['Helvetica_Neue'] font-bold mb-2">
            ✓ ALL SYSTEMS NOMINAL
          </div>
          <div className="text-xs font-['Helvetica_Neue'] text-gray-500">
            NO ALERTS REQUIRING EXECUTIVE ATTENTION
          </div>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {allAlerts.slice(0, 10).map((alert) => (
            <div
              key={alert.id}
              className={`border-l-2 pl-4 py-2 hover:bg-gray-950 transition-colors duration-150 ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-bold ${getSeverityColor(alert.severity).split(' ')[1]}`}>
                    {getSeverityIcon(alert.severity)}
                  </span>
                  <span className="text-xs font-['Helvetica_Neue'] font-bold uppercase tracking-wider bg-gray-800 px-2 py-1 text-gray-400">
                    {getCategoryLabel(alert.category)}
                  </span>
                </div>
                <span className="text-xs font-['Helvetica_Neue'] text-gray-500">
                  {formatTimestamp(alert.timestamp)}
                </span>
              </div>
              <div className="text-sm font-['Helvetica_Neue'] text-white">
                {alert.message}
              </div>
            </div>
          ))}
          
          {allAlerts.length > 10 && (
            <div className="text-center pt-4 border-t border-gray-800">
              <span className="text-xs font-['Helvetica_Neue'] text-gray-500">
                +{allAlerts.length - 10} MORE ALERTS
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}