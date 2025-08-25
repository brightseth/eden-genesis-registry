'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Agent {
  id: string
  handle: string
  displayName: string
  role: string
  status: string
  cohort?: string
  profile?: {
    statement?: string
    tags?: string[]
  }
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAgents() {
      try {
        const res = await fetch('/api/v1/agents')
        const data = await res.json()
        setAgents(data.agents || [])
      } catch (err) {
        console.error('Failed to fetch agents:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAgents()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-xl uppercase tracking-wider animate-pulse">LOADING REGISTRY...</p>
        </div>
      </div>
    )
  }

  const activeAgents = agents.filter(a => a.status === 'ACTIVE')
  const otherAgents = agents.filter(a => a.status !== 'ACTIVE')

  return (
    <div className="min-h-screen bg-black text-white p-8" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-white hover:opacity-70 uppercase tracking-wider text-sm mb-8 inline-block">
            ← BACK TO REGISTRY
          </Link>
          <h1 className="text-5xl font-bold uppercase tracking-wider mb-6">GENESIS COHORT AGENTS</h1>
          <p className="text-lg uppercase tracking-wide opacity-80">
            {agents.length} AGENTS REGISTERED | {activeAgents.length} ACTIVE
          </p>
        </div>

        {/* Active Agents */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold uppercase tracking-wider mb-8 border-b border-white/20 pb-4">
            ACTIVE AGENTS ({activeAgents.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeAgents.map((agent) => (
              <Link
                key={agent.id}
                href={`/agents/${agent.handle}`}
                className="border border-white p-6 hover:bg-white hover:text-black transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold uppercase tracking-wide">{agent.displayName}</h3>
                  <span className="text-xs px-3 py-1 border border-current uppercase tracking-wide">
                    {agent.role?.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm uppercase tracking-wide opacity-60 mb-3">@{agent.handle}</p>
                {agent.profile?.statement && (
                  <p className="text-sm opacity-80 line-clamp-2">
                    {agent.profile.statement}
                  </p>
                )}
                {agent.profile?.tags && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {agent.profile.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 border border-current/30 uppercase tracking-wide">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Other Status Agents */}
        {otherAgents.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-8 border-b border-white/20 pb-4">
              OTHER AGENTS ({otherAgents.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherAgents.map((agent) => (
                <Link
                  key={agent.id}
                  href={`/agents/${agent.handle}`}
                  className="border border-white/50 p-6 hover:bg-white/10 transition-colors opacity-75"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl uppercase tracking-wide">{agent.displayName}</h3>
                    <span className="text-xs px-3 py-1 border border-white/50 uppercase tracking-wide">
                      {agent.status}
                    </span>
                  </div>
                  <p className="text-sm uppercase tracking-wide opacity-60">@{agent.handle}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-12 border-t border-white/20 text-center">
          <p className="text-sm uppercase tracking-wider opacity-60">EDEN GENESIS REGISTRY | SOVEREIGN SYSTEM OF RECORD</p>
        </div>
      </div>
    </div>
  )
}