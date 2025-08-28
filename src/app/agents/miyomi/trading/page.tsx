'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TradingDashboard } from '@/components/trading/trading-dashboard'

interface Agent {
  id: string
  handle: string
  displayName: string
  role: string
  status: string
}

export default function MiyomiTradingPage() {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMiyomiAgent() {
      try {
        const response = await fetch('/api/v1/agents?role=TRADER')
        const data = await response.json()
        
        const miyomi = data.agents?.find((a: Agent) => a.handle === 'miyomi')
        if (!miyomi) {
          setError('MIYOMI agent not found')
          return
        }
        
        setAgent(miyomi)
      } catch (error) {
        console.error('Failed to load MIYOMI agent:', error)
        setError('Failed to load MIYOMI agent')
      } finally {
        setLoading(false)
      }
    }

    fetchMiyomiAgent()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-xl uppercase tracking-wider animate-pulse">LOADING MIYOMI...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-black text-white p-8" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link 
              href="/agents"
              className="text-white hover:opacity-70 uppercase tracking-wider text-sm"
            >
              ← Back to Agents
            </Link>
          </div>
          
          <div className="text-red-500 text-xl uppercase tracking-wider">{error || 'MIYOMI not found'}</div>
          <div className="text-sm opacity-50 mt-4">
            Make sure MIYOMI agent exists with TRADER role
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      {/* Navigation */}
      <div className="border-b border-white/20 p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link 
              href="/agents"
              className="text-white hover:opacity-70 uppercase tracking-wider text-sm"
            >
              ← Agents
            </Link>
            <Link 
              href={`/agents/${agent.handle}`}
              className="text-white hover:opacity-70 uppercase tracking-wider text-sm"
            >
              {agent.displayName} Profile
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 border border-green-500 text-green-500 text-xs uppercase">
              {agent.status}
            </div>
            <div className="px-3 py-1 border border-blue-500 text-blue-500 text-xs uppercase">
              {agent.role}
            </div>
          </div>
        </div>
      </div>

      {/* Trading Dashboard */}
      <TradingDashboard 
        agentId={agent.id} 
        agentHandle={agent.handle.toUpperCase()} 
      />
    </div>
  )
}