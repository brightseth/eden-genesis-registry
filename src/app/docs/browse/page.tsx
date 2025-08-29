'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { marked } from 'marked'

interface Document {
  id: string
  title: string
  slug: string
  category: 'adr' | 'api' | 'technical' | 'integration'
  summary: string
  lastModified: string
  status: 'draft' | 'published' | 'archived'
}

interface Category {
  name: string
  slug: string
  count: number
}

interface DocumentContent {
  id: string
  title: string
  slug: string
  category: string
  summary: string
  lastModified: string
  status: string
  content: string
  metadata: any
  tableOfContents: Array<{
    level: number
    title: string
    anchor: string
  }>
}

export default function DocumentationBrowser() {
  const [categories, setCategories] = useState<Category[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDocument, setSelectedDocument] = useState<DocumentContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDocumentation()
  }, [])

  const loadDocumentation = async () => {
    try {
      const response = await fetch('/api/v1/docs')
      const data = await response.json()
      
      if (response.ok) {
        setCategories([
          { name: 'All Documents', slug: 'all', count: data.total },
          ...data.categories
        ])
        setDocuments(data.documents || [])
      } else {
        setError('Failed to load documentation')
      }
    } catch (error) {
      console.error('Failed to load documentation:', error)
      setError('Failed to load documentation')
    } finally {
      setLoading(false)
    }
  }

  const loadDocumentContent = async (category: string, slug: string) => {
    try {
      const response = await fetch(`/api/v1/docs/${category}/${slug}`)
      const data = await response.json()
      
      if (response.ok) {
        setSelectedDocument(data)
      } else {
        setError(`Failed to load document: ${slug}`)
      }
    } catch (error) {
      console.error('Failed to load document:', error)
      setError('Failed to load document content')
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    const matchesSearch = !searchTerm || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getCategoryName = (slug: string) => {
    const names: { [key: string]: string } = {
      'adr': 'Architecture Decisions',
      'api': 'API Documentation',
      'technical': 'Technical Specs',
      'integration': 'Integration Guides'
    }
    return names[slug] || slug
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-400 border-green-400'
      case 'draft': return 'text-yellow-400 border-yellow-400'
      case 'archived': return 'text-gray-400 border-gray-400'
      default: return 'text-white border-white'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-xl uppercase tracking-wider animate-pulse">Loading Documentation...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-8" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-red-500 text-xl uppercase tracking-wider">{error}</div>
          <Link href="/docs" className="text-white hover:opacity-70 uppercase tracking-wider text-sm mt-4 inline-block">
            ← Back to Documentation Hub
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/docs" className="text-white hover:opacity-70 uppercase tracking-wider text-sm mb-4 inline-block">
            ← Documentation Hub
          </Link>
          <h1 className="text-4xl font-bold uppercase tracking-wider mb-4">
            Documentation Browser
          </h1>
          <p className="text-sm uppercase opacity-70">
            Browse all Registry documentation • {documents.length} documents available
          </p>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-3">
            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border border-white px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
              />
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h3 className="text-lg font-bold uppercase tracking-wider mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.slug}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`block w-full text-left px-4 py-2 border transition-colors ${
                      selectedCategory === category.slug
                        ? 'bg-white text-black border-white'
                        : 'border-white/30 text-white hover:border-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="text-sm uppercase tracking-wide">{category.name}</span>
                      <span className="text-xs opacity-70">{category.count}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            {selectedDocument ? (
              /* Document View */
              <div>
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => setSelectedDocument(null)}
                    className="text-white hover:opacity-70 uppercase tracking-wider text-sm"
                  >
                    ← Back to Browse
                  </button>
                  <div className={`px-3 py-1 border text-xs uppercase ${getStatusColor(selectedDocument.status)}`}>
                    {selectedDocument.status}
                  </div>
                </div>

                <div className="border border-white p-8">
                  <div className="mb-6">
                    <div className={`inline-block px-3 py-1 border text-xs uppercase mb-4 ${getStatusColor(selectedDocument.category)}`}>
                      {getCategoryName(selectedDocument.category)}
                    </div>
                    <h1 className="text-3xl font-bold uppercase tracking-wider mb-4">
                      {selectedDocument.title}
                    </h1>
                    <div className="text-sm opacity-70 mb-4">
                      Last modified: {formatDate(selectedDocument.lastModified)}
                    </div>
                    {selectedDocument.summary && (
                      <p className="text-lg opacity-80 mb-6 border-l-4 border-green-500 pl-4">
                        {selectedDocument.summary}
                      </p>
                    )}
                  </div>

                  {/* Table of Contents */}
                  {selectedDocument.tableOfContents && selectedDocument.tableOfContents.length > 0 && (
                    <div className="border border-white/30 p-4 mb-8">
                      <h3 className="font-bold uppercase tracking-wider mb-4">Table of Contents</h3>
                      <div className="space-y-1">
                        {selectedDocument.tableOfContents.map((item, index) => (
                          <div
                            key={index}
                            className="text-sm"
                            style={{ marginLeft: `${(item.level - 1) * 20}px` }}
                          >
                            <a
                              href={`#${item.anchor}`}
                              className="text-white hover:text-green-400 transition-colors"
                            >
                              {item.title}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div 
                    className="prose prose-invert prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: marked(selectedDocument.content || '') 
                    }}
                  />
                </div>
              </div>
            ) : (
              /* Document List */
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold uppercase tracking-wider">
                    {selectedCategory === 'all' ? 'All Documents' : getCategoryName(selectedCategory)}
                  </h2>
                  <p className="text-sm opacity-70 mt-2">
                    {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} found
                  </p>
                </div>

                <div className="space-y-4">
                  {filteredDocuments.map(doc => (
                    <div
                      key={doc.id}
                      className="border border-white/20 p-6 hover:border-white/40 transition-colors cursor-pointer"
                      onClick={() => loadDocumentContent(doc.category, doc.slug)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className={`px-3 py-1 border text-xs uppercase ${getStatusColor(doc.category)}`}>
                            {getCategoryName(doc.category)}
                          </div>
                          <div className={`px-2 py-1 border text-xs uppercase ${getStatusColor(doc.status)}`}>
                            {doc.status}
                          </div>
                        </div>
                        <div className="text-xs opacity-50">
                          {formatDate(doc.lastModified)}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3 hover:text-green-400 transition-colors">
                        {doc.title}
                      </h3>
                      
                      {doc.summary && (
                        <p className="text-sm opacity-80 line-clamp-2">
                          {doc.summary}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {filteredDocuments.length === 0 && (
                  <div className="border border-white/20 p-8 text-center">
                    <div className="text-lg uppercase opacity-70">No documents found</div>
                    <div className="text-sm opacity-50 mt-2">
                      Try adjusting your search or category filter
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}