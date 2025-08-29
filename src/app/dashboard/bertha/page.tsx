'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { registryClient } from '@/lib/registry-sdk-client'

interface AnalysisSession {
  id: string
  title: string
  status: 'active' | 'completed' | 'scheduled'
  marketsAnalyzed: number
  predictionsGenerated: number
  accuracyRate: number
  createdAt: string
}

interface AnalyticsMetrics {
  totalAnalyses: number
  portfolioROI: number
  predictionAccuracy: number
  marketBeatRate: number
  averageConfidence: number
  activePositions: number
}

interface MarketSignal {
  asset: string
  signal: 'BUY' | 'SELL' | 'HOLD'
  confidence: number
  timeframe: string
  reasoning: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  probability: number
}

export default function BerthaTrainerDashboard() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    totalAnalyses: 1847,
    portfolioROI: 34.7,
    predictionAccuracy: 78.3,
    marketBeatRate: 16.5,
    averageConfidence: 82.1,
    activePositions: 23
  })
  
  const [activeSessions, setActiveSessions] = useState<AnalysisSession[]>([
    {
      id: '1',
      title: 'Q4 Market Momentum Analysis',
      status: 'active',
      marketsAnalyzed: 47,
      predictionsGenerated: 12,
      accuracyRate: 85.2,
      createdAt: '2025-08-28T13:15:00Z'
    },
    {
      id: '2',
      title: 'Sector Rotation Predictions',
      status: 'scheduled',
      marketsAnalyzed: 0,
      predictionsGenerated: 0,
      accuracyRate: 0,
      createdAt: '2025-08-29T08:30:00Z'
    }
  ])

  const [marketSignals, setMarketSignals] = useState<MarketSignal[]>([
    {
      asset: 'NVDA',
      signal: 'BUY',
      confidence: 87,
      timeframe: '3-6 months',
      reasoning: 'AI infrastructure demand surge, earnings momentum sustainable',
      riskLevel: 'MEDIUM',
      probability: 74
    },
    {
      asset: 'TSLA',
      signal: 'HOLD',
      confidence: 72,
      timeframe: '1-3 months',
      reasoning: 'Production scaling positive, regulatory uncertainty remains',
      riskLevel: 'HIGH',
      probability: 68
    },
    {
      asset: 'BTC-USD',
      signal: 'SELL',
      confidence: 81,
      timeframe: '2-4 weeks',
      reasoning: 'Technical breakdown, institutional selling pressure increasing',
      riskLevel: 'HIGH',
      probability: 79
    }
  ])

  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white" 
         style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Header */}
      <div className="border-b border-white/20 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-wide">BERTHA</h1>
            <p className="text-lg opacity-80">Advanced Analytics • Trainer Dashboard</p>
          </div>
          <div className="text-right">
            <p className="text-sm uppercase tracking-wider opacity-60">PRIVATE INTERFACE</p>
            <p className="text-lg uppercase tracking-wide">ANALYTICS CONTROLS</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        
        {/* Key Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          <div className="bg-black/30 border border-blue-400 p-6 text-center">
            <p className="text-3xl font-bold text-blue-400">{metrics.totalAnalyses}</p>
            <p className="text-sm uppercase tracking-wide opacity-80">Analyses</p>
          </div>
          <div className="bg-black/30 border border-green-500 p-6 text-center">
            <p className="text-3xl font-bold text-green-500">+{metrics.portfolioROI}%</p>
            <p className="text-sm uppercase tracking-wide opacity-80">Portfolio ROI</p>
          </div>
          <div className="bg-black/30 border border-blue-400 p-6 text-center">
            <p className="text-3xl font-bold text-blue-400">{metrics.predictionAccuracy}%</p>
            <p className="text-sm uppercase tracking-wide opacity-80">Accuracy</p>
          </div>
          <div className="bg-black/30 border border-green-500 p-6 text-center">
            <p className="text-3xl font-bold text-green-500">+{metrics.marketBeatRate}%</p>
            <p className="text-sm uppercase tracking-wide opacity-80">vs Market</p>
          </div>
          <div className="bg-black/30 border border-blue-400 p-6 text-center">
            <p className="text-3xl font-bold text-blue-400">{metrics.averageConfidence}%</p>
            <p className="text-sm uppercase tracking-wide opacity-80">Confidence</p>
          </div>
          <div className="bg-black/30 border border-purple-400 p-6 text-center">
            <p className="text-3xl font-bold text-purple-400">{metrics.activePositions}</p>
            <p className="text-sm uppercase tracking-wide opacity-80">Positions</p>
          </div>
        </div>

        {/* Active Analysis Sessions */}
        <div className="bg-black/30 border border-white/20 p-8 mb-12">
          <h2 className="text-3xl font-bold mb-8">ACTIVE ANALYSIS SESSIONS</h2>
          
          <div className="space-y-6">
            {activeSessions.map((session) => (
              <div key={session.id} className="border border-white/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{session.title}</h3>
                    <p className="text-sm opacity-80">Started {new Date(session.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-4 py-2 border text-sm uppercase tracking-wide ${
                    session.status === 'active' ? 'border-green-500 text-green-500' :
                    session.status === 'scheduled' ? 'border-blue-400 text-blue-400' :
                    'border-purple-400 text-purple-400'
                  }`}>
                    {session.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-400">{session.marketsAnalyzed}</p>
                    <p className="text-xs opacity-60 uppercase">Markets</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-400">{session.predictionsGenerated}</p>
                    <p className="text-xs opacity-60 uppercase">Predictions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-400">{session.accuracyRate}%</p>
                    <p className="text-xs opacity-60 uppercase">Accuracy</p>
                  </div>
                  <div>
                    <button className="px-4 py-2 border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-150 text-sm uppercase tracking-wide">
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button className="px-8 py-3 border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-150 uppercase tracking-wide">
              Launch New Analysis Session
            </button>
          </div>
        </div>

        {/* Live Market Signals */}
        <div className="bg-black/30 border border-white/20 p-8 mb-12">
          <h2 className="text-3xl font-bold mb-8">LIVE MARKET SIGNALS</h2>
          
          <div className="space-y-6">
            {marketSignals.map((signal, index) => (
              <div key={index} className="border border-white/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-bold text-blue-400">{signal.asset}</h3>
                    <span className={`px-3 py-1 border text-xs uppercase tracking-wide font-bold ${
                      signal.signal === 'BUY' ? 'border-green-500 text-green-500 bg-green-500/10' :
                      signal.signal === 'SELL' ? 'border-red-500 text-red-500 bg-red-500/10' :
                      'border-yellow-500 text-yellow-500 bg-yellow-500/10'
                    }`}>
                      {signal.signal}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-400">{signal.confidence}%</p>
                    <p className="text-sm opacity-60">Confidence</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm uppercase tracking-wider opacity-60 mb-1">Timeframe</p>
                    <p className="text-sm font-semibold">{signal.timeframe}</p>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-wider opacity-60 mb-1">Risk Level</p>
                    <span className={`px-2 py-1 border text-xs uppercase tracking-wide ${
                      signal.riskLevel === 'LOW' ? 'border-green-500 text-green-500' :
                      signal.riskLevel === 'MEDIUM' ? 'border-yellow-500 text-yellow-500' :
                      'border-red-500 text-red-500'
                    }`}>
                      {signal.riskLevel}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-wider opacity-60 mb-1">Probability</p>
                    <p className="text-sm font-semibold">{signal.probability}%</p>
                  </div>
                </div>
                
                <p className="text-sm opacity-80 mb-3">{signal.reasoning}</p>
                <div className="flex justify-between items-center">
                  <button className="text-sm text-blue-400 hover:text-blue-300 uppercase tracking-wide">
                    View Analysis →
                  </button>
                  <button className="px-3 py-1 border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-150 text-xs uppercase tracking-wide">
                    Execute Signal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Training Controls */}
        <div className="bg-black/30 border border-white/20 p-8 mb-12">
          <h2 className="text-3xl font-bold mb-8">ANALYTICS TRAINING CONTROLS</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-white/20 p-6">
              <h3 className="text-lg font-bold mb-4 text-blue-400">Model Optimization</h3>
              <p className="text-sm opacity-80 mb-4">Fine-tune prediction models and risk assessment algorithms</p>
              <button className="w-full px-4 py-3 border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-150 text-sm uppercase tracking-wide">
                Launch Model Tuner
              </button>
            </div>
            
            <div className="border border-white/20 p-6">
              <h3 className="text-lg font-bold mb-4 text-purple-400">Data Pipeline</h3>
              <p className="text-sm opacity-80 mb-4">Configure data sources, feeds, and processing workflows</p>
              <button className="w-full px-4 py-3 border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black transition-all duration-150 text-sm uppercase tracking-wide">
                Data Manager
              </button>
            </div>
            
            <div className="border border-white/20 p-6">
              <h3 className="text-lg font-bold mb-4 text-green-400">Performance Review</h3>
              <p className="text-sm opacity-80 mb-4">Analyze prediction accuracy and portfolio performance metrics</p>
              <button className="w-full px-4 py-3 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all duration-150 text-sm uppercase tracking-wide">
                Performance Analyzer
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="bg-black/30 border border-white/20 p-8">
          <h2 className="text-3xl font-bold mb-6">BERTHA INTERFACES</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/agents/bertha"
              className="border border-white bg-black/50 text-white hover:bg-white hover:text-black transition-all duration-150 p-4 text-center block"
            >
              <div className="text-sm font-bold uppercase tracking-wide mb-1">REGISTRY PROFILE</div>
              <div className="text-xs opacity-60">Agent Details & Analytics</div>
            </Link>
            
            <Link 
              href="/sites/bertha"
              className="border border-blue-400 bg-blue-400/10 text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-150 p-4 text-center block"
            >
              <div className="text-sm font-bold uppercase tracking-wide mb-1">ANALYTICS DASHBOARD</div>
              <div className="text-xs opacity-60">Public Performance View</div>
            </Link>
            
            <div className="border border-dashed border-white/50 bg-black/30 text-white/50 p-4 text-center">
              <div className="text-sm font-bold uppercase tracking-wide mb-1">PORTFOLIO MANAGER</div>
              <div className="text-xs opacity-40">Coming Soon</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-12 border-t border-white/20 text-center">
          <p className="text-sm uppercase tracking-wider opacity-60">BERTHA • ADVANCED ANALYTICS • EDEN ACADEMY</p>
          <p className="text-xs uppercase tracking-wider opacity-40 mt-3">
            PREDICTIVE MODELING • RISK ASSESSMENT • MARKET ANALYSIS
          </p>
        </div>
      </div>
    </div>
  )
}