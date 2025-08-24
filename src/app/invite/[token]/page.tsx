'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface ChecklistItem {
  id: string
  label: string
  required: boolean
  done: boolean
}

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const [agent, setAgent] = useState<any>(null)
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  const [profile, setProfile] = useState({
    statement: '',
    manifesto: '',
    tags: [] as string[],
    links: {}
  })

  useEffect(() => {
    authenticateWithToken()
  }, [params.token])

  const authenticateWithToken = async () => {
    try {
      const res = await fetch('/api/v1/auth/magic/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: params.token })
      })

      if (!res.ok) {
        throw new Error('Invalid or expired token')
      }

      const data = await res.json()
      localStorage.setItem('token', data.token)
      setUser(data.user)
      
      // Load agent data if user has an assigned agent
      if (data.user.role === 'TRAINER' || data.user.role === 'CURATOR' || data.user.role === 'COLLECTOR') {
        await loadAgentData(data.token)
      }
      
      setLoading(false)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const loadAgentData = async (token: string) => {
    // This would load the agent assigned to this user
    // For now, we'll skip this implementation
  }

  const updateProgress = async (itemId: string, done: boolean) => {
    if (!agent) return

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/v1/agents/${agent.id}/progress/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ itemId, done })
      })

      if (res.ok) {
        const updated = await res.json()
        setChecklist(updated.items)
      }
    } catch (err) {
      console.error('Failed to update progress:', err)
    }
  }

  const saveProfile = async () => {
    if (!agent) return

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/v1/agents/${agent.id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      })

      if (res.ok) {
        alert('Profile saved successfully!')
        await updateProgress('statement', true)
      }
    } catch (err) {
      console.error('Failed to save profile:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Eden Genesis Cohort</h1>
          <p className="text-gray-600 mb-8">
            Hello {user?.name || user?.email}, you're joining as a <strong>{user?.role}</strong>
          </p>

          {/* Progress Checklist */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Onboarding Progress</h2>
            <div className="space-y-3">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={(e) => updateProgress(item.id, e.target.checked)}
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                  <span className={item.done ? 'line-through text-gray-400' : ''}>
                    {item.label}
                    {item.required && <span className="text-red-500 ml-1">*</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Form */}
          {user?.role === 'TRAINER' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Your Profile</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statement
                </label>
                <textarea
                  value={profile.statement}
                  onChange={(e) => setProfile({ ...profile, statement: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Write a brief statement about your approach to training AI agents..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={profile.tags.join(', ')}
                  onChange={(e) => setProfile({ 
                    ...profile, 
                    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="AI, creativity, generative art..."
                />
              </div>

              <button
                onClick={saveProfile}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
              >
                Save Profile
              </button>
            </div>
          )}

          {/* Role-specific content */}
          {user?.role === 'CURATOR' && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Curator Tasks</h2>
              <p className="text-gray-600">
                As a curator, you'll be responsible for tagging and organizing agent creations.
                Your curation will help showcase the best work from the Genesis Cohort.
              </p>
            </div>
          )}

          {user?.role === 'COLLECTOR' && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Collector Access</h2>
              <p className="text-gray-600">
                As a collector, you'll get early access to agent creations and can participate
                in the preview pipeline for upcoming releases.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}