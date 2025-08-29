/**
 * System Health Indicator Component
 * HELVETICA-styled service status for executive oversight
 */

'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SystemStatus } from '@/types/ceo-dashboard'

interface Props {
  status: SystemStatus
  loading?: boolean
}

export function SystemHealthIndicator({ status, loading = false }: Props) {
  if (loading) {
    return (
      <Card className="bg-black border-gray-800">
        <CardHeader>
          <CardTitle className="text-white font-bold uppercase tracking-wider font-['Helvetica_Neue']">
            SYSTEM STATUS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-800 rounded"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStatusColor = (serviceStatus: string) => {
    switch (serviceStatus) {
      case 'healthy': case 'connected':
        return 'text-green-400'
      case 'degraded': case 'slow':
        return 'text-yellow-400'
      case 'down': case 'disconnected':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusIcon = (serviceStatus: string) => {
    switch (serviceStatus) {
      case 'healthy': case 'connected':
        return '●'
      case 'degraded': case 'slow':
        return '◐'
      case 'down': case 'disconnected':
        return '○'
      default:
        return '?'
    }
  }

  const getOverallStatusColor = (overall: string) => {
    switch (overall) {
      case 'healthy':
        return 'border-green-400 bg-green-400/10'
      case 'degraded':
        return 'border-yellow-400 bg-yellow-400/10'
      case 'critical':
        return 'border-red-400 bg-red-400/10'
      default:
        return 'border-gray-400 bg-gray-400/10'
    }
  }

  const services = [
    { name: 'REGISTRY', status: status.registry },
    { name: 'ACADEMY', status: status.academy },
    { name: 'GATEWAY', status: status.gateway },
    { name: 'DATABASE', status: status.database }
  ]

  return (
    <Card className="bg-black border-gray-800">
      <CardHeader>
        <CardTitle className="text-white font-bold uppercase tracking-wider font-['Helvetica_Neue']">
          SYSTEM HEALTH
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Status */}
        <div className={`p-4 border ${getOverallStatusColor(status.overall)} text-center`}>
          <div className={`text-2xl font-bold uppercase tracking-wider mb-1 font-['Helvetica_Neue'] ${getStatusColor(status.overall)}`}>
            {status.overall}
          </div>
          <div className="text-gray-400 text-xs font-bold uppercase tracking-wider font-['Helvetica_Neue']">
            OVERALL STATUS
          </div>
        </div>

        {/* Service Status Grid */}
        <div className="space-y-3">
          {services.map((service) => (
            <div key={service.name} className="flex items-center justify-between py-2 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <span className={`text-lg ${getStatusColor(service.status)}`}>
                  {getStatusIcon(service.status)}
                </span>
                <span className="text-white font-bold uppercase tracking-wide text-sm font-['Helvetica_Neue']">
                  {service.name}
                </span>
              </div>
              <span className={`font-bold uppercase tracking-wider text-sm ${getStatusColor(service.status)} font-['Helvetica_Neue']`}>
                {service.status}
              </span>
            </div>
          ))}
        </div>

        {/* Service Details */}
        <div className="pt-4 border-t border-gray-800">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-white font-['Helvetica_Neue']">
                {services.filter(s => s.status === 'healthy' || s.status === 'connected').length}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-green-400 font-['Helvetica_Neue']">
                HEALTHY
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-white font-['Helvetica_Neue']">
                {services.filter(s => s.status === 'degraded' || s.status === 'slow').length + 
                 services.filter(s => s.status === 'down' || s.status === 'disconnected').length}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-red-400 font-['Helvetica_Neue']">
                ISSUES
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}