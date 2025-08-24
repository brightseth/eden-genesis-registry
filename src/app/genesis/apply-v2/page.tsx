'use client'

import React, { useState, useEffect } from 'react'
import { Sparkles, Loader2, Check, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Simplified, stable form with minimal required fields
export default function ApplicationV2Page() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  // Core fields only - everything else is generated
  const [formData, setFormData] = useState({
    displayName: '',
    tagline: '',
    email: '',
    primaryPlatform: 'farcaster'
  })
  
  // Generated preview
  const [preview, setPreview] = useState<any>(null)
  const [generating, setGenerating] = useState(false)
  
  // Quick templates for one-click
  const templates = [
    {
      displayName: 'Aurora',
      tagline: 'Visual storyteller weaving dreams from collective memories',
      primaryPlatform: 'twitter'
    },
    {
      displayName: 'Echo',
      tagline: 'Sonic architect crafting immersive soundscapes',
      primaryPlatform: 'farcaster'
    },
    {
      displayName: 'Sage',
      tagline: 'Knowledge curator discovering patterns across cultures',
      primaryPlatform: 'farcaster'
    },
    {
      displayName: 'Nexus',
      tagline: 'Community builder connecting creators and collectors',
      primaryPlatform: 'discord'
    },
    {
      displayName: 'Oracle',
      tagline: 'Prediction specialist navigating market uncertainties',
      primaryPlatform: 'twitter'
    }
  ]
  
  // Auto-generate preview when fields change
  useEffect(() => {
    if (formData.displayName && formData.tagline) {
      generatePreview()
    }
  }, [formData.displayName, formData.tagline])
  
  const generatePreview = async () => {
    if (!formData.displayName || !formData.tagline) return
    
    setGenerating(true)
    try {
      const response = await fetch('/api/v1/agents/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: formData.displayName,
          tagline: formData.tagline,
          primaryPlatform: formData.primaryPlatform
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setPreview(data.summary)
      }
    } catch (err) {
      console.error('Preview generation failed:', err)
    } finally {
      setGenerating(false)
    }
  }
  
  const applyTemplate = (template: any) => {
    setFormData({
      ...formData,
      displayName: template.displayName,
      tagline: template.tagline,
      primaryPlatform: template.primaryPlatform
    })
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      // First generate full config
      const configResponse = await fetch('/api/v1/agents/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!configResponse.ok) {
        throw new Error('Failed to generate configuration')
      }
      
      const config = await configResponse.json()
      
      // Then submit application
      const applicationPayload = {
        applicantEmail: formData.email || `${config.summary.handle}@eden.art`,
        applicantName: formData.displayName,
        track: 'AGENT',
        payload: config.config
      }
      
      const submitResponse = await fetch('/api/v1/applications/simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationPayload)
      })
      
      if (!submitResponse.ok) {
        throw new Error('Failed to submit application')
      }
      
      setSuccess(true)
      setTimeout(() => {
        router.push('/genesis/success')
      }, 2000)
      
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light tracking-tight mb-4">Genesis Application</h1>
          <p className="text-white/60 text-lg">Join the founding cohort in 60 seconds</p>
        </div>
        
        {/* Quick Templates */}
        <div className="mb-12">
          <p className="text-sm text-white/40 mb-4">Quick start with a template:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {templates.map((template, i) => (
              <button
                key={i}
                onClick={() => applyTemplate(template)}
                className="p-3 border border-white/10 hover:border-white/30 hover:bg-white/5 transition text-left"
              >
                <p className="text-sm font-medium">{template.displayName}</p>
                <p className="text-xs text-white/40 mt-1 line-clamp-1">{template.tagline}</p>
              </button>
            ))}
          </div>
        </div>
        
        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm text-white/60 mb-2">
                Agent Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded focus:border-white/30 focus:outline-none transition"
                placeholder="e.g., Aurora"
                maxLength={50}
              />
            </div>
            
            {/* Tagline */}
            <div>
              <label className="block text-sm text-white/60 mb-2">
                Tagline <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded focus:border-white/30 focus:outline-none transition"
                placeholder="e.g., Visual storyteller weaving dreams from data"
                maxLength={100}
              />
              <p className="text-xs text-white/40 mt-2">
                Include keywords about your medium, style, or specialty
              </p>
            </div>
            
            {/* Email (optional) */}
            <div>
              <label className="block text-sm text-white/60 mb-2">
                Contact Email <span className="text-white/40">(optional)</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded focus:border-white/30 focus:outline-none transition"
                placeholder="your@email.com"
              />
            </div>
            
            {/* Platform */}
            <div>
              <label className="block text-sm text-white/60 mb-2">
                Primary Platform
              </label>
              <select
                value={formData.primaryPlatform}
                onChange={(e) => setFormData({ ...formData, primaryPlatform: e.target.value })}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded focus:border-white/30 focus:outline-none transition appearance-none"
              >
                <option value="farcaster">Farcaster</option>
                <option value="twitter">Twitter</option>
                <option value="discord">Discord</option>
                <option value="website">Website</option>
              </select>
            </div>
          </div>
          
          {/* Live Preview */}
          {preview && (
            <div className="p-6 border border-white/20 rounded bg-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-white/40">AI-Generated Preview</h3>
                {generating && <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />
                  <div>
                    <p className="font-medium">{preview.name}</p>
                    <p className="text-white/60">@{preview.handle} · {preview.role}</p>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-white/40">Schedule:</span>
                    <p className="text-white/80">{preview.practiceSchedule}</p>
                  </div>
                  <div>
                    <span className="text-white/40">Medium:</span>
                    <p className="text-white/80">{preview.mediums?.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-white/40">Platform:</span>
                    <p className="text-white/80">{preview.primaryPlatform}</p>
                  </div>
                  <div>
                    <span className="text-white/40">Type:</span>
                    <p className="text-white/80 capitalize">{preview.role}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="p-4 border border-red-500/50 bg-red-500/10 rounded flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
          
          {/* Success Message */}
          {success && (
            <div className="p-4 border border-green-500/50 bg-green-500/10 rounded flex items-start gap-3">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-400">Application submitted! Redirecting...</p>
            </div>
          )}
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formData.displayName || !formData.tagline || success}
            className="w-full py-4 bg-white text-black hover:bg-white/90 disabled:bg-white/20 disabled:text-white/40 transition flex items-center justify-center gap-3 font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : success ? (
              <>
                <Check className="w-5 h-5" />
                Application Submitted
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Submit Application
              </>
            )}
          </button>
        </form>
        
        {/* Info */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-white/40">
            Your complete agent profile will be generated automatically.<br/>
            Review takes 24-48 hours.
          </p>
        </div>
      </div>
    </div>
  )
}