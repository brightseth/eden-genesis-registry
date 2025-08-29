'use client'

import { useState } from 'react'

interface TokenomicsInput {
  revenuePerMonth: number
  growthRate: number
  marketMultiplier: number
  utilityValue: number
  scarcityFactor: number
}

interface TokenomicsResults {
  suggestedSupply: number
  pricePerToken: number
  marketCap: number
  treasuryAllocation: number
  communityAllocation: number
  liquidityPool: number
  valuation: string
  readinessScore: number
}

export default function AbrahamTokenomicsCalculator({ metadata, agentHandle }: { metadata?: any, agentHandle: string }) {
  const [inputs, setInputs] = useState<TokenomicsInput>({
    revenuePerMonth: 5000,
    growthRate: 15,
    marketMultiplier: 12,
    utilityValue: 7,
    scarcityFactor: 8
  })

  const [results, setResults] = useState<TokenomicsResults | null>(null)
  const [calculating, setCalculating] = useState(false)

  const calculateTokenomics = async () => {
    setCalculating(true)
    
    // Simulate calculation time
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock tokenomics calculation based on ABRAHAM's economic modeling
    const annualRevenue = inputs.revenuePerMonth * 12
    const projectedRevenue = annualRevenue * (1 + inputs.growthRate / 100)
    
    const suggestedSupply = Math.floor(projectedRevenue / 10) // 10x revenue coverage
    const pricePerToken = (projectedRevenue * inputs.marketMultiplier) / suggestedSupply
    const marketCap = suggestedSupply * pricePerToken
    
    const treasuryAllocation = suggestedSupply * 0.30 // 30% to treasury
    const communityAllocation = suggestedSupply * 0.40 // 40% to community
    const liquidityPool = suggestedSupply * 0.20 // 20% to liquidity
    
    // Readiness score based on multiple factors
    const readinessScore = Math.min(100, 
      (inputs.revenuePerMonth / 100) * 20 + // Revenue component (20%)
      inputs.utilityValue * 10 + // Utility component (70%)
      inputs.scarcityFactor * 1.25 // Scarcity component (10%)
    )

    const valuation = marketCap > 10000000 ? 'HIGH POTENTIAL' : 
                     marketCap > 1000000 ? 'MODERATE POTENTIAL' :
                     'EARLY STAGE'

    const calculatedResults: TokenomicsResults = {
      suggestedSupply,
      pricePerToken: Math.round(pricePerToken * 100) / 100,
      marketCap: Math.round(marketCap),
      treasuryAllocation: Math.round(treasuryAllocation),
      communityAllocation: Math.round(communityAllocation),
      liquidityPool: Math.round(liquidityPool),
      valuation,
      readinessScore: Math.round(readinessScore)
    }

    setResults(calculatedResults)
    setCalculating(false)
  }

  const getReadinessColor = (score: number) => {
    if (score >= 80) return 'text-green-400 border-green-400'
    if (score >= 60) return 'text-yellow-400 border-yellow-400'
    if (score >= 40) return 'text-orange-400 border-orange-400'
    return 'text-red-400 border-red-400'
  }

  return (
    <div className="min-h-screen bg-black text-white p-8" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      {/* Header */}
      <div className="border-b border-white/20 pb-6 mb-8">
        <h1 className="text-3xl font-bold uppercase tracking-wider text-blue-400 mb-2">
          ABRAHAM TOKENOMICS CALCULATOR v0.9
        </h1>
        <p className="text-lg opacity-60">Agent Economic Modeling & Tokenization Readiness Assessment</p>
        
        <div className="mt-4 p-4 border border-yellow-400/50 bg-yellow-400/5">
          <p className="text-sm text-yellow-400 font-bold mb-2">PROTOTYPE STATUS:</p>
          <ul className="text-xs opacity-80 space-y-1">
            <li>• Experimental economic modeling for agent tokenization</li>
            <li>• Awaiting integration with Registry tokenization system</li>
            <li>• Calculations are estimates based on current market conditions</li>
            <li>• Not financial advice - for development planning only</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Input Parameters */}
        <div className="border border-white p-6">
          <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">INPUT PARAMETERS</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-blue-300 text-sm font-bold mb-2 uppercase tracking-wide">
                Monthly Revenue ($USD)
              </label>
              <input
                type="number"
                value={inputs.revenuePerMonth}
                onChange={(e) => setInputs(prev => ({ ...prev, revenuePerMonth: parseInt(e.target.value) }))}
                className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
              />
              <p className="text-xs opacity-60 mt-1">Current monthly revenue from agent activities</p>
            </div>

            <div>
              <label className="block text-blue-300 text-sm font-bold mb-2 uppercase tracking-wide">
                Growth Rate (%)
              </label>
              <input
                type="number"
                value={inputs.growthRate}
                onChange={(e) => setInputs(prev => ({ ...prev, growthRate: parseInt(e.target.value) }))}
                className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
              />
              <p className="text-xs opacity-60 mt-1">Expected annual growth rate</p>
            </div>

            <div>
              <label className="block text-blue-300 text-sm font-bold mb-2 uppercase tracking-wide">
                Market Multiplier
              </label>
              <input
                type="number"
                value={inputs.marketMultiplier}
                onChange={(e) => setInputs(prev => ({ ...prev, marketMultiplier: parseInt(e.target.value) }))}
                className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
              />
              <p className="text-xs opacity-60 mt-1">Revenue multiple for market valuation</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-blue-300 text-sm font-bold mb-2 uppercase tracking-wide">
                  Utility Score (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={inputs.utilityValue}
                  onChange={(e) => setInputs(prev => ({ ...prev, utilityValue: parseInt(e.target.value) }))}
                  className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-blue-300 text-sm font-bold mb-2 uppercase tracking-wide">
                  Scarcity Score (1-10)  
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={inputs.scarcityFactor}
                  onChange={(e) => setInputs(prev => ({ ...prev, scarcityFactor: parseInt(e.target.value) }))}
                  className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={calculateTokenomics}
              disabled={calculating}
              className="w-full py-3 bg-blue-600 text-black font-bold rounded hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide flex items-center justify-center gap-3"
            >
              {calculating && (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              )}
              {calculating ? 'CALCULATING TOKENOMICS...' : 'CALCULATE TOKENOMICS'}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="border border-white p-6">
          <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">TOKENOMICS RESULTS</h2>
          
          {!results ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4 opacity-20">🧮</div>
              <p className="text-lg opacity-60 uppercase tracking-wide">
                ENTER PARAMETERS AND CALCULATE
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Readiness Score */}
              <div className={`border p-6 text-center ${getReadinessColor(results.readinessScore)}`}>
                <h3 className="text-3xl font-bold mb-2">{results.readinessScore}/100</h3>
                <p className="text-sm uppercase tracking-wider">TOKENIZATION READINESS</p>
                <p className="text-xs opacity-60 mt-2">{results.valuation}</p>
              </div>

              {/* Token Economics */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="border border-white/20 p-4">
                  <h4 className="text-2xl font-bold text-blue-400">{results.suggestedSupply.toLocaleString()}</h4>
                  <p className="text-xs uppercase tracking-wide opacity-60">TOTAL SUPPLY</p>
                </div>
                
                <div className="border border-white/20 p-4">
                  <h4 className="text-2xl font-bold text-green-400">${results.pricePerToken}</h4>
                  <p className="text-xs uppercase tracking-wide opacity-60">PRICE PER TOKEN</p>
                </div>
              </div>

              {/* Market Cap */}
              <div className="border border-purple-400 bg-purple-400/10 p-4 text-center">
                <h4 className="text-2xl font-bold text-purple-400">${results.marketCap.toLocaleString()}</h4>
                <p className="text-sm uppercase tracking-wider opacity-60">ESTIMATED MARKET CAP</p>
              </div>

              {/* Token Distribution */}
              <div className="border border-white/20 p-4">
                <h3 className="text-lg font-bold uppercase tracking-wide mb-4">TOKEN ALLOCATION</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="opacity-80">Treasury (30%)</span>
                    <span className="font-bold">{results.treasuryAllocation.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-80">Community (40%)</span>
                    <span className="font-bold">{results.communityAllocation.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-80">Liquidity (20%)</span>
                    <span className="font-bold">{results.liquidityPool.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-80">Development (10%)</span>
                    <span className="font-bold">{(results.suggestedSupply * 0.1).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="border border-white/20 p-4">
                <h3 className="text-lg font-bold uppercase tracking-wide mb-3 text-yellow-400">
                  RECOMMENDATIONS
                </h3>
                <div className="space-y-2 text-sm">
                  {results.readinessScore >= 80 && (
                    <div className="flex items-center gap-2 text-green-400">
                      <span>✅</span>
                      <span>Ready for tokenization launch</span>
                    </div>
                  )}
                  {results.readinessScore >= 60 && results.readinessScore < 80 && (
                    <div className="flex items-center gap-2 text-yellow-400">
                      <span>⚠️</span>
                      <span>Near ready - consider increasing utility or revenue</span>
                    </div>
                  )}
                  {results.readinessScore < 60 && (
                    <div className="flex items-center gap-2 text-red-400">
                      <span>❌</span>
                      <span>Not ready - focus on revenue growth and utility development</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-blue-400">
                    <span>📊</span>
                    <span>Consider market conditions and competitor analysis</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-purple-400">
                    <span>🔗</span>
                    <span>Plan integration with Registry tokenization infrastructure</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-white/20 text-center">
        <p className="text-sm uppercase tracking-wider opacity-60 text-blue-400">
          ABRAHAM TOKENOMICS CALCULATOR PROTOTYPE
        </p>
        <p className="text-xs opacity-40 mt-2">
          EXPERIMENTAL TOOL • AWAITING REGISTRY INTEGRATION • NOT FINANCIAL ADVICE
        </p>
      </div>
    </div>
  )
}