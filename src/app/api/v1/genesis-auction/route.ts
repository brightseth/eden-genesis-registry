import { NextRequest, NextResponse } from 'next/server'
import { ABRAHAM_GENESIS_COLLECTION, GENESIS_AUCTION_CONFIG, COLLECTION_METRICS } from '@/data/abraham-genesis-artifacts'

// GET /api/v1/genesis-auction - Get auction status and collection data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const artifactId = searchParams.get('artifact')

    if (artifactId) {
      // Return specific artifact data
      const artifact = ABRAHAM_GENESIS_COLLECTION.find(a => a.id === artifactId)
      if (!artifact) {
        return NextResponse.json(
          { error: 'Artifact not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        artifact,
        auctionConfig: GENESIS_AUCTION_CONFIG,
        currentBid: 100, // Would be fetched from blockchain/database
        bidHistory: [], // Would be populated from actual bid data
        timeRemaining: calculateTimeRemaining(),
        isLive: isAuctionLive()
      })
    }

    // Return full collection overview
    return NextResponse.json({
      success: true,
      collection: ABRAHAM_GENESIS_COLLECTION,
      config: GENESIS_AUCTION_CONFIG,
      metrics: COLLECTION_METRICS,
      status: {
        isLive: isAuctionLive(),
        launchDate: GENESIS_AUCTION_CONFIG.launchDate,
        timeRemaining: calculateTimeRemaining(),
        totalArtifacts: ABRAHAM_GENESIS_COLLECTION.length
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Genesis auction API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch auction data' },
      { status: 500 }
    )
  }
}

// POST /api/v1/genesis-auction - Submit a bid (placeholder for blockchain integration)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { artifactId, bidAmount, bidderAddress } = body

    // Validate bid data
    if (!artifactId || !bidAmount || !bidderAddress) {
      return NextResponse.json(
        { error: 'Missing required bid parameters' },
        { status: 400 }
      )
    }

    const artifact = ABRAHAM_GENESIS_COLLECTION.find(a => a.id === artifactId)
    if (!artifact) {
      return NextResponse.json(
        { error: 'Artifact not found' },
        { status: 404 }
      )
    }

    // Check if auction is live
    if (!isAuctionLive()) {
      return NextResponse.json(
        { error: 'Auction not yet live' },
        { status: 400 }
      )
    }

    // Validate bid amount (simplified - would check against current highest bid)
    if (bidAmount < GENESIS_AUCTION_CONFIG.startingBid) {
      return NextResponse.json(
        { error: `Bid must be at least $${GENESIS_AUCTION_CONFIG.startingBid}` },
        { status: 400 }
      )
    }

    // TODO: In production, this would:
    // 1. Submit transaction to blockchain
    // 2. Update bid tracking database
    // 3. Notify other bidders
    // 4. Update auction timers
    
    // For now, return success with placeholder data
    return NextResponse.json({
      success: true,
      bidId: `bid_${Date.now()}`,
      artifactId,
      bidAmount,
      bidderAddress,
      timestamp: new Date().toISOString(),
      message: 'Bid submitted successfully',
      nextMinimumBid: bidAmount + 1
    })
  } catch (error) {
    console.error('Genesis auction bid error:', error)
    return NextResponse.json(
      { error: 'Failed to submit bid' },
      { status: 500 }
    )
  }
}

function isAuctionLive(): boolean {
  const launchDate = new Date(GENESIS_AUCTION_CONFIG.launchDate)
  const now = new Date()
  return now >= launchDate
}

function calculateTimeRemaining(): string {
  const launchDate = new Date(GENESIS_AUCTION_CONFIG.launchDate)
  const now = new Date()
  
  if (now < launchDate) {
    // Time until launch
    const diff = launchDate.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    return `${days}d ${hours}h until launch`
  } else {
    // Time remaining in auction (7 days from launch)
    const auctionEnd = new Date(launchDate.getTime() + GENESIS_AUCTION_CONFIG.duration)
    if (now >= auctionEnd) {
      return 'Auction ended'
    }
    
    const diff = auctionEnd.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    return `${days}d ${hours}h remaining`
  }
}