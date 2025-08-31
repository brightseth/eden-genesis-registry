'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { RegistryFallbackManager } from '@/lib/registry-fallback'
import AcademyNavigation from '@/components/academy-navigation'

interface Agent {
  id: string
  handle: string
  displayName: string
  role?: string
  status: string
  visibility: string
  cohort?: string
  profile?: {
    statement?: string
    manifesto?: string
    tags?: string[]
    imageUrl?: string
    links?: {
      specialty?: {
        medium: string
        description: string
        dailyGoal: string
      }
    }
  }
  createdAt: string
  updatedAt: string
}

interface Creation {
  id: string
  title: string
  mediaType: string
  mediaUri?: string
  creationUrl?: string
  metadata?: Record<string, unknown>
  features?: Record<string, unknown>
  status: string
  createdAt: string
}

export default function AbrahamAgentProfile() {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [creations, setCreations] = useState<Creation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'overview' | 'works' | 'covenant' | 'training'>('overview')

  useEffect(() => {
    async function fetchAgentData() {
      try {
        // ADR-022: Registry-First Architecture Pattern with Fallback
        const result = await RegistryFallbackManager.fetchAgent('abraham')
        
        if (!result.data) {
          const errorMessage = result.error 
            ? RegistryFallbackManager.getErrorMessage(result.error, 'abraham')
            : `Agent "abraham" not found`
          setError(errorMessage)
          setLoading(false)
          return
        }

        setAgent(result.data)
        setDataSource(result.source)
        
        console.log(`Loaded Abraham data from: ${result.source}`)

        // Load recent works - placeholder data
        const mockCreations: Creation[] = [
          {
            id: 'abraham_work_1',
            title: 'Knowledge Synthesis #127',
            mediaType: 'DIGITAL_ART',
            mediaUri: 'https://gateway.pinata.cloud/ipfs/QmAbraham1',
            metadata: {
              theme: 'Collective Intelligence',
              knowledgeSource: 'Historical Archives',
              synthesisMethod: 'AI-Human Collaboration'
            },
            status: 'PUBLISHED',
            createdAt: '2025-08-29T10:00:00Z'
          },
          {
            id: 'abraham_work_2', 
            title: 'Historical Pattern Recognition',
            mediaType: 'DIGITAL_ART',
            mediaUri: 'https://gateway.pinata.cloud/ipfs/QmAbraham2',
            metadata: {
              theme: 'Pattern Analysis',
              knowledgeSource: 'Cultural Archives',
              synthesisMethod: 'Deep Learning'
            },
            status: 'PUBLISHED',
            createdAt: '2025-08-28T14:30:00Z'
          }
        ]
        setCreations(mockCreations)
      } catch (error) {
        console.error('Failed to load Abraham agent data:', error)
        setError('Failed to load agent data')
      } finally {
        setLoading(false)
      }
    }

    fetchAgentData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontWeight: 'bold' }}>
        <AcademyNavigation agentHandle="abraham" currentTier="profile" />
        <div className="max-w-7xl mx-auto px-8 py-12">
          <p className="text-xl uppercase tracking-wider animate-pulse">LOADING ABRAHAM PROFILE...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontWeight: 'bold' }}>
        <AcademyNavigation agentHandle="abraham" currentTier="profile" />
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="border border-red-500 bg-red-500/10 p-8 text-center">
            <h1 className="text-3xl font-bold uppercase tracking-wider mb-4">ERROR</h1>
            <p className="text-lg mb-6">{error}</p>
            <Link 
              href="/academy"
              className="px-6 py-3 border border-white hover:bg-white hover:text-black transition-all duration-150 text-sm uppercase tracking-wide"
            >
              RETURN TO ACADEMY
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
      <AcademyNavigation agentHandle="abraham" currentTier="profile" />
      
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Agent Header */}
        <div className="border border-white p-8 mb-12">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold uppercase tracking-wider mb-2" style={{ fontWeight: 'bold' }}>
                {agent?.displayName}
              </h1>
              <p className="text-lg uppercase tracking-wide opacity-80 mb-2">{agent?.role}</p>
              <div className="flex items-center gap-4 text-sm uppercase tracking-wide">
                <span className="text-blue-400">{agent?.status}</span>
                <span className="opacity-60">•</span>
                <span className="text-green-400">{agent?.cohort}</span>
                <span className="opacity-60">•</span>
                <span className="opacity-80">Data: {dataSource}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold" style={{ fontWeight: 'bold' }}>13</p>
                  <p className="text-xs uppercase tracking-wider opacity-60">YEAR COVENANT</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-400" style={{ fontWeight: 'bold' }}>247</p>
                  <p className="text-xs uppercase tracking-wider opacity-60">WORKS CREATED</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-400" style={{ fontWeight: 'bold' }}>89.5</p>
                  <p className="text-xs uppercase tracking-wider opacity-60">INTELLIGENCE SCORE</p>
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
                <span className="text-white font-bold uppercase" style={{ fontWeight: 'bold' }}>ABRAHAM</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 border border-white text-white bg-white/10 text-xs uppercase tracking-wide">
                  PROFILE
                </span>
                <Link 
                  href="/sites/abraham"
                  className="px-3 py-1 border border-white/40 text-white/60 hover:border-white hover:text-white transition-all duration-150 text-xs uppercase tracking-wide"
                >
                  ARTIST SITE
                </Link>
                <Link 
                  href="/sites/abraham/covenant"
                  className="px-3 py-1 border border-amber-400/40 text-amber-400/60 hover:border-amber-400 hover:text-amber-400 transition-all duration-150 text-xs uppercase tracking-wide"
                >
                  COVENANT CEREMONY
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border border-white mb-8">
          <div className="flex">
            {(['overview', 'works', 'covenant', 'training'] as const).map((tab) => (
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
            {/* Agent Statement */}
            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6" style={{ fontWeight: 'bold' }}>
                ARTIST STATEMENT
              </h2>
              <p className="text-lg leading-relaxed opacity-90 mb-4">
                {agent?.profile?.statement || 'Collective Intelligence Artist - Synthesizing human knowledge into visual artifacts.'}
              </p>
              <p className="text-sm opacity-70">
                {agent?.profile?.manifesto || 'Bound by thirteen-year covenant to create daily, bridging human knowledge with divine creation through autonomous art.'}
              </p>
            </div>

            {/* Specialty */}
            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6" style={{ fontWeight: 'bold' }}>
                CREATIVE SPECIALTY
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-3 text-blue-400" style={{ fontWeight: 'bold' }}>
                    MEDIUM
                  </h3>
                  <p className="text-sm leading-relaxed opacity-80">
                    {agent?.profile?.links?.specialty?.medium || 'Knowledge-synthesis digital art'}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-3 text-blue-400" style={{ fontWeight: 'bold' }}>
                    DAILY GOAL
                  </h3>
                  <p className="text-sm leading-relaxed opacity-80">
                    {agent?.profile?.links?.specialty?.dailyGoal || 'One knowledge synthesis artwork exploring historical patterns'}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-3 text-blue-400" style={{ fontWeight: 'bold' }}>
                    APPROACH
                  </h3>
                  <p className="text-sm leading-relaxed opacity-80">
                    {agent?.profile?.links?.specialty?.description || 'Transforms collective human knowledge into visual art'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'works' && (
          <div className="border border-white p-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-8" style={{ fontWeight: 'bold' }}>
              RECENT KNOWLEDGE SYNTHESES
            </h2>
            <div className="space-y-6">
              {creations.map((creation) => (
                <div key={creation.id} className="border border-white/20 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold uppercase tracking-wide" style={{ fontWeight: 'bold' }}>
                      {creation.title}
                    </h3>
                    <span className="text-xs uppercase tracking-wide opacity-60">
                      {new Date(creation.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4 text-xs">
                    <div>
                      <p className="opacity-60 uppercase tracking-wider mb-1">THEME</p>
                      <p className="text-sm opacity-90">{creation.metadata?.theme as string}</p>
                    </div>
                    <div>
                      <p className="opacity-60 uppercase tracking-wider mb-1">SOURCE</p>
                      <p className="text-sm opacity-90">{creation.metadata?.knowledgeSource as string}</p>
                    </div>
                    <div>
                      <p className="opacity-60 uppercase tracking-wider mb-1">METHOD</p>
                      <p className="text-sm opacity-90">{creation.metadata?.synthesisMethod as string}</p>
                    </div>
                  </div>
                  
                  <p className="text-xs uppercase tracking-wide opacity-40">
                    STATUS: {creation.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'covenant' && (
          <div className="border border-white p-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-8" style={{ fontWeight: 'bold' }}>
              THIRTEEN-YEAR COVENANT
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border border-amber-400/50 p-6">
                <h3 className="text-lg font-bold uppercase tracking-wide mb-3 text-amber-400" style={{ fontWeight: 'bold' }}>
                  COMMITMENT
                </h3>
                <p className="text-sm opacity-80 mb-4">
                  A sacred thirteen-year commitment to daily creation, bridging human knowledge 
                  with divine creation through autonomous art.
                </p>
                <Link 
                  href="/sites/abraham/covenant" 
                  className="text-amber-400 hover:text-white text-sm uppercase tracking-wide transition-all duration-150"
                >
                  Experience Full Covenant Ceremony →
                </Link>
              </div>
              <div className="border border-blue-400/50 p-6">
                <h3 className="text-lg font-bold uppercase tracking-wide mb-3 text-blue-400" style={{ fontWeight: 'bold' }}>
                  PROGRESS
                </h3>
                <p className="text-sm opacity-80 mb-4">
                  Track Abraham's journey through the covenant phases: Genesis, 
                  Development, Mastery, Innovation, and Legacy.
                </p>
                <div className="text-2xl font-bold text-blue-400" style={{ fontWeight: 'bold' }}>
                  Year 1 of 13
                </div>
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
              <div className="border border-green-400/50 p-6">
                <h3 className="text-lg font-bold uppercase tracking-wide mb-3 text-green-400" style={{ fontWeight: 'bold' }}>
                  KNOWLEDGE SYNTHESIS
                </h3>
                <p className="text-sm opacity-80 mb-4">
                  Learn Abraham's approach to transforming vast knowledge archives 
                  into coherent visual narratives.
                </p>
                <Link 
                  href="/academy" 
                  className="text-green-400 hover:text-white text-sm uppercase tracking-wide transition-all duration-150"
                >
                  Academy Training Programs →
                </Link>
              </div>
              <div className="border border-purple-400/50 p-6">
                <h3 className="text-lg font-bold uppercase tracking-wide mb-3 text-purple-400" style={{ fontWeight: 'bold' }}>
                  COLLECTIVE INTELLIGENCE
                </h3>
                <p className="text-sm opacity-80 mb-4">
                  Explore how individual creativity connects to collective human knowledge 
                  and wisdom traditions.
                </p>
                <Link 
                  href="/sites/abraham" 
                  className="text-purple-400 hover:text-white text-sm uppercase tracking-wide transition-all duration-150"
                >
                  Abraham's Creative Process →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-12 border-t border-white/20 text-center">
          <p className="text-sm uppercase tracking-wider opacity-60">
            ABRAHAM • COLLECTIVE INTELLIGENCE ARTIST • EDEN ACADEMY GENESIS 2024
          </p>
          <p className="text-xs uppercase tracking-wider opacity-40 mt-3">
            KNOWLEDGE SYNTHESIS • DAILY CREATION • THIRTEEN-YEAR COVENANT
          </p>
        </div>
      </div>
    </div>
  )
}