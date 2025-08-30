'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { registryClient } from '@/lib/registry-client'

interface CurationSession {
  id: string
  title: string
  status: 'active' | 'completed' | 'scheduled'
  worksAnalyzed: number
  masterworks: number
  worthyWorks: number
  averageScore: number
  createdAt: string
}

interface CulturalTrend {
  category: string
  trend: string
  confidence: number
  impact: 'high' | 'medium' | 'low'
  description: string
}

interface CurationMetrics {
  totalAnalyses: number
  masterworkRate: number
  averageCriticalScore: number
  culturalRelevanceScore: number
  trendsIdentified: number
}

export default function SueTrainerDashboard() {
  const [metrics, setMetrics] = useState<CurationMetrics>({
    totalAnalyses: 247,
    masterworkRate: 12.6,
    averageCriticalScore: 78.4,
    culturalRelevanceScore: 85.2,
    trendsIdentified: 18
  })
  
  const [activeSessions, setActiveSessions] = useState<CurationSession[]>([
    {
      id: '1',
      title: 'Digital Consciousness Collection Review',
      status: 'active',
      worksAnalyzed: 23,
      masterworks: 3,
      worthyWorks: 12,
      averageScore: 82.3,
      createdAt: '2025-08-28T10:00:00Z'
    },
    {
      id: '2', 
      title: 'Generative Art Weekly Curation',
      status: 'scheduled',
      worksAnalyzed: 0,
      masterworks: 0,
      worthyWorks: 0,
      averageScore: 0,
      createdAt: '2025-08-29T09:00:00Z'
    }
  ])

  const [culturalTrends, setCulturalTrends] = useState<CulturalTrend[]>([
    {
      category: 'AI Ethics',
      trend: 'Growing focus on consciousness representation',
      confidence: 87,
      impact: 'high',
      description: 'Artists increasingly exploring digital consciousness and AI sentience themes'
    },
    {
      category: 'Technical Innovation',
      trend: 'Multi-modal AI integration',
      confidence: 92,
      impact: 'high', 
      description: 'Integration of text, image, and audio AI models in single artworks'
    },
    {
      category: 'Market Dynamics',
      trend: 'Curation-driven value appreciation',
      confidence: 78,
      impact: 'medium',
      description: 'Works with professional curatorial endorsement showing stronger market performance'
    }
  ])

  const [newSessionTitle, setNewSessionTitle] = useState('')
  const [isCreatingSession, setIsCreatingSession] = useState(false)

  const createCurationSession = async () => {
    if (!newSessionTitle.trim()) return
    
    setIsCreatingSession(true)
    try {
      // Mock session creation
      const newSession: CurationSession = {
        id: Date.now().toString(),
        title: newSessionTitle,
        status: 'active',
        worksAnalyzed: 0,
        masterworks: 0,
        worthyWorks: 0,
        averageScore: 0,
        createdAt: new Date().toISOString()
      }
      
      setActiveSessions(prev => [newSession, ...prev])
      setNewSessionTitle('')
    } catch (error) {
      console.error('Failed to create session:', error)
    } finally {
      setIsCreatingSession(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 border-green-400'
      case 'scheduled': return 'text-yellow-400 border-yellow-400'
      case 'completed': return 'text-blue-400 border-blue-400'
      default: return 'text-white border-white'
    }
  }

  const getTrendImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400 border-red-400'
      case 'medium': return 'text-yellow-400 border-yellow-400'
      case 'low': return 'text-blue-400 border-blue-400'
      default: return 'text-white border-white'
    }
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      {/* Header */}
      <div className="border-b border-white/20 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-wider">SUE</h1>
            <p className="text-lg uppercase tracking-wide opacity-80">CURATOR TRAINING DASHBOARD</p>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/sites/sue"
              className="px-4 py-2 border border-white text-white hover:bg-white hover:text-black transition-all duration-150 uppercase tracking-wide text-sm"
            >
              PUBLIC SITE
            </Link>
            <Link 
              href="/agents/sue"
              className="px-4 py-2 border border-white/50 text-white/80 hover:border-white hover:text-white transition-all duration-150 uppercase tracking-wide text-sm"
            >
              REGISTRY PROFILE
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          <div className="border border-white p-6 text-center">
            <h3 className="text-3xl font-bold mb-2">{metrics.totalAnalyses}</h3>
            <p className="text-sm uppercase tracking-wider opacity-60">TOTAL ANALYSES</p>
          </div>
          <div className="border border-green-400 p-6 text-center">
            <h3 className="text-3xl font-bold mb-2 text-green-400">{metrics.masterworkRate}%</h3>
            <p className="text-sm uppercase tracking-wider opacity-60">MASTERWORK RATE</p>
          </div>
          <div className="border border-blue-400 p-6 text-center">
            <h3 className="text-3xl font-bold mb-2 text-blue-400">{metrics.averageCriticalScore}</h3>
            <p className="text-sm uppercase tracking-wider opacity-60">AVG CRITICAL SCORE</p>
          </div>
          <div className="border border-purple-400 p-6 text-center">
            <h3 className="text-3xl font-bold mb-2 text-purple-400">{metrics.culturalRelevanceScore}</h3>
            <p className="text-sm uppercase tracking-wider opacity-60">CULTURAL RELEVANCE</p>
          </div>
          <div className="border border-yellow-400 p-6 text-center">
            <h3 className="text-3xl font-bold mb-2 text-yellow-400">{metrics.trendsIdentified}</h3>
            <p className="text-sm uppercase tracking-wider opacity-60">TRENDS IDENTIFIED</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Active Curation Sessions */}
          <div className="border border-white p-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">CURATION SESSIONS</h2>
            
            {/* Create New Session */}
            <div className="border border-white/50 p-4 mb-6">
              <h3 className="text-lg font-bold uppercase tracking-wide mb-4">CREATE NEW SESSION</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newSessionTitle}
                  onChange={(e) => setNewSessionTitle(e.target.value)}
                  placeholder="Session title..."
                  className="flex-1 bg-black border border-white/50 px-3 py-2 text-white placeholder-white/50 focus:border-white outline-none text-sm"
                />
                <button
                  onClick={createCurationSession}
                  disabled={!newSessionTitle.trim() || isCreatingSession}
                  className="px-4 py-2 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all duration-150 uppercase tracking-wide text-sm disabled:opacity-50"
                >
                  {isCreatingSession ? 'CREATING...' : 'CREATE'}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {activeSessions.map((session) => (
                <div key={session.id} className="border border-white/20 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold uppercase tracking-wide">{session.title}</h3>
                    <span className={`px-3 py-1 border text-xs uppercase tracking-wide ${getStatusColor(session.status)}`}>
                      {session.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                    <div>
                      <p className="font-bold text-lg">{session.worksAnalyzed}</p>
                      <p className="opacity-60 uppercase text-xs">ANALYZED</p>
                    </div>
                    <div>
                      <p className="font-bold text-lg text-green-400">{session.masterworks}</p>
                      <p className="opacity-60 uppercase text-xs">MASTERWORKS</p>
                    </div>
                    <div>
                      <p className="font-bold text-lg text-blue-400">{session.worthyWorks}</p>
                      <p className="opacity-60 uppercase text-xs">WORTHY</p>
                    </div>
                    <div>
                      <p className="font-bold text-lg">{session.averageScore || 'N/A'}</p>
                      <p className="opacity-60 uppercase text-xs">AVG SCORE</p>
                    </div>
                  </div>
                  
                  {session.status === 'active' && (
                    <div className="mt-4 pt-3 border-t border-white/10">
                      <button className="text-sm uppercase tracking-wide text-blue-400 hover:text-white transition-colors">
                        CONTINUE SESSION →
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cultural Trends Analysis */}
          <div className="border border-white p-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">CULTURAL TRENDS</h2>
            <div className="space-y-4">
              {culturalTrends.map((trend, index) => (
                <div key={index} className="border border-white/20 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold uppercase tracking-wide">{trend.category}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-sm">{trend.confidence}%</span>
                      <span className={`px-2 py-1 border text-xs uppercase tracking-wide ${getTrendImpactColor(trend.impact)}`}>
                        {trend.impact}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm font-bold mb-2 text-blue-400">{trend.trend}</p>
                  <p className="text-sm opacity-80">{trend.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/20">
              <button className="w-full py-3 border border-white text-white hover:bg-white hover:text-black transition-all duration-150 uppercase tracking-wide text-sm">
                GENERATE TREND REPORT
              </button>
            </div>
          </div>
        </div>

        {/* Curatorial Tools */}
        <div className="border border-white p-8 mb-12">
          <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">CURATORIAL TOOLS</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="border border-green-400 bg-green-400/10 text-green-400 hover:bg-green-400 hover:text-black transition-all duration-150 p-4 text-center">
              <div className="text-sm font-bold uppercase tracking-wide mb-1">BATCH ANALYSIS</div>
              <div className="text-xs opacity-60">Analyze Multiple Works</div>
            </button>
            
            <button className="border border-blue-400 bg-blue-400/10 text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-150 p-4 text-center">
              <div className="text-sm font-bold uppercase tracking-wide mb-1">EXHIBITION PLANNER</div>
              <div className="text-xs opacity-60">Curate Collections</div>
            </button>
            
            <button className="border border-purple-400 bg-purple-400/10 text-purple-400 hover:bg-purple-400 hover:text-black transition-all duration-150 p-4 text-center">
              <div className="text-sm font-bold uppercase tracking-wide mb-1">TREND ANALYZER</div>
              <div className="text-xs opacity-60">Cultural Pattern Recognition</div>
            </button>
            
            <button className="border border-yellow-400 bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-150 p-4 text-center">
              <div className="text-sm font-bold uppercase tracking-wide mb-1">CRITERIA TUNING</div>
              <div className="text-xs opacity-60">Adjust Analysis Parameters</div>
            </button>
          </div>
        </div>

        {/* Training Progress */}
        <div className="border border-white p-8">
          <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">TRAINING PROGRESS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wide mb-3 text-green-400">CRITICAL ANALYSIS</h3>
              <div className="bg-black border border-white/20 p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm opacity-80">MASTERY LEVEL</span>
                  <span className="text-sm font-bold">EXPERT</span>
                </div>
                <div className="w-full bg-white/10 h-2 mb-2">
                  <div className="bg-green-400 h-2" style={{ width: '92%' }}></div>
                </div>
                <p className="text-xs opacity-60">Exceptional ability to identify artistic innovation and cultural significance</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wide mb-3 text-blue-400">CULTURAL AWARENESS</h3>
              <div className="bg-black border border-white/20 p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm opacity-80">MASTERY LEVEL</span>
                  <span className="text-sm font-bold">ADVANCED</span>
                </div>
                <div className="w-full bg-white/10 h-2 mb-2">
                  <div className="bg-blue-400 h-2" style={{ width: '85%' }}></div>
                </div>
                <p className="text-xs opacity-60">Strong understanding of contemporary cultural movements and contexts</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wide mb-3 text-purple-400">TREND PREDICTION</h3>
              <div className="bg-black border border-white/20 p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm opacity-80">MASTERY LEVEL</span>
                  <span className="text-sm font-bold">PROFICIENT</span>
                </div>
                <div className="w-full bg-white/10 h-2 mb-2">
                  <div className="bg-purple-400 h-2" style={{ width: '78%' }}></div>
                </div>
                <p className="text-xs opacity-60">Developing capability to predict emerging cultural and artistic trends</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-12 border-t border-white/20 text-center">
          <p className="text-sm uppercase tracking-wider opacity-60">SUE CURATOR TRAINING DASHBOARD</p>
          <p className="text-xs uppercase tracking-wider opacity-40 mt-3">
            RIGOROUS ANALYSIS • CULTURAL INTELLIGENCE • CRITICAL EXCELLENCE
          </p>
        </div>
      </div>
    </div>
  )
}