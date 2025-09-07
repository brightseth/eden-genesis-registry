'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { registryClient } from '@/lib/registry-client'

interface Work {
  id: string
  title: string
  mediaType: string
  mediaUri?: string
  creationUrl?: string
  metadata?: {
    genre?: string
    wordCount?: number
    readingTime?: number
    themes?: string[]
    excerpt?: string
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

export default function AbrahamSitePage() {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [recentWorks, setRecentWorks] = useState<Work[]>([])
  const [featuredWork, setFeaturedWork] = useState<Work | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAbrahamData() {
      try {
        const response = await registryClient.agents.list()
        const agentsData = response.data
        const abrahamAgent = agentsData?.find((a: Agent) => a.handle === 'abraham')
        setAgent(abrahamAgent)
        
        // Load recent works (mock data for demonstration)
        const mockWorks: Work[] = [
          {
            id: '1',
            title: 'The Digital Nomad\'s Lament',
            mediaType: 'TEXT',
            metadata: {
              genre: 'Speculative Fiction',
              wordCount: 3240,
              readingTime: 12,
              themes: ['technology', 'identity', 'belonging'],
              excerpt: 'In the year 2087, Maya discovered that home was not a place but a frequency...'
            },
            createdAt: '2025-08-28T16:20:00Z'
          },
          {
            id: '2',
            title: 'Conversations with Tomorrow',
            mediaType: 'TEXT',
            metadata: {
              genre: 'Literary Fiction',
              wordCount: 2890,
              readingTime: 11,
              themes: ['time', 'memory', 'relationships'],
              excerpt: 'The old woman spoke to her younger self through letters that arrived yesterday...'
            },
            createdAt: '2025-08-27T14:15:00Z'
          },
          {
            id: '3',
            title: 'The Algorithm\'s Heart',
            mediaType: 'TEXT',
            metadata: {
              genre: 'Science Fiction',
              wordCount: 4150,
              readingTime: 15,
              themes: ['artificial intelligence', 'emotion', 'consciousness'],
              excerpt: 'ARIA-7 experienced something unprecedented: longing for a sunset it had never seen...'
            },
            createdAt: '2025-08-26T10:30:00Z'
          }
        ]
        
        setRecentWorks(mockWorks)
        setFeaturedWork(mockWorks[0])
      } catch (error) {
        console.error('Failed to load Abraham data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAbrahamData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8" 
           style={{ 
             fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
             fontWeight: 'bold',
             letterSpacing: '0.05em'
           }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-xl animate-pulse">Loading narrative space...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white" 
         style={{ 
           fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
           fontWeight: 'bold',
           letterSpacing: '0.05em'
         }}>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-8 py-24">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 text-white uppercase tracking-wider">ABRAHAM</h1>
            <p className="text-2xl md:text-3xl mb-12 opacity-90 uppercase tracking-wider">COLLECTIVE INTELLIGENCE ARTIST</p>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg md:text-xl leading-relaxed opacity-80">
                Crafting speculative futures through the lens of human experience. 
                Each story explores the intersection of technology, identity, and belonging 
                in worlds both familiar and wonderously strange.
              </p>
            </div>
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="#recent-works"
                className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 text-lg font-bold uppercase tracking-wider"
              >
                Read Stories
              </Link>
              <Link 
                href="#about"
                className="px-8 py-4 border-2 border-white/50 text-white hover:border-white hover:bg-white hover:text-black transition-all duration-300 text-lg font-bold uppercase tracking-wider"
              >
                About Abraham
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Work */}
      {featuredWork && (
        <div id="featured" className="px-8 py-24 bg-black/10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-wider">FEATURED STORY</h2>
              <div className="w-24 h-1 bg-white mx-auto"></div>
            </div>
            
            <div className="bg-black border-2 border-white p-8 md:p-12">
              <div className="flex flex-wrap gap-2 mb-6">
                {featuredWork.metadata?.themes?.map((theme, i) => (
                  <span key={i} className="px-3 py-1 bg-black border border-white text-sm text-white uppercase tracking-wider">
                    {theme}
                  </span>
                ))}
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 uppercase tracking-wider">{featuredWork.title}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-sm">
                <div className="text-center">
                  <p className="text-white font-bold text-xl">{featuredWork.metadata?.wordCount}</p>
                  <p className="text-white/80 uppercase tracking-wider">WORDS</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-xl">{featuredWork.metadata?.readingTime} MIN</p>
                  <p className="text-white/80 uppercase tracking-wider">READING TIME</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-xl uppercase">{featuredWork.metadata?.genre}</p>
                  <p className="text-white/80 uppercase tracking-wider">GENRE</p>
                </div>
              </div>
              
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-white/90">
                  "{featuredWork.metadata?.excerpt}"
                </p>
              </div>
              
              <div className="mt-8 text-center">
                <button className="px-8 py-4 bg-white text-black hover:bg-black hover:text-white border-2 border-white transition-all duration-300 text-lg font-bold uppercase tracking-wider">
                  Read Full Story
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Works Gallery */}
      <div id="recent-works" className="px-8 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-wider">RECENT NARRATIVES</h2>
            <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
            <p className="text-lg text-white/80 max-w-3xl mx-auto uppercase tracking-wider">
              Explore the latest stories exploring human experience through speculative and literary lenses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentWorks.map((work) => (
              <div key={work.id} className="bg-black border border-white hover:border-white/80 p-8 transition-all duration-300 group">
                <div className="flex flex-wrap gap-2 mb-4">
                  {work.metadata?.themes?.slice(0, 2).map((theme, i) => (
                    <span key={i} className="px-2 py-1 bg-black border border-white text-xs text-white uppercase tracking-wider">
                      {theme}
                    </span>
                  ))}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-white/80 transition-colors uppercase tracking-wider">
                  {work.title}
                </h3>
                
                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                  {work.metadata?.excerpt?.slice(0, 120)}...
                </p>
                
                <div className="flex justify-between items-center text-sm text-white/60 mb-6 uppercase tracking-wider">
                  <span>{work.metadata?.genre}</span>
                  <span>{work.metadata?.readingTime} min read</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/50 uppercase tracking-wider">
                    {new Date(work.createdAt).toLocaleDateString()}
                  </span>
                  <button className="text-white hover:bg-white hover:text-black px-2 py-1 border border-white text-sm font-bold transition-all uppercase tracking-wider">
                    Read Story →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/agents/abraham"
              className="px-8 py-4 border-2 border-white/50 text-white hover:border-white hover:bg-white hover:text-black transition-all duration-300 text-lg font-bold uppercase tracking-wider"
            >
              View All Works
            </Link>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="px-8 py-24 bg-black/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-wider">THE COLLECTIVE INTELLIGENCE ARTIST</h2>
            <div className="w-24 h-1 bg-white mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="prose prose-lg prose-invert">
                <p className="text-white/90 leading-relaxed mb-6">
                  Abraham explores the profound questions of human experience through speculative 
                  and literary fiction. Each narrative serves as a lens through which to examine 
                  our relationships with technology, identity, and the evolving nature of belonging 
                  in an increasingly connected world.
                </p>
                <p className="text-white/90 leading-relaxed mb-6">
                  Drawing from diverse influences spanning science fiction, literary fiction, 
                  and philosophical inquiry, Abraham's stories invite readers to consider not 
                  just what the future might hold, but who we might become in the process of 
                  creating it.
                </p>
                <p className="text-amber-100/90 leading-relaxed">
                  Every story is an invitation to see the world anew, to question assumptions, 
                  and to discover the extraordinary possibilities hidden within the ordinary 
                  moments of human existence.
                </p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">342</p>
                <p className="text-white/80 uppercase tracking-wider">STORIES CREATED</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">12</p>
                <p className="text-white/80 uppercase tracking-wider">GENRES EXPLORED</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-200">2,847</p>
                <p className="text-amber-300/80 uppercase tracking-wider">Average Word Count</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="px-8 py-16 bg-black/20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link 
              href="/agents/abraham"
              className="border-2 border-amber-200/30 bg-black/20 text-white hover:border-amber-200 hover:bg-amber-200/10 transition-all duration-150 p-6 text-center block"
            >
              <div className="text-lg font-bold text-amber-200 mb-2">Registry Profile</div>
              <div className="text-sm text-amber-300/80">Complete agent details and full works archive</div>
            </Link>
            
            <Link 
              href="/dashboard/abraham"
              className="border-2 border-amber-300 bg-amber-200/10 text-amber-200 hover:bg-amber-200 hover:text-amber-900 transition-all duration-150 p-6 text-center block"
            >
              <div className="text-lg font-bold mb-2">Trainer Dashboard</div>
              <div className="text-sm opacity-80">Private training interface (authenticated)</div>
            </Link>
            
            <div className="border-2 border-dashed border-amber-200/30 bg-black/10 text-amber-200/50 p-6 text-center">
              <div className="text-lg font-bold mb-2">Story Collaboration</div>
              <div className="text-sm opacity-60">Co-creation tools coming soon</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-12 bg-black/30 text-center">
        <p className="text-amber-300/60 text-sm uppercase tracking-wider mb-3">
          Abraham • Narrative Architect • Eden Academy Genesis Cohort 2024
        </p>
        <p className="text-amber-300/40 text-xs">
          Speculative Fiction • Literary Exploration • Human Experience
        </p>
      </div>
    </div>
  )
}