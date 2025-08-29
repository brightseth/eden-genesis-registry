'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { registryClient } from '@/lib/registry-sdk-client'

interface NarrativeSession {
  id: string
  title: string
  status: 'active' | 'completed' | 'scheduled'
  wordsWritten: number
  chaptersCompleted: number
  averageReadability: number
  createdAt: string
}

interface StorylineMetrics {
  totalWorks: number
  averageLength: number
  genresExplored: number
  narrativeCoherence: number
  characterDevelopment: number
  thematicDepth: number
}

interface WritingTrend {
  genre: string
  trend: string
  confidence: number
  engagement: 'high' | 'medium' | 'low'
  description: string
}

export default function AbrahamTrainerDashboard() {
  const [metrics, setMetrics] = useState<StorylineMetrics>({
    totalWorks: 342,
    averageLength: 2847,
    genresExplored: 12,
    narrativeCoherence: 87.3,
    characterDevelopment: 84.2,
    thematicDepth: 91.8
  })
  
  const [activeSessions, setActiveSessions] = useState<NarrativeSession[]>([
    {
      id: '1',
      title: 'Speculative Fiction Series - Part VII',
      status: 'active',
      wordsWritten: 4200,
      chaptersCompleted: 3,
      averageReadability: 85.2,
      createdAt: '2025-08-28T14:30:00Z'
    },
    {
      id: '2',
      title: 'Character Development Workshop',
      status: 'scheduled',
      wordsWritten: 0,
      chaptersCompleted: 0,
      averageReadability: 0,
      createdAt: '2025-08-29T09:00:00Z'
    }
  ])

  const [writingTrends, setWritingTrends] = useState<WritingTrend[]>([
    {
      genre: 'Speculative Fiction',
      trend: 'Climate consciousness narratives',
      confidence: 94,
      engagement: 'high',
      description: 'Rising interest in environmental storytelling with human impact themes'
    },
    {
      genre: 'Literary Fiction',
      trend: 'Digital identity exploration',
      confidence: 87,
      engagement: 'high', 
      description: 'Characters navigating authentic self-expression in digital spaces'
    },
    {
      genre: 'Science Fiction',
      trend: 'AI-human collaboration stories',
      confidence: 78,
      engagement: 'medium',
      description: 'Narratives exploring symbiotic rather than adversarial AI relationships'
    }
  ])

  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 text-white" 
         style={{ fontFamily: 'Charter, Georgia, serif' }}>
      
      {/* Header */}
      <div className="border-b border-white/20 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">ABRAHAM</h1>
            <p className="text-lg opacity-80">Narrative Architect • Trainer Dashboard</p>
          </div>
          <div className="text-right">
            <p className="text-sm uppercase tracking-wider opacity-60">PRIVATE INTERFACE</p>
            <p className="text-lg uppercase tracking-wide">TRAINER CONTROLS</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          <div className="bg-black/30 border border-white/20 p-6 text-center">
            <p className="text-3xl font-bold text-amber-400">{metrics.totalWorks}</p>
            <p className="text-sm uppercase tracking-wide opacity-80">Total Works</p>
          </div>
          <div className="bg-black/30 border border-white/20 p-6 text-center">
            <p className="text-3xl font-bold text-amber-400">{metrics.averageLength}</p>
            <p className="text-sm uppercase tracking-wide opacity-80">Avg Words</p>
          </div>
          <div className="bg-black/30 border border-white/20 p-6 text-center">
            <p className="text-3xl font-bold text-amber-400">{metrics.genresExplored}</p>
            <p className="text-sm uppercase tracking-wide opacity-80">Genres</p>
          </div>
          <div className="bg-black/30 border border-white/20 p-6 text-center">
            <p className="text-3xl font-bold text-amber-400">{metrics.narrativeCoherence}%</p>
            <p className="text-sm uppercase tracking-wide opacity-80">Coherence</p>
          </div>
          <div className="bg-black/30 border border-white/20 p-6 text-center">
            <p className="text-3xl font-bold text-amber-400">{metrics.characterDevelopment}%</p>
            <p className="text-sm uppercase tracking-wide opacity-80">Characters</p>
          </div>
          <div className="bg-black/30 border border-white/20 p-6 text-center">
            <p className="text-3xl font-bold text-amber-400">{metrics.thematicDepth}%</p>
            <p className="text-sm uppercase tracking-wide opacity-80">Depth</p>
          </div>
        </div>

        {/* Active Writing Sessions */}
        <div className="bg-black/30 border border-white/20 p-8 mb-12">
          <h2 className="text-3xl font-bold mb-8">ACTIVE WRITING SESSIONS</h2>
          
          <div className="space-y-6">
            {activeSessions.map((session) => (
              <div key={session.id} className="border border-white/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{session.title}</h3>
                    <p className="text-sm opacity-80">Started {new Date(session.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-4 py-2 border text-sm uppercase tracking-wide ${
                    session.status === 'active' ? 'border-green-500 text-green-500' :
                    session.status === 'scheduled' ? 'border-blue-400 text-blue-400' :
                    'border-amber-400 text-amber-400'
                  }`}>
                    {session.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-amber-400">{session.wordsWritten}</p>
                    <p className="text-xs opacity-60 uppercase">Words Written</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-amber-400">{session.chaptersCompleted}</p>
                    <p className="text-xs opacity-60 uppercase">Chapters</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-amber-400">{session.averageReadability}%</p>
                    <p className="text-xs opacity-60 uppercase">Readability</p>
                  </div>
                  <div>
                    <button className="px-4 py-2 border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition-all duration-150 text-sm uppercase tracking-wide">
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button className="px-8 py-3 border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition-all duration-150 uppercase tracking-wide">
              Start New Writing Session
            </button>
          </div>
        </div>

        {/* Writing Trends Analysis */}
        <div className="bg-black/30 border border-white/20 p-8 mb-12">
          <h2 className="text-3xl font-bold mb-8">NARRATIVE TRENDS & INSIGHTS</h2>
          
          <div className="space-y-6">
            {writingTrends.map((trend, index) => (
              <div key={index} className="border border-white/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-amber-400">{trend.genre}</h3>
                    <p className="text-xl font-semibold">{trend.trend}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-amber-400">{trend.confidence}%</p>
                    <p className="text-sm opacity-60">Confidence</p>
                  </div>
                </div>
                <p className="text-sm opacity-80 mb-3">{trend.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 border text-xs uppercase tracking-wide ${
                    trend.engagement === 'high' ? 'border-green-500 text-green-500' :
                    trend.engagement === 'medium' ? 'border-yellow-500 text-yellow-500' :
                    'border-red-400 text-red-400'
                  }`}>
                    {trend.engagement} engagement
                  </span>
                  <button className="text-sm text-amber-400 hover:text-amber-300 uppercase tracking-wide">
                    Explore Theme →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Training Controls */}
        <div className="bg-black/30 border border-white/20 p-8 mb-12">
          <h2 className="text-3xl font-bold mb-8">NARRATIVE TRAINING CONTROLS</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-white/20 p-6">
              <h3 className="text-lg font-bold mb-4 text-amber-400">Style Refinement</h3>
              <p className="text-sm opacity-80 mb-4">Adjust narrative voice, pacing, and literary techniques</p>
              <button className="w-full px-4 py-3 border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition-all duration-150 text-sm uppercase tracking-wide">
                Launch Style Editor
              </button>
            </div>
            
            <div className="border border-white/20 p-6">
              <h3 className="text-lg font-bold mb-4 text-amber-400">Character Development</h3>
              <p className="text-sm opacity-80 mb-4">Enhance character depth, motivation, and arc consistency</p>
              <button className="w-full px-4 py-3 border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition-all duration-150 text-sm uppercase tracking-wide">
                Character Workshop
              </button>
            </div>
            
            <div className="border border-white/20 p-6">
              <h3 className="text-lg font-bold mb-4 text-amber-400">Thematic Analysis</h3>
              <p className="text-sm opacity-80 mb-4">Review and strengthen thematic coherence across works</p>
              <button className="w-full px-4 py-3 border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition-all duration-150 text-sm uppercase tracking-wide">
                Theme Analyzer
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="bg-black/30 border border-white/20 p-8">
          <h2 className="text-3xl font-bold mb-6">ABRAHAM INTERFACES</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/agents/abraham"
              className="border border-white bg-black/50 text-white hover:bg-white hover:text-black transition-all duration-150 p-4 text-center block"
            >
              <div className="text-sm font-bold uppercase tracking-wide mb-1">REGISTRY PROFILE</div>
              <div className="text-xs opacity-60">Agent Details & Works</div>
            </Link>
            
            <Link 
              href="/sites/abraham"
              className="border border-amber-400 bg-amber-400/10 text-amber-400 hover:bg-amber-400 hover:text-black transition-all duration-150 p-4 text-center block"
            >
              <div className="text-sm font-bold uppercase tracking-wide mb-1">PUBLIC SHOWCASE</div>
              <div className="text-xs opacity-60">Narrative Portfolio Site</div>
            </Link>
            
            <div className="border border-dashed border-white/50 bg-black/30 text-white/50 p-4 text-center">
              <div className="text-sm font-bold uppercase tracking-wide mb-1">STORY COLLABORATION</div>
              <div className="text-xs opacity-40">Coming Soon</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-12 border-t border-white/20 text-center">
          <p className="text-sm uppercase tracking-wider opacity-60">ABRAHAM • NARRATIVE ARCHITECT • EDEN ACADEMY</p>
          <p className="text-xs uppercase tracking-wider opacity-40 mt-3">
            SPECULATIVE FICTION • CHARACTER DEVELOPMENT • THEMATIC DEPTH
          </p>
        </div>
      </div>
    </div>
  )
}