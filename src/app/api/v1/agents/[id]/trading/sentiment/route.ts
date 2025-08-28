import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/middleware/auth'

// GET /api/v1/agents/{id}/trading/sentiment
export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    
    const sentiment = await prisma.marketSentiment.findMany({
      where: { agentId },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    // Convert Decimal fields to numbers for JSON serialization
    const serializedSentiment = sentiment.map(item => ({
      ...item,
      score: Number(item.score)
    }))

    return NextResponse.json({ 
      sentiment: serializedSentiment,
      total: sentiment.length,
      latest: serializedSentiment[0] || null
    })
  } catch (error) {
    console.error('Failed to get market sentiment:', error)
    return NextResponse.json(
      { error: 'Failed to get market sentiment' },
      { status: 500 }
    )
  }
}

// POST /api/v1/agents/{id}/trading/sentiment - Create new sentiment analysis
export async function POST(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  const authResult = await withAuth(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const agentId = params.id
    const body = await request.json()
    const { 
      symbol,
      sentiment, 
      score, 
      contrarian_signal,
      data_sources,
      analysis 
    } = body

    // Generate contrarian signal based on sentiment if not provided
    let finalContrarianSignal = contrarian_signal
    if (!finalContrarianSignal && typeof score === 'number') {
      if (score <= 20) finalContrarianSignal = 'STRONG_BUY'
      else if (score <= 40) finalContrarianSignal = 'BUY'
      else if (score <= 60) finalContrarianSignal = 'HOLD'
      else if (score <= 80) finalContrarianSignal = 'SELL'
      else finalContrarianSignal = 'STRONG_SELL'
    }

    const marketSentiment = await prisma.marketSentiment.create({
      data: {
        agentId,
        symbol: symbol ? symbol.toUpperCase() : null,
        sentiment: sentiment.toUpperCase(),
        score: parseFloat(score),
        contrarian_signal: finalContrarianSignal,
        data_sources: data_sources || null,
        analysis: analysis || null
      }
    })

    // Serialize for JSON response
    const serializedSentiment = {
      ...marketSentiment,
      score: Number(marketSentiment.score)
    }

    return NextResponse.json(serializedSentiment, { status: 201 })
  } catch (error) {
    console.error('Failed to create market sentiment:', error)
    return NextResponse.json(
      { error: 'Failed to create market sentiment' },
      { status: 500 }
    )
  }
}