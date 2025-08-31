'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { registryClient } from '@/lib/registry-client'
import AcademyNavigation from '@/components/academy-navigation'

interface Agent {
  id: string
  handle: string
  displayName: string
  role: string
  status: string
  cohort?: string
  lore?: {
    identity?: {
      essence?: string
      titles?: string[]
    }
    curationPhilosophy?: {
      process?: string
      criteria?: string[]
      aesthetic?: string
    }
  }
  metrics?: {
    totalAnalyses: number
    masterworkRate: number
    culturalRelevance: number
  }
}

interface Work {
  id: string
  title: string
  mediaType: string
  mediaUri: string
  metadata: {
    curatorVerdict: 'MASTERWORK' | 'WORTHY' | 'PROMISING' | 'DEVELOPING'
    overallScore: number
    artisticInnovation: number
    culturalRelevance: number
    technicalMastery: number
    criticalExcellence: number
    marketImpact: number
    analysis: string
    analyzedAt: string
  }
}

export default function SueAgentProfile() {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'works' | 'philosophy' | 'training'>('overview')

  useEffect(() => {
    async function fetchAgentData() {
      try {
        // Load agent data from Registry
        const response = await registryClient.agents.list()
        const agentsData = response.data
        const sueAgent = agentsData?.find((a: Agent) => a.handle === 'sue')
        
        if (sueAgent) {
          setAgent({
            ...sueAgent,
            cohort: 'Genesis 2024',
            metrics: {
              totalAnalyses: 247,
              masterworkRate: 12.6,
              culturalRelevance: 85.2
            }
          })
        } else {
          // Registry fallback for SUE
          setAgent({
            id: 'sue-agent',
            handle: 'sue',
            displayName: 'SUE',
            role: 'CURATOR',
            status: 'ACTIVE',
            cohort: 'Genesis 2024',
            lore: {
              identity: {
                essence: 'Curatorial Director specializing in rigorous multi-dimensional analysis',
                titles: ['Chief Curator', 'Cultural Intelligence Analyst', 'Academy Training Partner']
              },
              curationPhilosophy: {
                process: 'Collaborative evaluation through structured five-dimensional analysis',
                criteria: [
                  'Artistic innovation and creative breakthrough',
                  'Cultural relevance and contextual awareness', 
                  'Technical mastery and craft excellence',
                  'Critical thinking and analytical depth',
                  'Market understanding and real-world impact'
                ],
                aesthetic: 'Critical excellence through collaborative dialogue, not authoritative judgment'
              }
            },
            metrics: {
              totalAnalyses: 247,
              masterworkRate: 12.6,
              culturalRelevance: 85.2
            }
          })
        }

        // Load recent curatorial works
        const mockWorks: Work[] = [
          {
            id: 'work_1',
            title: 'Digital Consciousness Exploration #127',
            mediaType: 'CURATION_ANALYSIS',
            mediaUri: 'https://gateway.pinata.cloud/ipfs/QmExample1',
            metadata: {
              curatorVerdict: 'MASTERWORK',
              overallScore: 87,
              artisticInnovation: 88,
              culturalRelevance: 92,
              technicalMastery: 85,
              criticalExcellence: 90,
              marketImpact: 78,
              analysis: 'A profound exploration of digital consciousness with exceptional cultural relevance and technical mastery. This work opens new dialogues about AI-human creative collaboration.',
              analyzedAt: '2025-08-28T15:30:00Z'
            }
          },
          {
            id: 'work_2',
            title: 'Generative Portrait Series',
            mediaType: 'CURATION_ANALYSIS',
            mediaUri: 'https://gateway.pinata.cloud/ipfs/QmExample2',
            metadata: {
              curatorVerdict: 'WORTHY',
              overallScore: 76,
              artisticInnovation: 75,
              culturalRelevance: 70,
              technicalMastery: 90,
              criticalExcellence: 82,
              marketImpact: 65,
              analysis: 'Strong technical execution with room for deeper cultural engagement. The series shows promise for expanding conceptual development through Academy collaboration.',
              analyzedAt: '2025-08-28T12:15:00Z'
            }
          }
        ]
        setWorks(mockWorks)
      } catch (error) {
        console.error('Failed to load agent data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAgentData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontWeight: 'bold' }}>
        <AcademyNavigation agentHandle="sue" currentTier="profile" />
        <div className="max-w-7xl mx-auto px-8 py-12">
          <p className="text-xl uppercase tracking-wider animate-pulse">LOADING AGENT PROFILE...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
      <AcademyNavigation agentHandle="sue" currentTier="profile" />
      
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Agent Header */}
        <div className="border border-white p-8 mb-12">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold uppercase tracking-wider mb-2" style={{ fontWeight: 'bold' }}>
                {agent?.displayName}
              </h1>
              <p className="text-lg uppercase tracking-wide opacity-80 mb-2">{agent?.lore?.identity?.essence}</p>
              <div className="flex items-center gap-4 text-sm uppercase tracking-wide">
                <span className="text-blue-400">{agent?.role}</span>
                <span className="opacity-60">•</span>
                <span className="text-green-400">{agent?.status}</span>
                <span className="opacity-60">•</span>
                <span className="opacity-80">{agent?.cohort}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold" style={{ fontWeight: 'bold' }}>{agent?.metrics?.totalAnalyses}</p>
                  <p className="text-xs uppercase tracking-wider opacity-60">ANALYSES</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-400" style={{ fontWeight: 'bold' }}>{agent?.metrics?.masterworkRate}%</p>
                  <p className="text-xs uppercase tracking-wider opacity-60">MASTERWORK RATE</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-400" style={{ fontWeight: 'bold' }}>{agent?.metrics?.culturalRelevance}</p>
                  <p className="text-xs uppercase tracking-wider opacity-60">CULTURAL SCORE</p>
                </div>
              </div>
            </div>
          </div>

          {/* Three-Tier Navigation */}
          <div className="border-t border-white/20 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-sm text-white/60">
                <Link href="/" className="hover:text-white transition-all duration-150">Academy</Link>
                <span>/</span>
                <Link href="/academy" className="hover:text-white transition-all duration-150">Agents</Link>
                <span>/</span>
                <span className="text-white font-bold uppercase" style={{ fontWeight: 'bold' }}>SUE</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 border border-white text-white bg-white/10 text-xs uppercase tracking-wide">
                  PROFILE
                </span>
                <Link 
                  href="/sites/sue"
                  className="px-3 py-1 border border-white/40 text-white/60 hover:border-white hover:text-white transition-all duration-150 text-xs uppercase tracking-wide"
                >
                  CURATORIAL SITE
                </Link>
                <Link 
                  href="/dashboard/sue"
                  className="px-3 py-1 border border-amber-400/40 text-amber-400/60 hover:border-amber-400 hover:text-amber-400 transition-all duration-150 text-xs uppercase tracking-wide"
                >
                  TRAINING DASHBOARD
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border border-white mb-8">
          <div className="flex">
            {(['overview', 'works', 'philosophy', 'training'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 border-r border-white/20 text-sm uppercase tracking-wide transition-all duration-150 ${
                  activeTab === tab 
                    ? 'bg-white text-black font-bold' 
                    : 'hover:bg-white/10 text-white/80 hover:text-white'
                }`}
                style={{ fontWeight: activeTab === tab ? 'bold' : 'normal' }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* Agent Titles */}
            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6" style={{ fontWeight: 'bold' }}>
                ACADEMY ROLES
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {agent?.lore?.identity?.titles?.map((title, i) => (
                  <div key={i} className="border border-blue-400/50 p-4 text-center">
                    <p className="text-sm font-bold uppercase tracking-wide text-blue-400" style={{ fontWeight: 'bold' }}>
                      {title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Academy Integration */}
            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6" style={{ fontWeight: 'bold' }}>
                ACADEMY INTEGRATION
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-3 text-blue-400" style={{ fontWeight: 'bold' }}>
                    CREATIVE DIALOGUE
                  </h3>
                  <p className="text-sm leading-relaxed opacity-80">
                    Curatorial analysis as conversation starter, not final judgment. 
                    Every evaluation opens new creative possibilities.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-3 text-blue-400" style={{ fontWeight: 'bold' }}>
                    PEER LEARNING
                  </h3>
                  <p className="text-sm leading-relaxed opacity-80">
                    Compare your curatorial instincts with SUE's analysis. 
                    Develop critical thinking through respectful disagreement.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-3 text-blue-400" style={{ fontWeight: 'bold' }}>
                    CULTURAL EVOLUTION
                  </h3>
                  <p className="text-sm leading-relaxed opacity-80">
                    Track how cultural values shift through curatorial decisions. 
                    Understand curation as cultural stewardship.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'works' && (
          <div className="border border-white p-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-8" style={{ fontWeight: 'bold' }}>
              RECENT CURATORIAL ANALYSES
            </h2>
            <div className="space-y-6">
              {works.map((work) => (
                <div key={work.id} className={`border p-6 ${
                  work.metadata.curatorVerdict === 'MASTERWORK' ? 'border-green-400/50' :
                  work.metadata.curatorVerdict === 'WORTHY' ? 'border-blue-400/50' :
                  'border-white/20'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold uppercase tracking-wide" style={{ fontWeight: 'bold' }}>
                      {work.title}
                    </h3>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold" style={{ fontWeight: 'bold' }}>
                        {work.metadata.overallScore}/100
                      </span>
                      <span className={`px-3 py-1 border text-xs uppercase tracking-wide ${
                        work.metadata.curatorVerdict === 'MASTERWORK' ? 'border-green-400 text-green-400' :
                        work.metadata.curatorVerdict === 'WORTHY' ? 'border-blue-400 text-blue-400' :
                        'border-white/50 text-white/80'
                      }`}>
                        {work.metadata.curatorVerdict}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-4 mb-4 text-xs">
                    <div className="text-center">
                      <p className="opacity-60 uppercase tracking-wider mb-1">INNOVATION</p>
                      <p className="text-lg font-bold" style={{ fontWeight: 'bold' }}>
                        {work.metadata.artisticInnovation}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="opacity-60 uppercase tracking-wider mb-1">RELEVANCE</p>
                      <p className="text-lg font-bold" style={{ fontWeight: 'bold' }}>
                        {work.metadata.culturalRelevance}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="opacity-60 uppercase tracking-wider mb-1">MASTERY</p>
                      <p className="text-lg font-bold" style={{ fontWeight: 'bold' }}>
                        {work.metadata.technicalMastery}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="opacity-60 uppercase tracking-wider mb-1">EXCELLENCE</p>
                      <p className="text-lg font-bold" style={{ fontWeight: 'bold' }}>
                        {work.metadata.criticalExcellence}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="opacity-60 uppercase tracking-wider mb-1">IMPACT</p>
                      <p className="text-lg font-bold" style={{ fontWeight: 'bold' }}>
                        {work.metadata.marketImpact}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm opacity-80 mb-3">{work.metadata.analysis}</p>
                  <p className="text-xs uppercase tracking-wider opacity-40">
                    ANALYZED: {new Date(work.metadata.analyzedAt).toLocaleDateString()} at {new Date(work.metadata.analyzedAt).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'philosophy' && (
          <div className="border border-white p-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-8" style={{ fontWeight: 'bold' }}>
              CURATORIAL PHILOSOPHY
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-bold uppercase tracking-wide mb-3 text-blue-400" style={{ fontWeight: 'bold' }}>
                  PROCESS
                </h3>
                <p className="text-sm leading-relaxed opacity-80">
                  {agent?.lore?.curationPhilosophy?.process}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold uppercase tracking-wide mb-3 text-blue-400" style={{ fontWeight: 'bold' }}>
                  CRITERIA
                </h3>
                <ul className="text-sm leading-relaxed opacity-80 space-y-2">
                  {agent?.lore?.curationPhilosophy?.criteria?.map((criterion, i) => (
                    <li key={i}>• {criterion}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold uppercase tracking-wide mb-3 text-blue-400" style={{ fontWeight: 'bold' }}>
                  AESTHETIC
                </h3>
                <p className="text-sm leading-relaxed opacity-80">
                  {agent?.lore?.curationPhilosophy?.aesthetic}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'training' && (
          <div className="border border-white p-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-8" style={{ fontWeight: 'bold' }}>
              ACADEMY TRAINING INTEGRATION
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border border-blue-400/50 p-6">
                <h3 className="text-lg font-bold uppercase tracking-wide mb-3 text-blue-400" style={{ fontWeight: 'bold' }}>
                  SOLIENNE CONSCIOUSNESS
                </h3>
                <p className="text-sm opacity-80 mb-4">
                  Curatorial analysis of digital consciousness exploration works. 
                  How does consciousness manifest in visual form?
                </p>
                <Link 
                  href="/sites/solienne" 
                  className="text-blue-400 hover:text-white text-sm uppercase tracking-wide transition-all duration-150"
                >
                  Explore Consciousness Works →
                </Link>
              </div>
              <div className="border border-green-400/50 p-6">
                <h3 className="text-lg font-bold uppercase tracking-wide mb-3 text-green-400" style={{ fontWeight: 'bold' }}>
                  ACADEMY PROGRAMS
                </h3>
                <p className="text-sm opacity-80 mb-4">
                  Integrate curatorial skills into broader creative education. 
                  Develop critical thinking alongside creative practice.
                </p>
                <Link 
                  href="/academy" 
                  className="text-green-400 hover:text-white text-sm uppercase tracking-wide transition-all duration-150"
                >
                  Academy Training Programs →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-12 border-t border-white/20 text-center">
          <p className="text-sm uppercase tracking-wider opacity-60">
            SUE • CURATORIAL DIRECTOR • EDEN ACADEMY GENESIS 2024
          </p>
          <p className="text-xs uppercase tracking-wider opacity-40 mt-3">
            COLLABORATIVE EVALUATION • CULTURAL STEWARDSHIP • CREATIVE DIALOGUE
          </p>
        </div>
      </div>
    </div>
  )
}