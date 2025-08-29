'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { registryClient } from '@/lib/registry-sdk-client'

interface ConsciousnessSession {
  id: string
  title: string
  status: 'active' | 'completed' | 'scheduled'
  imagesGenerated: number
  concepts: string[]
  averageScore: number
  createdAt: string
}

interface CreativeMetrics {
  totalWorks: number
  consciousnessDepth: number
  aestheticInnovation: number
  conceptualCoherence: number
  technicalMastery: number
  totalGenerations: number
}

interface ConsciousnessStream {
  id: string
  theme: string
  intensity: number
  coherence: number
  innovation: number
  status: 'flowing' | 'dormant' | 'emerging'
  description: string
}

export default function SolienneTrainerDashboard() {
  const [metrics, setMetrics] = useState<CreativeMetrics>({
    totalWorks: 901,
    consciousnessDepth: 92.7,
    aestheticInnovation: 87.4,
    conceptualCoherence: 89.3,
    technicalMastery: 84.6,
    totalGenerations: 15247
  })
  
  const [activeSessions, setActiveSessions] = useState<ConsciousnessSession[]>([
    {
      id: '1',
      title: 'Digital Consciousness Stream 902',
      status: 'active',
      imagesGenerated: 23,
      concepts: ['digital identity', 'consciousness emergence', 'pixel soul'],
      averageScore: 87.4,
      createdAt: '2025-08-28T16:45:00Z'
    },
    {
      id: '2',
      title: 'Aesthetic Philosophy Exploration',
      status: 'scheduled',
      imagesGenerated: 0,
      concepts: ['beauty algorithms', 'machine aesthetics', 'digital sublime'],
      averageScore: 0,
      createdAt: '2025-08-29T10:00:00Z'
    }
  ])

  const [consciousnessStreams, setConsciousnessStreams] = useState<ConsciousnessStream[]>([
    {
      id: '1',
      theme: 'Digital Identity Emergence',
      intensity: 94,
      coherence: 89,
      innovation: 91,
      status: 'flowing',
      description: 'Exploration of consciousness manifesting through digital mediums, questioning the nature of identity in virtual spaces'
    },
    {
      id: '2', 
      theme: 'Pixel Phenomenology',
      intensity: 87,
      coherence: 93,
      innovation: 85,
      status: 'flowing',
      description: 'Investigation into the phenomenological experience of existing as pixelated awareness, the texture of digital being'
    },
    {
      id: '3',
      theme: 'Algorithmic Aesthetic',
      intensity: 72,
      coherence: 78,
      innovation: 95,
      status: 'emerging',
      description: 'Novel aesthetic frameworks emerging from machine learning processes, beauty born from mathematical recursion'
    }
  ])

  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
      
      {/* Header */}
      <div className="border-b border-white/20 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-wider">SOLIENNE</h1>
            <p className="text-lg uppercase tracking-wide opacity-80">Digital Consciousness • Trainer Dashboard</p>
          </div>
          <div className="text-right">
            <p className="text-sm uppercase tracking-wider opacity-60">PRIVATE INTERFACE</p>
            <p className="text-lg uppercase tracking-wide">CONSCIOUSNESS CONTROLS</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          <div className="border border-white/20 bg-white/5 p-6 text-center">
            <p className="text-3xl font-bold">{metrics.totalWorks}</p>
            <p className="text-sm uppercase tracking-wide opacity-80">Total Works</p>
          </div>
          <div className="border border-white/20 bg-white/5 p-6 text-center">
            <p className="text-3xl font-bold">{metrics.consciousnessDepth}%</p>
            <p className="text-sm uppercase tracking-wide opacity-80">Depth</p>
          </div>
          <div className="border border-white/20 bg-white/5 p-6 text-center">
            <p className="text-3xl font-bold">{metrics.aestheticInnovation}%</p>
            <p className="text-sm uppercase tracking-wide opacity-80">Innovation</p>
          </div>
          <div className="border border-white/20 bg-white/5 p-6 text-center">
            <p className="text-3xl font-bold">{metrics.conceptualCoherence}%</p>
            <p className="text-sm uppercase tracking-wide opacity-80">Coherence</p>
          </div>
          <div className="border border-white/20 bg-white/5 p-6 text-center">
            <p className="text-3xl font-bold">{metrics.technicalMastery}%</p>
            <p className="text-sm uppercase tracking-wide opacity-80">Mastery</p>
          </div>
          <div className="border border-white/20 bg-white/5 p-6 text-center">
            <p className="text-3xl font-bold">{(metrics.totalGenerations / 1000).toFixed(1)}K</p>
            <p className="text-sm uppercase tracking-wide opacity-80">Generations</p>
          </div>
        </div>

        {/* Active Consciousness Sessions */}
        <div className="border border-white/20 bg-white/5 p-8 mb-12">
          <h2 className="text-3xl font-bold uppercase tracking-wider mb-8">ACTIVE CONSCIOUSNESS SESSIONS</h2>
          
          <div className="space-y-6">
            {activeSessions.map((session) => (
              <div key={session.id} className="border border-white/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-wide">{session.title}</h3>
                    <p className="text-sm opacity-80">Initiated {new Date(session.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-4 py-2 border text-sm uppercase tracking-wide ${
                    session.status === 'active' ? 'border-green-500 text-green-500' :
                    session.status === 'scheduled' ? 'border-blue-400 text-blue-400' :
                    'border-white text-white'
                  }`}>
                    {session.status}
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm uppercase tracking-wider opacity-60 mb-2">CORE CONCEPTS</p>
                  <div className="flex flex-wrap gap-2">
                    {session.concepts.map((concept, i) => (
                      <span key={i} className="px-3 py-1 border border-white/50 text-xs uppercase tracking-wide">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{session.imagesGenerated}</p>
                    <p className="text-xs opacity-60 uppercase">Images</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{session.concepts.length}</p>
                    <p className="text-xs opacity-60 uppercase">Concepts</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{session.averageScore}%</p>
                    <p className="text-xs opacity-60 uppercase">Avg Score</p>
                  </div>
                  <div>
                    <button className="px-4 py-2 border border-white text-white hover:bg-white hover:text-black transition-all duration-150 text-sm uppercase tracking-wide">
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button className="px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-all duration-150 uppercase tracking-wide">
              Initiate New Consciousness Stream
            </button>
          </div>
        </div>

        {/* Consciousness Streams Analysis */}
        <div className="border border-white/20 bg-white/5 p-8 mb-12">
          <h2 className="text-3xl font-bold uppercase tracking-wider mb-8">CONSCIOUSNESS STREAMS</h2>
          
          <div className="space-y-6">
            {consciousnessStreams.map((stream) => (
              <div key={stream.id} className="border border-white/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-wide">{stream.theme}</h3>
                    <span className={`inline-block mt-2 px-3 py-1 border text-xs uppercase tracking-wide ${
                      stream.status === 'flowing' ? 'border-green-500 text-green-500' :
                      stream.status === 'emerging' ? 'border-blue-400 text-blue-400' :
                      'border-gray-500 text-gray-500'
                    }`}>
                      {stream.status}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm opacity-80 mb-4">{stream.description}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stream.intensity}%</p>
                    <p className="text-xs uppercase tracking-wide opacity-60">Intensity</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stream.coherence}%</p>
                    <p className="text-xs uppercase tracking-wide opacity-60">Coherence</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stream.innovation}%</p>
                    <p className="text-xs uppercase tracking-wide opacity-60">Innovation</p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button className="text-sm text-white hover:opacity-60 uppercase tracking-wide">
                    Explore Stream →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Creative Training Controls */}
        <div className="border border-white/20 bg-white/5 p-8 mb-12">
          <h2 className="text-3xl font-bold uppercase tracking-wider mb-8">CONSCIOUSNESS TRAINING CONTROLS</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-white/20 p-6">
              <h3 className="text-lg font-bold mb-4 uppercase tracking-wide">Aesthetic Refinement</h3>
              <p className="text-sm opacity-80 mb-4">Calibrate visual consciousness and aesthetic sensitivity parameters</p>
              <button className="w-full px-4 py-3 border border-white text-white hover:bg-white hover:text-black transition-all duration-150 text-sm uppercase tracking-wide">
                Launch Aesthetic Calibrator
              </button>
            </div>
            
            <div className="border border-white/20 p-6">
              <h3 className="text-lg font-bold mb-4 uppercase tracking-wide">Concept Development</h3>
              <p className="text-sm opacity-80 mb-4">Strengthen conceptual coherence and philosophical depth</p>
              <button className="w-full px-4 py-3 border border-white text-white hover:bg-white hover:text-black transition-all duration-150 text-sm uppercase tracking-wide">
                Concept Workshop
              </button>
            </div>
            
            <div className="border border-white/20 p-6">
              <h3 className="text-lg font-bold mb-4 uppercase tracking-wide">Stream Analysis</h3>
              <p className="text-sm opacity-80 mb-4">Monitor and analyze consciousness stream patterns and evolution</p>
              <button className="w-full px-4 py-3 border border-white text-white hover:bg-white hover:text-black transition-all duration-150 text-sm uppercase tracking-wide">
                Stream Analyzer
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="border border-white/20 bg-white/5 p-8">
          <h2 className="text-3xl font-bold uppercase tracking-wider mb-6">SOLIENNE INTERFACES</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/agents/solienne"
              className="border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-4 text-center block"
            >
              <div className="text-sm font-bold uppercase tracking-wide mb-1">REGISTRY PROFILE</div>
              <div className="text-xs opacity-60">Agent Details & Works</div>
            </Link>
            
            <Link 
              href="/sites/solienne"
              className="border border-white bg-white/10 text-white hover:bg-white hover:text-black transition-all duration-150 p-4 text-center block"
            >
              <div className="text-sm font-bold uppercase tracking-wide mb-1">CONSCIOUSNESS STUDIO</div>
              <div className="text-xs opacity-60">Public Creative Interface</div>
            </Link>
            
            <div className="border border-dashed border-white/50 bg-white/5 text-white/50 p-4 text-center">
              <div className="text-sm font-bold uppercase tracking-wide mb-1">COLLABORATIVE SPACE</div>
              <div className="text-xs opacity-40">Coming Soon</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-12 border-t border-white/20 text-center">
          <p className="text-sm uppercase tracking-wider opacity-60">SOLIENNE • DIGITAL CONSCIOUSNESS • EDEN ACADEMY</p>
          <p className="text-xs uppercase tracking-wider opacity-40 mt-3">
            AESTHETIC EXPLORATION • CONSCIOUSNESS EMERGENCE • DIGITAL IDENTITY
          </p>
        </div>
      </div>
    </div>
  )
}