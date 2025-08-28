/**
 * Academy Documentation Federation Template
 * Template for Academy to consume Registry documentation via API
 * This should be implemented in the Academy codebase
 */

import { useState, useEffect } from 'react'

interface RegistryDocument {
  id: string
  title: string
  slug: string
  category: 'adr' | 'api' | 'technical' | 'integration'
  summary: string
  lastModified: string
  status: 'draft' | 'published' | 'archived'
  content?: string
  tableOfContents?: Array<{
    level: number
    title: string
    anchor: string
  }>
}

interface RegistryDocsResponse {
  categories: Array<{
    name: string
    slug: string
    count: number
  }>
  documents: RegistryDocument[]
  total: number
}

// Registry API Client
class RegistryDocsClient {
  private baseUrl: string

  constructor(baseUrl = 'https://registry.eden.art') {
    this.baseUrl = baseUrl
  }

  async getAllDocs(): Promise<RegistryDocsResponse> {
    const response = await fetch(`${this.baseUrl}/api/v1/docs`)
    if (!response.ok) throw new Error('Failed to fetch documentation')
    return response.json()
  }

  async getDocsByCategory(category: string): Promise<{ documents: RegistryDocument[] }> {
    const response = await fetch(`${this.baseUrl}/api/v1/docs/${category}`)
    if (!response.ok) throw new Error(`Failed to fetch ${category} documentation`)
    return response.json()
  }

  async getDocument(category: string, slug: string): Promise<RegistryDocument> {
    const response = await fetch(`${this.baseUrl}/api/v1/docs/${category}/${slug}`)
    if (!response.ok) throw new Error(`Failed to fetch document ${category}/${slug}`)
    return response.json()
  }
}

// Academy Documentation Page Component
export function AcademyRegistryDocsPage() {
  const [registryDocs, setRegistryDocs] = useState<RegistryDocsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const registryClient = new RegistryDocsClient()

  useEffect(() => {
    async function fetchRegistryDocs() {
      try {
        const docs = await registryClient.getAllDocs()
        setRegistryDocs(docs)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchRegistryDocs()
  }, [])

  if (loading) return <div>Loading Registry documentation...</div>
  if (error) return <div>Error loading Registry docs: {error}</div>
  if (!registryDocs) return <div>No documentation available</div>

  return (
    <div className="registry-docs-federation">
      <div className="docs-header">
        <h1>Registry Documentation</h1>
        <div className="source-attribution">
          📚 <strong>Source:</strong> Eden Genesis Registry
          <span className="live-indicator">● Live</span>
        </div>
      </div>

      <div className="docs-categories">
        {registryDocs.categories.map((category) => (
          <div key={category.slug} className="category-card">
            <h3>{category.name}</h3>
            <span className="document-count">{category.count} documents</span>
          </div>
        ))}
      </div>

      <div className="recent-docs">
        <h2>Recent Documentation</h2>
        {registryDocs.documents.map((doc) => (
          <div key={doc.id} className="doc-card">
            <h3>{doc.title}</h3>
            <p>{doc.summary}</p>
            <div className="doc-meta">
              <span className="category">{doc.category}</span>
              <span className="updated">
                Updated: {new Date(doc.lastModified).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="federation-notice">
        ⚠️ <strong>Documentation Migration Notice</strong>
        <p>
          Registry architectural documentation has been consolidated into the Registry itself.
          This page displays live content from the Registry API. For the most current 
          information, visit the Registry directly.
        </p>
      </div>
    </div>
  )
}

// Academy Document Viewer Component
export function AcademyRegistryDocViewer({ 
  category, 
  slug 
}: { 
  category: string
  slug: string 
}) {
  const [document, setDocument] = useState<RegistryDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const registryClient = new RegistryDocsClient()

  useEffect(() => {
    async function fetchDocument() {
      try {
        const doc = await registryClient.getDocument(category, slug)
        setDocument(doc)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchDocument()
  }, [category, slug])

  if (loading) return <div>Loading document...</div>
  if (error) return <div>Error loading document: {error}</div>
  if (!document) return <div>Document not found</div>

  return (
    <div className="registry-doc-viewer">
      <div className="doc-header">
        <div className="breadcrumb">
          Registry Documentation → {document.category} → {document.title}
        </div>
        <div className="source-attribution">
          📚 <strong>Source:</strong> Eden Genesis Registry API
          <span className="live-indicator">● Live</span>
        </div>
      </div>

      <article className="doc-content">
        <h1>{document.title}</h1>
        
        {document.tableOfContents && document.tableOfContents.length > 0 && (
          <nav className="table-of-contents">
            <h2>Table of Contents</h2>
            <ul>
              {document.tableOfContents.map((item, index) => (
                <li key={index} className={`toc-level-${item.level}`}>
                  <a href={`#${item.anchor}`}>{item.title}</a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div 
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: document.content || '' }}
        />
      </article>

      <div className="doc-meta">
        <p><strong>Category:</strong> {document.category}</p>
        <p><strong>Status:</strong> {document.status}</p>
        <p><strong>Last Updated:</strong> {new Date(document.lastModified).toLocaleString()}</p>
      </div>
    </div>
  )
}

// Deprecation Notice Component for Academy
export function DeprecationNotice({ 
  title, 
  newLocation 
}: { 
  title: string
  newLocation: string 
}) {
  return (
    <div className="deprecation-notice">
      <div className="warning-header">
        ⚠️ Documentation Deprecated
      </div>
      
      <h2>{title}</h2>
      
      <div className="migration-info">
        <p>
          <strong>This document has been moved to the Registry documentation system.</strong>
        </p>
        
        <p>
          <strong>New Location:</strong>{' '}
          <a href={newLocation} target="_blank" rel="noopener noreferrer">
            {newLocation}
          </a>
        </p>
        
        <div className="migration-reasons">
          <h3>Why did this change?</h3>
          <p>
            As part of our documentation consolidation (ADR-001), all Registry 
            architectural documentation now lives in the Registry itself to maintain 
            the Registry as the single source of truth.
          </p>
        </div>
        
        <div className="what-to-do">
          <h3>What should you do?</h3>
          <ul>
            <li>Update your bookmarks to point to the new Registry documentation</li>
            <li>Use the Registry API to access current documentation</li>
            <li>Academy will automatically display Registry docs going forward</li>
          </ul>
        </div>
      </div>
      
      <div className="removal-notice">
        <em>This deprecated file will be removed in a future release.</em>
      </div>
    </div>
  )
}

// Webhook handler for Academy to receive Registry doc updates
export async function handleRegistryDocumentUpdate(event: {
  event: string
  data: {
    documentId: string
    category: string
    slug: string
    timestamp: string
  }
}) {
  // Academy can implement cache invalidation, UI updates, etc.
  console.log('Registry documentation updated:', event)
  
  // Example: Invalidate local cache
  // cacheManager.invalidate(`registry-doc-${event.data.category}-${event.data.slug}`)
  
  // Example: Show notification to users
  // notificationService.show({
  //   title: 'Documentation Updated',
  //   message: `Registry documentation for ${event.data.category}/${event.data.slug} has been updated`
  // })
}

export { RegistryDocsClient }