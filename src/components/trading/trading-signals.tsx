'use client'

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

interface TradingSignalsProps {
  signals: TradingSignal[]
}

export function TradingSignals({ signals }: TradingSignalsProps) {
  const activeSignals = signals.filter(s => s.status === 'ACTIVE')
  const recentSignals = signals.filter(s => s.status !== 'ACTIVE').slice(0, 10)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatPercent = (percent: number) => {
    return `${percent.toFixed(1)}%`
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getSignalColor = (signal: string) => {
    switch (signal.toLowerCase()) {
      case 'buy': return 'border-green-500 text-green-500 bg-green-500/10'
      case 'sell': return 'border-red-500 text-red-500 bg-red-500/10'
      case 'hold': return 'border-yellow-500 text-yellow-500 bg-yellow-500/10'
      default: return 'border-gray-500 text-gray-500 bg-gray-500/10'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400'
    if (confidence >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'border-green-500 text-green-500'
      case 'FILLED': return 'border-blue-500 text-blue-500'
      case 'EXPIRED': return 'border-gray-500 text-gray-500'
      default: return 'border-gray-500 text-gray-500'
    }
  }

  if (signals.length === 0) {
    return (
      <div className="border border-white/20 p-8 text-center">
        <div className="text-lg uppercase opacity-70">No Trading Signals</div>
        <div className="text-sm opacity-50 mt-2">MIYOMI hasn't generated any signals yet</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Active Signals */}
      {activeSignals.length > 0 && (
        <div>
          <h3 className="text-xl font-bold uppercase tracking-wider mb-4 text-green-400">
            Active Signals ({activeSignals.length})
          </h3>
          <div className="space-y-4">
            {activeSignals.map(signal => (
              <div key={signal.id} className="border border-white/20 p-6 hover:border-white/40 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold">{signal.symbol}</div>
                    <div className={`px-4 py-2 border text-sm uppercase font-bold ${getSignalColor(signal.signal)}`}>
                      {signal.signal}
                    </div>
                    <div className={`px-3 py-1 border text-xs uppercase ${getStatusColor(signal.status)}`}>
                      {signal.status}
                    </div>
                    {signal.timeframe && (
                      <div className="px-3 py-1 border border-white/30 text-white/70 text-xs uppercase">
                        {signal.timeframe}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm uppercase opacity-50 mb-1">Confidence</div>
                    <div className={`text-2xl font-bold ${getConfidenceColor(signal.confidence)}`}>
                      {formatPercent(signal.confidence)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {signal.targetPrice && (
                    <div>
                      <div className="opacity-50 uppercase text-xs mb-1">Target Price</div>
                      <div className="font-mono text-lg text-green-400">{formatCurrency(signal.targetPrice)}</div>
                    </div>
                  )}
                  {signal.stopLoss && (
                    <div>
                      <div className="opacity-50 uppercase text-xs mb-1">Stop Loss</div>
                      <div className="font-mono text-lg text-red-400">{formatCurrency(signal.stopLoss)}</div>
                    </div>
                  )}
                  <div>
                    <div className="opacity-50 uppercase text-xs mb-1">Generated</div>
                    <div className="font-mono text-sm">{formatDateTime(signal.createdAt)}</div>
                  </div>
                </div>

                {signal.reasoning && (
                  <div className="border-t border-white/10 pt-4">
                    <div className="opacity-50 uppercase text-xs mb-2">MIYOMI's Analysis</div>
                    <div className="text-sm leading-relaxed text-white/80 italic">
                      "{signal.reasoning}"
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Signals */}
      {recentSignals.length > 0 && (
        <div>
          <h3 className="text-xl font-bold uppercase tracking-wider mb-4 text-blue-400">
            Recent Signals ({recentSignals.length})
          </h3>
          <div className="space-y-3">
            {recentSignals.map(signal => (
              <div key={signal.id} className="border border-white/10 p-4 opacity-70">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold">{signal.symbol}</div>
                    <div className={`px-3 py-1 border text-xs uppercase ${getSignalColor(signal.signal)}`}>
                      {signal.signal}
                    </div>
                    <div className={`px-2 py-1 border text-xs uppercase ${getStatusColor(signal.status)}`}>
                      {signal.status}
                    </div>
                    <div className={`text-sm font-bold ${getConfidenceColor(signal.confidence)}`}>
                      {formatPercent(signal.confidence)}
                    </div>
                  </div>
                  <div className="text-xs opacity-50">{formatDateTime(signal.createdAt)}</div>
                </div>

                {signal.reasoning && (
                  <div className="text-xs text-white/60 italic truncate">
                    "{signal.reasoning}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}