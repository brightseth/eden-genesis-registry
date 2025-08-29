'use client'

import { useEffect, useState } from 'react'
import { betaPrototypeManager } from '@/lib/beta-prototype-manager'
import { betaFeatureFlags } from '@/lib/beta-feature-flags'
import { AgentPrototypeCollection, BetaFeatureFlag, PrototypeVersion } from '@/lib/schemas/prototype.schema'

const GENESIS_AGENTS = [
  'abraham', 'bertha', 'citizen', 'geppetto', 'koru', 
  'miyomi', 'nina', 'solienne', 'sue', 'verdelis'
]

export default function AdminBetaManagement() {
  const [agentCollections, setAgentCollections] = useState<Record<string, AgentPrototypeCollection>>({})
  const [allFlags, setAllFlags] = useState<Record<string, BetaFeatureFlag[]>>({})
  const [selectedAgent, setSelectedAgent] = useState<string>('miyomi')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    async function loadAllBetaData() {
      const collections: Record<string, AgentPrototypeCollection> = {}
      const flags: Record<string, BetaFeatureFlag[]> = {}

      for (const agent of GENESIS_AGENTS) {
        try {
          const [collection, agentFlags] = await Promise.all([
            betaPrototypeManager.getAgentPrototypes(agent),
            betaPrototypeManager.getBetaFeatureFlags(agent)
          ])
          collections[agent] = collection
          flags[agent] = agentFlags
        } catch (error) {
          console.error(`Failed to load data for ${agent}:`, error)
        }
      }

      setAgentCollections(collections)
      setAllFlags(flags)
      setLoading(false)
    }

    loadAllBetaData()
  }, [])

  const handleArchivePrototype = async (agentHandle: string, prototypeId: string) => {
    setActionLoading(`archive-${prototypeId}`)
    try {
      await betaPrototypeManager.archivePrototype(agentHandle, prototypeId, 'Admin manual archive')
      
      // Refresh data
      const updatedCollection = await betaPrototypeManager.getAgentPrototypes(agentHandle)
      setAgentCollections(prev => ({
        ...prev,
        [agentHandle]: updatedCollection
      }))
    } catch (error) {
      console.error('Failed to archive prototype:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleFlag = async (agentHandle: string, flagKey: string, enabled: boolean) => {
    setActionLoading(`flag-${flagKey}`)
    try {
      await betaFeatureFlags.toggleFlag(agentHandle, flagKey, enabled)
      
      // Refresh flags
      const updatedFlags = await betaPrototypeManager.getBetaFeatureFlags(agentHandle)
      setAllFlags(prev => ({
        ...prev,
        [agentHandle]: updatedFlags
      }))
    } catch (error) {
      console.error('Failed to toggle flag:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const getTotalStats = () => {
    let totalPrototypes = 0
    let totalExperiments = 0
    let totalArchived = 0
    
    Object.values(agentCollections).forEach(collection => {
      totalPrototypes += collection.prototypes.length
      totalExperiments += collection.experiments.length
      totalArchived += collection.archived.length
    })
    
    return { totalPrototypes, totalExperiments, totalArchived }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-xl uppercase tracking-wider animate-pulse">LOADING BETA MANAGEMENT...</p>
        </div>
      </div>
    )
  }

  const stats = getTotalStats()
  const selectedCollection = agentCollections[selectedAgent]
  const selectedFlags = allFlags[selectedAgent] || []

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      {/* Header */}
      <div className="border-b border-white/20 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold uppercase tracking-wider text-yellow-400 mb-2">
            BETA MANAGEMENT
          </h1>
          <p className="text-lg uppercase tracking-wide opacity-80">
            PROTOTYPE ARCHIVE & EXPERIMENTAL FEATURE CONTROL
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="border border-white p-6 text-center">
            <h3 className="text-3xl font-bold mb-2">{GENESIS_AGENTS.length}</h3>
            <p className="text-sm uppercase tracking-wider opacity-60">AGENTS WITH BETA</p>
          </div>
          <div className="border border-blue-400 p-6 text-center">
            <h3 className="text-3xl font-bold mb-2 text-blue-400">{stats.totalPrototypes}</h3>
            <p className="text-sm uppercase tracking-wider opacity-60">TOTAL PROTOTYPES</p>
          </div>
          <div className="border border-yellow-400 p-6 text-center">
            <h3 className="text-3xl font-bold mb-2 text-yellow-400">{stats.totalExperiments}</h3>
            <p className="text-sm uppercase tracking-wider opacity-60">ACTIVE EXPERIMENTS</p>
          </div>
          <div className="border border-gray-500 p-6 text-center">
            <h3 className="text-3xl font-bold mb-2 text-gray-400">{stats.totalArchived}</h3>
            <p className="text-sm uppercase tracking-wider opacity-60">ARCHIVED</p>
          </div>
        </div>

        {/* Agent Selection */}
        <div className="border border-white p-6 mb-8">
          <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">SELECT AGENT</h2>
          <div className="grid grid-cols-5 gap-3">
            {GENESIS_AGENTS.map((agent) => {
              const collection = agentCollections[agent]
              const hasContent = collection && (collection.totalPrototypes > 0 || allFlags[agent]?.length > 0)
              
              return (
                <button
                  key={agent}
                  onClick={() => setSelectedAgent(agent)}
                  className={`p-4 border text-center transition-all duration-150 uppercase tracking-wide text-sm ${
                    selectedAgent === agent
                      ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                      : hasContent 
                        ? 'border-white text-white hover:border-yellow-400 hover:text-yellow-400'
                        : 'border-gray-600 text-gray-600'
                  }`}
                >
                  <div className="font-bold mb-1">{agent}</div>
                  <div className="text-xs opacity-60">
                    {collection ? `${collection.totalPrototypes}P ${allFlags[agent]?.length || 0}F` : 'No data'}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected Agent Details */}
        {selectedCollection && (
          <>
            {/* Agent Beta Overview */}
            <div className="border border-white p-6 mb-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">
                {selectedAgent.toUpperCase()} BETA OVERVIEW
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">{selectedCollection.prototypes.length}</p>
                  <p className="text-xs uppercase tracking-wide opacity-60">PROTOTYPES</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-400">{selectedCollection.experiments.length}</p>
                  <p className="text-xs uppercase tracking-wide opacity-60">EXPERIMENTS</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-400">{selectedCollection.archived.length}</p>
                  <p className="text-xs uppercase tracking-wide opacity-60">ARCHIVED</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-400">{selectedFlags.length}</p>
                  <p className="text-xs uppercase tracking-wide opacity-60">FEATURE FLAGS</p>
                </div>
              </div>
            </div>

            {/* Feature Flags Management */}
            {selectedFlags.length > 0 && (
              <div className="border border-white p-6 mb-8">
                <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">FEATURE FLAGS</h2>
                <div className="space-y-3">
                  {selectedFlags.map((flag) => (
                    <div key={flag.key} className="border border-white/20 p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold uppercase tracking-wide">{flag.name}</h3>
                        <p className="text-sm opacity-80 mb-2">{flag.description}</p>
                        <div className="flex gap-4 text-xs uppercase tracking-wider opacity-60">
                          <span>ROLLOUT: {flag.rolloutPercentage}%</span>
                          <span>ENVS: {flag.enabledEnvironments.join(', ')}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 border text-xs uppercase tracking-wide ${
                          flag.enabled ? 'border-green-400 text-green-400' : 'border-gray-500 text-gray-500'
                        }`}>
                          {flag.enabled ? 'ENABLED' : 'DISABLED'}
                        </span>
                        
                        <button
                          onClick={() => handleToggleFlag(selectedAgent, flag.key, !flag.enabled)}
                          disabled={actionLoading === `flag-${flag.key}`}
                          className={`px-4 py-2 border font-bold text-sm uppercase tracking-wide transition-all duration-150 ${
                            flag.enabled
                              ? 'border-red-400 text-red-400 hover:bg-red-400 hover:text-black'
                              : 'border-green-400 text-green-400 hover:bg-green-400 hover:text-black'
                          } disabled:opacity-50`}
                        >
                          {actionLoading === `flag-${flag.key}` ? 'UPDATING...' : 
                           flag.enabled ? 'DISABLE' : 'ENABLE'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Prototypes */}
            {(selectedCollection.prototypes.length > 0 || selectedCollection.experiments.length > 0) && (
              <div className="border border-white p-6">
                <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">ACTIVE PROTOTYPES</h2>
                <div className="space-y-4">
                  {[...selectedCollection.prototypes, ...selectedCollection.experiments].map((prototype) => (
                    <div key={prototype.id} className="border border-white/20 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold uppercase tracking-wide">{prototype.title}</h3>
                          <p className="text-sm opacity-60 mb-2">v{prototype.version} • {prototype.type.toUpperCase()}</p>
                          <p className="text-lg opacity-80 mb-3">{prototype.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {prototype.features.map((feature, i) => (
                              <span key={i} className="text-xs px-2 py-1 border border-white/30 uppercase tracking-wide">
                                {feature}
                              </span>
                            ))}
                          </div>
                          
                          <div className="text-xs uppercase tracking-wider opacity-60">
                            CREATED: {new Date(prototype.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-3 ml-6">
                          <span className={`px-3 py-1 border text-xs uppercase tracking-wide ${
                            prototype.status === 'active' ? 'border-green-400 text-green-400' :
                            prototype.status === 'experimental' ? 'border-yellow-400 text-yellow-400' :
                            'border-gray-500 text-gray-500'
                          }`}>
                            {prototype.status}
                          </span>
                          
                          <div className="flex gap-2">
                            {prototype.url && (
                              <a
                                href={prototype.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-150 text-xs uppercase tracking-wide"
                              >
                                OPEN
                              </a>
                            )}
                            
                            <button
                              onClick={() => handleArchivePrototype(selectedAgent, prototype.id)}
                              disabled={actionLoading === `archive-${prototype.id}`}
                              className="px-3 py-1 border border-red-400 text-red-400 hover:bg-red-400 hover:text-black transition-all duration-150 text-xs uppercase tracking-wide disabled:opacity-50"
                            >
                              {actionLoading === `archive-${prototype.id}` ? 'ARCHIVING...' : 'ARCHIVE'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* No Beta Content State */}
        {!selectedCollection || (selectedCollection.totalPrototypes === 0 && selectedFlags.length === 0) && (
          <div className="border border-white/50 p-12 text-center">
            <div className="text-6xl mb-6 opacity-20">🧪</div>
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">NO BETA CONTENT</h2>
            <p className="text-lg opacity-60 mb-8">
              {selectedAgent.toUpperCase()} doesn't have any prototypes or feature flags registered yet.
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-16 pt-12 border-t border-white/20">
          <div className="flex justify-center gap-6">
            <button className="px-6 py-3 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all duration-150 uppercase tracking-wide text-sm">
              REGISTER NEW PROTOTYPE
            </button>
            <button className="px-6 py-3 border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-150 uppercase tracking-wide text-sm">
              CREATE FEATURE FLAG
            </button>
            <button className="px-6 py-3 border border-red-400 text-red-400 hover:bg-red-400 hover:text-black transition-all duration-150 uppercase tracking-wide text-sm">
              CLEANUP OLD PROTOTYPES
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}