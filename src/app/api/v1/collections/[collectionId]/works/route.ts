/**
 * Collection Works Management API
 * Add, remove, and manage works within collections
 */

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { type Collection } from '@/lib/schemas/curation.schema'

// POST - Add work to collection
export async function POST(
  request: NextRequest,
  { params }: { params: { collectionId: string } }
) {
  try {
    const { collectionId } = params
    const body = await request.json()
    const { workId, curatorId, position, metadata } = body
    
    if (!workId) {
      return NextResponse.json(
        { success: false, error: 'workId is required' },
        { status: 400 }
      )
    }
    
    // Load collections
    const collectionsPath = path.join(process.cwd(), 'data', 'collections', 'collections.json')
    const data = await fs.readFile(collectionsPath, 'utf-8')
    const collections: Collection[] = JSON.parse(data)
    
    // Find collection
    const collectionIndex = collections.findIndex(c => c.id === collectionId)
    if (collectionIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Collection not found' },
        { status: 404 }
      )
    }
    
    const collection = collections[collectionIndex]
    
    // Check permissions
    const hasPermission = 
      collection.ownerId === curatorId ||
      collection.collaborators.some(c => 
        c.curatorId === curatorId && 
        (c.permissions.includes('add') || c.permissions.includes('admin'))
      )
    
    if (!hasPermission && curatorId) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    // Check if work already in collection
    if (collection.works.some(w => w.id === workId)) {
      return NextResponse.json(
        { success: false, error: 'Work already in collection' },
        { status: 409 }
      )
    }
    
    // Check acceptance criteria
    const work = await getWork(workId)
    if (work) {
      const meetsQuality = !collection.criteria.minQuality || 
        (work.analysis?.registry?.qualityScore || 0) >= collection.criteria.minQuality
      
      const meetsThemes = collection.criteria.requiredThemes.length === 0 ||
        collection.criteria.requiredThemes.some((t: string) => 
          work.themes?.includes(t)
        )
      
      if (!meetsQuality || !meetsThemes) {
        if (collection.criteria.autoAccept) {
          return NextResponse.json(
            { success: false, error: 'Work does not meet collection criteria' },
            { status: 422 }
          )
        }
      }
    }
    
    // Add work to collection
    const workEntry = {
      id: workId,
      addedAt: new Date(),
      addedBy: curatorId || collection.ownerId,
      position: position || collection.works.length,
      metadata: metadata || {}
    }
    
    collection.works.push(workEntry)
    
    // Update stats
    await updateCollectionStats(collection)
    
    collection.updatedAt = new Date()
    
    // Save collections
    await fs.writeFile(collectionsPath, JSON.stringify(collections, null, 2))
    
    // Update work's collection membership
    await updateWorkCollections(workId, collection, curatorId || collection.ownerId)
    
    return NextResponse.json({
      success: true,
      message: 'Work added to collection',
      collection: {
        id: collection.id,
        title: collection.title,
        totalWorks: collection.works.length
      }
    })
    
  } catch (error) {
    console.error('Add to collection error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove work from collection
export async function DELETE(
  request: NextRequest,
  { params }: { params: { collectionId: string } }
) {
  try {
    const { collectionId } = params
    const searchParams = request.nextUrl.searchParams
    const workId = searchParams.get('workId')
    const curatorId = searchParams.get('curatorId')
    
    if (!workId) {
      return NextResponse.json(
        { success: false, error: 'workId is required' },
        { status: 400 }
      )
    }
    
    // Load collections
    const collectionsPath = path.join(process.cwd(), 'data', 'collections', 'collections.json')
    const data = await fs.readFile(collectionsPath, 'utf-8')
    const collections: Collection[] = JSON.parse(data)
    
    // Find collection
    const collectionIndex = collections.findIndex(c => c.id === collectionId)
    if (collectionIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Collection not found' },
        { status: 404 }
      )
    }
    
    const collection = collections[collectionIndex]
    
    // Check permissions
    const hasPermission = 
      collection.ownerId === curatorId ||
      collection.collaborators.some(c => 
        c.curatorId === curatorId && 
        (c.permissions.includes('remove') || c.permissions.includes('admin'))
      )
    
    if (!hasPermission && curatorId) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    // Remove work from collection
    const initialLength = collection.works.length
    collection.works = collection.works.filter(w => w.id !== workId)
    
    if (collection.works.length === initialLength) {
      return NextResponse.json(
        { success: false, error: 'Work not found in collection' },
        { status: 404 }
      )
    }
    
    // Update stats
    await updateCollectionStats(collection)
    
    collection.updatedAt = new Date()
    
    // Save collections
    await fs.writeFile(collectionsPath, JSON.stringify(collections, null, 2))
    
    return NextResponse.json({
      success: true,
      message: 'Work removed from collection',
      collection: {
        id: collection.id,
        title: collection.title,
        totalWorks: collection.works.length
      }
    })
    
  } catch (error) {
    console.error('Remove from collection error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Get works in collection
export async function GET(
  request: NextRequest,
  { params }: { params: { collectionId: string } }
) {
  try {
    const { collectionId } = params
    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format') || 'full'
    
    // Load collections
    const collectionsPath = path.join(process.cwd(), 'data', 'collections', 'collections.json')
    const data = await fs.readFile(collectionsPath, 'utf-8')
    const collections: Collection[] = JSON.parse(data)
    
    // Find collection
    const collection = collections.find(c => c.id === collectionId)
    if (!collection) {
      return NextResponse.json(
        { success: false, error: 'Collection not found' },
        { status: 404 }
      )
    }
    
    // Get work details
    const worksWithDetails = []
    
    for (const workEntry of collection.works) {
      const work = await getWork(workEntry.id)
      if (work) {
        if (format === 'full') {
          worksWithDetails.push({
            ...workEntry,
            work
          })
        } else if (format === 'minimal') {
          worksWithDetails.push({
            ...workEntry,
            work: {
              id: work.id,
              title: work.title,
              medium: work.medium,
              thumbnail: work.files?.[0]?.url
            }
          })
        } else {
          worksWithDetails.push(workEntry)
        }
      }
    }
    
    // Sort by position
    worksWithDetails.sort((a, b) => (a.position || 0) - (b.position || 0))
    
    return NextResponse.json({
      success: true,
      collectionId,
      collectionTitle: collection.title,
      works: worksWithDetails,
      meta: {
        total: worksWithDetails.length,
        stats: collection.stats
      }
    })
    
  } catch (error) {
    console.error('Get collection works error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper to get work details
async function getWork(workId: string) {
  const agentId = workId.split('_')[0]
  const worksPath = path.join(process.cwd(), 'data', 'works', `${agentId}.json`)
  
  try {
    const data = await fs.readFile(worksPath, 'utf-8')
    const works = JSON.parse(data)
    return works.find((w: any) => w.id === workId)
  } catch {
    return null
  }
}

// Helper to update collection stats
async function updateCollectionStats(collection: Collection) {
  const themes: Record<string, number> = {}
  let totalQuality = 0
  let qualityCount = 0
  
  for (const workEntry of collection.works) {
    const work = await getWork(workEntry.id)
    if (work) {
      // Count themes
      for (const theme of (work.themes || [])) {
        themes[theme] = (themes[theme] || 0) + 1
      }
      
      // Sum quality scores
      if (work.analysis?.registry?.qualityScore) {
        totalQuality += work.analysis.registry.qualityScore
        qualityCount++
      }
    }
  }
  
  collection.stats = {
    totalWorks: collection.works.length,
    averageQuality: qualityCount > 0 ? totalQuality / qualityCount : 0,
    topThemes: Object.entries(themes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([theme]) => theme),
    viewCount: collection.stats.viewCount || 0,
    shareCount: collection.stats.shareCount || 0
  }
}

// Helper to update work's collection membership
async function updateWorkCollections(workId: string, collection: Collection, curatorId: string) {
  const agentId = workId.split('_')[0]
  const worksPath = path.join(process.cwd(), 'data', 'works', `${agentId}.json`)
  
  try {
    const data = await fs.readFile(worksPath, 'utf-8')
    const works = JSON.parse(data)
    
    const work = works.find((w: any) => w.id === workId)
    if (work) {
      if (!work.curation) {
        work.curation = {
          featured: false,
          curated: false,
          score: null,
          tags: [],
          collections: [],
          exhibitions: [],
          annotations: [],
          history: []
        }
      }
      
      // Add collection reference
      work.curation.collections.push({
        id: collection.id,
        name: collection.title,
        addedAt: new Date().toISOString(),
        addedBy: curatorId
      })
      
      // Add to history
      work.curation.history.push({
        action: 'collect',
        metadata: {
          collectionId: collection.id,
          collectionName: collection.title,
          collectionType: collection.type
        },
        timestamp: new Date().toISOString(),
        curatorId
      })
      
      await fs.writeFile(worksPath, JSON.stringify(works, null, 2))
    }
  } catch (error) {
    console.error('Failed to update work collections:', error)
  }
}