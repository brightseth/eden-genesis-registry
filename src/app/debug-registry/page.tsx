'use client'

import { useEffect, useState } from 'react'
import { RegistryFallbackManager } from '@/lib/registry-fallback'

interface HealthResult {
  endpoint: string
  status: 'healthy' | 'unhealthy' | 'timeout'
  responseTime?: number
}

export default function DebugRegistryPage() {
  const [health, setHealth] = useState<HealthResult[]>([])
  const [abrahamData, setAbrahamData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function runDiagnostics() {
      console.log('Running Registry diagnostics...')
      
      // Check endpoint health
      const healthResults = await RegistryFallbackManager.checkEndpointHealth()
      setHealth(healthResults)
      
      // Try to fetch Abraham
      const abrahamResult = await RegistryFallbackManager.fetchAgent('abraham')
      setAbrahamData(abrahamResult)
      
      setLoading(false)
    }
    
    runDiagnostics()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold uppercase tracking-wider mb-8">REGISTRY DIAGNOSTICS</h1>
          <p className="text-xl animate-pulse">Running diagnostics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-8">REGISTRY DIAGNOSTICS</h1>
        
        {/* Endpoint Health */}
        <div className="border border-white p-6 mb-8">
          <h2 className="text-xl font-bold uppercase tracking-wide mb-4">ENDPOINT HEALTH</h2>
          <div className="space-y-3">
            {health.map((result, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-lg">{result.endpoint}</span>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 border text-sm uppercase tracking-wide ${
                    result.status === 'healthy' ? 'border-green-500 text-green-500' :
                    result.status === 'timeout' ? 'border-yellow-500 text-yellow-500' :
                    'border-red-500 text-red-500'
                  }`}>
                    {result.status}
                  </span>
                  {result.responseTime && (
                    <span className="text-sm opacity-60">{result.responseTime}ms</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Abraham Data */}
        <div className="border border-white p-6">
          <h2 className="text-xl font-bold uppercase tracking-wide mb-4">ABRAHAM FETCH RESULT</h2>
          {abrahamData ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm uppercase tracking-wide opacity-60">DATA SOURCE</p>
                  <p className="text-lg">{abrahamData.source}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-wide opacity-60">SUCCESS</p>
                  <p className="text-lg">{abrahamData.data ? 'YES' : 'NO'}</p>
                </div>
              </div>
              
              {abrahamData.error && (
                <div className="border border-red-500 bg-red-500/10 p-4">
                  <p className="text-sm uppercase tracking-wide text-red-500 mb-2">ERROR</p>
                  <p className="text-red-400">{abrahamData.error}</p>
                </div>
              )}
              
              {abrahamData.data && (
                <div className="border border-green-500 bg-green-500/10 p-4">
                  <p className="text-sm uppercase tracking-wide text-green-500 mb-3">AGENT DATA LOADED</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="opacity-60 uppercase">HANDLE</p>
                      <p>{abrahamData.data.handle}</p>
                    </div>
                    <div>
                      <p className="opacity-60 uppercase">DISPLAY NAME</p>
                      <p>{abrahamData.data.displayName}</p>
                    </div>
                    <div>
                      <p className="opacity-60 uppercase">STATUS</p>
                      <p>{abrahamData.data.status}</p>
                    </div>
                    <div>
                      <p className="opacity-60 uppercase">COHORT</p>
                      <p>{abrahamData.data.cohort || 'N/A'}</p>
                    </div>
                  </div>
                  
                  {abrahamData.data.profile?.statement && (
                    <div className="mt-4 pt-4 border-t border-green-500/30">
                      <p className="opacity-60 uppercase text-xs mb-2">STATEMENT</p>
                      <p className="text-sm">{abrahamData.data.profile.statement}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-lg opacity-60">No data available</p>
          )}
        </div>
        
        {/* Raw Data */}
        <div className="border border-white/20 p-6 mt-8">
          <h2 className="text-xl font-bold uppercase tracking-wide mb-4">RAW JSON</h2>
          <pre className="text-xs bg-white/5 p-4 overflow-auto max-h-96">
            {JSON.stringify({ health, abrahamData }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}