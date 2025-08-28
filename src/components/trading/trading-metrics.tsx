'use client'

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

interface TradingMetricsProps {
  metrics: TradingMetricsData | null
}

export function TradingMetrics({ metrics }: TradingMetricsProps) {
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

  const formatNumber = (num: number, decimals = 2) => {
    return num.toFixed(decimals)
  }

  const getPerformanceColor = (value: number, isPercentage = false) => {
    if (value > 0) return 'text-green-400'
    if (value < 0) return 'text-red-400'
    return 'text-white'
  }

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 60) return 'text-green-400'
    if (winRate >= 45) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getProfitFactorColor = (profitFactor: number) => {
    if (profitFactor >= 2.0) return 'text-green-400'
    if (profitFactor >= 1.5) return 'text-yellow-400'
    if (profitFactor >= 1.0) return 'text-white'
    return 'text-red-400'
  }

  const getSharpeRatioColor = (sharpeRatio?: number) => {
    if (!sharpeRatio) return 'text-gray-400'
    if (sharpeRatio >= 2.0) return 'text-green-400'
    if (sharpeRatio >= 1.0) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getGradeFromWinRate = (winRate: number) => {
    if (winRate >= 70) return { grade: 'A+', color: 'text-green-400' }
    if (winRate >= 65) return { grade: 'A', color: 'text-green-400' }
    if (winRate >= 60) return { grade: 'A-', color: 'text-green-300' }
    if (winRate >= 55) return { grade: 'B+', color: 'text-yellow-400' }
    if (winRate >= 50) return { grade: 'B', color: 'text-yellow-300' }
    if (winRate >= 45) return { grade: 'B-', color: 'text-yellow-200' }
    if (winRate >= 40) return { grade: 'C+', color: 'text-orange-400' }
    if (winRate >= 35) return { grade: 'C', color: 'text-orange-300' }
    if (winRate >= 30) return { grade: 'C-', color: 'text-red-300' }
    return { grade: 'D', color: 'text-red-400' }
  }

  if (!metrics) {
    return (
      <div className="border border-white/20 p-8 text-center">
        <div className="text-lg uppercase opacity-70">No Trading Metrics Available</div>
        <div className="text-sm opacity-50 mt-2">Performance data will appear after trading activity</div>
      </div>
    )
  }

  const grade = getGradeFromWinRate(metrics.winRate)

  return (
    <div className="space-y-8">
      {/* Performance Summary */}
      <div>
        <h3 className="text-xl font-bold uppercase tracking-wider mb-4 text-green-400">
          Performance Summary - {metrics.period.replace('_', ' ')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="border border-white/20 p-4 text-center">
            <div className="text-3xl font-bold text-white mb-2">{metrics.totalTrades}</div>
            <div className="text-sm uppercase opacity-70">Total Trades</div>
          </div>
          <div className="border border-white/20 p-4 text-center">
            <div className={`text-3xl font-bold mb-2 ${getWinRateColor(metrics.winRate)}`}>
              {formatPercent(metrics.winRate)}
            </div>
            <div className="text-sm uppercase opacity-70">Win Rate</div>
            <div className={`text-xs mt-1 font-bold ${grade.color}`}>
              Grade: {grade.grade}
            </div>
          </div>
          <div className="border border-white/20 p-4 text-center">
            <div className={`text-3xl font-bold mb-2 ${getPerformanceColor(metrics.totalPnl)}`}>
              {formatCurrency(metrics.totalPnl)}
            </div>
            <div className="text-sm uppercase opacity-70">Total P&L</div>
          </div>
          <div className="border border-white/20 p-4 text-center">
            <div className={`text-3xl font-bold mb-2 ${getPerformanceColor(metrics.totalPnlPercent)}`}>
              {formatPercent(metrics.totalPnlPercent)}
            </div>
            <div className="text-sm uppercase opacity-70">Return %</div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div>
        <h3 className="text-xl font-bold uppercase tracking-wider mb-4 text-blue-400">
          Detailed Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Win/Loss Breakdown */}
          <div className="border border-white/20 p-6">
            <h4 className="text-lg font-bold uppercase mb-4 text-white/80">Trade Breakdown</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-green-400">Winning Trades:</span>
                <span className="font-bold text-green-400">{metrics.winningTrades}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-400">Losing Trades:</span>
                <span className="font-bold text-red-400">{metrics.losingTrades}</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between">
                <span>Total Volume:</span>
                <span className="font-bold">{formatCurrency(metrics.volume)}</span>
              </div>
            </div>
          </div>

          {/* Average Performance */}
          <div className="border border-white/20 p-6">
            <h4 className="text-lg font-bold uppercase mb-4 text-white/80">Average Performance</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-green-400">Avg Win:</span>
                <span className="font-bold text-green-400">{formatCurrency(metrics.averageWin)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-400">Avg Loss:</span>
                <span className="font-bold text-red-400">{formatCurrency(metrics.averageLoss)}</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between">
                <span>Win/Loss Ratio:</span>
                <span className="font-bold">
                  {metrics.averageLoss !== 0 ? 
                    formatNumber(Math.abs(metrics.averageWin / metrics.averageLoss)) + ':1' : 
                    'N/A'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Risk Metrics */}
          <div className="border border-white/20 p-6">
            <h4 className="text-lg font-bold uppercase mb-4 text-white/80">Risk Metrics</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Profit Factor:</span>
                <span className={`font-bold ${getProfitFactorColor(metrics.profitFactor)}`}>
                  {formatNumber(metrics.profitFactor)}
                </span>
              </div>
              {metrics.sharpeRatio && (
                <div className="flex justify-between">
                  <span>Sharpe Ratio:</span>
                  <span className={`font-bold ${getSharpeRatioColor(metrics.sharpeRatio)}`}>
                    {formatNumber(metrics.sharpeRatio)}
                  </span>
                </div>
              )}
              {metrics.maxDrawdown && (
                <div className="flex justify-between">
                  <span className="text-red-400">Max Drawdown:</span>
                  <span className="font-bold text-red-400">
                    {formatPercent(metrics.maxDrawdown)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="border border-blue-500/20 p-6 bg-blue-500/5">
        <h3 className="text-lg font-bold uppercase tracking-wider mb-4 text-blue-400">
          🎯 MIYOMI Performance Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-bold mb-3 text-white/80">Trading Strength:</h4>
            <div className="space-y-2">
              {metrics.winRate >= 50 && (
                <p className="text-green-400">✓ Above-average win rate ({formatPercent(metrics.winRate)})</p>
              )}
              {metrics.profitFactor >= 1.5 && (
                <p className="text-green-400">✓ Strong profit factor ({formatNumber(metrics.profitFactor)})</p>
              )}
              {metrics.totalPnlPercent > 0 && (
                <p className="text-green-400">✓ Profitable overall ({formatPercent(metrics.totalPnlPercent)})</p>
              )}
              {metrics.averageWin > Math.abs(metrics.averageLoss) && (
                <p className="text-green-400">✓ Winners exceed losers on average</p>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-white/80">Areas to Watch:</h4>
            <div className="space-y-2">
              {metrics.winRate < 45 && (
                <p className="text-yellow-400">⚠ Win rate could be improved ({formatPercent(metrics.winRate)})</p>
              )}
              {metrics.profitFactor < 1.2 && (
                <p className="text-yellow-400">⚠ Profit factor needs improvement ({formatNumber(metrics.profitFactor)})</p>
              )}
              {metrics.maxDrawdown && metrics.maxDrawdown > 20 && (
                <p className="text-red-400">⚠ High drawdown risk ({formatPercent(metrics.maxDrawdown)})</p>
              )}
              {metrics.totalTrades < 10 && (
                <p className="text-gray-400">ℹ Limited sample size ({metrics.totalTrades} trades)</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}