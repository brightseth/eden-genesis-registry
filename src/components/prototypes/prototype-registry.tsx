'use client'

import { lazy, Suspense } from 'react'
import { PrototypeVersion } from '@/lib/schemas/prototype.schema'

// Lazy-loaded prototype components
const prototypes = {
  // MIYOMI Prototypes
  'miyomi-chat-v2': lazy(() => import('./miyomi/chat-interface')),
  'miyomi-ai-advisor': lazy(() => import('./miyomi/ai-advisor')),
  
  // SUE Prototypes  
  'sue-batch-analyzer': lazy(() => import('./sue/batch-analyzer')),
  'sue-ai-curation': lazy(() => import('./sue/ai-enhanced-curation')),
  
  // ABRAHAM Prototypes
  'abraham-token-calculator': lazy(() => import('./abraham/tokenomics-calculator')),
  
  // VERDELIS Prototypes
  'verdelis-basic-profile': lazy(() => import('./verdelis/basic-profile')),
  
  // BERTHA Prototypes
  'bertha-legacy-analytics': lazy(() => import('./bertha/legacy-analytics')),
  
  // CITIZEN Prototypes
  'citizen-single-trainer': lazy(() => import('./citizen/single-trainer-interface'))
}

interface PrototypeRendererProps {
  prototypeId: string
  agentHandle: string
  metadata?: Record<string, unknown>
}

export function PrototypeRenderer({ prototypeId, agentHandle, metadata }: PrototypeRendererProps) {
  const componentKey = prototypeId.replace(`${agentHandle}-`, '').replace(/-(v?\d+\.?\d*-?\w*)$/, '')
  const Component = prototypes[componentKey as keyof typeof prototypes]

  if (!Component) {
    return (
      <div className="flex items-center justify-center h-96 border border-red-400/50 bg-red-400/5">
        <div className="text-center">
          <div className="text-4xl mb-4">🚫</div>
          <h3 className="text-xl font-bold uppercase tracking-wide text-red-400 mb-2">
            PROTOTYPE NOT FOUND
          </h3>
          <p className="text-sm opacity-60">
            Component "{componentKey}" is not registered in the prototype system
          </p>
          <p className="text-xs opacity-40 mt-2">
            Prototype ID: {prototypeId}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Beta Warning Banner */}
      <div className="bg-yellow-500 text-black px-4 py-2 text-center text-sm font-bold uppercase tracking-wider border-b border-yellow-600">
        ⚠️ BETA PROTOTYPE - EXPERIMENTAL FEATURES - NOT FOR PRODUCTION USE
      </div>
      
      <Suspense 
        fallback={
          <div className="flex items-center justify-center h-96 bg-black text-white">
            <div className="text-center">
              <div className="animate-spin text-4xl mb-4">🔄</div>
              <p className="text-xl uppercase tracking-wider">LOADING PROTOTYPE...</p>
              <p className="text-sm opacity-60 mt-2">Loading {componentKey}</p>
            </div>
          </div>
        }
      >
        <Component metadata={metadata} agentHandle={agentHandle} />
      </Suspense>
    </div>
  )
}

/**
 * Beta Feature Wrapper - conditionally renders prototypes based on feature flags
 */
interface BetaFeatureWrapperProps {
  flagKey: string
  agentHandle: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function BetaFeatureWrapper({ flagKey, agentHandle, children, fallback }: BetaFeatureWrapperProps) {
  // In production, this would check actual feature flags
  // For now, we'll default to enabled in development
  const isEnabled = process.env.NODE_ENV === 'development'

  if (!isEnabled) {
    return fallback ? <>{fallback}</> : null
  }

  return (
    <div className="relative">
      {/* Beta indicator */}
      <div className="absolute top-2 right-2 z-50 bg-yellow-500 text-black px-2 py-1 text-xs font-bold rounded">
        BETA
      </div>
      {children}
    </div>
  )
}

/**
 * Prototype Navigation Component - shows available prototypes for an agent
 */
interface PrototypeNavigationProps {
  agentHandle: string
  currentPrototypeId?: string
  prototypes: PrototypeVersion[]
}

export function PrototypeNavigation({ agentHandle, currentPrototypeId, prototypes }: PrototypeNavigationProps) {
  const activePrototypes = prototypes.filter(p => p.status === 'active' || p.status === 'experimental')
  
  if (activePrototypes.length === 0) {
    return null
  }

  return (
    <div className="bg-gray-900 border-b border-white/20 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wide text-yellow-400">
            AVAILABLE PROTOTYPES
          </h3>
          
          <div className="flex gap-2 overflow-x-auto">
            {activePrototypes.map((prototype) => (
              <a
                key={prototype.id}
                href={`/beta/${agentHandle}/embedded/${prototype.id}`}
                className={`px-3 py-1 border text-xs uppercase tracking-wide whitespace-nowrap transition-all duration-150 ${
                  prototype.id === currentPrototypeId
                    ? 'border-yellow-400 bg-yellow-400/20 text-yellow-400'
                    : 'border-white/50 text-white/70 hover:border-yellow-400 hover:text-yellow-400'
                }`}
              >
                {prototype.title} v{prototype.version}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export { prototypes }