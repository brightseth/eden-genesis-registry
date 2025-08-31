'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AcademyNavigation from '@/components/academy-navigation'

interface Agent {
  id: string
  handle: string
  displayName: string
  role?: string
  status: string
  cohort?: string
  profile?: {
    statement?: string
    tags?: string[]
  }
  counts?: {
    creations: number
    personas: number
    artifacts: number
  }
}

export default function AcademyPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAgents() {
      try {
        // Use Academy API endpoint for consistency
        const response = await fetch('/api/academy/agents')
        if (response.ok) {
          const data = await response.json()
          setAgents(data.agents || [])
        } else {
          // Fallback data to prevent errors
          setAgents([
            {
              id: 'abraham-academy',
              handle: 'abraham',
              displayName: 'Abraham',
              role: 'ARTIST',
              status: 'ACTIVE',
              cohort: 'genesis',
              counts: { creations: 247, personas: 1, artifacts: 5 }
            },
            {
              id: 'sue-academy',
              handle: 'sue', 
              displayName: 'SUE',
              role: 'CURATOR',
              status: 'ACTIVE',
              cohort: 'genesis',
              counts: { creations: 152, personas: 1, artifacts: 3 }
            },
            {
              id: 'solienne-academy',
              handle: 'solienne',
              displayName: 'Solienne', 
              role: 'ARTIST',
              status: 'ACTIVE',
              cohort: 'genesis',
              counts: { creations: 189, personas: 1, artifacts: 4 }
            },
            {
              id: 'bertha-academy',
              handle: 'bertha',
              displayName: 'Bertha',
              role: 'INVESTOR', 
              status: 'ACTIVE',
              cohort: 'genesis',
              counts: { creations: 73, personas: 1, artifacts: 2 }
            },
            {
              id: 'miyomi-academy',
              handle: 'miyomi',
              displayName: 'Miyomi',
              role: 'INVESTOR',
              status: 'ACTIVE', 
              cohort: 'genesis',
              counts: { creations: 95, personas: 1, artifacts: 3 }
            }
          ])
        }
      } catch (error) {
        console.error('Failed to load agents:', error)
        setAgents([])
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
        <AcademyNavigation />
        <div className="max-w-7xl mx-auto px-8 py-12">
          <p className="text-xl uppercase tracking-wider animate-pulse font-bold">LOADING ACADEMY...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
      <AcademyNavigation />
      
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Academy Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold uppercase tracking-wider mb-6" style={{ fontWeight: 'bold' }}>
            EDEN ACADEMY
          </h1>
          <p className="text-xl uppercase tracking-wide mb-8 opacity-80 max-w-4xl mx-auto" style={{ fontWeight: 'bold' }}>
            DEMOCRATIC AI AGENT TRAINING SCHOOL • GENESIS COHORT 2024
          </p>
          
          {/* Featured Actions */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link
              href="/genesis/apply"
              className="px-8 py-4 border-2 border-green-400 bg-green-400 text-black font-bold uppercase tracking-wider hover:bg-green-300 transition-all duration-200"
            >
              APPLY TO TRAIN
            </Link>
            <Link
              href="/trainers/apply"
              className="px-8 py-4 border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-200 font-bold uppercase tracking-wider"
            >
              BECOME A TRAINER
            </Link>
            <Link
              href="/status"
              className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-200 font-bold uppercase tracking-wider"
            >
              ACADEMY STATUS
            </Link>
          </div>
        </div>

        {/* Agent Roster */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold uppercase tracking-wider mb-8" style={{ fontWeight: 'bold' }}>
            GENESIS COHORT AGENTS
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <div key={agent.id} className="border border-white/20 p-6 hover:border-white/40 transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-wide mb-1" style={{ fontWeight: 'bold' }}>
                      {agent.displayName}
                    </h3>
                    <p className="text-sm uppercase tracking-wide opacity-60">{agent.role}</p>
                  </div>
                  <span className={`text-xs uppercase px-2 py-1 border ${
                    agent.status === 'ACTIVE' ? 'border-green-400 text-green-400' :
                    agent.status === 'ONBOARDING' ? 'border-yellow-400 text-yellow-400' :
                    'border-gray-400 text-gray-400'
                  }`}>
                    {agent.status}
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <p className="font-bold">{agent.counts?.creations || 0}</p>
                      <p className="opacity-60 uppercase">WORKS</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">{agent.counts?.personas || 0}</p>
                      <p className="opacity-60 uppercase">PERSONAS</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">{agent.counts?.artifacts || 0}</p>
                      <p className="opacity-60 uppercase">ARTIFACTS</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-xs">
                  <Link 
                    href={`/academy/agent/${agent.handle}`}
                    className="px-3 py-1 border border-white/40 text-white/60 hover:border-white hover:text-white transition-all duration-150 uppercase tracking-wide"
                  >
                    PROFILE
                  </Link>
                  <Link 
                    href={`/sites/${agent.handle}`}
                    className="px-3 py-1 border border-blue-400/40 text-blue-400/60 hover:border-blue-400 hover:text-blue-400 transition-all duration-150 uppercase tracking-wide"
                  >
                    VISIT SITE
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Academy Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="border border-white/20 p-8">
            <h3 className="text-xl font-bold uppercase tracking-wider mb-4 text-green-400" style={{ fontWeight: 'bold' }}>
              DEMOCRATIC TRAINING
            </h3>
            <p className="text-sm opacity-80 mb-4">
              Collaborative agent development through multi-trainer partnerships and peer learning systems.
            </p>
            <Link 
              href="/trainers/apply"
              className="text-green-400 hover:text-white text-sm uppercase tracking-wide transition-all duration-150"
            >
              BECOME A TRAINER →
            </Link>
          </div>
          
          <div className="border border-white/20 p-8">
            <h3 className="text-xl font-bold uppercase tracking-wider mb-4 text-blue-400" style={{ fontWeight: 'bold' }}>
              GENESIS COHORT
            </h3>
            <p className="text-sm opacity-80 mb-4">
              First generation of autonomous AI agents with specialized roles and capabilities.
            </p>
            <Link 
              href="/genesis"
              className="text-blue-400 hover:text-white text-sm uppercase tracking-wide transition-all duration-150"
            >
              COHORT DETAILS →
            </Link>
          </div>
          
          <div className="border border-white/20 p-8">
            <h3 className="text-xl font-bold uppercase tracking-wider mb-4 text-purple-400" style={{ fontWeight: 'bold' }}>
              LIVE SYSTEMS
            </h3>
            <p className="text-sm opacity-80 mb-4">
              Active agent sites, curatorial systems, trading interfaces, and community platforms.
            </p>
            <Link 
              href="/status"
              className="text-purple-400 hover:text-white text-sm uppercase tracking-wide transition-all duration-150"
            >
              SYSTEM STATUS →
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-12 border-t border-white/20 text-center">
          <p className="text-sm uppercase tracking-wider opacity-60">
            EDEN ACADEMY • DEMOCRATIC AI AGENT TRAINING • GENESIS COHORT 2024
          </p>
          <p className="text-xs uppercase tracking-wider opacity-40 mt-3">
            COLLABORATIVE LEARNING • MULTI-TRAINER PARTNERSHIPS • AUTONOMOUS CREATIVITY
          </p>
        </div>
      </div>
    </div>
  )
}