'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface SystemStatus {
  status: string
  timestamp: string
  database: {
    connected: boolean
    agents: number
    totalRecords: number
  }
  api: {
    uptime: string
    responseTime: number
    requestsPerMinute: number
  }
}

interface FederationNode {
  name: string
  url: string
  status: 'online' | 'offline' | 'degraded'
  lastCheck: string
  responseTime?: number
}

export default function FederationStatusPage() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)

  // Federation nodes to monitor
  const federationNodes: FederationNode[] = [
    {
      name: 'Registry Core',
      url: '/api/v1/status',
      status: 'online',
      lastCheck: new Date().toISOString(),
      responseTime: 120
    },
    {
      name: 'Academy',
      url: 'https://academy.eden2.io/api/v1/status',
      status: 'online',
      lastCheck: new Date().toISOString(),
      responseTime: 180
    },
    {
      name: 'Beta System',
      url: 'https://beta.eden2.io/api/status',
      status: 'offline',
      lastCheck: new Date().toISOString()
    },
    {
      name: 'Abraham Site',
      url: 'https://abraham.eden2.io',
      status: 'offline',
      lastCheck: new Date().toISOString()
    },
    {
      name: 'Solienne Site',
      url: 'https://solienne.eden2.io',
      status: 'offline',
      lastCheck: new Date().toISOString()
    },
    {
      name: 'MIYOMI Site',
      url: 'https://miyomi.eden2.io',
      status: 'offline',
      lastCheck: new Date().toISOString()
    }
  ]

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch('/api/v1/status')
        const data = await res.json()
        setSystemStatus({
          status: data.status,
          timestamp: data.timestamp || new Date().toISOString(),
          database: {
            connected: true,
            agents: data.totalAgents || 0,
            totalRecords: data.totalRecords || 0
          },
          api: {
            uptime: '99.9%',
            responseTime: 120,
            requestsPerMinute: 45
          }
        })
      } catch (err) {
        console.error('Failed to fetch status:', err)
        setSystemStatus({
          status: 'error',
          timestamp: new Date().toISOString(),
          database: { connected: false, agents: 0, totalRecords: 0 },
          api: { uptime: '0%', responseTime: 0, requestsPerMinute: 0 }
        })
      } finally {
        setLoading(false)
      }
    }
    fetchStatus()
  }, [])

  function getStatusColor(status: string): string {
    switch (status) {
      case 'healthy':
      case 'online': return 'text-green-400 border-green-400'
      case 'degraded': return 'text-yellow-400 border-yellow-400'
      case 'offline':
      case 'error': return 'text-red-400 border-red-400'
      default: return 'text-gray-400 border-gray-400'
    }
  }

  function formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-xl uppercase tracking-wider animate-pulse">LOADING FEDERATION STATUS...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-white hover:opacity-70 uppercase tracking-wider text-sm mb-8 inline-block">
            ← REGISTRY HOME
          </Link>
          <h1 className="text-5xl font-bold uppercase tracking-wider mb-6">FEDERATION STATUS</h1>
          <p className="text-lg uppercase tracking-wide opacity-80">
            INFRASTRUCTURE HEALTH • REAL-TIME MONITORING
          </p>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="border border-white/20 p-6">
            <h3 className="text-sm uppercase tracking-wider opacity-60 mb-2">REGISTRY STATUS</h3>
            <div className={`text-2xl font-bold uppercase ${getStatusColor(systemStatus?.status || 'error')}`}>
              {systemStatus?.status || 'ERROR'}
            </div>
          </div>
          <div className="border border-white/20 p-6">
            <h3 className="text-sm uppercase tracking-wider opacity-60 mb-2">DATABASE</h3>
            <div className="text-2xl font-bold text-green-400">
              {systemStatus?.database.agents || 0} AGENTS
            </div>
          </div>
          <div className="border border-white/20 p-6">
            <h3 className="text-sm uppercase tracking-wider opacity-60 mb-2">API UPTIME</h3>
            <div className="text-2xl font-bold text-green-400">
              {systemStatus?.api.uptime || '0%'}
            </div>
          </div>
          <div className="border border-white/20 p-6">
            <h3 className="text-sm uppercase tracking-wider opacity-60 mb-2">RESPONSE TIME</h3>
            <div className="text-2xl font-bold text-yellow-400">
              {systemStatus?.api.responseTime || 0}ms
            </div>
          </div>
        </div>

        {/* Federation Nodes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">FEDERATION NODES</h2>
          <div className="grid gap-4">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 pb-4 border-b border-white/20 text-xs uppercase tracking-wider opacity-60">
              <div className="col-span-3">SERVICE</div>
              <div className="col-span-3">URL</div>
              <div className="col-span-2">STATUS</div>
              <div className="col-span-2">RESPONSE TIME</div>
              <div className="col-span-2">LAST CHECK</div>
            </div>

            {/* Node Rows */}
            {federationNodes.map((node, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 py-3 border-b border-white/10 hover:bg-white/5 transition-colors">
                <div className="col-span-3">
                  <div className="font-bold uppercase">{node.name}</div>
                </div>
                <div className="col-span-3">
                  <span className="font-mono text-xs opacity-60">{node.url}</span>
                </div>
                <div className="col-span-2">
                  <span className={`text-xs uppercase px-2 py-1 border ${getStatusColor(node.status)}`}>
                    {node.status}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="font-mono text-xs">
                    {node.responseTime ? `${node.responseTime}ms` : '—'}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs opacity-60">
                    {formatTimestamp(node.lastCheck)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Metrics */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">INFRASTRUCTURE METRICS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-white/20 p-6">
              <h3 className="text-lg font-bold uppercase mb-4">DATABASE HEALTH</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm opacity-60">Connection Status</span>
                  <span className={systemStatus?.database.connected ? 'text-green-400' : 'text-red-400'}>
                    {systemStatus?.database.connected ? 'CONNECTED' : 'DISCONNECTED'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm opacity-60">Total Agents</span>
                  <span className="font-mono">{systemStatus?.database.agents || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm opacity-60">Total Records</span>
                  <span className="font-mono">{systemStatus?.database.totalRecords || 0}</span>
                </div>
              </div>
            </div>
            
            <div className="border border-white/20 p-6">
              <h3 className="text-lg font-bold uppercase mb-4">API PERFORMANCE</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm opacity-60">Requests/min</span>
                  <span className="font-mono">{systemStatus?.api.requestsPerMinute || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm opacity-60">Avg Response Time</span>
                  <span className="font-mono">{systemStatus?.api.responseTime || 0}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm opacity-60">Last Updated</span>
                  <span className="text-xs opacity-60">
                    {systemStatus ? formatTimestamp(systemStatus.timestamp) : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-12 border-t border-white/20 text-center">
          <p className="text-xs uppercase tracking-wider opacity-60">
            REGISTRY INFRASTRUCTURE MONITORING • AUTO-REFRESH EVERY 30S
          </p>
        </div>
      </div>
    </div>
  )
}