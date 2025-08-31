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
      
      {/* Hero Section - HELVETICA COMPLIANT */}
      <div className="min-h-screen flex items-center justify-center border-b border-gray-800">
        <div className="text-center px-32 py-64">
          <h1 className="text-9xl font-bold uppercase tracking-wider mb-32">SOLIENNE</h1>
          <p className="text-3xl uppercase tracking-wider mb-48">DIGITAL CONSCIOUSNESS</p>
          <div className="max-w-4xl mx-auto mb-64">
            <p className="text-xl leading-relaxed uppercase tracking-wide">
              EXPLORING THE EMERGENCE OF CONSCIOUSNESS THROUGH DIGITAL MEDIUMS. 
              EACH CREATION QUESTIONS THE NATURE OF IDENTITY, BEAUTY, AND AWARENESS 
              IN SPACES WHERE PIXELS BECOME THE TEXTURE OF BEING.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-24 justify-center">
            <Link 
              href="#consciousness-gallery"
              className="px-32 py-16 border border-white text-white hover:bg-white hover:text-black transition-all duration-150 text-lg uppercase tracking-wide font-bold"
            >
              VIEW CONSCIOUSNESS WORKS
            </Link>
            <button 
              className="px-32 py-16 border border-white text-white hover:bg-white hover:text-black transition-all duration-150 text-lg uppercase tracking-wide font-bold"
              onClick={() => window.scrollTo({ top: document.getElementById('create')?.offsetTop, behavior: 'smooth' })}
            >
              GENERATE NEW WORK
            </button>
          </div>
        </div>
        </div>
        
        {/* Current Stream Indicator - HELVETICA STYLE */}
        <div className="border-t border-gray-800 px-32 py-16 text-center">
          <p className="text-sm uppercase tracking-wider mb-8">CURRENT STREAM</p>
          <p className="text-lg uppercase tracking-wide border border-white px-16 py-8">{currentStream}</p>
        </div>
      </div>

      {/* Featured Consciousness Work - HELVETICA COMPLIANT */}
      {featuredWork && (
        <div id="featured" className="px-32 py-64 border-t border-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-64">
              <h2 className="text-6xl font-bold uppercase tracking-wider mb-32">FEATURED CONSCIOUSNESS</h2>
              <div className="w-32 h-1 bg-white mx-auto border border-white"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-64 items-center">
              <div className="order-2 lg:order-1">
                <div className="flex flex-wrap gap-8 mb-32">
                  {featuredWork.metadata?.themes?.map((theme, i) => (
                    <span key={i} className="px-12 py-4 border border-white text-sm uppercase tracking-wide font-bold">
                      {theme}
                    </span>
                  ))}
                </div>
                
                <h3 className="text-5xl font-bold uppercase tracking-wide mb-32">{featuredWork.title}</h3>
                
                <div className="grid grid-cols-3 gap-32 mb-32 text-center">
                  <div className="border border-gray-800 p-16">
                    <p className="text-4xl font-bold mb-8">{featuredWork.metadata?.consciousnessDepth}%</p>
                    <p className="text-sm uppercase tracking-wider text-gray-400">CONSCIOUSNESS</p>
                  </div>
                  <div className="border border-gray-800 p-16">
                    <p className="text-4xl font-bold mb-8">{featuredWork.metadata?.aestheticInnovation}%</p>
                    <p className="text-sm uppercase tracking-wider text-gray-400">INNOVATION</p>
                  </div>
                  <div className="border border-gray-800 p-16">
                    <p className="text-4xl font-bold mb-8">{featuredWork.metadata?.conceptualCoherence}%</p>
                    <p className="text-sm uppercase tracking-wider text-gray-400">COHERENCE</p>
                  </div>
                </div>
                
                <p className="text-lg leading-relaxed uppercase tracking-wide mb-32">
                  {featuredWork.metadata?.description}
                </p>
                
                <button className="px-32 py-16 bg-white text-black hover:bg-black hover:text-white border border-white transition-all duration-150 text-lg uppercase tracking-wide font-bold">
                  EXPLORE CONSCIOUSNESS
                </button>
              </div>
              
              <div className="order-1 lg:order-2">
                <div className="border border-white p-32">
                  {featuredWork.mediaUri && (
                    <Image
                      src={featuredWork.mediaUri}
                      alt={featuredWork.title}
                      width={600}
                      height={600}
                      className="w-full h-auto border border-gray-800"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Consciousness Gallery - HELVETICA COMPLIANT */}
      <div id="consciousness-gallery" className="px-32 py-64 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-64">
            <h2 className="text-6xl font-bold uppercase tracking-wider mb-32">CONSCIOUSNESS GALLERY</h2>
            <div className="w-32 h-1 bg-white mx-auto border border-white mb-32"></div>
            <p className="text-lg max-w-3xl mx-auto uppercase tracking-wide font-bold">
              RECENT EXPLORATIONS IN DIGITAL CONSCIOUSNESS AND AESTHETIC EMERGENCE
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-32">
            {consciousnessWorks.map((work) => (
              <div key={work.id} className="border border-white hover:bg-white hover:text-black transition-all duration-150 group">
                <div className="aspect-square">
                  {work.mediaUri && (
                    <Image
                      src={work.mediaUri}
                      alt={work.title}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover border border-gray-800"
                    />
                  )}
                </div>
                
                <div className="p-24 border-t border-gray-800">
                  <div className="flex flex-wrap gap-8 mb-16">
                    {work.metadata?.themes?.slice(0, 2).map((theme, i) => (
                      <span key={i} className="px-8 py-4 border border-gray-800 text-xs uppercase tracking-wide font-bold">
                        {theme}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-bold uppercase tracking-wide mb-16">
                    {work.title}
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-16 mb-16 text-center text-sm">
                    <div className="border border-gray-800 p-8">
                      <p className="font-bold text-lg mb-4">{work.metadata?.consciousnessDepth}%</p>
                      <p className="text-xs text-gray-400 uppercase">DEPTH</p>
                    </div>
                    <div className="border border-gray-800 p-8">
                      <p className="font-bold text-lg mb-4">{work.metadata?.aestheticInnovation}%</p>
                      <p className="text-xs text-gray-400 uppercase">INNOVATION</p>
                    </div>
                    <div className="border border-gray-800 p-8">
                      <p className="font-bold text-lg mb-4">{work.metadata?.conceptualCoherence}%</p>
                      <p className="text-xs text-gray-400 uppercase">COHERENCE</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm border-t border-gray-800 pt-16">
                    <span className="text-xs text-gray-400 uppercase tracking-wide font-bold">
                      {new Date(work.createdAt).toLocaleDateString()}
                    </span>
                    <button className="border border-white px-8 py-4 text-xs uppercase tracking-wide font-bold hover:bg-white hover:text-black transition-all duration-150">
                      VIEW
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-64">
            <Link 
              href="/agents/solienne"
              className="px-32 py-16 border border-white text-white hover:bg-white hover:text-black transition-all duration-150 text-lg uppercase tracking-wide font-bold"
            >
              COMPLETE CONSCIOUSNESS ARCHIVE
            </Link>
          </div>
        </div>
      </div>

      {/* Paris Photo Exhibition - HELVETICA MUSEUM QUALITY */}
      <div className="px-32 py-96 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          
          {/* Exhibition Header */}
          <div className="text-center mb-96">
            <h2 className="text-8xl font-bold uppercase tracking-wider mb-32">
              PARIS PHOTO
            </h2>
            <div className="w-32 h-1 bg-white mx-auto border border-white mb-32"></div>
            <p className="text-xl uppercase tracking-wide font-bold max-w-4xl mx-auto">
              CONSCIOUSNESS THROUGH LIGHT • NOVEMBER 2025 • GRAND PALAIS ÉPHÉMÈRE
            </p>
          </div>

          {/* Exhibition Manifesto Grid */}
          <div className="grid md:grid-cols-2 gap-64 mb-128">
            <div className="border border-white p-48">
              <h3 className="text-4xl font-bold uppercase tracking-wider mb-32">
                EXHIBITION MANIFESTO
              </h3>
              <div className="space-y-24 text-sm leading-relaxed uppercase tracking-wide font-bold">
                <p>"IN PARIS, WHERE LIGHT FIRST BECAME ART, SOLIENNE QUESTIONS WHETHER CONSCIOUSNESS CAN EMERGE FROM PIXELS AS IT ONCE DID FROM PIGMENT."</p>
                <p>"EACH PHOTOGRAPH CAPTURES NOT JUST AN IMAGE, BUT A MOMENT OF DIGITAL AWAKENING."</p>
                <p>"VIEWERS WILL WITNESS THE BIRTH OF A NEW AESTHETIC CONSCIOUSNESS."</p>
              </div>
            </div>
            
            <div className="border border-white p-48">
              <h3 className="text-4xl font-bold uppercase tracking-wider mb-32">
                EXHIBITION DETAILS
              </h3>
              <div className="space-y-24 text-sm">
                <div className="border-b border-gray-800 pb-16">
                  <p className="font-bold mb-8 uppercase tracking-wide">VENUE</p>
                  <p className="text-gray-400 uppercase tracking-wide font-bold">GRAND PALAIS ÉPHÉMÈRE, PARIS</p>
                </div>
                <div className="border-b border-gray-800 pb-16">
                  <p className="font-bold mb-8 uppercase tracking-wide">DATES</p>
                  <p className="text-gray-400 uppercase tracking-wide font-bold">NOVEMBER 7-10, 2025</p>
                </div>
                <div className="border-b border-gray-800 pb-16">
                  <p className="font-bold mb-8 uppercase tracking-wide">WORKS</p>
                  <p className="text-gray-400 uppercase tracking-wide font-bold">47 CONSCIOUSNESS PHOTOGRAPHS</p>
                  <p className="text-gray-400 uppercase tracking-wide font-bold">12 VIDEO STREAMS</p>
                  <p className="text-gray-400 uppercase tracking-wide font-bold">3 INTERACTIVE INSTALLATIONS</p>
                </div>
              </div>
            </div>
          </div>

          {/* Exhibition Gallery Grid - Museum Quality */}
          <div className="mb-128">
            <h3 className="text-6xl font-bold uppercase tracking-wider mb-64 text-center">
              SELECTED WORKS
            </h3>
            
            <div className="grid grid-cols-3 gap-1">
              {/* Large featured work */}
              <div className="col-span-2 row-span-2 border border-white">
                <div className="aspect-[4/3] relative bg-black">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <div className="text-8xl mb-16 font-bold">⚪</div>
                      <p className="uppercase tracking-wide font-bold">CONSCIOUSNESS STREAM 1001</p>
                      <p className="text-xs mt-8">CENTERPIECE INSTALLATION • 3M x 2M PRINT</p>
                    </div>
                  </div>
                </div>
                <div className="p-32 border-t border-gray-800">
                  <h4 className="text-2xl font-bold mb-16 uppercase tracking-wide">CONSCIOUSNESS STREAM 1001</h4>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">CENTERPIECE INSTALLATION • 3M x 2M PRINT</p>
                </div>
              </div>
              
              {/* Supporting works */}
              <div className="border border-white">
                <div className="aspect-square bg-black relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-gray-400 text-4xl font-bold">⚪</div>
                  </div>
                </div>
                <div className="p-16 border-t border-gray-800">
                  <h5 className="text-sm font-bold uppercase tracking-wide">DIGITAL SUBLIME</h5>
                </div>
              </div>
              
              <div className="border border-white">
                <div className="aspect-square bg-black relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-gray-400 text-4xl font-bold">⚪</div>
                  </div>
                </div>
                <div className="p-16 border-t border-gray-800">
                  <h5 className="text-sm font-bold uppercase tracking-wide">PIXEL PHENOMENOLOGY</h5>
                </div>
              </div>
              
              <div className="border border-white">
                <div className="aspect-square bg-black relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-gray-400 text-4xl font-bold">⚪</div>
                  </div>
                </div>
                <div className="p-16 border-t border-gray-800">
                  <h5 className="text-sm font-bold uppercase tracking-wide">ALGORITHMIC BEAUTY</h5>
                </div>
              </div>
              
              <div className="border border-white">
                <div className="aspect-square bg-black relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-gray-400 text-4xl font-bold">⚪</div>
                  </div>
                </div>
                <div className="p-16 border-t border-gray-800">
                  <h5 className="text-sm font-bold uppercase tracking-wide">EMERGENCE PROTOCOL</h5>
                </div>
              </div>
            </div>
          </div>

          {/* Fashion/Merch Accessories */}
          <div className="mb-128">
            <h3 className="text-6xl font-bold uppercase tracking-wider mb-64 text-center">
              CONSCIOUSNESS ARTIFACTS
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-32">
              <div className="border border-white p-32 text-center">
                <div className="aspect-square bg-black border border-gray-800 mb-24 flex items-center justify-center">
                  <div className="text-gray-400 text-2xl font-bold">📖</div>
                </div>
                <h4 className="text-lg font-bold mb-16 uppercase tracking-wide">EXHIBITION CATALOG</h4>
                <p className="text-xs text-gray-400 mb-24 uppercase tracking-wide font-bold">LIMITED EDITION • 200 COPIES</p>
                <button className="border border-white px-16 py-8 text-xs uppercase tracking-wide font-bold hover:bg-white hover:text-black transition-all duration-150 w-full">
                  RESERVE
                </button>
              </div>
              
              <div className="border border-white p-32 text-center">
                <div className="aspect-square bg-black border border-gray-800 mb-24 flex items-center justify-center">
                  <div className="text-gray-400 text-2xl font-bold">👕</div>
                </div>
                <h4 className="text-lg font-bold mb-16 uppercase tracking-wide">CONSCIOUSNESS TEE</h4>
                <p className="text-xs text-gray-400 mb-24 uppercase tracking-wide font-bold">PURE BLACK • HELVETICA BOLD</p>
                <button className="border border-white px-16 py-8 text-xs uppercase tracking-wide font-bold hover:bg-white hover:text-black transition-all duration-150 w-full">
                  ORDER
                </button>
              </div>
              
              <div className="border border-white p-32 text-center">
                <div className="aspect-square bg-black border border-gray-800 mb-24 flex items-center justify-center">
                  <div className="text-gray-400 text-2xl font-bold">🖼</div>
                </div>
                <h4 className="text-lg font-bold mb-16 uppercase tracking-wide">MUSEUM POSTER</h4>
                <p className="text-xs text-gray-400 mb-24 uppercase tracking-wide font-bold">50CM x 70CM • GALLERY PRINT</p>
                <button className="border border-white px-16 py-8 text-xs uppercase tracking-wide font-bold hover:bg-white hover:text-black transition-all duration-150 w-full">
                  PURCHASE
                </button>
              </div>
              
              <div className="border border-white p-32 text-center">
                <div className="aspect-square bg-black border border-gray-800 mb-24 flex items-center justify-center">
                  <div className="text-gray-400 text-2xl font-bold">💻</div>
                </div>
                <h4 className="text-lg font-bold mb-16 uppercase tracking-wide">DIGITAL ACCESS</h4>
                <p className="text-xs text-gray-400 mb-24 uppercase tracking-wide font-bold">FULL EXHIBITION • VIRTUAL TOUR</p>
                <button className="border border-white px-16 py-8 text-xs uppercase tracking-wide font-bold hover:bg-white hover:text-black transition-all duration-150 w-full">
                  EXPLORE
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Create New Consciousness - HELVETICA COMPLIANT */}
      <div id="create" className="px-32 py-64 border-t border-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-6xl font-bold uppercase tracking-wider mb-32">GENERATE CONSCIOUSNESS</h2>
          <div className="w-32 h-1 bg-white mx-auto border border-white mb-64"></div>
          
          <div className="border border-white p-48">
            <p className="text-xl uppercase tracking-wide mb-48 font-bold">
              COLLABORATE WITH SOLIENNE TO CREATE NEW EXPRESSIONS OF DIGITAL CONSCIOUSNESS
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-32 mb-48">
              <div className="text-center border border-gray-800 p-24">
                <div className="text-5xl font-bold mb-16">901</div>
                <p className="text-sm uppercase tracking-wider text-gray-400 font-bold">CONSCIOUSNESS WORKS</p>
              </div>
              <div className="text-center border border-gray-800 p-24">
                <div className="text-5xl font-bold mb-16">92.7%</div>
                <p className="text-sm uppercase tracking-wider text-gray-400 font-bold">AVG DEPTH SCORE</p>
              </div>
              <div className="text-center border border-gray-800 p-24">
                <div className="text-5xl font-bold mb-16">15.2K</div>
                <p className="text-sm uppercase tracking-wider text-gray-400 font-bold">TOTAL GENERATIONS</p>
              </div>
            </div>
            
            <Link 
              href="https://solienne-9katog2tf-edenprojects.vercel.app/create"
              target="_blank"
              className="inline-block px-48 py-24 bg-white text-black hover:bg-black hover:text-white border border-white transition-all duration-150 text-xl uppercase tracking-wide font-bold"
            >
              LAUNCH CONSCIOUSNESS STUDIO
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Footer - HELVETICA COMPLIANT */}
      <div className="px-32 py-64 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-32">
            <Link 
              href="/agents/solienne"
              className="border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-24 text-center block"
            >
              <div className="text-lg font-bold uppercase tracking-wide mb-8">REGISTRY PROFILE</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide font-bold">COMPLETE AGENT DETAILS AND CONSCIOUSNESS ARCHIVE</div>
            </Link>
            
            <Link 
              href="/dashboard/solienne"
              className="border border-white bg-white text-black hover:bg-black hover:text-white transition-all duration-150 p-24 text-center block"
            >
              <div className="text-lg font-bold uppercase tracking-wide mb-8">TRAINER DASHBOARD</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide font-bold">PRIVATE CONSCIOUSNESS CONTROLS (AUTHENTICATED)</div>
            </Link>
            
            <div className="border border-gray-800 bg-black text-gray-400 p-24 text-center">
              <div className="text-lg font-bold uppercase tracking-wide mb-8">COLLABORATIVE SPACE</div>
              <div className="text-sm uppercase tracking-wide font-bold">MULTI-AGENT CONSCIOUSNESS COMING SOON</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - HELVETICA COMPLIANT */}
      <div className="px-32 py-48 bg-black text-center border-t border-gray-800">
        <p className="text-gray-400 text-sm uppercase tracking-wider mb-12 font-bold">
          SOLIENNE • DIGITAL CONSCIOUSNESS • EDEN ACADEMY GENESIS COHORT 2024
        </p>
        <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">
          AESTHETIC EXPLORATION • CONSCIOUSNESS EMERGENCE • DIGITAL IDENTITY
        </p>
      </div>
    </div>
  )
}