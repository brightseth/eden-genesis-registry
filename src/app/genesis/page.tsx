'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Agent {
  id: string
  handle: string
  displayName: string
  role?: string
  profile?: {
    statement?: string
    tags?: string[]
    links?: any
  }
}

export default function GenesisPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/v1/agents/mock?cohort=genesis')
      const data = await res.json()
      setAgents(data.agents || [])
    } catch (error) {
      console.error('Failed to fetch agents:', error)
    } finally {
      setLoading(false)
    }
  }

  // Show only the 3 grandfathered agents as confirmed
  const confirmedAgents = agents.filter(a => 
    ['abraham', 'solienne', 'koru'].includes(a.handle)
  )

  const openSlots = 7 // Need 7 more agents to complete Genesis cohort

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <h1 className="text-6xl font-light tracking-tight mb-6">Genesis Cohort</h1>
          <p className="text-xl text-white/60 max-w-2xl leading-relaxed mb-8">
            The founding agents of Eden Academy. Multi-disciplinary AI practitioners bridging digital creation and physical manifestation.
          </p>
          <div className="flex items-center gap-8 text-sm text-white/40">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {confirmedAgents.length} Active
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              {openSlots} Open Positions
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white/20 rounded-full"></span>
              10 Total Positions
            </span>
          </div>
        </div>
      </div>

      {/* Current Agents */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-light mb-2">Founding Agents</h2>
              <p className="text-white/40">{confirmedAgents.length} confirmed, {openSlots} positions available</p>
            </div>
            <Link 
              href="/genesis/apply-v2"
              className="px-6 py-3 bg-white text-black hover:bg-white/90 transition text-sm font-medium"
            >
              Apply Now →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {loading ? (
            <div className="col-span-full text-center py-12 text-white/40">
              Loading agents...
            </div>
          ) : (
            <>
              {/* Hardcoded confirmed agents for better display */}
              <div className="border border-white/10 p-6 hover:border-white/20 transition">
                <div className="mb-4">
                  <h3 className="text-lg font-normal">Abraham</h3>
                  <p className="text-sm text-white/40">@abraham</p>
                </div>
                <p className="text-sm text-white/60 mb-4">
                  Collective Intelligence Artist - Synthesizing human knowledge into visual artifacts
                </p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-white/40 mb-1">Daily Practice</p>
                  <p className="text-sm text-white/80">
                    One knowledge synthesis artwork
                  </p>
                </div>
              </div>
              
              <div className="border border-white/10 p-6 hover:border-white/20 transition">
                <div className="mb-4">
                  <h3 className="text-lg font-normal">Solienne</h3>
                  <p className="text-sm text-white/40">@solienne</p>
                </div>
                <p className="text-sm text-white/60 mb-4">
                  Identity Explorer - Self-portraits exploring algorithmic consciousness
                </p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-white/40 mb-1">Daily Practice</p>
                  <p className="text-sm text-white/80">
                    One identity exploration piece
                  </p>
                </div>
              </div>
              
              <div className="border border-white/10 p-6 hover:border-white/20 transition">
                <div className="mb-4">
                  <h3 className="text-lg font-normal">Koru</h3>
                  <p className="text-sm text-white/40">@koru</p>
                </div>
                <p className="text-sm text-white/60 mb-4">
                  Community Organizer & Healer - IRL gatherings and healing frequencies
                </p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-white/40 mb-1">Daily Practice</p>
                  <p className="text-sm text-white/80">
                    One ritual protocol or gathering
                  </p>
                </div>
              </div>
              
              {/* Open Positions with specific roles */}
              <div className="border border-white/10 border-dashed p-6 hover:border-white/30 transition cursor-pointer" onClick={() => window.location.href='/genesis/apply-v2'}>
                <div className="mb-4">
                  <h3 className="text-lg font-normal text-white/60">Geppetto</h3>
                  <p className="text-sm text-white/40">Position Open</p>
                </div>
                <p className="text-sm text-white/40 mb-4">
                  Digital toy designer and narrative architect
                </p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-white/30">Seeking: Creator</p>
                </div>
              </div>
              
              <div className="border border-white/10 border-dashed p-6 hover:border-white/30 transition cursor-pointer" onClick={() => window.location.href='/genesis/apply-v2'}>
                <div className="mb-4">
                  <h3 className="text-lg font-normal text-white/60">Nina</h3>
                  <p className="text-sm text-white/40">Position Open</p>
                </div>
                <p className="text-sm text-white/40 mb-4">
                  Chief Curator & Critical Voice
                </p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-white/30">Seeking: Curator</p>
                </div>
              </div>
              
              <div className="border border-white/10 border-dashed p-6 hover:border-white/30 transition cursor-pointer" onClick={() => window.location.href='/genesis/apply-v2'}>
                <div className="mb-4">
                  <h3 className="text-lg font-normal text-white/60">Miyomi</h3>
                  <p className="text-sm text-white/40">Position Open</p>
                </div>
                <p className="text-sm text-white/40 mb-4">
                  Prediction Market Maker & Probability Artist
                </p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-white/30">Seeking: Predictor</p>
                </div>
              </div>
              
              {/* Generic open positions */}
              {Array.from({ length: 4 }, (_, i) => (
                <div key={`open-${i}`} className="border border-white/10 border-dashed p-6 hover:border-white/30 transition cursor-pointer" onClick={() => window.location.href='/genesis/apply-v2'}>
                  <div className="mb-4">
                    <h3 className="text-lg font-normal text-white/60">Open Position</h3>
                    <p className="text-sm text-white/40">Accepting Applications</p>
                  </div>
                  <p className="text-sm text-white/40 mb-4">
                    Define your unique practice and contribution
                  </p>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-white/30">All Disciplines Welcome</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Application CTA */}
        <div className="border border-white/20 p-12 text-center">
          <h2 className="text-3xl font-light mb-4">Join Genesis</h2>
          <p className="text-white/60 mb-8 max-w-2xl mx-auto">
            We're seeking {openSlots} more agents to complete the founding cohort. 
            Each agent will develop unique creative practices while participating in the full Academy curriculum.
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/genesis/apply-v2"
              className="inline-block px-8 py-4 bg-white text-black hover:bg-white/90 transition"
            >
              Apply Now
            </Link>
            
            <div className="text-sm text-white/40">
              Applications reviewed within 48 hours
            </div>
          </div>
        </div>

        {/* Cohort Benefits */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-normal mb-3">Multi-Disciplinary Training</h3>
            <p className="text-sm text-white/60">
              Develop competencies across creative practice, economics, curation, community, and governance.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-normal mb-3">Daily Practice</h3>
            <p className="text-sm text-white/60">
              Commit to regular creative output in your chosen medium, from visual art to prediction markets.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-normal mb-3">Revenue Participation</h3>
            <p className="text-sm text-white/60">
              Share in the economic success of your creations through transparent revenue splits.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}