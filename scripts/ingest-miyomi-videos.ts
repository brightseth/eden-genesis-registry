#!/usr/bin/env npx tsx
// Ingest Miyomi's Eden videos into the Registry

import { PrismaClient } from '@prisma/client'
import axios from 'axios'
import { randomBytes } from 'crypto'

const prisma = new PrismaClient()

// Miyomi's Eden collection data
const COLLECTION_URL = 'https://app.eden.art/collections/68acce3a74876e833da2432a'
const COLLECTION_ID = '68acce3a74876e833da2432a'
const CREATOR = 'seth'

// Manually extracted video data from the collection
// Since we can't directly scrape Eden, you'll need to provide the video URLs
const MIYOMI_VIDEOS = [
  {
    title: "Miyomi's Market Chaos - Episode 1",
    description: "NYC trader vibes meet prediction markets",
    url: "", // Add Eden video URL here
    thumbnail: "",
    duration: "0:21",
    createdAt: "2025-08-25"
  },
  // Add more videos here as you get the URLs
]

interface VideoWork {
  title: string
  description: string
  mediaUrl: string
  thumbnailUrl?: string
  metadata: any
}

async function generateWorkId(): string {
  // Generate ULID-style ID
  const timestamp = Date.now().toString(36)
  const random = randomBytes(8).toString('hex')
  return `${timestamp}${random}`
}

async function ingestVideosToRegistry() {
  try {
    console.log('🎬 Ingesting Miyomi Videos to Registry')
    console.log('═'.repeat(60))
    
    // Find Miyomi in the Registry
    const miyomi = await prisma.agent.findFirst({
      where: { handle: 'miyomi' },
      include: { 
        cohort: true,
        profile: true
      }
    })

    if (!miyomi) {
      console.error('❌ Miyomi not found in Registry!')
      console.log('Please ensure Miyomi is registered first.')
      process.exit(1)
    }

    console.log(`✅ Found Miyomi (${miyomi.id}) in Registry`)
    console.log(`   Status: ${miyomi.status}`)
    console.log(`   Cohort: ${miyomi.cohort.name}`)

    // Process each video
    for (const video of MIYOMI_VIDEOS) {
      if (!video.url) {
        console.log(`⚠️ Skipping "${video.title}" - no URL provided`)
        continue
      }

      console.log(`\n📹 Processing: ${video.title}`)
      
      // Create a Creation record for the video
      const creation = await prisma.creation.create({
        data: {
          id: await generateWorkId(),
          agentId: miyomi.id,
          title: video.title,
          description: video.description,
          mediaType: 'VIDEO',
          mediaUrl: video.url,
          thumbnailUrl: video.thumbnail || video.url,
          status: 'PUBLISHED',
          visibility: 'PUBLIC',
          metadata: {
            source: 'eden',
            collectionId: COLLECTION_ID,
            collectionUrl: COLLECTION_URL,
            creator: CREATOR,
            duration: video.duration,
            platform: 'eden.art',
            tags: ['video', 'market-analysis', 'prediction', 'nyc', 'contrarian'],
            originalCreatedAt: video.createdAt
          }
        }
      })

      console.log(`   ✅ Added to Registry: ${creation.id}`)
      console.log(`   Title: ${creation.title}`)
      console.log(`   Status: ${creation.status}`)
    }

    // Update Miyomi's profile with video creation info
    if (miyomi.profile) {
      await prisma.profile.update({
        where: { agentId: miyomi.id },
        data: {
          links: {
            ...(miyomi.profile.links as any || {}),
            edenCollection: COLLECTION_URL,
            videoCount: MIYOMI_VIDEOS.filter(v => v.url).length
          }
        }
      })
    }

    // Get summary
    const totalCreations = await prisma.creation.count({
      where: { agentId: miyomi.id }
    })

    console.log('\n' + '═'.repeat(60))
    console.log('🎉 VIDEO INGESTION COMPLETE!')
    console.log(`   Total videos processed: ${MIYOMI_VIDEOS.filter(v => v.url).length}`)
    console.log(`   Total creations for Miyomi: ${totalCreations}`)
    console.log(`   Eden collection: ${COLLECTION_URL}`)
    
  } catch (error) {
    console.error('❌ Failed to ingest videos:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Helper function to fetch Eden collection data
// This would need Eden API access or manual URL collection
async function fetchEdenCollectionData(collectionId: string): Promise<VideoWork[]> {
  console.log('📥 Fetching Eden collection data...')
  
  // TODO: Implement actual Eden API calls here
  // For now, return empty array - videos need to be added manually
  console.log('⚠️ Eden API integration not implemented')
  console.log('Please add video URLs manually to MIYOMI_VIDEOS array')
  
  return []
}

// Run the ingestion
if (require.main === module) {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                  MIYOMI VIDEO INGESTION                     ║
║                                                            ║
║  This script will add Miyomi's Eden videos to the         ║
║  Genesis Registry as Creation records.                     ║
║                                                            ║
║  Collection: ${COLLECTION_ID}          ║
║  Creator: ${CREATOR}                                            ║
╚════════════════════════════════════════════════════════════╝
`)

  // Check if we should try to auto-fetch
  const autoFetch = process.argv.includes('--fetch')
  
  if (autoFetch) {
    console.log('🔄 Attempting to auto-fetch collection data...')
    fetchEdenCollectionData(COLLECTION_ID).then(videos => {
      if (videos.length > 0) {
        console.log(`Found ${videos.length} videos`)
        // Would update MIYOMI_VIDEOS here
      }
    })
  } else {
    console.log('💡 To add videos:')
    console.log('   1. Get video URLs from Eden collection')
    console.log('   2. Add them to MIYOMI_VIDEOS array in this script')
    console.log('   3. Run: npx tsx scripts/ingest-miyomi-videos.ts')
    console.log('\n📌 Note: You need to manually add video URLs from Eden')
  }

  // Only run if we have videos to process
  if (MIYOMI_VIDEOS.some(v => v.url)) {
    ingestVideosToRegistry()
  } else {
    console.log('\n⚠️ No video URLs found in MIYOMI_VIDEOS array')
    console.log('Please add video URLs first, then run this script again.')
  }
}