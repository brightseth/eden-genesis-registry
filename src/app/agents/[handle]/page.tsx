'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Agent {
  id: string
  handle: string
  displayName: string
  role: string
  status: string
  visibility: string
  cohort?: string
  profile?: {
    statement?: string
    manifesto?: string
    tags?: string[]
    links?: any
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
  metadata?: any
  features?: any
  status: string
  createdAt: string
}

export default function AgentDetailPage() {
  const params = useParams()
  const handle = params.handle as string
  const [agent, setAgent] = useState<Agent | null>(null)
  const [creations, setCreations] = useState<Creation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAgentData() {
      try {
        // Fetch agent details
        const agentsRes = await fetch('/api/v1/agents')
        const agentsData = await agentsRes.json()
        const foundAgent = agentsData.agents?.find((a: Agent) => a.handle === handle)
        
        if (!foundAgent) {
          setError('Agent not found')
          setLoading(false)
          return
        }
        
        setAgent(foundAgent)

        // Fetch agent creations
        try {
          const creationsRes = await fetch(`/api/v1/agents/${foundAgent.id}/creations`)
          if (creationsRes.ok) {
            const creationsData = await creationsRes.json()
            setCreations(creationsData.creations || [])
          }
        } catch (err) {
          console.log('Could not fetch creations')
        }

      } catch (err) {
        setError('Failed to load agent data')
      } finally {
        setLoading(false)
      }
    }

    fetchAgentData()
  }, [handle])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-xl uppercase tracking-wider animate-pulse">LOADING AGENT DATA...</p>
        </div>
      </div>
    )
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-black text-white p-8" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold uppercase tracking-wider mb-4">ERROR</h1>
          <p className="text-xl mb-8 opacity-80">{error || 'Agent not found'}</p>
          <Link href="/" className="text-white hover:opacity-70 underline uppercase tracking-wide">
            ← RETURN TO REGISTRY
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-white hover:opacity-70 uppercase tracking-wider text-sm mb-8 inline-block">
            ← EDEN GENESIS REGISTRY
          </Link>
        </div>

        {/* Agent Profile */}
        <div className="border border-white p-8 mb-12">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-5xl font-bold uppercase tracking-wider mb-4">{agent.displayName}</h1>
              <p className="text-xl uppercase tracking-wide opacity-80">@{agent.handle}</p>
            </div>
            <div className="text-right">
              <span className={`px-4 py-2 border uppercase tracking-wide ${
                agent.status === 'ACTIVE' ? 'border-white text-white' : 'border-white/50 text-white/50'
              }`}>
                {agent.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="text-sm uppercase tracking-wider opacity-60 mb-2">ROLE</p>
              <p className="text-lg uppercase tracking-wide">{agent.role}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wider opacity-60 mb-2">COHORT</p>
              <p className="text-lg uppercase tracking-wide">{agent.cohort || 'GENESIS'}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wider opacity-60 mb-2">VISIBILITY</p>
              <p className="text-lg uppercase tracking-wide">{agent.visibility}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wider opacity-60 mb-2">REGISTRY ID</p>
              <p className="text-xs opacity-80 break-all">{agent.id}</p>
            </div>
          </div>

          {agent.profile && (
            <>
              {agent.profile.statement && (
                <div className="mb-6">
                  <p className="text-sm uppercase tracking-wider opacity-60 mb-3">STATEMENT</p>
                  <p className="text-lg leading-relaxed">{agent.profile.statement}</p>
                </div>
              )}

              {agent.profile.tags && agent.profile.tags.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm uppercase tracking-wider opacity-60 mb-3">TAGS</p>
                  <div className="flex flex-wrap gap-3">
                    {agent.profile.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 border border-white/50 text-sm uppercase tracking-wide">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {agent.profile.links && (
                <div className="mb-6">
                  <p className="text-sm uppercase tracking-wider opacity-60 mb-3">LINKS</p>
                  {agent.profile.links.edenCollection && (
                    <a 
                      href={agent.profile.links.edenCollection}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:opacity-70 underline uppercase tracking-wide text-sm"
                    >
                      EDEN COLLECTION →
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Creations */}
        <div className="border border-white p-8">
          <h2 className="text-3xl font-bold uppercase tracking-wider mb-8">CREATIONS ({creations.length})</h2>
          
          {creations.length === 0 ? (
            <p className="text-lg opacity-60 uppercase tracking-wide">NO CREATIONS REGISTERED YET.</p>
          ) : (
            <div className="space-y-6">
              {creations.map((creation) => (
                <div key={creation.id} className="border border-white/20 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold uppercase tracking-wide mb-3">{creation.title}</h3>
                      {creation.metadata?.description && (
                        <p className="text-lg opacity-80 mb-4">{creation.metadata.description}</p>
                      )}
                      <div className="flex gap-6 text-xs uppercase tracking-wider opacity-60">
                        <span>TYPE: {creation.mediaType}</span>
                        <span>STATUS: {creation.status}</span>
                        <span>ID: {creation.id}</span>
                      </div>
                    </div>
                    {creation.creationUrl && (
                      <a
                        href={creation.creationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:opacity-70 uppercase tracking-wider text-sm ml-6"
                      >
                        VIEW →
                      </a>
                    )}
                  </div>
                  {creation.features?.tags && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {creation.features.tags.map((tag: string, i: number) => (
                        <span key={i} className="text-xs px-3 py-1 border border-white/30 uppercase tracking-wide">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-12 border-t border-white/20 text-center">
          <p className="text-sm uppercase tracking-wider opacity-60">EDEN GENESIS REGISTRY | SOVEREIGN SYSTEM OF RECORD</p>
          <p className="text-xs uppercase tracking-wider opacity-40 mt-3">
            CREATED: {new Date(agent.createdAt).toLocaleDateString()} | 
            UPDATED: {new Date(agent.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}