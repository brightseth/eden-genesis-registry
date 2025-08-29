'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { registryClient } from '@/lib/registry-client'

interface MarketAnalysis {
  id: string
  title: string
  asset: string
  prediction: 'BULLISH' | 'BEARISH' | 'NEUTRAL'
  confidence: number
  timeframe: string
  currentPrice?: number
  targetPrice?: number
  reasoning: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  createdAt: string
}

interface PerformanceMetric {
  label: string
  value: number | string
  change?: number
  positive?: boolean
  suffix?: string
}

interface Agent {
  id: string
  handle: string
  displayName: string
  role: string
  status: string
}

export default function BerthaSitePage() {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [recentAnalyses, setRecentAnalyses] = useState<MarketAnalysis[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    async function fetchBerthaData() {
      try {
        const response = await registryClient.agents.list()
        const agentsData = response.data
        const berthaAgent = agentsData?.find((a: Agent) => a.handle === 'bertha')
        setAgent(berthaAgent)
        
        // Load performance metrics
        const metrics: PerformanceMetric[] = [
          { label: 'Portfolio ROI', value: 34.7, change: 2.3, positive: true, suffix: '%' },
          { label: 'Prediction Accuracy', value: 78.3, change: 1.2, positive: true, suffix: '%' },
          { label: 'Market Beat Rate', value: '+16.5', positive: true, suffix: '%' },
          { label: 'Active Positions', value: 23, change: -2, positive: false },
          { label: 'Total Analyses', value: '1.8K' },
          { label: 'Risk Score', value: 'MODERATE' }
        ]
        setPerformanceMetrics(metrics)
        
        // Load recent market analyses
        const analyses: MarketAnalysis[] = [
          {
            id: '1',
            title: 'NVDA Q4 Earnings Momentum',
            asset: 'NVDA',
            prediction: 'BULLISH',
            confidence: 87,
            timeframe: '3-6 months',
            currentPrice: 712.50,
            targetPrice: 850.00,
            reasoning: 'AI infrastructure demand surge driving revenue growth. Data center expansion accelerating.',
            riskLevel: 'MEDIUM',
            createdAt: '2025-08-28T15:30:00Z'
          },
          {
            id: '2',
            title: 'Bitcoin Technical Breakdown',
            asset: 'BTC-USD',
            prediction: 'BEARISH',
            confidence: 81,
            timeframe: '2-4 weeks',
            currentPrice: 42150.00,
            targetPrice: 38000.00,
            reasoning: 'Technical support levels failing. Institutional selling pressure increasing significantly.',
            riskLevel: 'HIGH',
            createdAt: '2025-08-28T13:45:00Z'
          },
          {
            id: '3',
            title: 'TSLA Production Scale Analysis',
            asset: 'TSLA',
            prediction: 'NEUTRAL',
            confidence: 72,
            timeframe: '1-3 months',
            currentPrice: 248.50,
            targetPrice: 260.00,
            reasoning: 'Production scaling positive but regulatory uncertainty creates mixed signals.',
            riskLevel: 'HIGH',
            createdAt: '2025-08-28T11:20:00Z'
          }
        ]
        setRecentAnalyses(analyses)
      } catch (error) {
        console.error('Failed to load BERTHA data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBerthaData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xl animate-pulse">Analyzing market data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white" 
         style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Market Data Header */}
      <div className="border-b border-white/20 px-8 py-4 bg-black/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex gap-6">
            <span className="text-green-400">S&P 500: +0.8%</span>
            <span className="text-green-400">NASDAQ: +1.2%</span>
            <span className="text-red-400">BTC: -2.1%</span>
          </div>
          <div className="text-blue-300">
            LIVE • {currentTime.toLocaleTimeString()} EST
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-8 py-24">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            BERTHA
          </h1>
          <p className="text-2xl md:text-3xl mb-12 opacity-90">Advanced Market Analytics</p>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg md:text-xl leading-relaxed opacity-80 mb-16">
              Sophisticated market analysis powered by advanced algorithms and deep learning models. 
              BERTHA processes vast amounts of financial data to identify patterns, predict trends, 
              and provide actionable investment insights with quantified confidence levels.
            </p>
          </div>

          {/* Live Performance Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="bg-black/30 border border-blue-400/30 p-6 text-center">
                <p className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">
                  {metric.value}{metric.suffix}
                </p>
                <p className="text-sm uppercase tracking-wide opacity-80">{metric.label}</p>
                {metric.change && (
                  <p className={`text-xs mt-1 ${metric.positive ? 'text-green-400' : 'text-red-400'}`}>
                    {metric.positive ? '+' : ''}{metric.change}%
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#market-analysis"
              className="px-8 py-4 bg-blue-500 text-white hover:bg-blue-400 transition-all duration-300 text-lg font-semibold"
            >
              View Latest Analysis
            </Link>
            <Link 
              href="#performance"
              className="px-8 py-4 border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-all duration-300 text-lg"
            >
              Performance Metrics
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Market Analyses */}
      <div id="market-analysis" className="px-8 py-24 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Latest Market Analysis</h2>
            <div className="w-24 h-1 bg-blue-400 mx-auto mb-8"></div>
            <p className="text-lg opacity-80 max-w-3xl mx-auto">
              Real-time market insights powered by advanced analytics and machine learning models
            </p>
          </div>

          <div className="space-y-8">
            {recentAnalyses.map((analysis) => (
              <div key={analysis.id} className="bg-black/30 border border-blue-400/30 p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Analysis Header */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-2xl font-bold text-blue-400">{analysis.asset}</h3>
                      <span className={`px-4 py-2 border text-sm uppercase tracking-wide font-bold ${
                        analysis.prediction === 'BULLISH' ? 'border-green-500 text-green-500 bg-green-500/10' :
                        analysis.prediction === 'BEARISH' ? 'border-red-500 text-red-500 bg-red-500/10' :
                        'border-yellow-500 text-yellow-500 bg-yellow-500/10'
                      }`}>
                        {analysis.prediction}
                      </span>
                      <span className={`px-3 py-1 border text-xs uppercase tracking-wide ${
                        analysis.riskLevel === 'LOW' ? 'border-green-500 text-green-500' :
                        analysis.riskLevel === 'MEDIUM' ? 'border-yellow-500 text-yellow-500' :
                        'border-red-500 text-red-500'
                      }`}>
                        {analysis.riskLevel} Risk
                      </span>
                    </div>
                    
                    <h4 className="text-xl font-semibold mb-4">{analysis.title}</h4>
                    
                    <p className="text-opacity-80 text-white mb-6 leading-relaxed">
                      {analysis.reasoning}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-blue-400 font-semibold mb-1">Timeframe</p>
                        <p>{analysis.timeframe}</p>
                      </div>
                      {analysis.currentPrice && (
                        <div>
                          <p className="text-blue-400 font-semibold mb-1">Current Price</p>
                          <p>${analysis.currentPrice.toLocaleString()}</p>
                        </div>
                      )}
                      {analysis.targetPrice && (
                        <div>
                          <p className="text-blue-400 font-semibold mb-1">Target Price</p>
                          <p>${analysis.targetPrice.toLocaleString()}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-blue-400 font-semibold mb-1">Upside/Downside</p>
                        <p className={
                          analysis.currentPrice && analysis.targetPrice 
                            ? ((analysis.targetPrice - analysis.currentPrice) / analysis.currentPrice * 100) > 0 
                              ? 'text-green-400' : 'text-red-400'
                            : ''
                        }>
                          {analysis.currentPrice && analysis.targetPrice 
                            ? ((analysis.targetPrice - analysis.currentPrice) / analysis.currentPrice * 100).toFixed(1)
                            : '0'}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Confidence & Actions */}
                  <div className="text-center">
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-blue-400 mb-2">{analysis.confidence}%</div>
                      <p className="text-sm uppercase tracking-wide opacity-80">Confidence Level</p>
                    </div>
                    
                    <div className="space-y-3">
                      <button className="w-full px-4 py-3 bg-blue-500 text-white hover:bg-blue-400 transition-all duration-150 text-sm uppercase tracking-wide">
                        View Full Analysis
                      </button>
                      <button className="w-full px-4 py-3 border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-all duration-150 text-sm uppercase tracking-wide">
                        Historical Performance
                      </button>
                    </div>
                    
                    <p className="text-xs opacity-60 mt-4">
                      {new Date(analysis.createdAt).toLocaleDateString()} • {new Date(analysis.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/agents/bertha"
              className="px-8 py-4 border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-all duration-300 text-lg"
            >
              View Complete Analysis Archive
            </Link>
          </div>
        </div>
      </div>

      {/* Performance Analytics */}
      <div id="performance" className="px-8 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Performance Analytics</h2>
            <div className="w-24 h-1 bg-purple-400 mx-auto mb-8"></div>
            <p className="text-lg opacity-80">
              Track BERTHA's predictive accuracy and portfolio performance over time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-black/30 border border-purple-400/30 p-8">
              <h3 className="text-2xl font-bold text-purple-400 mb-8">Algorithm Performance</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span>Prediction Accuracy (YTD)</span>
                  <span className="text-2xl font-bold text-green-400">78.3%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{width: '78.3%'}}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Risk-Adjusted Returns</span>
                  <span className="text-2xl font-bold text-blue-400">+34.7%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Sharpe Ratio</span>
                  <span className="text-2xl font-bold text-purple-400">2.34</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-400 h-2 rounded-full" style={{width: '78%'}}></div>
                </div>
              </div>
            </div>

            <div className="bg-black/30 border border-blue-400/30 p-8">
              <h3 className="text-2xl font-bold text-blue-400 mb-8">Market Analysis Stats</h3>
              
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-blue-400 mb-2">1,847</p>
                  <p className="text-sm uppercase tracking-wide opacity-80">Total Analyses</p>
                </div>
                
                <div className="text-center">
                  <p className="text-4xl font-bold text-green-400 mb-2">342</p>
                  <p className="text-sm uppercase tracking-wide opacity-80">Successful Predictions</p>
                </div>
                
                <div className="text-center">
                  <p className="text-4xl font-bold text-purple-400 mb-2">23</p>
                  <p className="text-sm uppercase tracking-wide opacity-80">Active Positions</p>
                </div>
                
                <div className="text-center">
                  <p className="text-4xl font-bold text-yellow-400 mb-2">$2.1M</p>
                  <p className="text-sm uppercase tracking-wide opacity-80">Assets Under Analysis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="px-8 py-16 bg-black/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link 
              href="/agents/bertha"
              className="border-2 border-blue-400/30 bg-black/20 text-white hover:border-blue-400 hover:bg-blue-400/10 transition-all duration-150 p-6 text-center block"
            >
              <div className="text-lg font-bold text-blue-400 mb-2">Registry Profile</div>
              <div className="text-sm opacity-80">Complete agent details and analysis history</div>
            </Link>
            
            <Link 
              href="/dashboard/bertha"
              className="border-2 border-blue-400 bg-blue-400/10 text-blue-400 hover:bg-blue-400 hover:text-white transition-all duration-150 p-6 text-center block"
            >
              <div className="text-lg font-bold mb-2">Analytics Dashboard</div>
              <div className="text-sm opacity-80">Private trainer controls (authenticated)</div>
            </Link>
            
            <div className="border-2 border-dashed border-blue-400/30 bg-black/10 text-blue-400/50 p-6 text-center">
              <div className="text-lg font-bold mb-2">Portfolio Manager</div>
              <div className="text-sm opacity-60">Advanced portfolio tools coming soon</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-12 bg-black/40 text-center">
        <p className="text-blue-300/60 text-sm uppercase tracking-wider mb-3">
          BERTHA • Advanced Market Analytics • Eden Academy Genesis Cohort 2024
        </p>
        <p className="text-blue-300/40 text-xs">
          Predictive Modeling • Risk Assessment • Market Intelligence
        </p>
        <p className="text-xs text-blue-400/40 mt-4">
          ⚠️ Past performance does not guarantee future results. All investments carry risk of loss.
        </p>
      </div>
    </div>
  )
}