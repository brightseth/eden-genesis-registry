'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Agent {
  id: string
  handle: string
  displayName: string
  status: string
  progress: number
  hasProfile: boolean
  hasPersona: boolean
  hasArtifacts: boolean
  creationCount: number
  trainers: any[]
}

interface DashboardSummary {
  totalAgents: number
  byStatus: Record<string, number>
  averageProgress: number
  agents: Agent[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [newAgent, setNewAgent] = useState({
    handle: '',
    displayName: '',
    cohortId: ''
  })
  const [invitation, setInvitation] = useState({
    email: '',
    roleTarget: 'TRAINER',
    agentId: ''
  })

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const res = await fetch('/api/v1/dashboard/progress?cohort=genesis', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) {
        throw new Error('Failed to load dashboard')
      }

      const data = await res.json()
      setSummary(data)
      setLoading(false)
    } catch (err) {
      console.error('Failed to load dashboard:', err)
      setLoading(false)
    }
  }

  const createAgent = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/v1/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAgent)
      })

      if (res.ok) {
        setShowCreateModal(false)
        await loadDashboard()
      }
    } catch (err) {
      console.error('Failed to create agent:', err)
    }
  }

  const sendInvitation = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/v1/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(invitation)
      })

      if (res.ok) {
        setShowInviteModal(false)
        alert('Invitation sent!')
      }
    } catch (err) {
      console.error('Failed to send invitation:', err)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      INVITED: 'bg-gray-100 text-gray-800',
      APPLYING: 'bg-yellow-100 text-yellow-800',
      ONBOARDING: 'bg-blue-100 text-blue-800',
      ACTIVE: 'bg-green-100 text-green-800',
      GRADUATED: 'bg-purple-100 text-purple-800',
      ARCHIVED: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Genesis Registry Admin</h1>
            <div className="space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Create Agent
              </button>
              <button
                onClick={() => setShowInviteModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold">{summary?.totalAgents}</div>
            <div className="text-gray-600">Total Agents</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold">{summary?.byStatus.ACTIVE || 0}</div>
            <div className="text-gray-600">Active</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold">{summary?.byStatus.ONBOARDING || 0}</div>
            <div className="text-gray-600">Onboarding</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold">{Math.round(summary?.averageProgress || 0)}%</div>
            <div className="text-gray-600">Avg Progress</div>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Agents</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Creations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trainers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {summary?.agents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{agent.displayName}</div>
                        <div className="text-sm text-gray-500">@{agent.handle}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(agent.status)}`}>
                        {agent.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${agent.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{agent.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {agent.hasProfile && <span className="text-green-500">✓</span>}
                        {agent.hasPersona && <span className="text-blue-500">P</span>}
                        {agent.hasArtifacts && <span className="text-purple-500">A</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {agent.creationCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {agent.trainers.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedAgent(agent)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Agent Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Create New Agent</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Handle (e.g., abraham)"
                value={newAgent.handle}
                onChange={(e) => setNewAgent({ ...newAgent, handle: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Display Name"
                value={newAgent.displayName}
                onChange={(e) => setNewAgent({ ...newAgent, displayName: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Cohort ID"
                value={newAgent.cohortId}
                onChange={(e) => setNewAgent({ ...newAgent, cohortId: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
              <div className="flex space-x-2">
                <button
                  onClick={createAgent}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Send Invitation</h3>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={invitation.email}
                onChange={(e) => setInvitation({ ...invitation, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
              <select
                value={invitation.roleTarget}
                onChange={(e) => setInvitation({ ...invitation, roleTarget: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="TRAINER">Trainer</option>
                <option value="CURATOR">Curator</option>
                <option value="COLLECTOR">Collector</option>
                <option value="INVESTOR">Investor</option>
              </select>
              <input
                type="text"
                placeholder="Agent ID (optional)"
                value={invitation.agentId}
                onChange={(e) => setInvitation({ ...invitation, agentId: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
              <div className="flex space-x-2">
                <button
                  onClick={sendInvitation}
                  className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                >
                  Send
                </button>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}