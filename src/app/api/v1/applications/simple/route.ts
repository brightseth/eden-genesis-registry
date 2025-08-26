import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// Simple file-based storage for applications
const APPLICATIONS_FILE = path.join(process.cwd(), 'data', 'applications.json')

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

async function getApplications() {
  await ensureDataDir()
  try {
    const data = await fs.readFile(APPLICATIONS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveApplications(applications: Record<string, unknown>[]) {
  await ensureDataDir()
  await fs.writeFile(APPLICATIONS_FILE, JSON.stringify(applications, null, 2))
}

// GET /api/v1/applications/simple
export async function GET() {
  try {
    const applications = await getApplications()
    return NextResponse.json({
      applications,
      total: applications.length
    })
  } catch (error) {
    console.error('Failed to get applications:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve applications' },
      { status: 500 }
    )
  }
}

// POST /api/v1/applications/simple
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Basic validation
    if (!body.applicantName || !body.payload?.name || !body.payload?.handle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Create application
    const application = {
      id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...body
    }
    
    // Save to file
    const applications = await getApplications()
    applications.push(application)
    await saveApplications(applications)
    
    // Log to console for monitoring
    console.log('New Genesis application received:', {
      name: application.payload.name,
      handle: application.payload.handle,
      role: application.payload.role,
      id: application.id
    })
    
    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    console.error('Failed to create application:', error)
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    )
  }
}