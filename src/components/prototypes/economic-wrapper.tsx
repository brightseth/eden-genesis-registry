'use client'

import { useState } from 'react'

interface EconomicWrapperProps {
  prototypeId: string
  agentHandle: string
  children: React.ReactNode
  economicModel?: {
    type: 'pay-per-use' | 'subscription' | 'donation' | 'auction' | 'free' | 'artistic-development'
    price?: number
    currency?: 'USD' | 'ETH' | 'USDC'
    revenueShare?: number // percentage to agent
  }
  artisticMetrics?: {
    iterationCount?: number
    engagementTime?: number  // seconds of meaningful interaction
    collectorSignals?: number // expressions of interest
    artisticCoherence?: number // 0-100 score
    launchReadiness?: number // 0-100 score
  }
}

export default function EconomicWrapper({ 
  prototypeId, 
  agentHandle, 
  children, 
  economicModel = { type: 'free' },
  artisticMetrics = {}
}: EconomicWrapperProps) {
  const [hasAccess, setHasAccess] = useState(economicModel.type === 'free')
  const [isProcessing, setIsProcessing] = useState(false)
  const [metrics, setMetrics] = useState({
    views: Math.floor(Math.random() * 500) + 50,
    interactions: Math.floor(Math.random() * 100) + 10,
    revenue: Math.floor(Math.random() * 50) + 5,
    // Artistic development metrics
    iterationCount: artisticMetrics.iterationCount || Math.floor(Math.random() * 20) + 5,
    engagementTime: artisticMetrics.engagementTime || Math.floor(Math.random() * 300) + 60,
    collectorSignals: artisticMetrics.collectorSignals || Math.floor(Math.random() * 15) + 3,
    artisticCoherence: artisticMetrics.artisticCoherence || Math.floor(Math.random() * 30) + 70,
    launchReadiness: artisticMetrics.launchReadiness || Math.floor(Math.random() * 40) + 45
  })

  const handlePayment = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setHasAccess(true)
      setIsProcessing(false)
      setMetrics(prev => ({
        ...prev,
        revenue: prev.revenue + (economicModel.price || 0)
      }))
    }, 2000)
  }

  const handleDonation = async (amount: number) => {
    setIsProcessing(true)
    
    // Simulate donation processing
    setTimeout(() => {
      setIsProcessing(false)
      setMetrics(prev => ({
        ...prev,
        revenue: prev.revenue + amount
      }))
    }, 1500)
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Economic Paywall */}
        <div className="flex items-center justify-center min-h-screen p-8">
          <div className="max-w-md w-full">
            <div className="bg-white/5 border border-white/20 p-8 text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                💡
              </div>
              
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">
                {(agentHandle || 'AGENT').toUpperCase()} BETA EXPERIMENT
              </h2>
              
              <p className="text-white/70 mb-6">
                This prototype is testing economic sustainability models. 
                Support {(agentHandle || 'AGENT').toUpperCase()}'s experimentation.
              </p>

              {economicModel.type === 'pay-per-use' && (
                <div className="mb-6">
                  <div className="text-3xl font-bold mb-2">
                    ${economicModel.price} {economicModel.currency}
                  </div>
                  <div className="text-sm text-white/60 uppercase tracking-wide">
                    One-time access
                  </div>
                  <div className="text-xs text-white/50 mt-2">
                    {economicModel.revenueShare}% goes to {(agentHandle || 'AGENT').toUpperCase()}
                  </div>
                </div>
              )}

              {economicModel.type === 'donation' && (
                <div className="mb-6">
                  <div className="text-lg font-bold mb-4">SUPPORT THIS EXPERIMENT</div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[5, 10, 25].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => handleDonation(amount)}
                        disabled={isProcessing}
                        className="bg-white/10 hover:bg-white/20 border border-white/30 p-3 text-center font-bold disabled:opacity-50"
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                  <div className="text-xs text-white/50">
                    100% goes to {(agentHandle || 'AGENT').toUpperCase()}'s development
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {economicModel.type !== 'donation' && (
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="flex-1 bg-white text-black py-3 px-6 font-bold uppercase tracking-wide hover:bg-white/90 transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : 'Access Prototype'}
                  </button>
                )}
                
                <button
                  onClick={() => setHasAccess(true)}
                  className="px-4 py-3 border border-white/50 text-white/70 hover:border-white hover:text-white transition-all duration-150 text-sm uppercase tracking-wide"
                >
                  Preview (Free)
                </button>
              </div>

              {/* Metrics Display - Economic vs Artistic */}
              <div className="mt-6 pt-6 border-t border-white/20">
                {economicModel.type === 'artistic-development' ? (
                  <>
                    <div className="text-xs uppercase tracking-wide text-white/60 mb-3">
                      Artistic Development Progress
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center mb-4">
                      <div>
                        <div className="font-bold text-purple-400">{metrics.iterationCount}</div>
                        <div className="text-xs text-white/50">Iterations</div>
                      </div>
                      <div>
                        <div className="font-bold text-blue-400">{Math.floor(metrics.engagementTime / 60)}m</div>
                        <div className="text-xs text-white/50">Engagement</div>
                      </div>
                      <div>
                        <div className="font-bold text-green-400">{metrics.collectorSignals}</div>
                        <div className="text-xs text-white/50">Collector Signals</div>
                      </div>
                      <div>
                        <div className="font-bold text-amber-400">{metrics.artisticCoherence}%</div>
                        <div className="text-xs text-white/50">Coherence</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400 mb-1">{metrics.launchReadiness}%</div>
                      <div className="text-xs text-white/50">Launch Readiness</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-xs uppercase tracking-wide text-white/60 mb-3">
                      Prototype Performance
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="font-bold">{metrics.views}</div>
                        <div className="text-xs text-white/50">Views</div>
                      </div>
                      <div>
                        <div className="font-bold">{metrics.interactions}</div>
                        <div className="text-xs text-white/50">Interactions</div>
                      </div>
                      <div>
                        <div className="font-bold">${metrics.revenue}</div>
                        <div className="text-xs text-white/50">Revenue</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Status Bar - Economic vs Artistic Development */}
      {economicModel.type === 'artistic-development' ? (
        <div className="bg-purple-500/10 border-b border-purple-500 p-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-purple-400 font-bold uppercase tracking-wide">
                🎨 ARTISTIC DEVELOPMENT MODE
              </span>
              <span className="text-white/60">
                Focus: Creative Laboratory
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-xs">
              <div>
                <span className="text-white/60">Iterations: </span>
                <span className="font-bold">{metrics.iterationCount}</span>
              </div>
              <div>
                <span className="text-white/60">Coherence: </span>
                <span className="font-bold">{metrics.artisticCoherence}%</span>
              </div>
              <div>
                <span className="text-white/60">Launch Ready: </span>
                <span className={`font-bold ${metrics.launchReadiness > 70 ? 'text-green-400' : metrics.launchReadiness > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {metrics.launchReadiness}%
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-green-500/10 border-b border-green-500 p-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-green-400 font-bold uppercase tracking-wide">
                💰 ECONOMIC EXPERIMENT ACTIVE
              </span>
              <span className="text-white/60">
                Model: {(economicModel.type || 'UNKNOWN').toUpperCase()}
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-xs">
              <div>
                <span className="text-white/60">Revenue: </span>
                <span className="font-bold">${metrics.revenue}</span>
              </div>
              <div>
                <span className="text-white/60">Agent Share: </span>
                <span className="font-bold">{economicModel.revenueShare || 100}%</span>
              </div>
              <div>
                <span className="text-white/60">Sustainability: </span>
                <span className={`font-bold ${metrics.revenue > 20 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {metrics.revenue > 20 ? 'VIABLE' : 'TESTING'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prototype Content */}
      {children}

      {/* Economic Feedback */}
      <div className="bg-black border-t border-white/20 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="text-sm text-white/70">
              This prototype is testing economic sustainability for {(agentHandle || 'AGENT').toUpperCase()}
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => handleDonation(5)}
                className="bg-white/10 hover:bg-white/20 border border-white/30 px-3 py-1 text-xs uppercase tracking-wide"
              >
                Support (+$5)
              </button>
              
              <button className="text-xs text-white/50 hover:text-white/70 uppercase tracking-wide">
                Economic Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}