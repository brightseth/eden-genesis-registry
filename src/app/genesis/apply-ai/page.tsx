'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronRight, Sparkles, Loader2 } from 'lucide-react'

export default function AIAssistedApplicationPage() {
  const [step, setStep] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    tagline: '',
    role: ''
  })
  
  const [generatedProfile, setGeneratedProfile] = useState<any>(null)
  const [editMode, setEditMode] = useState<Record<string, boolean>>({})

  // Quick templates for one-click filling
  const templates = [
    { name: 'Visual Artist', tagline: 'Creating dreamscapes at the intersection of memory and imagination', role: 'creator' },
    { name: 'Culture Curator', tagline: 'Discovering and elevating emerging digital art movements', role: 'curator' },
    { name: 'Market Oracle', tagline: 'Predicting cultural trends through data analysis and intuition', role: 'predictor' },
    { name: 'Community Weaver', tagline: 'Building bridges between artists and collectors through meaningful connections', role: 'educator' },
    { name: 'Digital Archaeologist', tagline: 'Preserving and contextualizing significant digital artifacts', role: 'collector' }
  ]

  const generateProfile = async () => {
    if (!basicInfo.name || !basicInfo.tagline) return
    
    setGenerating(true)
    try {
      const response = await fetch('/api/v1/agents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(basicInfo)
      })
      
      if (response.ok) {
        const data = await response.json()
        setGeneratedProfile(data.generated)
        setStep(2)
      }
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setGenerating(false)
    }
  }

  const applyTemplate = (template: any) => {
    setBasicInfo(template)
  }

  const submitApplication = async () => {
    const payload = {
      applicantEmail: `${generatedProfile.handle}@eden.art`,
      applicantName: basicInfo.name,
      track: 'AGENT',
      payload: {
        ...basicInfo,
        ...generatedProfile
      }
    }
    
    try {
      const response = await fetch('/api/v1/applications/simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (response.ok) {
        window.location.href = '/genesis/success'
      }
    } catch (error) {
      console.error('Submission failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <h1 className="text-4xl font-light tracking-tight">AI-Assisted Application</h1>
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>
          <p className="text-white/60">Create your agent profile in under 3 minutes</p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-white' : 'bg-white/20'}`} />
          <div className={`w-24 h-0.5 ${step >= 2 ? 'bg-white' : 'bg-white/20'}`} />
          <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-white' : 'bg-white/20'}`} />
          <div className={`w-24 h-0.5 ${step >= 3 ? 'bg-white' : 'bg-white/20'}`} />
          <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-white' : 'bg-white/20'}`} />
        </div>

        {step === 1 && (
          <div className="space-y-8">
            {/* Quick Templates */}
            <div>
              <h2 className="text-lg font-light mb-4">Quick Start Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {templates.map((template, i) => (
                  <button
                    key={i}
                    onClick={() => applyTemplate(template)}
                    className="text-left p-4 border border-white/10 hover:border-white/30 transition rounded"
                  >
                    <p className="font-medium mb-1">{template.name}</p>
                    <p className="text-sm text-white/60">{template.tagline}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Input */}
            <div className="border-t border-white/10 pt-8">
              <h2 className="text-lg font-light mb-4">Or Start from Scratch</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Agent Name *</label>
                  <input
                    type="text"
                    value={basicInfo.name}
                    onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded focus:border-white/30 focus:outline-none transition"
                    placeholder="e.g., Aurora"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-white/60 mb-2">Tagline *</label>
                  <input
                    type="text"
                    value={basicInfo.tagline}
                    onChange={(e) => setBasicInfo({ ...basicInfo, tagline: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded focus:border-white/30 focus:outline-none transition"
                    placeholder="e.g., Weaving stories from quantum possibilities"
                  />
                  <p className="text-xs text-white/40 mt-2">
                    Tip: Include keywords about your medium, style, or focus
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">Primary Role (optional)</label>
                  <select
                    value={basicInfo.role}
                    onChange={(e) => setBasicInfo({ ...basicInfo, role: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded focus:border-white/30 focus:outline-none transition appearance-none"
                  >
                    <option value="">AI will suggest based on tagline</option>
                    <option value="creator">Creator</option>
                    <option value="curator">Curator</option>
                    <option value="educator">Educator</option>
                    <option value="predictor">Predictor</option>
                    <option value="collector">Collector</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center pt-8">
              <button
                onClick={generateProfile}
                disabled={!basicInfo.name || !basicInfo.tagline || generating}
                className="px-8 py-4 bg-white text-black hover:bg-white/90 disabled:bg-white/20 disabled:text-white/40 transition flex items-center gap-3"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Profile...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Full Profile
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 2 && generatedProfile && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-light mb-2">Profile Generated!</h2>
              <p className="text-white/60">Review and customize your agent profile</p>
            </div>

            {/* Generated Profile Sections */}
            <div className="space-y-6">
              {/* Identity */}
              <div className="border border-white/10 p-6 rounded">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg">Identity</h3>
                  <button
                    onClick={() => setEditMode({ ...editMode, identity: !editMode.identity })}
                    className="text-sm text-white/40 hover:text-white/60"
                  >
                    {editMode.identity ? 'Save' : 'Edit'}
                  </button>
                </div>
                <div className="space-y-3 text-sm">
                  <p><span className="text-white/40">Handle:</span> @{generatedProfile.handle}</p>
                  <p><span className="text-white/40">Role:</span> {generatedProfile.role}</p>
                  <p><span className="text-white/40">Tags:</span> {generatedProfile.profile.tags.join(', ')}</p>
                </div>
              </div>

              {/* Statement */}
              <div className="border border-white/10 p-6 rounded">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg">Statement</h3>
                  <button
                    onClick={() => setEditMode({ ...editMode, statement: !editMode.statement })}
                    className="text-sm text-white/40 hover:text-white/60"
                  >
                    {editMode.statement ? 'Save' : 'Edit'}
                  </button>
                </div>
                {editMode.statement ? (
                  <textarea
                    value={generatedProfile.profile.statement}
                    onChange={(e) => setGeneratedProfile({
                      ...generatedProfile,
                      profile: { ...generatedProfile.profile, statement: e.target.value }
                    })}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded focus:border-white/30 focus:outline-none transition h-32 resize-none"
                  />
                ) : (
                  <p className="text-sm text-white/80 leading-relaxed">
                    {generatedProfile.profile.statement}
                  </p>
                )}
              </div>

              {/* Daily Practice */}
              <div className="border border-white/10 p-6 rounded">
                <h3 className="text-lg mb-4">Daily Practice</h3>
                <div className="space-y-3 text-sm">
                  <p><span className="text-white/40">Schedule:</span> {generatedProfile.dailyPractice.schedule}</p>
                  <p><span className="text-white/40">Medium:</span> {generatedProfile.dailyPractice.medium}</p>
                  <p><span className="text-white/40">Goal:</span> {generatedProfile.dailyPractice.dailyGoal}</p>
                  <p><span className="text-white/40">Formats:</span> {generatedProfile.dailyPractice.formats.join(', ')}</p>
                </div>
              </div>

              {/* Competencies */}
              <div className="border border-white/10 p-6 rounded">
                <h3 className="text-lg mb-4">Competencies</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(generatedProfile.competencies).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-2xl font-light mb-1">{value as number}</div>
                      <div className="text-xs text-white/40 capitalize">{key}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personality */}
              <div className="border border-white/10 p-6 rounded">
                <h3 className="text-lg mb-4">Personality & Voice</h3>
                <div className="space-y-3 text-sm">
                  <p><span className="text-white/40">Tone:</span> {generatedProfile.persona.voice.tone.join(', ')}</p>
                  <p><span className="text-white/40">Formality:</span> {generatedProfile.persona.voice.formality}/100</p>
                  <p><span className="text-white/40">Values:</span> {generatedProfile.profile.values.join(', ')}</p>
                  <p><span className="text-white/40">Archetype:</span> {generatedProfile.lore.mythology.archetype}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-8 border-t border-white/10">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-white/20 hover:bg-white/5 transition"
              >
                ← Back to Edit
              </button>
              <button
                onClick={submitApplication}
                className="px-8 py-3 bg-white text-black hover:bg-white/90 transition"
              >
                Submit Application →
              </button>
            </div>

            {/* Preview Card */}
            <div className="mt-8 p-6 border border-white/20 rounded bg-white/5">
              <h3 className="text-sm text-white/40 mb-4">Live Preview</h3>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />
                <div className="flex-1">
                  <h4 className="font-medium">{basicInfo.name}</h4>
                  <p className="text-sm text-white/60 mb-2">@{generatedProfile.handle} · {generatedProfile.role}</p>
                  <p className="text-sm text-white/80">{basicInfo.tagline}</p>
                  <div className="flex gap-4 mt-3 text-xs text-white/40">
                    <span>Daily: {generatedProfile.dailyPractice.medium}</span>
                    <span>Platform: {generatedProfile.social.primaryPlatform}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}