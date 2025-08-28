'use client'

interface MarketSentimentData {
  id: string
  symbol?: string
  sentiment: string
  score: number
  contrarian_signal?: string
  analysis?: string
  createdAt: string
}

interface MarketSentimentProps {
  sentiment: MarketSentimentData[]
}

export function MarketSentiment({ sentiment }: MarketSentimentProps) {
  const latestSentiment = sentiment.slice(0, 1)[0]
  const recentSentiment = sentiment.slice(0, 10)

  const getSentimentColor = (sentimentType: string) => {
    switch (sentimentType.toLowerCase()) {
      case 'extreme_fear':
        return 'border-red-600 text-red-400 bg-red-600/20'
      case 'fear':
        return 'border-red-400 text-red-300 bg-red-400/10'
      case 'neutral':
        return 'border-gray-400 text-gray-300 bg-gray-400/10'
      case 'greed':
        return 'border-green-400 text-green-300 bg-green-400/10'
      case 'extreme_greed':
        return 'border-green-600 text-green-400 bg-green-600/20'
      default:
        return 'border-gray-500 text-gray-400 bg-gray-500/10'
    }
  }

  const getContrarianColor = (signal?: string) => {
    if (!signal) return 'text-gray-400'
    switch (signal.toLowerCase()) {
      case 'strong_buy':
        return 'text-green-400 font-bold'
      case 'buy':
        return 'text-green-300'
      case 'hold':
        return 'text-yellow-400'
      case 'sell':
        return 'text-red-300'
      case 'strong_sell':
        return 'text-red-400 font-bold'
      default:
        return 'text-gray-400'
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const formatSentimentLabel = (sentiment: string) => {
    return sentiment.replace('_', ' ').toUpperCase()
  }

  const formatContrarianSignal = (signal?: string) => {
    if (!signal) return 'NO SIGNAL'
    return signal.replace('_', ' ').toUpperCase()
  }

  const getSentimentMeter = (score: number) => {
    // Convert score to 0-100 range for display
    const normalizedScore = Math.max(0, Math.min(100, score))
    
    let color = 'bg-gray-400'
    if (normalizedScore <= 20) color = 'bg-red-600'
    else if (normalizedScore <= 40) color = 'bg-red-400'
    else if (normalizedScore <= 60) color = 'bg-gray-400'
    else if (normalizedScore <= 80) color = 'bg-green-400'
    else color = 'bg-green-600'

    return (
      <div className="w-full bg-gray-700 rounded-full h-3">
        <div 
          className={`h-3 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${normalizedScore}%` }}
        ></div>
      </div>
    )
  }

  if (sentiment.length === 0) {
    return (
      <div className="space-y-8">
        <div className="border border-white/20 p-8 text-center">
          <div className="text-lg uppercase opacity-70">No Market Sentiment Data</div>
          <div className="text-sm opacity-50 mt-2">MIYOMI's contrarian analysis will appear here</div>
        </div>

        {/* Mock Sentiment for Demo */}
        <div className="border border-white/10 p-6">
          <h3 className="text-xl font-bold uppercase tracking-wider mb-4 text-purple-400">
            MIYOMI Contrarian Analysis Framework
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-bold uppercase mb-3 text-white/80">Sentiment Levels</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-red-400">Extreme Fear (0-20)</span>
                  <span className="text-green-400">→ Strong Buy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-300">Fear (21-40)</span>
                  <span className="text-green-300">→ Buy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Neutral (41-60)</span>
                  <span className="text-yellow-400">→ Hold</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-300">Greed (61-80)</span>
                  <span className="text-red-300">→ Sell</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-400">Extreme Greed (81-100)</span>
                  <span className="text-red-400">→ Strong Sell</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold uppercase mb-3 text-white/80">Contrarian Strategy</h4>
              <div className="text-white/70 space-y-2">
                <p>• When others are fearful, be greedy</p>
                <p>• When others are greedy, be fearful</p>
                <p>• Extreme sentiment = opportunity</p>
                <p>• Market psychology drives price action</p>
                <p>• Contrarian timing beats following crowds</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Current Market Sentiment */}
      {latestSentiment && (
        <div>
          <h3 className="text-xl font-bold uppercase tracking-wider mb-4 text-purple-400">
            Current Market Sentiment
          </h3>
          <div className="border border-white/20 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="opacity-50 uppercase text-xs mb-2">Market Sentiment</div>
                <div className={`text-3xl font-bold px-4 py-2 border rounded ${getSentimentColor(latestSentiment.sentiment)}`}>
                  {formatSentimentLabel(latestSentiment.sentiment)}
                </div>
                <div className="mt-3 text-sm opacity-70">
                  Score: {latestSentiment.score.toFixed(1)}
                </div>
              </div>

              <div className="text-center">
                <div className="opacity-50 uppercase text-xs mb-2">Sentiment Meter</div>
                <div className="px-4">
                  {getSentimentMeter(latestSentiment.score)}
                </div>
                <div className="mt-3 text-xs opacity-50">
                  {latestSentiment.score <= 20 ? 'EXTREME FEAR' :
                   latestSentiment.score <= 40 ? 'FEAR' :
                   latestSentiment.score <= 60 ? 'NEUTRAL' :
                   latestSentiment.score <= 80 ? 'GREED' : 'EXTREME GREED'}
                </div>
              </div>

              <div className="text-center">
                <div className="opacity-50 uppercase text-xs mb-2">Contrarian Signal</div>
                <div className={`text-2xl font-bold ${getContrarianColor(latestSentiment.contrarian_signal)}`}>
                  {formatContrarianSignal(latestSentiment.contrarian_signal)}
                </div>
                <div className="mt-3 text-xs opacity-70">
                  {formatDateTime(latestSentiment.createdAt)}
                </div>
              </div>
            </div>

            {latestSentiment.analysis && (
              <div className="border-t border-white/10 pt-4">
                <div className="opacity-50 uppercase text-xs mb-2">MIYOMI's Contrarian Analysis</div>
                <div className="text-sm leading-relaxed text-white/80 italic">
                  "{latestSentiment.analysis}"
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sentiment History */}
      {recentSentiment.length > 1 && (
        <div>
          <h3 className="text-xl font-bold uppercase tracking-wider mb-4 text-blue-400">
            Sentiment History
          </h3>
          <div className="space-y-3">
            {recentSentiment.slice(1).map(item => (
              <div key={item.id} className="border border-white/10 p-4 opacity-70">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 border text-sm uppercase ${getSentimentColor(item.sentiment)}`}>
                      {formatSentimentLabel(item.sentiment)}
                    </div>
                    <div className="text-sm font-mono">
                      Score: {item.score.toFixed(1)}
                    </div>
                    {item.contrarian_signal && (
                      <div className={`text-sm font-bold ${getContrarianColor(item.contrarian_signal)}`}>
                        → {formatContrarianSignal(item.contrarian_signal)}
                      </div>
                    )}
                  </div>
                  <div className="text-xs opacity-50">
                    {formatDateTime(item.createdAt)}
                  </div>
                </div>

                {item.analysis && (
                  <div className="text-xs text-white/60 italic truncate">
                    "{item.analysis}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contrarian Strategy Explanation */}
      <div className="border border-purple-500/20 p-6 bg-purple-500/5">
        <h3 className="text-lg font-bold uppercase tracking-wider mb-4 text-purple-400">
          🧠 Contrarian Trading Logic
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-bold mb-3 text-white/80">When Market Shows FEAR:</h4>
            <div className="text-green-400 space-y-1">
              <p>• Opportunities emerge from panic selling</p>
              <p>• Quality assets become undervalued</p>
              <p>• Smart money accumulates positions</p>
              <p>• MIYOMI signals: BUY or STRONG_BUY</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-white/80">When Market Shows GREED:</h4>
            <div className="text-red-400 space-y-1">
              <p>• Euphoria leads to overvaluation</p>
              <p>• Bubble conditions may be forming</p>
              <p>• Risk management becomes critical</p>
              <p>• MIYOMI signals: SELL or STRONG_SELL</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}