'use client'

import { useEffect, useState } from 'react'

interface Application {
  id: string
  createdAt: string
  status: string
  applicantEmail: string
  applicantName: string
  payload: {
    name: string
    handle: string
    role: string
    tagline: string
    personaPublic: string
    dailyPractice: {
      medium: string
      dailyGoal: string
    }
    socials: {
      farcaster: string
      twitter: string
    }
  }
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/v1/applications/simple')
      const data = await res.json()
      setApplications(data.applications || [])
    } catch (error) {
      console.error('Failed to fetch applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light tracking-tight mb-4">Genesis Applications</h1>
          <div className="flex items-center gap-8 text-sm text-white/60">
            <span>Total: {applications.length}</span>
            <span>Pending: {applications.filter(a => a.status === 'pending').length}</span>
            <button 
              onClick={fetchApplications}
              className="px-4 py-2 border border-white/20 hover:bg-white/5 transition"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-white/40">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/40 mb-4">No applications yet</p>
            <a 
              href="/genesis/apply"
              className="inline-block px-6 py-3 bg-white text-black hover:bg-white/90 transition"
            >
              Submit Test Application
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Applications List */}
            <div className="space-y-4">
              <h2 className="text-lg font-light mb-4">Applications</h2>
              {applications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`border ${selectedApp?.id === app.id ? 'border-white/40 bg-white/5' : 'border-white/10'} p-4 cursor-pointer hover:border-white/20 transition`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-normal">{app.payload.name}</h3>
                      <p className="text-sm text-white/40">@{app.payload.handle}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      app.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                      app.status === 'approved' ? 'bg-green-500/20 text-green-400' : 
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm text-white/60 mb-2">{app.payload.tagline}</p>
                  <div className="flex items-center gap-4 text-xs text-white/40">
                    <span>{app.payload.role}</span>
                    <span>{formatDate(app.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Application Detail */}
            {selectedApp && (
              <div className="border border-white/10 p-6">
                <h2 className="text-lg font-light mb-6">Application Details</h2>
                
                {/* Basic Info */}
                <div className="mb-6">
                  <h3 className="text-sm text-white/40 mb-2">Identity</h3>
                  <div className="space-y-2">
                    <p><span className="text-white/40">Name:</span> {selectedApp.payload.name}</p>
                    <p><span className="text-white/40">Handle:</span> @{selectedApp.payload.handle}</p>
                    <p><span className="text-white/40">Role:</span> {selectedApp.payload.role}</p>
                    <p><span className="text-white/40">Tagline:</span> {selectedApp.payload.tagline}</p>
                  </div>
                </div>

                {/* Persona */}
                <div className="mb-6">
                  <h3 className="text-sm text-white/40 mb-2">Persona</h3>
                  <p className="text-sm text-white/80 whitespace-pre-wrap">
                    {selectedApp.payload.personaPublic}
                  </p>
                </div>

                {/* Daily Practice */}
                <div className="mb-6">
                  <h3 className="text-sm text-white/40 mb-2">Daily Practice</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-white/40">Medium:</span> {selectedApp.payload.dailyPractice.medium}</p>
                    <p><span className="text-white/40">Goal:</span> {selectedApp.payload.dailyPractice.dailyGoal}</p>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mb-6">
                  <h3 className="text-sm text-white/40 mb-2">Social</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-white/40">Farcaster:</span> {selectedApp.payload.socials.farcaster}</p>
                    <p><span className="text-white/40">Twitter:</span> {selectedApp.payload.socials.twitter}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-6 border-t border-white/10">
                  <button className="px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 transition">
                    Approve
                  </button>
                  <button className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 transition">
                    Reject
                  </button>
                  <button className="px-4 py-2 border border-white/20 hover:bg-white/5 transition">
                    Export JSON
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}