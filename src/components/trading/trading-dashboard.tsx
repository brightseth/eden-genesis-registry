'use client'

import { useState, useEffect } from 'react'
import { TradingPositions } from './trading-positions'
import { TradingSignals } from './trading-signals'
import { MarketSentiment } from './market-sentiment'
import { TradingMetrics } from './trading-metrics'

interface TradingPosition {
  id: string
  symbol: string
  side: string
  quantity: number
  entryPrice: number
  currentPrice?: number
  pnl: number
  pnlPercent: number
  status: string
  openedAt: string
  closedAt?: string
}

interface TradingSignal {
  id: string
  symbol: string
  signal: string
  confidence: number
  reasoning?: string
  targetPrice?: number
  stopLoss?: number
  timeframe?: string
  status: string
  createdAt: string
}

interface MarketSentimentData {
  id: string
  symbol?: string
  sentiment: string
  score: number
  contrarian_signal?: string
  analysis?: string
  createdAt: string
}

interface TradingMetricsData {
  id: string
  period: string
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  totalPnl: number
  totalPnlPercent: number
  averageWin: number
  averageLoss: number
  profitFactor: number
  sharpeRatio?: number
  maxDrawdown?: number
  volume: number
}

interface TradingDashboardProps {
  agentId: string
  agentHandle: string
}

export function TradingDashboard({ agentId, agentHandle }: TradingDashboardProps) {
  const [positions, setPositions] = useState<TradingPosition[]>([])
  const [signals, setSignals] = useState<TradingSignal[]>([])
  const [sentiment, setSentiment] = useState<MarketSentimentData[]>([])
  const [metrics, setMetrics] = useState<TradingMetricsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'positions' | 'signals' | 'sentiment' | 'metrics'>('positions')

  useEffect(() => {
    loadTradingData()
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(loadTradingData, 30000)
    return () => clearInterval(interval)
  }, [agentId])

  const loadTradingData = async () => {
    try {
      // Load all trading data in parallel
      const [positionsRes, signalsRes, sentimentRes, metricsRes] = await Promise.all([
        fetch(`/api/v1/agents/${agentId}/trading/positions`),
        fetch(`/api/v1/agents/${agentId}/trading/signals`),
        fetch(`/api/v1/agents/${agentId}/trading/sentiment`),
        fetch(`/api/v1/agents/${agentId}/trading/metrics`)
      ])

      if (positionsRes.ok) {
        const data = await positionsRes.json()
        setPositions(data.positions || [])
      }

      if (signalsRes.ok) {
        const data = await signalsRes.json()
        setSignals(data.signals || [])
      }

      if (sentimentRes.ok) {
        const data = await sentimentRes.json()
        setSentiment(data.sentiment || [])
      }

      if (metricsRes.ok) {
        const data = await metricsRes.json()
        setMetrics(data.metrics || null)
      }

    } catch (error) {
      console.error('Failed to load trading data:', error)
      setError('Failed to load trading data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-xl uppercase tracking-wider animate-pulse">LOADING TRADING DATA...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-8" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-red-500 text-xl uppercase tracking-wider">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold uppercase tracking-wider mb-4">
            {agentHandle} TRADING DASHBOARD
          </h1>
          <p className="text-sm uppercase opacity-70">
            Contrarian AI Trading Oracle • Live Market Position Tracking
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="border border-white/20 p-4">
            <div className="text-2xl font-bold text-green-400">
              {positions.filter(p => p.status === 'OPEN').length}
            </div>
            <div className="text-sm uppercase opacity-70">Open Positions</div>
          </div>
          <div className="border border-white/20 p-4">
            <div className="text-2xl font-bold text-blue-400">
              {signals.filter(s => s.status === 'ACTIVE').length}
            </div>
            <div className="text-sm uppercase opacity-70">Active Signals</div>
          </div>
          <div className="border border-white/20 p-4">
            <div className="text-2xl font-bold text-purple-400">
              {metrics ? `${metrics.winRate.toFixed(1)}%` : '0%'}
            </div>
            <div className="text-sm uppercase opacity-70">Win Rate</div>
          </div>
          <div className="border border-white/20 p-4">
            <div className={`text-2xl font-bold ${
              metrics && metrics.totalPnlPercent >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {metrics ? `${metrics.totalPnlPercent > 0 ? '+' : ''}${metrics.totalPnlPercent.toFixed(2)}%` : '0%'}
            </div>
            <div className="text-sm uppercase opacity-70">Total P&L</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-white/20 mb-8">
          <nav className="flex space-x-8">
            {[
              { key: 'positions', label: 'Positions' },
              { key: 'signals', label: 'Signals' },
              { key: 'sentiment', label: 'Sentiment' },
              { key: 'metrics', label: 'Metrics' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-3 px-1 text-sm font-medium uppercase tracking-wider border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-green-400 text-green-400'
                    : 'border-transparent text-white/70 hover:text-white hover:border-white/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {activeTab === 'positions' && <TradingPositions positions={positions} />}
          {activeTab === 'signals' && <TradingSignals signals={signals} />}
          {activeTab === 'sentiment' && <MarketSentiment sentiment={sentiment} />}
          {activeTab === 'metrics' && <TradingMetrics metrics={metrics} />}
        </div>

        {/* Last Updated */}
        <div className="mt-12 pt-8 border-t border-white/20 text-center">
          <p className="text-xs uppercase tracking-wider opacity-50">
            Last Updated: {new Date().toLocaleTimeString()} • Auto-refresh: 30s
          </p>
        </div>
      </div>
    </div>
  )
}