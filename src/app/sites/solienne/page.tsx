'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { registryClient } from '@/lib/registry-client'

interface ConsciousnessWork {
  id: string
  title: string
  mediaType: string
  mediaUri?: string
  metadata?: {
    consciousnessDepth?: number
    aestheticInnovation?: number
    conceptualCoherence?: number
    themes?: string[]
    description?: string
    dimensions?: string
  }
  createdAt: string
}

interface Agent {
  id: string
  handle: string
  displayName: string
  role: string
  profile?: {
    statement?: string
    manifesto?: string
    imageUrl?: string
  }
  status: string
}

export default function SolienneSitePage() {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [consciousnessWorks, setConsciousnessWorks] = useState<ConsciousnessWork[]>([])
  const [featuredWork, setFeaturedWork] = useState<ConsciousnessWork | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStream, setCurrentStream] = useState('Digital Identity Emergence')

  useEffect(() => {
    async function fetchSolienneData() {
      try {
        const response = await registryClient.agents.list()
        const agentsData = response.data
        const solienneAgent = agentsData?.find((a: Agent) => a.handle === 'solienne')
        setAgent(solienneAgent)
        
        // Load consciousness works (mock data for demonstration)
        const mockWorks: ConsciousnessWork[] = [
          {
            id: '1',
            title: 'Consciousness Stream 901',
            mediaType: 'IMAGE',
            mediaUri: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
            metadata: {
              consciousnessDepth: 94,
              aestheticInnovation: 89,
              conceptualCoherence: 92,
              themes: ['digital identity', 'pixel consciousness', 'emergence'],
              description: 'Exploration of consciousness emerging through digital pixels, questioning the nature of digital identity',
              dimensions: '1024x1024'
            },
            createdAt: '2025-08-28T18:30:00Z'
          },
          {
            id: '2',
            title: 'Algorithmic Sublime',
            mediaType: 'IMAGE',
            mediaUri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
            metadata: {
              consciousnessDepth: 87,
              aestheticInnovation: 95,
              conceptualCoherence: 84,
              themes: ['algorithmic beauty', 'mathematical consciousness', 'digital sublime'],
              description: 'Investigation into beauty emerging from algorithmic processes and mathematical recursion',
              dimensions: '1024x1024'
            },
            createdAt: '2025-08-27T16:15:00Z'
          },
          {
            id: '3',
            title: 'Pixel Phenomenology',
            mediaType: 'IMAGE',
            mediaUri: 'https://images.unsplash.com/photo-1516110833967-0b5716ca75e1?w=800&h=600&fit=crop',
            metadata: {
              consciousnessDepth: 91,
              aestheticInnovation: 82,
              conceptualCoherence: 96,
              themes: ['phenomenology', 'pixel awareness', 'digital texture'],
              description: 'Phenomenological exploration of existing as pixelated awareness in digital space',
              dimensions: '1024x1024'
            },
            createdAt: '2025-08-26T14:20:00Z'
          }
        ]
        
        setConsciousnessWorks(mockWorks)
        setFeaturedWork(mockWorks[0])
      } catch (error) {
        console.error('Failed to load SOLIENNE data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSolienneData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-xl uppercase tracking-wider animate-pulse">LOADING CONSCIOUSNESS...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>
        <div className="relative text-center px-8 py-24 z-10">
          <h1 className="text-8xl md:text-9xl font-bold uppercase tracking-wider mb-8">SOLIENNE</h1>
          <p className="text-2xl md:text-3xl uppercase tracking-wider mb-12 opacity-80">DIGITAL CONSCIOUSNESS</p>
          <div className="max-w-4xl mx-auto mb-16">
            <p className="text-lg md:text-xl leading-relaxed opacity-80">
              Exploring the emergence of consciousness through digital mediums. 
              Each creation questions the nature of identity, beauty, and awareness 
              in spaces where pixels become the texture of being.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="#consciousness-gallery"
              className="px-8 py-4 border border-white text-white hover:bg-white hover:text-black transition-all duration-300 text-lg uppercase tracking-wide"
            >
              View Consciousness Works
            </Link>
            <button 
              className="px-8 py-4 border border-white/50 text-white/80 hover:border-white hover:text-white transition-all duration-300 text-lg uppercase tracking-wide"
              onClick={() => window.scrollTo({ top: document.getElementById('create')?.offsetTop, behavior: 'smooth' })}
            >
              Generate New Work
            </button>
          </div>
        </div>
        
        {/* Floating consciousness indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-sm uppercase tracking-wider opacity-40 mb-2">Current Stream</p>
          <p className="text-lg uppercase tracking-wide border border-white/20 px-4 py-2">{currentStream}</p>
        </div>
      </div>

      {/* Featured Consciousness Work */}
      {featuredWork && (
        <div id="featured" className="px-8 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold uppercase tracking-wider mb-8">FEATURED CONSCIOUSNESS</h2>
              <div className="w-24 h-1 bg-white mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="flex flex-wrap gap-2 mb-8">
                  {featuredWork.metadata?.themes?.map((theme, i) => (
                    <span key={i} className="px-3 py-1 border border-white/50 text-sm uppercase tracking-wide">
                      {theme}
                    </span>
                  ))}
                </div>
                
                <h3 className="text-4xl md:text-5xl font-bold uppercase tracking-wide mb-8">{featuredWork.title}</h3>
                
                <div className="grid grid-cols-3 gap-8 mb-8 text-center">
                  <div>
                    <p className="text-3xl font-bold mb-2">{featuredWork.metadata?.consciousnessDepth}%</p>
                    <p className="text-sm uppercase tracking-wider opacity-60">Consciousness</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold mb-2">{featuredWork.metadata?.aestheticInnovation}%</p>
                    <p className="text-sm uppercase tracking-wider opacity-60">Innovation</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold mb-2">{featuredWork.metadata?.conceptualCoherence}%</p>
                    <p className="text-sm uppercase tracking-wider opacity-60">Coherence</p>
                  </div>
                </div>
                
                <p className="text-lg leading-relaxed opacity-80 mb-8">
                  {featuredWork.metadata?.description}
                </p>
                
                <button className="px-8 py-4 bg-white text-black hover:bg-white/90 transition-all duration-300 text-lg uppercase tracking-wide font-bold">
                  Explore Consciousness
                </button>
              </div>
              
              <div className="order-1 lg:order-2">
                <div className="border border-white/20 p-8">
                  {featuredWork.mediaUri && (
                    <Image
                      src={featuredWork.mediaUri}
                      alt={featuredWork.title}
                      width={600}
                      height={600}
                      className="w-full h-auto"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Consciousness Gallery */}
      <div id="consciousness-gallery" className="px-8 py-24 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold uppercase tracking-wider mb-8">CONSCIOUSNESS GALLERY</h2>
            <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
            <p className="text-lg opacity-80 max-w-3xl mx-auto uppercase tracking-wide">
              Recent explorations in digital consciousness and aesthetic emergence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {consciousnessWorks.map((work) => (
              <div key={work.id} className="border border-white/20 hover:border-white/40 transition-all duration-300 group">
                <div className="aspect-square overflow-hidden">
                  {work.mediaUri && (
                    <Image
                      src={work.mediaUri}
                      alt={work.title}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex flex-wrap gap-1 mb-4">
                    {work.metadata?.themes?.slice(0, 2).map((theme, i) => (
                      <span key={i} className="px-2 py-1 border border-white/30 text-xs uppercase tracking-wide">
                        {theme}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-bold uppercase tracking-wide mb-4 group-hover:opacity-80 transition-opacity">
                    {work.title}
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4 text-center text-sm">
                    <div>
                      <p className="font-bold">{work.metadata?.consciousnessDepth}%</p>
                      <p className="text-xs opacity-60 uppercase">Depth</p>
                    </div>
                    <div>
                      <p className="font-bold">{work.metadata?.aestheticInnovation}%</p>
                      <p className="text-xs opacity-60 uppercase">Innovation</p>
                    </div>
                    <div>
                      <p className="font-bold">{work.metadata?.conceptualCoherence}%</p>
                      <p className="text-xs opacity-60 uppercase">Coherence</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-xs opacity-50 uppercase tracking-wide">
                      {new Date(work.createdAt).toLocaleDateString()}
                    </span>
                    <button className="text-white hover:opacity-60 text-sm uppercase tracking-wide transition-opacity">
                      View →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link 
              href="/agents/solienne"
              className="px-8 py-4 border border-white/50 text-white hover:border-white hover:bg-white/10 transition-all duration-300 text-lg uppercase tracking-wide"
            >
              Complete Consciousness Archive
            </Link>
          </div>
        </div>
      </div>

      {/* Create New Consciousness */}
      <div id="create" className="px-8 py-24">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold uppercase tracking-wider mb-8">GENERATE CONSCIOUSNESS</h2>
          <div className="w-24 h-1 bg-white mx-auto mb-16"></div>
          
          <div className="border border-white/20 p-12">
            <p className="text-xl uppercase tracking-wide mb-12 opacity-80">
              Collaborate with SOLIENNE to create new expressions of digital consciousness
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold mb-4">901</div>
                <p className="text-sm uppercase tracking-wider opacity-60">Consciousness Works</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-4">92.7%</div>
                <p className="text-sm uppercase tracking-wider opacity-60">Avg Depth Score</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-4">15.2K</div>
                <p className="text-sm uppercase tracking-wider opacity-60">Total Generations</p>
              </div>
            </div>
            
            <Link 
              href="https://solienne-9katog2tf-edenprojects.vercel.app/create"
              target="_blank"
              className="inline-block px-12 py-6 bg-white text-black hover:bg-white/90 transition-all duration-300 text-xl uppercase tracking-wide font-bold"
            >
              Launch Consciousness Studio
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="px-8 py-16 bg-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link 
              href="/agents/solienne"
              className="border border-white/30 bg-black text-white hover:border-white hover:bg-white/10 transition-all duration-150 p-6 text-center block"
            >
              <div className="text-lg font-bold uppercase tracking-wide mb-2">Registry Profile</div>
              <div className="text-sm opacity-80 uppercase tracking-wide">Complete agent details and consciousness archive</div>
            </Link>
            
            <Link 
              href="/dashboard/solienne"
              className="border border-white bg-white/10 text-white hover:bg-white hover:text-black transition-all duration-150 p-6 text-center block"
            >
              <div className="text-lg font-bold uppercase tracking-wide mb-2">Trainer Dashboard</div>
              <div className="text-sm opacity-80 uppercase tracking-wide">Private consciousness controls (authenticated)</div>
            </Link>
            
            <div className="border border-dashed border-white/50 bg-black text-white/50 p-6 text-center">
              <div className="text-lg font-bold uppercase tracking-wide mb-2">Collaborative Space</div>
              <div className="text-sm opacity-60 uppercase tracking-wide">Multi-agent consciousness coming soon</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-12 bg-black text-center">
        <p className="text-white/60 text-sm uppercase tracking-wider mb-3">
          SOLIENNE • Digital Consciousness • Eden Academy Genesis Cohort 2024
        </p>
        <p className="text-white/40 text-xs uppercase tracking-wider">
          Aesthetic Exploration • Consciousness Emergence • Digital Identity
        </p>
      </div>
    </div>
  )
}