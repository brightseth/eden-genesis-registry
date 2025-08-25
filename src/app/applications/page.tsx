'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Application {
  id: string
  firstName: string
  lastName: string
  email: string
  track: string
  status: string
  proposedAgentHandle?: string
  agentConcept?: string
  submittedAt: string
  reviewedAt?: string
  reviewNotes?: string
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      const response = await fetch('/api/v1/applications')
      const data = await response.json()
      setApplications(data.applications || [])
    } catch (error) {
      console.error('Failed to load applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (id: string, status: string, notes?: string) => {
    try {
      const response = await fetch(`/api/v1/applications/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      })

      if (response.ok) {
        await loadApplications()
        setSelectedApp(null)
        setReviewNotes('')
      }
    } catch (error) {
      console.error('Failed to update application:', error)
    }
  }

  const filteredApplications = applications.filter(app => 
    filter === 'all' || app.status === filter
  )

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'border-yellow-500 text-yellow-500',
      'approved': 'border-green-500 text-green-500',
      'rejected': 'border-red-500 text-red-500',
      'invited': 'border-blue-500 text-blue-500'
    }
    return colors[status as keyof typeof colors] || 'border-gray-500 text-gray-500'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-lg">Loading applications...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold uppercase tracking-wider mb-4">
            APPLICATION REVIEW
          </h1>
          <p className="text-sm uppercase opacity-70">
            Review applications for open agent slots
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {['pending', 'approved', 'rejected', 'invited'].map(status => {
            const count = applications.filter(app => app.status === status).length
            return (
              <div key={status} className="border border-white/20 p-4">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm uppercase opacity-70">{status}</div>
              </div>
            )
          })}
        </div>

        {/* Filter */}
        <div className="mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent border border-white px-4 py-2 focus:outline-none focus:border-green-500"
          >
            <option value="all" className="bg-black">All Applications</option>
            <option value="pending" className="bg-black">Pending Review</option>
            <option value="approved" className="bg-black">Approved</option>
            <option value="rejected" className="bg-black">Rejected</option>
            <option value="invited" className="bg-black">Invited</option>
          </select>
        </div>

        {/* Applications Grid */}
        <div className="grid gap-4 mb-8">
          {filteredApplications.length === 0 ? (
            <div className="border border-white/20 p-8 text-center">
              <div className="text-lg uppercase opacity-70">
                No applications found for "{filter}"
              </div>
            </div>
          ) : (
            filteredApplications.map(app => (
              <div 
                key={app.id} 
                className={`border p-6 cursor-pointer hover:border-white/60 transition-colors ${getStatusColor(app.status)}`}
                onClick={() => setSelectedApp(app)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      {app.firstName} {app.lastName}
                    </h3>
                    <p className="text-sm opacity-70">{app.email}</p>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 border text-xs uppercase ${getStatusColor(app.status)}`}>
                      {app.status}
                    </div>
                    <div className="text-xs opacity-50 mt-1">
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs uppercase opacity-50 mb-1">Track</div>
                    <div className="text-sm">{app.track}</div>
                  </div>
                  {app.proposedAgentHandle && (
                    <div>
                      <div className="text-xs uppercase opacity-50 mb-1">Proposed Handle</div>
                      <div className="text-sm">@{app.proposedAgentHandle}</div>
                    </div>
                  )}
                </div>

                {app.agentConcept && (
                  <div className="mt-3">
                    <div className="text-xs uppercase opacity-50 mb-1">Concept</div>
                    <div className="text-sm opacity-80 line-clamp-2">
                      {app.agentConcept}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Review Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-black border border-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold uppercase">
                    Review Application
                  </h2>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="text-2xl opacity-70 hover:opacity-100"
                  >
                    ×
                  </button>
                </div>

                {/* Application Details */}
                <div className="space-y-4 mb-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs uppercase opacity-50 mb-1">Name</div>
                      <div>{selectedApp.firstName} {selectedApp.lastName}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase opacity-50 mb-1">Email</div>
                      <div>{selectedApp.email}</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs uppercase opacity-50 mb-1">Track</div>
                      <div>{selectedApp.track}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase opacity-50 mb-1">Status</div>
                      <div className={getStatusColor(selectedApp.status)}>
                        {selectedApp.status}
                      </div>
                    </div>
                  </div>

                  {selectedApp.proposedAgentHandle && (
                    <div>
                      <div className="text-xs uppercase opacity-50 mb-1">Proposed Agent Handle</div>
                      <div>@{selectedApp.proposedAgentHandle}</div>
                    </div>
                  )}

                  {selectedApp.agentConcept && (
                    <div>
                      <div className="text-xs uppercase opacity-50 mb-1">Agent Concept</div>
                      <div className="border border-white/20 p-3 text-sm">
                        {selectedApp.agentConcept}
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs uppercase opacity-50 mb-1">Submitted</div>
                      <div className="text-sm">{new Date(selectedApp.submittedAt).toLocaleString()}</div>
                    </div>
                    {selectedApp.reviewedAt && (
                      <div>
                        <div className="text-xs uppercase opacity-50 mb-1">Reviewed</div>
                        <div className="text-sm">{new Date(selectedApp.reviewedAt).toLocaleString()}</div>
                      </div>
                    )}
                  </div>

                  {selectedApp.reviewNotes && (
                    <div>
                      <div className="text-xs uppercase opacity-50 mb-1">Review Notes</div>
                      <div className="border border-white/20 p-3 text-sm">
                        {selectedApp.reviewNotes}
                      </div>
                    </div>
                  )}
                </div>

                {/* Review Actions */}
                {selectedApp.status === 'pending' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase opacity-50 mb-2">
                        Review Notes (Optional)
                      </label>
                      <textarea
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder="Add notes about this application..."
                        rows={3}
                        className="w-full bg-transparent border border-white/20 px-3 py-2 focus:outline-none focus:border-green-500"
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => updateApplicationStatus(selectedApp.id, 'approved', reviewNotes)}
                        className="flex-1 border border-green-500 text-green-500 px-4 py-2 uppercase tracking-wider hover:bg-green-500 hover:text-black transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(selectedApp.id, 'rejected', reviewNotes)}
                        className="flex-1 border border-red-500 text-red-500 px-4 py-2 uppercase tracking-wider hover:bg-red-500 hover:text-black transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(selectedApp.id, 'invited', reviewNotes)}
                        className="flex-1 border border-blue-500 text-blue-500 px-4 py-2 uppercase tracking-wider hover:bg-blue-500 hover:text-black transition-colors"
                      >
                        Invite
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex gap-6">
            <Link 
              href="/genesis/apply"
              className="text-sm uppercase tracking-wider opacity-70 hover:opacity-100"
            >
              ← Back to Applications
            </Link>
            <Link 
              href="/api/v1/applications"
              target="_blank"
              className="text-sm uppercase tracking-wider opacity-70 hover:opacity-100"
            >
              View API →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}