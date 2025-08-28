'use client'

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

interface TradingPositionsProps {
  positions: TradingPosition[]
}

export function TradingPositions({ positions }: TradingPositionsProps) {
  const openPositions = positions.filter(p => p.status === 'OPEN')
  const closedPositions = positions.filter(p => p.status === 'CLOSED')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatPercent = (percent: number) => {
    const sign = percent >= 0 ? '+' : ''
    return `${sign}${percent.toFixed(2)}%`
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'border-green-500 text-green-500'
      case 'CLOSED': return 'border-blue-500 text-blue-500'
      case 'LIQUIDATED': return 'border-red-500 text-red-500'
      default: return 'border-gray-500 text-gray-500'
    }
  }

  const getPnlColor = (pnl: number) => {
    if (pnl > 0) return 'text-green-400'
    if (pnl < 0) return 'text-red-400'
    return 'text-white'
  }

  if (positions.length === 0) {
    return (
      <div className="border border-white/20 p-8 text-center">
        <div className="text-lg uppercase opacity-70">No Trading Positions</div>
        <div className="text-sm opacity-50 mt-2">MIYOMI hasn't opened any positions yet</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Open Positions */}
      {openPositions.length > 0 && (
        <div>
          <h3 className="text-xl font-bold uppercase tracking-wider mb-4 text-green-400">
            Open Positions ({openPositions.length})
          </h3>
          <div className="space-y-4">
            {openPositions.map(position => (
              <div key={position.id} className="border border-white/20 p-6 hover:border-white/40 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold">{position.symbol}</div>
                    <div className={`px-3 py-1 border text-xs uppercase ${
                      position.side === 'LONG' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'
                    }`}>
                      {position.side}
                    </div>
                    <div className={`px-3 py-1 border text-xs uppercase ${getStatusColor(position.status)}`}>
                      {position.status}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${getPnlColor(position.pnl)}`}>
                      {formatCurrency(position.pnl)}
                    </div>
                    <div className={`text-sm ${getPnlColor(position.pnlPercent)}`}>
                      {formatPercent(position.pnlPercent)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="opacity-50 uppercase text-xs mb-1">Quantity</div>
                    <div className="font-mono">{position.quantity.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="opacity-50 uppercase text-xs mb-1">Entry Price</div>
                    <div className="font-mono">{formatCurrency(position.entryPrice)}</div>
                  </div>
                  <div>
                    <div className="opacity-50 uppercase text-xs mb-1">Current Price</div>
                    <div className="font-mono">
                      {position.currentPrice ? formatCurrency(position.currentPrice) : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="opacity-50 uppercase text-xs mb-1">Opened</div>
                    <div className="font-mono text-xs">{formatDateTime(position.openedAt)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Closed Positions */}
      {closedPositions.length > 0 && (
        <div>
          <h3 className="text-xl font-bold uppercase tracking-wider mb-4 text-blue-400">
            Recent Closed Positions ({closedPositions.length})
          </h3>
          <div className="space-y-4">
            {closedPositions.slice(0, 5).map(position => (
              <div key={position.id} className="border border-white/10 p-6 opacity-80">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-lg font-bold">{position.symbol}</div>
                    <div className={`px-2 py-1 border text-xs uppercase ${
                      position.side === 'LONG' ? 'border-green-500/50 text-green-500/50' : 'border-red-500/50 text-red-500/50'
                    }`}>
                      {position.side}
                    </div>
                    <div className="px-2 py-1 border border-blue-500/50 text-blue-500/50 text-xs uppercase">
                      CLOSED
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getPnlColor(position.pnl)}`}>
                      {formatCurrency(position.pnl)}
                    </div>
                    <div className={`text-sm ${getPnlColor(position.pnlPercent)}`}>
                      {formatPercent(position.pnlPercent)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <div className="opacity-50 uppercase text-xs mb-1">Quantity</div>
                    <div className="font-mono text-sm">{position.quantity.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="opacity-50 uppercase text-xs mb-1">Entry</div>
                    <div className="font-mono text-sm">{formatCurrency(position.entryPrice)}</div>
                  </div>
                  <div>
                    <div className="opacity-50 uppercase text-xs mb-1">Exit</div>
                    <div className="font-mono text-sm">
                      {position.currentPrice ? formatCurrency(position.currentPrice) : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="opacity-50 uppercase text-xs mb-1">Opened</div>
                    <div className="font-mono text-xs">{formatDateTime(position.openedAt)}</div>
                  </div>
                  <div>
                    <div className="opacity-50 uppercase text-xs mb-1">Closed</div>
                    <div className="font-mono text-xs">
                      {position.closedAt ? formatDateTime(position.closedAt) : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}