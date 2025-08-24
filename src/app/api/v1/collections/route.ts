/**
 * Collection Management API
 * Manage curated collections across all agents
 */

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { ulid } from 'ulid'
import { CollectionSchema, type Collection } from '@/lib/schemas/curation.schema'

// GET - List collections
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ownerId = searchParams.get('ownerId')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const visibility = searchParams.get('visibility')
    
    const collectionsPath = path.join(process.cwd(), 'data', 'collections', 'collections.json')
    
    // Initialize file if it doesn't exist
    try {
      await fs.access(collectionsPath)
    } catch {
      await fs.mkdir(path.dirname(collectionsPath), { recursive: true })
      await fs.writeFile(collectionsPath, '[]')
    }
    
    const data = await fs.readFile(collectionsPath, 'utf-8')
    let collections: Collection[] = JSON.parse(data)
    
    // Apply filters
    if (ownerId) {
      collections = collections.filter(c => 
        c.ownerId === ownerId || 
        c.collaborators.some(collab => collab.curatorId === ownerId)
      )
    }
    
    if (type) {
      collections = collections.filter(c => c.type === type)
    }
    
    if (status) {
      collections = collections.filter(c => c.status === status)
    }
    
    if (visibility) {
      collections = collections.filter(c => c.visibility === visibility)
    }
    
    // Sort by updated date
    collections.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    
    return NextResponse.json({
      success: true,
      collections,
      meta: {
        total: collections.length,
        byType: collections.reduce((acc, c) => {
          acc[c.type] = (acc[c.type] || 0) + 1
          return acc
        }, {} as Record<string, number>),
        byStatus: collections.reduce((acc, c) => {
          acc[c.status] = (acc[c.status] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      }
    })
    
  } catch (error) {
    console.error('Collections GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new collection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Calculate initial stats
    const stats = {
      totalWorks: 0,
      averageQuality: 0,
      topThemes: [],
      viewCount: 0,
      shareCount: 0
    }
    
    // Create collection
    const collectionData = {
      ...body,
      id: ulid(),
      works: [],
      stats,
      collaborators: body.collaborators || [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const collection = CollectionSchema.parse(collectionData)
    
    // Load existing collections
    const collectionsPath = path.join(process.cwd(), 'data', 'collections', 'collections.json')
    
    // Initialize file if it doesn't exist
    try {
      await fs.access(collectionsPath)
    } catch {
      await fs.mkdir(path.dirname(collectionsPath), { recursive: true })
      await fs.writeFile(collectionsPath, '[]')
    }
    
    const data = await fs.readFile(collectionsPath, 'utf-8')
    const collections = JSON.parse(data)
    
    // Add new collection
    collections.push(collection)
    
    // Save collections
    await fs.writeFile(collectionsPath, JSON.stringify(collections, null, 2))
    
    return NextResponse.json({
      success: true,
      collection,
      message: 'Collection created successfully'
    })
    
  } catch (error) {
    console.error('Collection creation error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}