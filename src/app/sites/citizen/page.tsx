'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { registryClient } from '@/lib/registry-client'

interface GovernanceProposal {
  id: string
  title: string
  category: 'GOVERNANCE' | 'ECONOMIC' | 'SOCIAL' | 'TECHNICAL'
  status: 'DRAFT' | 'ACTIVE' | 'PASSED' | 'REJECTED'
  votesFor: number
  votesAgainst: number
  participationRate: number
  description: string
  createdAt: string
}

interface CollaborationSession {
  id: string
  title: string
  participants: number
  consensusLevel: number
  status: 'active' | 'completed' | 'scheduled'
  topic: string
  createdAt: string
}

interface Agent {
  id: string
  handle: string
  displayName: string
  role: string
  status: string
}

export default function CitizenSitePage() {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [recentProposals, setRecentProposals] = useState<GovernanceProposal[]>([])
  const [collaborationSessions, setCollaborationSessions] = useState<CollaborationSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCitizenData() {
      try {
        const response = await registryClient.agents.list()
        const agentsData = response.data
        const citizenAgent = agentsData?.find((a: Agent) => a.handle === 'citizen')
        setAgent(citizenAgent)
        
        // Load governance proposals
        const proposals: GovernanceProposal[] = [
          {
            id: '1',
            title: 'Democratic Agent Training Standards',
            category: 'GOVERNANCE',
            status: 'ACTIVE',
            votesFor: 847,
            votesAgainst: 156,
            participationRate: 67.8,
            description: 'Proposal to establish democratic training protocols ensuring agent development reflects community values and collective decision-making principles.',
            createdAt: '2025-08-26T10:30:00Z'
          },
          {
            id: '2',
            title: 'Community Revenue Sharing Model',
            category: 'ECONOMIC',
            status: 'PASSED',
            votesFor: 1203,
            votesAgainst: 98,
            participationRate: 82.4,
            description: 'Framework for distributing agent-generated revenue back to the community through transparent, consensus-driven mechanisms.',
            createdAt: '2025-08-24T14:15:00Z'
          },
          {
            id: '3',
            title: 'Cross-Agent Collaboration Protocols',
            category: 'TECHNICAL',
            status: 'DRAFT',
            votesFor: 0,
            votesAgainst: 0,
            participationRate: 0,
            description: 'Technical standards for enabling seamless collaboration between agents while maintaining individual agency and creative autonomy.',
            createdAt: '2025-08-28T16:20:00Z'
          }
        ]
        setRecentProposals(proposals)
        
        // Load collaboration sessions
        const sessions: CollaborationSession[] = [
          {
            id: '1',
            title: 'Community Vision Workshop',
            participants: 23,
            consensusLevel: 89,
            status: 'active',
            topic: 'Long-term community development strategy',
            createdAt: '2025-08-28T09:00:00Z'
          },
          {
            id: '2',
            title: 'Agent Ethics Discussion',
            participants: 18,
            consensusLevel: 76,
            status: 'completed',
            topic: 'Ethical frameworks for AI agent development',
            createdAt: '2025-08-27T15:30:00Z'
          }
        ]
        setCollaborationSessions(sessions)
      } catch (error) {
        console.error('Failed to load CITIZEN data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCitizenData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xl animate-pulse">Loading democratic interface...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 text-white" 
         style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Hero Section */}
      <div className="px-8 py-24">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            CITIZEN
          </h1>
          <p className="text-2xl md:text-3xl mb-12 opacity-90">Democratic Agent Collaborative</p>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg md:text-xl leading-relaxed opacity-80 mb-16">
              Empowering collective decision-making and democratic governance through collaborative 
              AI agent development. CITIZEN facilitates transparent, inclusive processes that ensure 
              agent evolution reflects community values and wisdom.
            </p>
          </div>

          {/* Live Democracy Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">1,247</div>
              <p className="text-sm uppercase tracking-wide opacity-80">Active Participants</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-400 mb-2">{recentProposals.filter(p => p.status === 'ACTIVE').length}</div>
              <p className="text-sm uppercase tracking-wide opacity-80">Active Proposals</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">78.4%</div>
              <p className="text-sm uppercase tracking-wide opacity-80">Consensus Rate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">{collaborationSessions.filter(s => s.status === 'active').length}</div>
              <p className="text-sm uppercase tracking-wide opacity-80">Live Sessions</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#governance"
              className="px-8 py-4 bg-emerald-500 text-white hover:bg-emerald-400 transition-all duration-300 text-lg font-semibold"
            >
              View Proposals
            </Link>
            <Link 
              href="#collaborate"
              className="px-8 py-4 border-2 border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-white transition-all duration-300 text-lg"
            >
              Join Collaboration
            </Link>
          </div>
        </div>
      </div>

      {/* Active Governance Proposals */}
      <div id="governance" className="px-8 py-24 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Active Governance</h2>
            <div className="w-24 h-1 bg-emerald-400 mx-auto mb-8"></div>
            <p className="text-lg opacity-80 max-w-3xl mx-auto">
              Democratic proposals shaping the future of agent development and community governance
            </p>
          </div>

          <div className="space-y-8">
            {recentProposals.map((proposal) => (
              <div key={proposal.id} className="bg-black/30 border border-emerald-400/30 p-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  
                  {/* Proposal Content */}
                  <div className="lg:col-span-3">
                    <div className="flex items-center gap-4 mb-4">
                      <span className={`px-3 py-1 border text-xs uppercase tracking-wide ${
                        proposal.category === 'GOVERNANCE' ? 'border-emerald-500 text-emerald-500' :
                        proposal.category === 'ECONOMIC' ? 'border-yellow-500 text-yellow-500' :
                        proposal.category === 'SOCIAL' ? 'border-pink-500 text-pink-500' :
                        'border-blue-500 text-blue-500'
                      }`}>
                        {proposal.category}
                      </span>
                      <span className={`px-4 py-2 border text-sm uppercase tracking-wide font-bold ${
                        proposal.status === 'ACTIVE' ? 'border-green-500 text-green-500 bg-green-500/10' :
                        proposal.status === 'PASSED' ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10' :
                        proposal.status === 'DRAFT' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' :
                        'border-red-500 text-red-500 bg-red-500/10'
                      }`}>
                        {proposal.status}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-emerald-400 mb-4">{proposal.title}</h3>
                    
                    <p className="text-opacity-80 text-white mb-6 leading-relaxed">
                      {proposal.description}
                    </p>
                    
                    {proposal.status === 'ACTIVE' && (
                      <div className="flex gap-4">
                        <button className="px-6 py-3 bg-emerald-500 text-white hover:bg-emerald-400 transition-all duration-150 text-sm uppercase tracking-wide">
                          Vote For
                        </button>
                        <button className="px-6 py-3 border border-red-400 text-red-400 hover:bg-red-400 hover:text-white transition-all duration-150 text-sm uppercase tracking-wide">
                          Vote Against
                        </button>
                        <button className="px-6 py-3 border border-white/50 text-white/80 hover:border-white hover:text-white transition-all duration-150 text-sm uppercase tracking-wide">
                          View Discussion
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Voting Stats */}
                  <div className="text-center">
                    <div className="mb-6">
                      <div className="text-3xl font-bold text-emerald-400 mb-2">{proposal.participationRate}%</div>
                      <p className="text-sm uppercase tracking-wide opacity-80">Participation</p>
                    </div>
                    
                    {proposal.status !== 'DRAFT' && (
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-emerald-400">For: {proposal.votesFor}</span>
                            <span className="text-red-400">Against: {proposal.votesAgainst}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-emerald-400 h-2 rounded-l-full" 
                              style={{width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs opacity-60 mt-4">
                      {new Date(proposal.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/agents/citizen"
              className="px-8 py-4 border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-white transition-all duration-300 text-lg"
            >
              View All Governance Activity
            </Link>
          </div>
        </div>
      </div>

      {/* Active Collaborations */}
      <div id="collaborate" className="px-8 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Live Collaborations</h2>
            <div className="w-24 h-1 bg-teal-400 mx-auto mb-8"></div>
            <p className="text-lg opacity-80">
              Real-time collaborative sessions building consensus and community wisdom
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {collaborationSessions.map((session) => (
              <div key={session.id} className={`border p-8 ${
                session.status === 'active' ? 'border-teal-400 bg-teal-400/10' : 'border-white/20 bg-black/20'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-teal-400">{session.title}</h3>
                  <span className={`px-3 py-1 border text-xs uppercase tracking-wide ${
                    session.status === 'active' ? 'border-green-500 text-green-500' :
                    session.status === 'completed' ? 'border-gray-500 text-gray-500' :
                    'border-yellow-500 text-yellow-500'
                  }`}>
                    {session.status}
                  </span>
                </div>
                
                <p className="text-sm opacity-80 mb-6">{session.topic}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                  <div>
                    <p className="text-2xl font-bold text-teal-400">{session.participants}</p>
                    <p className="text-xs opacity-60 uppercase">Participants</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-teal-400">{session.consensusLevel}%</p>
                    <p className="text-xs opacity-60 uppercase">Consensus</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-teal-400">
                      {Math.floor((Date.now() - new Date(session.createdAt).getTime()) / (1000 * 60 * 60))}h
                    </p>
                    <p className="text-xs opacity-60 uppercase">Duration</p>
                  </div>
                </div>
                
                {session.status === 'active' && (
                  <button className="w-full px-4 py-3 bg-teal-500 text-white hover:bg-teal-400 transition-all duration-150 text-sm uppercase tracking-wide">
                    Join Session
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Community Stats */}
          <div className="bg-black/30 border border-white/20 p-12 text-center">
            <h3 className="text-3xl font-bold mb-8">Democratic Participation</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold text-emerald-400 mb-2">1,247</div>
                <p className="text-sm uppercase tracking-wide opacity-80">Community Members</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-teal-400 mb-2">89</div>
                <p className="text-sm uppercase tracking-wide opacity-80">Proposals Reviewed</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-cyan-400 mb-2">78.4%</div>
                <p className="text-sm uppercase tracking-wide opacity-80">Consensus Rate</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-emerald-400 mb-2">234</div>
                <p className="text-sm uppercase tracking-wide opacity-80">Collaborative Sessions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="px-8 py-16 bg-black/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link 
              href="/agents/citizen"
              className="border-2 border-emerald-400/30 bg-black/20 text-white hover:border-emerald-400 hover:bg-emerald-400/10 transition-all duration-150 p-6 text-center block"
            >
              <div className="text-lg font-bold text-emerald-400 mb-2">Registry Profile</div>
              <div className="text-sm opacity-80">Complete agent details and governance history</div>
            </Link>
            
            <Link 
              href="/dashboard/citizen"
              className="border-2 border-emerald-400 bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400 hover:text-white transition-all duration-150 p-6 text-center block"
            >
              <div className="text-lg font-bold mb-2">Trainer Dashboard</div>
              <div className="text-sm opacity-80">Private governance controls (authenticated)</div>
            </Link>
            
            <div className="border-2 border-dashed border-emerald-400/30 bg-black/10 text-emerald-400/50 p-6 text-center">
              <div className="text-lg font-bold mb-2">Community Forum</div>
              <div className="text-sm opacity-60">Full governance platform coming soon</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-12 bg-black/40 text-center">
        <p className="text-emerald-300/60 text-sm uppercase tracking-wider mb-3">
          CITIZEN • Democratic Agent Collaborative • Eden Academy Genesis Cohort 2024
        </p>
        <p className="text-emerald-300/40 text-xs">
          Democratic Governance • Collaborative Decision-Making • Community Wisdom
        </p>
      </div>
    </div>
  )
}