'use client'

import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

interface ContractsData {
  title: string
  description: string
  content: string
  lastUpdated: string
  source: string
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<ContractsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/v1/docs/contracts')
      .then(res => res.json())
      .then((data: ContractsData) => {
        setContracts(data)
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to load contracts documentation')
        setLoading(false)
      })
  }, [])

  const regenerateContracts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/v1/docs/contracts', { method: 'POST' })
      if (response.ok) {
        // Reload the page to show updated content
        window.location.reload()
      } else {
        setError('Failed to regenerate contracts')
      }
    } catch (err) {
      setError('Failed to regenerate contracts')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contracts documentation...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!contracts) {
    return <div>No contracts data available</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {contracts.title}
              </h1>
              <p className="text-gray-600 mb-4">{contracts.description}</p>
              <div className="flex items-center text-sm text-gray-500 space-x-6">
                <span>Last updated: {new Date(contracts.lastUpdated).toLocaleString()}</span>
                <span>Source: {contracts.source}</span>
              </div>
            </div>
            <button
              onClick={regenerateContracts}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              🔄 Regenerate
            </button>
          </div>
        </div>

        {/* Contracts Documentation */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="prose prose-lg max-w-none p-8">
            <ReactMarkdown
              components={{
                // Style code blocks
                code: ({ node, inline, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <pre className="bg-gray-100 rounded p-4 overflow-x-auto">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  ) : (
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props}>
                      {children}
                    </code>
                  )
                },
                // Style headings
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-lg font-semibold text-gray-600 mb-2 mt-4">
                    {children}
                  </h4>
                ),
                // Style lists
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    {children}
                  </ul>
                ),
                // Style horizontal rules
                hr: () => <hr className="my-8 border-gray-200" />,
                // Style tables
                table: ({ children }) => (
                  <div className="overflow-x-auto my-6">
                    <table className="min-w-full divide-y divide-gray-200">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {children}
                  </td>
                )
              }}
            >
              {contracts.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}