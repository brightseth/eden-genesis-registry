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
  visibility?: string
  profile?: {
    statement?: string
    tags?: string[]
    links?: {
      specialty?: {
        medium: string
        description: string
        dailyGoal: string
      }
    }
  }
  counts?: {
    creations: number
    personas: number
    artifacts: number
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

  // Sort agents: active first, then by custom order to put open slots last
  const sortedAgents = [...agents].sort((a, b) => {
    // First, separate by status
    if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') return -1
    if (a.status !== 'ACTIVE' && b.status === 'ACTIVE') return 1
    
    // Within same status, put open slots at the end
    const aIsOpen = a.handle.startsWith('open-')
    const bIsOpen = b.handle.startsWith('open-')
    if (aIsOpen && !bIsOpen) return 1
    if (!aIsOpen && bIsOpen) return -1
    
    // For other agents, maintain creation order
    return 0
  })

  const activeAgents = sortedAgents.filter(a => a.status === 'ACTIVE' && a.visibility === 'PUBLIC')
  const openSlots = sortedAgents.filter(a => a.handle.startsWith('open-'))
  const otherAgents = sortedAgents.filter(a => a.status !== 'ACTIVE' && !a.handle.startsWith('open-'))

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
            {agents.length} AGENTS REGISTERED | {activeAgents.length} ACTIVE | {openSlots.length} OPEN SLOTS
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
                  <p className="text-sm opacity-80 line-clamp-2 mb-3">
                    {agent.profile.statement}
                  </p>
                )}
                {agent.profile?.links?.specialty && (
                  <div className="mb-3">
                    <p className="text-xs uppercase tracking-wide opacity-50 mb-1">MEDIUM</p>
                    <p className="text-sm font-medium">{agent.profile.links.specialty.medium}</p>
                    {agent.profile.links.specialty.dailyGoal && (
                      <p className="text-xs opacity-60 mt-1">{agent.profile.links.specialty.dailyGoal}</p>
                    )}
                  </div>
                )}
                {agent.counts && (
                  <div className="mb-3 flex gap-4 text-xs uppercase tracking-wide opacity-60">
                    <span>{agent.counts.creations} WORKS</span>
                    <span>{agent.counts.personas} PERSONAS</span>
                    <span>{agent.counts.artifacts} ARTIFACTS</span>
                  </div>
                )}
                {agent.profile?.tags && (
                  <div className="flex flex-wrap gap-2">
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

        {/* Open Slots */}
        {openSlots.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-8 border-b border-white/20 pb-4">
              OPEN SLOTS ({openSlots.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {openSlots.map((agent) => (
                <div
                  key={agent.id}
                  className="border border-white/30 p-6 opacity-50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl uppercase tracking-wide">{agent.displayName}</h3>
                    <span className="text-xs px-3 py-1 border border-white/30 uppercase tracking-wide">
                      AVAILABLE
                    </span>
                  </div>
                  <p className="text-sm uppercase tracking-wide opacity-60 mb-3">@{agent.handle}</p>
                  {agent.profile?.statement && (
                    <p className="text-sm opacity-60 line-clamp-2 mb-3">
                      {agent.profile.statement}
                    </p>
                  )}
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-wide font-medium opacity-80">
                      ACCEPTING TRAINER APPLICATIONS
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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