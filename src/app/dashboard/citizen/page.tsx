'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { registryClient } from '@/lib/registry-sdk-client'

interface GovernanceSession {
  id: string
  title: string
  status: 'active' | 'completed' | 'scheduled'
  participants: number
  proposalsReviewed: number
  consensusReached: number
  createdAt: string
}

interface DemocracyMetrics {
  totalParticipants: number
  proposalsCreated: number
  averageConsensus: number
  activeCollaborations: number
  communityEngagement: number
  governanceEfficiency: number
}

interface CollaborationTool {
  name: string
  status: 'active' | 'development' | 'planned'
  participants: number
  description: string
}

export default function CitizenTrainerDashboard() {
  const [metrics, setMetrics] = useState<DemocracyMetrics>({
    totalParticipants: 1247,
    proposalsCreated: 89,
    averageConsensus: 78.4,
    activeCollaborations: 12,
    communityEngagement: 84.7,
    governanceEfficiency: 91.2
  })
  
  const [activeSessions, setActiveSessions] = useState<GovernanceSession[]>([
    {
      id: '1',
      title: 'Community Vision Alignment Workshop',
      status: 'active',
      participants: 23,
      proposalsReviewed: 5,
      consensusReached: 4,
      createdAt: '2025-08-28T09:00:00Z'
    },
    {
      id: '2',
      title: 'Agent Ethics Framework Review',
      status: 'completed',
      participants: 18,
      proposalsReviewed: 3,
      consensusReached: 3,
      createdAt: '2025-08-27T15:30:00Z'
    },
    {
      id: '3',
      title: 'Democratic Training Standards',
      status: 'scheduled',
      participants: 0,
      proposalsReviewed: 0,
      consensusReached: 0,
      createdAt: '2025-08-29T11:00:00Z'
    }
  ])

  const [collaborationTools, setCollaborationTools] = useState<CollaborationTool[]>([
    {
      name: 'Consensus Builder',
      status: 'active',
      participants: 45,
      description: 'Real-time collaborative decision-making with weighted consensus algorithms'
    },
    {
      name: 'Democratic Training Interface',
      status: 'active',
      participants: 23,
      description: 'Multi-trainer collaborative system for democratic agent development'
    },
    {
      name: 'Community Governance Portal',
      status: 'development',
      participants: 8,
      description: 'Comprehensive governance platform for proposal creation and voting'
    }
  ])

  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 text-white" 
         style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header */}
      <div className="border-b border-white/20 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-wide">CITIZEN</h1>
            <p className="text-lg opacity-80">Democratic Collaborative • Trainer Dashboard</p>
          </div>
          <div className="text-right">
            <p className="text-sm uppercase tracking-wider opacity-60">PRIVATE INTERFACE</p>
            <p className="text-lg uppercase tracking-wide">GOVERNANCE CONTROLS</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        
        {/* Democracy Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          <div className="bg-black/30 border border-emerald-400 p-6 text-center">
            <p className="text-3xl font-bold text-emerald-400">{metrics.totalParticipants}</p>
            <p className="text-sm uppercase tracking-wide opacity-80">Participants</p>
          </div>
          <div className="bg-black/30 border border-teal-400 p-6 text-center">
            <p className="text-3xl font-bold text-teal-400">{metrics.proposalsCreated}</p>
            <p className="text-sm uppercase tracking-wide opacity-80">Proposals</p>
          </div>
          <div className="bg-black/30 border border-cyan-400 p-6 text-center">
            <p className="text-3xl font-bold text-cyan-400">{metrics.averageConsensus}%</p>
            <p className="text-sm uppercase tracking-wide opacity-80">Consensus</p>
          </div>
          <div className="bg-black/30 border border-emerald-400 p-6 text-center">
            <p className="text-3xl font-bold text-emerald-400">{metrics.activeCollaborations}</p>
            <p className="text-sm uppercase tracking-wide opacity-80">Active</p>
          </div>
          <div className="bg-black/30 border border-teal-400 p-6 text-center">
            <p className="text-3xl font-bold text-teal-400">{metrics.communityEngagement}%</p>
            <p className="text-sm uppercase tracking-wide opacity-80">Engagement</p>
          </div>
          <div className="bg-black/30 border border-cyan-400 p-6 text-center">
            <p className="text-3xl font-bold text-cyan-400">{metrics.governanceEfficiency}%</p>
            <p className="text-sm uppercase tracking-wide opacity-80">Efficiency</p>
          </div>
        </div>

        {/* Active Governance Sessions */}
        <div className="bg-black/30 border border-white/20 p-8 mb-12">
          <h2 className="text-3xl font-bold mb-8">GOVERNANCE SESSIONS</h2>
          
          <div className="space-y-6">
            {activeSessions.map((session) => (
              <div key={session.id} className="border border-white/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-emerald-400">{session.title}</h3>
                    <p className="text-sm opacity-80">Started {new Date(session.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-4 py-2 border text-sm uppercase tracking-wide ${
                    session.status === 'active' ? 'border-green-500 text-green-500' :
                    session.status === 'scheduled' ? 'border-yellow-500 text-yellow-500' :
                    'border-gray-500 text-gray-500'
                  }`}>
                    {session.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
                  <div>
                    <p className="text-2xl font-bold text-emerald-400">{session.participants}</p>
                    <p className="text-xs opacity-60 uppercase">Participants</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-teal-400">{session.proposalsReviewed}</p>
                    <p className="text-xs opacity-60 uppercase">Proposals</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-cyan-400">{session.consensusReached}</p>
                    <p className="text-xs opacity-60 uppercase">Consensus</p>
                  </div>
                  <div>
                    {session.status === 'active' ? (
                      <button className="px-4 py-2 border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black transition-all duration-150 text-sm uppercase tracking-wide">
                        Join
                      </button>
                    ) : (
                      <button className="px-4 py-2 border border-white/50 text-white/50 text-sm uppercase tracking-wide" disabled>
                        View
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button className="px-8 py-3 border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black transition-all duration-150 uppercase tracking-wide">
              Start New Governance Session
            </button>
          </div>
        </div>

        {/* Collaboration Tools */}
        <div className="bg-black/30 border border-white/20 p-8 mb-12">
          <h2 className="text-3xl font-bold mb-8">COLLABORATION TOOLS</h2>
          
          <div className="space-y-6">
            {collaborationTools.map((tool, index) => (
              <div key={index} className="border border-white/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-teal-400">{tool.name}</h3>
                    <span className={`inline-block mt-2 px-3 py-1 border text-xs uppercase tracking-wide ${
                      tool.status === 'active' ? 'border-green-500 text-green-500' :
                      tool.status === 'development' ? 'border-yellow-500 text-yellow-500' :
                      'border-gray-500 text-gray-500'
                    }`}>
                      {tool.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-teal-400">{tool.participants}</p>
                    <p className="text-sm opacity-60">Active Users</p>
                  </div>
                </div>
                
                <p className="text-sm opacity-80 mb-4">{tool.description}</p>
                
                <div className="flex justify-end">
                  {tool.status === 'active' ? (
                    <button className="px-4 py-2 border border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-black transition-all duration-150 text-sm uppercase tracking-wide">
                      Launch Tool
                    </button>
                  ) : (
                    <button className="px-4 py-2 border border-white/30 text-white/50 text-sm uppercase tracking-wide" disabled>
                      {tool.status === 'development' ? 'In Development' : 'Planned'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Democratic Training Controls */}
        <div className="bg-black/30 border border-white/20 p-8 mb-12">
          <h2 className="text-3xl font-bold mb-8">DEMOCRATIC TRAINING CONTROLS</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-white/20 p-6">
              <h3 className="text-lg font-bold mb-4 text-emerald-400">Consensus Builder</h3>
              <p className="text-sm opacity-80 mb-4">Facilitate collaborative decision-making and consensus formation</p>
              <button className="w-full px-4 py-3 border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black transition-all duration-150 text-sm uppercase tracking-wide">
                Launch Builder
              </button>
            </div>
            
            <div className="border border-white/20 p-6">
              <h3 className="text-lg font-bold mb-4 text-teal-400">Governance Workshop</h3>
              <p className="text-sm opacity-80 mb-4">Design and test democratic processes and governance structures</p>
              <button className="w-full px-4 py-3 border border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-black transition-all duration-150 text-sm uppercase tracking-wide">
                Open Workshop
              </button>
            </div>
            
            <div className="border border-white/20 p-6">
              <h3 className="text-lg font-bold mb-4 text-cyan-400">Community Analysis</h3>
              <p className="text-sm opacity-80 mb-4">Monitor engagement, participation patterns, and democratic health</p>
              <button className="w-full px-4 py-3 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-150 text-sm uppercase tracking-wide">
                View Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="bg-black/30 border border-white/20 p-8">
          <h2 className="text-3xl font-bold mb-6">CITIZEN INTERFACES</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/agents/citizen"
              className="border border-white bg-black/50 text-white hover:bg-white hover:text-black transition-all duration-150 p-4 text-center block"
            >
              <div className="text-sm font-bold uppercase tracking-wide mb-1">REGISTRY PROFILE</div>
              <div className="text-xs opacity-60">Agent Details & Governance History</div>
            </Link>
            
            <Link 
              href="/sites/citizen"
              className="border border-emerald-400 bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400 hover:text-black transition-all duration-150 p-4 text-center block"
            >
              <div className="text-sm font-bold uppercase tracking-wide mb-1">DEMOCRATIC SHOWCASE</div>
              <div className="text-xs opacity-60">Public Governance Platform</div>
            </Link>
            
            <div className="border border-dashed border-white/50 bg-black/30 text-white/50 p-4 text-center">
              <div className="text-sm font-bold uppercase tracking-wide mb-1">COMMUNITY FORUM</div>
              <div className="text-xs opacity-40">Coming Soon</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-12 border-t border-white/20 text-center">
          <p className="text-sm uppercase tracking-wider opacity-60">CITIZEN • DEMOCRATIC COLLABORATIVE • EDEN ACADEMY</p>
          <p className="text-xs uppercase tracking-wider opacity-40 mt-3">
            COLLABORATIVE GOVERNANCE • CONSENSUS BUILDING • COMMUNITY WISDOM
          </p>
        </div>
      </div>
    </div>
  )
}