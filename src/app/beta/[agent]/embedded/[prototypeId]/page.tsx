'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { PrototypeRenderer, PrototypeNavigation } from '@/components/prototypes/prototype-registry'
import { PrototypeVersion } from '@/lib/schemas/prototype.schema'

// Same mock data as the main beta page
const mockPrototypes: Record<string, PrototypeVersion[]> = {
  miyomi: [
    {
      id: 'miyomi-chat-v2',
      version: '2.0',
      title: 'AI Chat Interface',
      description: 'Early conversational interface for trading advice before dashboard approach',
      type: 'interface',
      status: 'archived',
      component: 'miyomi-chat-interface',
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
      component: 'miyomi-ai-advisor',
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
      component: 'sue-batch-analyzer',
      features: ['batch-processing', 'curation-scoring', 'collection-analysis'],
      createdAt: '2024-01-10T00:00:00Z',
      metadata: { maxBatchSize: 50, avgProcessingTime: '2.3s' }
    }
  ]
}

export default function EmbeddedPrototypePage() {
  const params = useParams()
  const agent = params.agent as string
  const prototypeId = params.prototypeId as string

  const agentPrototypes = mockPrototypes[agent] || []
  const currentPrototype = agentPrototypes.find(p => p.id === prototypeId)

  if (!currentPrototype) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold uppercase tracking-wider mb-4">PROTOTYPE NOT FOUND</h1>
          <p className="text-white/70 mb-6">
            The prototype "{prototypeId}" was not found for agent {agent.toUpperCase()}.
          </p>
          <Link
            href={`/beta/${agent}`}
            className="px-6 py-3 bg-white text-black font-bold uppercase tracking-wide hover:bg-white/90 transition-colors"
          >
            ← Back to Beta Lab
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-2xl font-bold uppercase tracking-wider">
                  {currentPrototype.title}
                </h1>
                <span className="bg-yellow-500 text-black px-3 py-1 text-xs font-bold uppercase tracking-wide">
                  BETA v{currentPrototype.version}
                </span>
              </div>
              <p className="text-white/70 text-sm">
                {currentPrototype.description}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Link
                href={`/beta/${agent}`}
                className="px-4 py-2 border border-white/50 text-white/70 hover:border-white hover:text-white transition-all duration-150 uppercase tracking-wide text-sm"
              >
                ← Beta Lab
              </Link>
              <Link
                href={`/agents/${agent}`}
                className="px-4 py-2 bg-white text-black font-bold uppercase tracking-wide text-sm hover:bg-white/90 transition-colors"
              >
                Agent Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Prototype Navigation */}
      <PrototypeNavigation 
        agentHandle={agent}
        currentPrototypeId={prototypeId}
        prototypes={agentPrototypes}
      />

      {/* Prototype Content */}
      <div className="flex-1">
        {currentPrototype.component ? (
          <PrototypeRenderer 
            prototypeId={prototypeId}
            agentHandle={agent}
            metadata={currentPrototype.metadata}
          />
        ) : currentPrototype.url ? (
          <div className="h-screen">
            <div className="bg-blue-500 text-white p-4 text-center">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🔗</span>
                  <span className="font-bold uppercase tracking-wide">EXTERNAL PROTOTYPE</span>
                </div>
                <a
                  href={currentPrototype.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-black px-4 py-2 font-bold uppercase tracking-wide text-sm hover:bg-white/90 transition-colors"
                >
                  OPEN IN NEW TAB
                </a>
              </div>
            </div>
            <iframe
              src={currentPrototype.url}
              className="w-full h-full border-0"
              title={`${currentPrototype.title} - External Prototype`}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-2xl font-bold uppercase tracking-wider mb-4">REFERENCE ONLY</h3>
              <p className="text-white/70 max-w-md mx-auto mb-6">
                This prototype is preserved for reference purposes and doesn't have an interactive component.
              </p>
              
              {/* Prototype Details */}
              <div className="bg-white/10 p-6 text-left max-w-2xl mx-auto">
                <h4 className="font-bold uppercase tracking-wide mb-4">Prototype Details</h4>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <strong>Type:</strong> {currentPrototype.type}
                  </div>
                  <div>
                    <strong>Status:</strong> {currentPrototype.status}
                  </div>
                  <div>
                    <strong>Features:</strong> {currentPrototype.features.join(', ')}
                  </div>
                  {currentPrototype.metadata?.reason && (
                    <div>
                      <strong>Archive Reason:</strong> {currentPrototype.metadata.reason}
                    </div>
                  )}
                  <div>
                    <strong>Created:</strong> {new Date(currentPrototype.createdAt).toLocaleDateString()}
                  </div>
                  {currentPrototype.archivedAt && (
                    <div>
                      <strong>Archived:</strong> {new Date(currentPrototype.archivedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="border-t border-white/20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="text-white/60">
              {agent.toUpperCase()} • {currentPrototype.status.toUpperCase()} PROTOTYPE • v{currentPrototype.version}
            </div>
            <div className="text-white/40">
              Last updated: {new Date(currentPrototype.archivedAt || currentPrototype.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}