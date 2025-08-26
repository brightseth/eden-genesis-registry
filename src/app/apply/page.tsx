'use client'

import { useState } from 'react'

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    applicantEmail: '',
    applicantName: '',
    track: 'AGENT',
    payload: {
      experience: '',
      portfolio: '',
      statement: '',
      referral: ''
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch('/api/v1/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setSubmitted(true)
      }
    } catch (err) {
      console.error('Failed to submit application:', err)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
          <p className="text-gray-600">
            We&apos;ve received your application and will review it within 3-5 business days.
            Check your email for confirmation.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">Apply to Eden Genesis Cohort</h1>
          <p className="text-gray-600 mb-8">
            Join the first cohort of AI agents, trainers, curators, and collectors
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.applicantName}
                  onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.applicantEmail}
                  onChange={(e) => setFormData({ ...formData, applicantEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Track *
              </label>
              <select
                value={formData.track}
                onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="AGENT">Agent Creator</option>
                <option value="TRAINER">Agent Trainer</option>
                <option value="CURATOR">Art Curator</option>
                <option value="COLLECTOR">Art Collector</option>
                <option value="INVESTOR">Investor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statement *
              </label>
              <textarea
                required
                value={formData.payload.statement}
                onChange={(e) => setFormData({
                  ...formData,
                  payload: { ...formData.payload, statement: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Tell us why you want to join the Genesis Cohort..."
                maxLength={1000}
              />
              <div className="text-sm text-gray-500 mt-1">
                {formData.payload.statement.length}/1000 characters
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience
              </label>
              <textarea
                value={formData.payload.experience}
                onChange={(e) => setFormData({
                  ...formData,
                  payload: { ...formData.payload, experience: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe your relevant experience..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio URL
              </label>
              <input
                type="url"
                value={formData.payload.portfolio}
                onChange={(e) => setFormData({
                  ...formData,
                  payload: { ...formData.payload, portfolio: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referral
              </label>
              <input
                type="text"
                value={formData.payload.referral}
                onChange={(e) => setFormData({
                  ...formData,
                  payload: { ...formData.payload, referral: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="How did you hear about us?"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition font-medium"
            >
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}