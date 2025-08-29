'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PrototypeVersion } from '@/lib/schemas/prototype.schema'

// Mock data for prototypes - in production this would come from API/database
const mockPrototypes: Record<string, PrototypeVersion[]> = {
  miyomi: [
    {
      id: 'miyomi-chat-v2',
      version: '2.0',
      title: 'AI Chat Interface',
      description: 'Early conversational interface for trading advice before dashboard approach',
      type: 'interface',
      status: 'archived',
      features: ['chat', 'trading-advice', 'market-sentiment'],
      createdAt: '2024-01-15T00:00:00Z',
      archivedAt: '2024-03-01T00:00:00Z',
      metadata: { reason: 'Users preferred quick visual data over conversation' }
    },
    {
      id: 'miyomi-ai-advisor',
      version: '1.5',
      title: 'AI Trading Advisor',
      description: 'Experimental AI-powered trading recommendation system',
      type: 'dashboard',
      status: 'experimental',
      features: ['ai-analysis', 'recommendations', 'risk-scoring'],
      createdAt: '2024-02-20T00:00:00Z',
      metadata: { computeRequirements: 'high', accuracy: '78%' }
    }
  ],
  sue: [
    {
      id: 'sue-batch-analyzer',
      version: '1.0',
      title: 'Batch Artwork Analyzer',
      description: 'Multi-artwork curatorial analysis tool for processing collections',
      type: 'component',
      status: 'experimental',
      features: ['batch-processing', 'curation-scoring', 'collection-analysis'],
      createdAt: '2024-01-10T00:00:00Z',
      metadata: { maxBatchSize: 50, avgProcessingTime: '2.3s' }
    }
  ],
  abraham: [
    {
      id: 'abraham-token-calculator',
      version: '0.9',
      title: 'Agent Tokenomics Calculator',
      description: 'Tool for calculating agent tokenization readiness and economic models',
      type: 'full-site',
      status: 'experimental',
      features: ['tokenomics', 'economic-modeling', 'readiness-assessment'],
      createdAt: '2024-02-01T00:00:00Z',
      metadata: { integrationStatus: 'awaiting-registry-tokenization' }
    }
  ],
  citizen: [
    {
      id: 'citizen-single-trainer',
      version: '1.0',
      title: 'Single Trainer Interface',
      description: 'Original single-trainer collaboration interface before multi-trainer system',
      type: 'dashboard',
      status: 'archived',
      features: ['single-user', 'training', 'session-management'],
      createdAt: '2023-12-15T00:00:00Z',
      archivedAt: '2024-02-15T00:00:00Z',
      metadata: { reason: 'Evolved to multi-trainer collaborative system' }
    }
  ],
  bertha: [
    {
      id: 'bertha-legacy-analytics',
      version: '1.2',
      title: 'Legacy Analytics Dashboard',
      description: 'Earlier version of analytics with different visualization approach',
      type: 'dashboard',
      status: 'archived',
      features: ['basic-analytics', 'simple-charts', 'performance-tracking'],
      createdAt: '2023-11-20T00:00:00Z',
      archivedAt: '2024-01-30T00:00:00Z',
      metadata: { reason: 'Replaced with advanced ML-powered analytics' }
    }
  ],
  verdelis: [
    {
      id: 'verdelis-basic-profile',
      version: '1.0',
      title: 'Basic Environmental Profile',
      description: 'Simple environmental agent profile before specialization',
      type: 'interface',
      status: 'archived',
      features: ['basic-profile', 'environmental-tags'],
      createdAt: '2024-01-05T00:00:00Z',
      archivedAt: '2024-02-10T00:00:00Z',
      metadata: { reason: 'Enhanced with advanced sustainability tracking' }
    }
  ]
}

export default function AgentBetaPage() {
  const params = useParams()
  const agent = params.agent as string
  const [prototypes, setPrototypes] = useState<PrototypeVersion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In production, fetch from API
    const agentPrototypes = mockPrototypes[agent] || []
    setPrototypes(agentPrototypes)
    setLoading(false)
  }, [agent])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🔄</div>
          <p className="text-xl uppercase tracking-wider">LOADING BETA LAB...</p>
        </div>
      </div>
    )
  }

  const activeExperiments = prototypes.filter(p => p.status === 'experimental')
  const archivedPrototypes = prototypes.filter(p => p.status === 'archived')
  const deprecatedPrototypes = prototypes.filter(p => p.status === 'deprecated')

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">
                {agent.toUpperCase()} BETA LAB
              </h1>
              <p className="text-white/70">
                Experimental features, historical prototypes, and development artifacts
              </p>
            </div>
            <Link
              href={`/agents/${agent}`}
              className="px-4 py-2 border border-white/50 text-white/70 hover:border-white hover:text-white transition-all duration-150 uppercase tracking-wide text-sm"
            >
              ← Back to Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Warning Banner */}
        <div className="bg-yellow-500 text-black p-4 mb-8 border border-yellow-600">
          <div className="flex items-center gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <h3 className="font-bold uppercase tracking-wide">EXPERIMENTAL ZONE</h3>
              <p className="text-sm">
                These features are experimental, historical, or deprecated. Use for reference and testing only.
              </p>
            </div>
          </div>
        </div>

        {/* Active Experiments */}
        {activeExperiments.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 text-green-400">
              🧪 ACTIVE EXPERIMENTS ({activeExperiments.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeExperiments.map((prototype) => (
                <PrototypeCard key={prototype.id} prototype={prototype} agent={agent} />
              ))}
            </div>
          </section>
        )}

        {/* Historical Prototypes */}
        {archivedPrototypes.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 text-blue-400">
              📚 HISTORICAL PROTOTYPES ({archivedPrototypes.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archivedPrototypes.map((prototype) => (
                <PrototypeCard key={prototype.id} prototype={prototype} agent={agent} />
              ))}
            </div>
          </section>
        )}

        {/* Deprecated */}
        {deprecatedPrototypes.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 text-red-400">
              🗄️ DEPRECATED ({deprecatedPrototypes.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deprecatedPrototypes.map((prototype) => (
                <PrototypeCard key={prototype.id} prototype={prototype} agent={agent} />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {prototypes.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔬</div>
            <h3 className="text-2xl font-bold uppercase tracking-wider mb-4">NO PROTOTYPES YET</h3>
            <p className="text-white/70 max-w-md mx-auto">
              No experimental features or historical prototypes have been catalogued for {agent.toUpperCase()} yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

interface PrototypeCardProps {
  prototype: PrototypeVersion
  agent: string
}

function PrototypeCard({ prototype, agent }: PrototypeCardProps) {
  const statusColors = {
    experimental: 'border-green-400 bg-green-400/10',
    archived: 'border-blue-400 bg-blue-400/10',
    deprecated: 'border-red-400 bg-red-400/10',
    active: 'border-yellow-400 bg-yellow-400/10'
  }

  const statusIcons = {
    experimental: '🧪',
    archived: '📚',
    deprecated: '🗄️',
    active: '✨'
  }

  return (
    <div className={`border-2 ${statusColors[prototype.status]} p-6 relative`}>
      {/* Status Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span className="text-lg">{statusIcons[prototype.status]}</span>
        <span className="text-xs uppercase tracking-wide font-bold">
          {prototype.status}
        </span>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold uppercase tracking-wide mb-2">
          {prototype.title}
        </h3>
        <div className="text-sm text-white/60 mb-2">
          v{prototype.version} • {prototype.type}
        </div>
        <p className="text-sm text-white/80 leading-relaxed">
          {prototype.description}
        </p>
      </div>

      {/* Features */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {prototype.features.slice(0, 3).map((feature) => (
            <span
              key={feature}
              className="text-xs bg-white/10 px-2 py-1 uppercase tracking-wide"
            >
              {feature}
            </span>
          ))}
          {prototype.features.length > 3 && (
            <span className="text-xs text-white/60">
              +{prototype.features.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Metadata */}
      {prototype.metadata?.reason && (
        <div className="mb-4 text-xs text-white/60">
          <strong>Archived:</strong> {prototype.metadata.reason}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {prototype.component && (
          <Link
            href={`/beta/${agent}/embedded/${prototype.id}`}
            className="flex-1 bg-white text-black py-2 px-4 text-center text-sm font-bold uppercase tracking-wide hover:bg-white/90 transition-colors"
          >
            VIEW PROTOTYPE
          </Link>
        )}
        {prototype.url && (
          <a
            href={prototype.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 border border-white/50 text-white py-2 px-4 text-center text-sm font-bold uppercase tracking-wide hover:bg-white hover:text-black transition-colors"
          >
            EXTERNAL LINK
          </a>
        )}
        {!prototype.component && !prototype.url && (
          <div className="flex-1 bg-gray-600 text-white/70 py-2 px-4 text-center text-sm font-bold uppercase tracking-wide cursor-not-allowed">
            REFERENCE ONLY
          </div>
        )}
      </div>

      {/* Date */}
      <div className="text-xs text-white/40 mt-4">
        Created: {new Date(prototype.createdAt).toLocaleDateString()}
        {prototype.archivedAt && (
          <>
            {' • '}
            Archived: {new Date(prototype.archivedAt).toLocaleDateString()}
          </>
        )}
      </div>
    </div>
  )
}