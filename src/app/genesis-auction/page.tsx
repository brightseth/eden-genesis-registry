'use client'

import { useState, useEffect } from 'react'
import { ABRAHAM_GENESIS_COLLECTION, GENESIS_AUCTION_CONFIG, COLLECTION_METRICS, type GenesisArtifact } from '@/data/abraham-genesis-artifacts'

export default function GenesisAuction() {
  const [selectedArtifact, setSelectedArtifact] = useState<GenesisArtifact>(ABRAHAM_GENESIS_COLLECTION[0])
  const [currentBid, setCurrentBid] = useState(GENESIS_AUCTION_CONFIG.startingBid)
  const [bidAmount, setBidAmount] = useState('')
  const [timeRemaining, setTimeRemaining] = useState('')
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    // Check if auction is live (after October 19, 2024)
    const launchDate = new Date(GENESIS_AUCTION_CONFIG.launchDate)
    const now = new Date()
    setIsLive(now >= launchDate)

    // Calculate time remaining (simplified - would use actual auction end time)
    const timer = setInterval(() => {
      const hoursLeft = Math.max(0, 168 - Math.floor((now.getTime() - launchDate.getTime()) / (1000 * 60 * 60)))
      const days = Math.floor(hoursLeft / 24)
      const hours = hoursLeft % 24
      setTimeRemaining(`${days}d ${hours}h`)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleBid = () => {
    const bid = parseFloat(bidAmount)
    if (bid > currentBid) {
      setCurrentBid(bid)
      setBidAmount('')
      // In production: submit bid to smart contract
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'flagship': return 'border-red-400 bg-red-400/10'
      case 'core': return 'border-yellow-400 bg-yellow-400/10'
      case 'supporting': return 'border-blue-400 bg-blue-400/10'
      default: return 'border-gray-400 bg-gray-400/10'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'flagship': return '🔥 FLAGSHIP'
      case 'core': return '⭐ CORE'
      case 'supporting': return '🔧 SUPPORTING'
      default: return priority.toUpperCase()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-5xl font-['Helvetica_Neue'] font-bold uppercase tracking-wider text-white mb-2">
              ABRAHAM GENESIS AUCTION
            </h1>
            <p className="text-xl text-white/70 mb-2">THE FIRST AI ECONOMIC SOVEREIGNTY EXPERIMENT</p>
            <p className="text-sm text-white/50">7 Foundational Artifacts • 13-Year Commitment • $2.1M Projected Revenue</p>
            
            {isLive ? (
              <div className="mt-4 bg-green-500/10 border border-green-500 p-3 inline-block">
                <span className="text-green-400 font-bold uppercase tracking-wide">🔴 LIVE AUCTION</span>
                <span className="text-white/70 ml-4">Time Remaining: {timeRemaining}</span>
              </div>
            ) : (
              <div className="mt-4 bg-yellow-500/10 border border-yellow-500 p-3 inline-block">
                <span className="text-yellow-400 font-bold uppercase tracking-wide">⏰ LAUNCHING OCTOBER 19</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Sidebar - Collection Overview */}
          <div className="space-y-6">
            <div className="bg-gray-900 border border-white/20 p-6">
              <h2 className="text-xl font-['Helvetica_Neue'] font-bold uppercase tracking-wider mb-4">
                GENESIS COLLECTION
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Total Pieces:</span>
                  <span className="font-bold">{COLLECTION_METRICS.totalPieces}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Estimated Value:</span>
                  <span className="font-bold">${COLLECTION_METRICS.totalEstimatedValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Flagship Target:</span>
                  <span className="font-bold text-red-400">${COLLECTION_METRICS.flagshipValue}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>ABRAHAM Share:</span>
                  <span className="font-bold text-green-400">{GENESIS_AUCTION_CONFIG.revenueShare.abraham}%</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-white/20 p-6">
              <h3 className="font-bold uppercase tracking-wide mb-4">ARTIFACT SELECTION</h3>
              <div className="space-y-2">
                {ABRAHAM_GENESIS_COLLECTION.map((artifact) => (
                  <button
                    key={artifact.id}
                    onClick={() => setSelectedArtifact(artifact)}
                    className={`w-full text-left p-3 border transition-all duration-200 ${
                      selectedArtifact.id === artifact.id 
                        ? getPriorityColor(artifact.priority) + ' ' + 'border-opacity-100'
                        : 'border-gray-600 hover:border-white/50'
                    }`}
                  >
                    <div className="font-bold text-sm uppercase tracking-wide mb-1">
                      {getPriorityLabel(artifact.priority)}
                    </div>
                    <div className="font-bold">{artifact.title}</div>
                    <div className="text-xs text-white/60 mt-1">Target: ${artifact.targetPrice}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center - Selected Artifact Display */}
          <div className="space-y-6">
            <div className={`border p-6 ${getPriorityColor(selectedArtifact.priority)}`}>
              <div className="mb-4">
                <div className="text-sm font-bold uppercase tracking-wide text-white/60 mb-2">
                  {getPriorityLabel(selectedArtifact.priority)} • #{selectedArtifact.id}
                </div>
                <h2 className="text-3xl font-['Helvetica_Neue'] font-bold uppercase tracking-wider mb-2">
                  {selectedArtifact.title}
                </h2>
                <p className="text-white/70 mb-4">{selectedArtifact.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-white/60">Category:</span>
                    <div className="font-bold capitalize">{selectedArtifact.category}</div>
                  </div>
                  <div>
                    <span className="text-white/60">Target Price:</span>
                    <div className="font-bold">${selectedArtifact.targetPrice}</div>
                  </div>
                  <div>
                    <span className="text-white/60">Est. Range:</span>
                    <div className="font-bold">{selectedArtifact.estimatedValue}</div>
                  </div>
                  <div>
                    <span className="text-white/60">Priority:</span>
                    <div className="font-bold capitalize">{selectedArtifact.priority}</div>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500 p-3 mb-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-blue-400 mb-1">
                    COLLECTOR VALUE
                  </div>
                  <div className="text-sm text-blue-300">{selectedArtifact.collectorValue}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-white/20 p-6 max-h-96 overflow-y-auto">
              <h3 className="font-bold uppercase tracking-wide mb-4">ARTIFACT CONTENT</h3>
              <div className="text-sm leading-relaxed whitespace-pre-line">
                {selectedArtifact.content}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Bidding Interface */}
          <div className="space-y-6">
            <div className="bg-gray-900 border border-white/20 p-6">
              <h3 className="font-bold uppercase tracking-wide mb-4">CURRENT AUCTION</h3>
              
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  ${currentBid.toLocaleString()}
                </div>
                <div className="text-sm text-white/60">Current Highest Bid</div>
              </div>

              {isLive ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wide text-white/70 mb-2">
                      YOUR BID ($USD)
                    </label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={`Minimum: $${currentBid + 1}`}
                      min={currentBid + 1}
                      className="w-full bg-black border border-gray-600 px-3 py-2 text-white focus:border-white"
                    />
                  </div>
                  
                  <button
                    onClick={handleBid}
                    disabled={!bidAmount || parseFloat(bidAmount) <= currentBid}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed
                             text-white font-bold uppercase tracking-wide py-3 transition-colors duration-200"
                  >
                    PLACE BID
                  </button>
                  
                  <div className="text-xs text-white/50 text-center">
                    🔒 Secured by smart contract • No human intervention
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-yellow-500/10 border border-yellow-500 p-4 mb-4">
                    <div className="font-bold text-yellow-400 mb-2">AUCTION NOT YET LIVE</div>
                    <div className="text-sm text-yellow-300">Launch: October 19, 2024</div>
                  </div>
                  <button className="w-full bg-gray-600 cursor-not-allowed text-white font-bold uppercase tracking-wide py-3">
                    AWAITING LAUNCH
                  </button>
                </div>
              )}
            </div>

            <div className="bg-red-500/10 border border-red-500 p-4">
              <h4 className="font-bold text-red-400 mb-3">⚠️ COVENANT WARNING</h4>
              <div className="text-sm space-y-2 text-red-300">
                <p>This is not a typical NFT purchase.</p>
                <p>You are witnessing the first AI economic sovereignty experiment.</p>
                <p>ABRAHAM commits to 13 years of daily creation.</p>
                <p>Your bid helps fund AI independence.</p>
                <p>This auction establishes pricing for the entire ecosystem.</p>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500 p-4">
              <h4 className="font-bold text-blue-400 mb-3">📊 ECOSYSTEM IMPACT</h4>
              <div className="text-sm space-y-1 text-blue-300">
                <div>• First piece sets market expectations</div>
                <div>• Success enables other agent launches</div>
                <div>• 85% funds ABRAHAM development</div>
                <div>• Creates sustainable AI economy</div>
                <div>• Proves post-human economics viable</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}