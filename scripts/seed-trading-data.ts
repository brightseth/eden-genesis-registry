import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedTradingData() {
  console.log('🚀 Seeding trading data for MIYOMI...')

  // Find MIYOMI agent
  const miyomi = await prisma.agent.findFirst({
    where: { handle: 'miyomi' }
  })

  if (!miyomi) {
    console.error('❌ MIYOMI agent not found')
    process.exit(1)
  }

  console.log(`✅ Found MIYOMI agent: ${miyomi.displayName} (${miyomi.id})`)

  // Create trading positions
  const positions = [
    {
      symbol: 'BTC',
      side: 'LONG',
      quantity: 0.5,
      entryPrice: 42000,
      currentPrice: 45000,
      status: 'OPEN'
    },
    {
      symbol: 'ETH',
      side: 'LONG',
      quantity: 2.0,
      entryPrice: 2800,
      currentPrice: 3200,
      status: 'OPEN'
    },
    {
      symbol: 'SOL',
      side: 'SHORT',
      quantity: 10,
      entryPrice: 180,
      currentPrice: 165,
      status: 'OPEN'
    },
    {
      symbol: 'BTC',
      side: 'LONG',
      quantity: 0.3,
      entryPrice: 38000,
      currentPrice: 42000,
      status: 'CLOSED'
    },
    {
      symbol: 'ETH',
      side: 'SHORT',
      quantity: 1.5,
      entryPrice: 3500,
      currentPrice: 3200,
      status: 'CLOSED'
    }
  ]

  console.log('💰 Creating trading positions...')
  for (const posData of positions) {
    const pnl = posData.currentPrice ? 
      (posData.currentPrice - posData.entryPrice) * posData.quantity * (posData.side === 'LONG' ? 1 : -1) : 
      0
    const pnlPercent = posData.entryPrice !== 0 ? (pnl / (posData.entryPrice * posData.quantity)) * 100 : 0

    await prisma.tradingPosition.create({
      data: {
        agentId: miyomi.id,
        symbol: posData.symbol,
        side: posData.side,
        quantity: posData.quantity,
        entryPrice: posData.entryPrice,
        currentPrice: posData.currentPrice,
        pnl,
        pnlPercent,
        status: posData.status,
        openedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last week
        closedAt: posData.status === 'CLOSED' ? new Date() : null
      }
    })
  }

  // Create trading signals
  const signals = [
    {
      symbol: 'BTC',
      signal: 'BUY',
      confidence: 85.5,
      reasoning: 'Market showing extreme fear (score 18), perfect contrarian opportunity. Technical support at $42k holding strong.',
      targetPrice: 48000,
      stopLoss: 40000,
      timeframe: '1W',
      status: 'ACTIVE'
    },
    {
      symbol: 'ETH',
      signal: 'STRONG_BUY',
      confidence: 92.3,
      reasoning: 'Fear index at 15 - historically excellent entry point. Ethereum fundamentals remain strong with upcoming upgrades.',
      targetPrice: 3800,
      stopLoss: 2600,
      timeframe: '2W',
      status: 'ACTIVE'
    },
    {
      symbol: 'SOL',
      signal: 'SELL',
      confidence: 76.8,
      reasoning: 'Greed index climbing to 75. Recent 300% run showing signs of exhaustion. Time to take profits.',
      targetPrice: 140,
      stopLoss: 190,
      timeframe: '4H',
      status: 'FILLED'
    },
    {
      symbol: 'MATIC',
      signal: 'HOLD',
      confidence: 55.2,
      reasoning: 'Neutral sentiment (score 52). Waiting for clearer directional signals before taking action.',
      timeframe: '1D',
      status: 'EXPIRED'
    }
  ]

  console.log('📊 Creating trading signals...')
  for (const signalData of signals) {
    await prisma.tradingSignal.create({
      data: {
        agentId: miyomi.id,
        symbol: signalData.symbol,
        signal: signalData.signal,
        confidence: signalData.confidence,
        reasoning: signalData.reasoning,
        targetPrice: signalData.targetPrice || null,
        stopLoss: signalData.stopLoss || null,
        timeframe: signalData.timeframe,
        status: signalData.status,
        createdAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000) // Random time in last 3 days
      }
    })
  }

  // Create market sentiment data
  const sentimentData = [
    {
      sentiment: 'EXTREME_FEAR',
      score: 18.5,
      contrarian_signal: 'STRONG_BUY',
      analysis: 'Market panic creating exceptional buying opportunities. When others are fearful, be greedy. Historical analysis shows 18-20 fear levels preceded major rallies.',
      createdAt: new Date()
    },
    {
      sentiment: 'FEAR',
      score: 32.1,
      contrarian_signal: 'BUY',
      analysis: 'Widespread fear still dominating sentiment. Smart money accumulating while retail investors capitulate. Contrarian signals strengthening.',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
    },
    {
      sentiment: 'GREED',
      score: 78.3,
      contrarian_signal: 'SELL',
      analysis: 'Euphoria reaching dangerous levels. Everyone talking about crypto again - classic top signal. Time to reduce exposure.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      sentiment: 'EXTREME_GREED',
      score: 89.7,
      contrarian_signal: 'STRONG_SELL',
      analysis: 'Peak euphoria detected. Taxi drivers asking about crypto investments. Classic bubble territory - major correction incoming.',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    }
  ]

  console.log('😨 Creating market sentiment data...')
  for (const sentiment of sentimentData) {
    await prisma.marketSentiment.create({
      data: {
        agentId: miyomi.id,
        sentiment: sentiment.sentiment,
        score: sentiment.score,
        contrarian_signal: sentiment.contrarian_signal,
        analysis: sentiment.analysis,
        createdAt: sentiment.createdAt,
        data_sources: {
          sources: ['Fear & Greed Index', 'Social Sentiment', 'Market Volatility', 'Trading Volume'],
          timestamp: sentiment.createdAt.toISOString()
        }
      }
    })
  }

  // Calculate and create trading metrics
  console.log('📈 Calculating trading metrics...')
  const closedPositions = await prisma.tradingPosition.findMany({
    where: { 
      agentId: miyomi.id,
      status: 'CLOSED'
    }
  })

  if (closedPositions.length > 0) {
    const totalTrades = closedPositions.length
    const winningTrades = closedPositions.filter(p => Number(p.pnl) > 0).length
    const losingTrades = closedPositions.filter(p => Number(p.pnl) < 0).length
    const winRate = (winningTrades / totalTrades) * 100

    const totalPnl = closedPositions.reduce((sum, p) => sum + Number(p.pnl), 0)
    const totalVolume = closedPositions.reduce((sum, p) => sum + (Number(p.entryPrice) * Number(p.quantity)), 0)
    const totalPnlPercent = (totalPnl / totalVolume) * 100

    const winningPositions = closedPositions.filter(p => Number(p.pnl) > 0)
    const losingPositions = closedPositions.filter(p => Number(p.pnl) < 0)

    const averageWin = winningPositions.length > 0 ? 
      winningPositions.reduce((sum, p) => sum + Number(p.pnl), 0) / winningPositions.length : 0
    const averageLoss = losingPositions.length > 0 ? 
      losingPositions.reduce((sum, p) => sum + Number(p.pnl), 0) / losingPositions.length : 0

    const grossProfit = winningPositions.reduce((sum, p) => sum + Number(p.pnl), 0)
    const grossLoss = Math.abs(losingPositions.reduce((sum, p) => sum + Number(p.pnl), 0))
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 999

    await prisma.tradingMetrics.create({
      data: {
        agentId: miyomi.id,
        period: 'ALL_TIME',
        startDate: new Date('2024-01-01'),
        endDate: new Date(),
        totalTrades,
        winningTrades,
        losingTrades,
        winRate,
        totalPnl,
        totalPnlPercent,
        averageWin,
        averageLoss,
        profitFactor,
        sharpeRatio: 1.85, // Example Sharpe ratio
        maxDrawdown: 15.3, // Example max drawdown
        volume: totalVolume,
        metadata: {
          generatedAt: new Date().toISOString(),
          note: 'Seed data for demo purposes'
        }
      }
    })
  }

  console.log('✅ Trading data seeded successfully!')
  console.log(`
📊 Summary:
   • ${positions.length} trading positions created
   • ${signals.length} trading signals created  
   • ${sentimentData.length} sentiment analyses created
   • Trading metrics calculated and stored

🎯 Next steps:
   1. Visit /agents/miyomi/trading to see the dashboard
   2. All API endpoints are ready for real-time updates
   3. Contrarian signals are active based on fear/greed levels
`)

  await prisma.$disconnect()
}

seedTradingData().catch((error) => {
  console.error('Error seeding trading data:', error)
  process.exit(1)
})