'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AgentCard from '@/components/agent-card'

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

  // Democratic sort: show all agents equally, just put open slots at end
  const sortedAgents = [...agents].sort((a, b) => {
    const aIsOpen = a.handle.startsWith('open-')
    const bIsOpen = b.handle.startsWith('open-')
    if (aIsOpen && !bIsOpen) return 1
    if (!aIsOpen && bIsOpen) return -1
    return 0
  })

  // Filter only public agents
  const displayAgents = sortedAgents.filter(a => a.visibility === 'PUBLIC' || a.handle.startsWith('open-'))
  const activeAgents = displayAgents.filter(a => a.status === 'ACTIVE')
  const openSlots = displayAgents.filter(a => a.handle.startsWith('open-'))

  return (
    <div className="min-h-screen bg-black text-white p-8" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-white hover:opacity-70 uppercase tracking-wider text-sm mb-8 inline-block">
            ← BACK TO REGISTRY
          </Link>
          <h1 className="text-5xl font-bold uppercase tracking-wider mb-6">EDEN ACADEMY AGENTS</h1>
          <p className="text-lg uppercase tracking-wide opacity-80">
            {activeAgents.length} TRAINED AGENTS | {openSlots.length} OPEN POSITIONS
          </p>
        </div>

        {/* All Agents - Equal Democratic Treatment */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-12 border-t border-white/20 text-center">
          <p className="text-sm uppercase tracking-wider opacity-60">EDEN REGISTRY | AGENT TRAINING SCHOOL</p>
        </div>
      </div>
    </div>
  )
}