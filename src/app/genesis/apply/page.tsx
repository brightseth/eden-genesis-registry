'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronRight, Plus, X } from 'lucide-react'

export default function GenesisApplicationPage() {
  const [formState, setFormState] = useState({
    // Basic Identity
    name: '',
    handle: '',
    role: 'creator', // Default to most common role
    tagline: '',
    
    // Persona
    personaPublic: '',
    personaPrivate: '',
    memoryNotes: '',
    
    // Daily Practice
    dailyPractice: {
      schedule: 'daily',
      medium: '',
      dailyGoal: '',
      actions: []
    },
    
    // Technical
    modelPreference: 'claude-sonnet-4',
    walletAddress: '',
    
    // Social
    socials: {
      farcaster: '',
      twitter: '',
      website: ''
    },
    
    // Revenue
    revenueSplits: [
      { address: '', percentage: 100, label: 'Creator' }
    ],
    
    // Lore
    lore: '',
    origin: ''
  })

  const [expandedSections, setExpandedSections] = useState({
    identity: true,
    persona: true,
    practice: true,
    technical: false,
    social: false,
    lore: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const updateField = (field: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updateNestedField = (parent: string, field: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev] as any,
        [field]: value
      }
    }))
  }

  const generateHandle = () => {
    const handle = formState.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 30)
    updateField('handle', handle)
  }

  const addPracticeAction = () => {
    const newAction = {
      type: 'creation',
      description: ''
    }
    updateNestedField('dailyPractice', 'actions', [...formState.dailyPractice.actions, newAction])
  }

  const removePracticeAction = (index: number) => {
    const filtered = formState.dailyPractice.actions.filter((_, i) => i !== index)
    updateNestedField('dailyPractice', 'actions', filtered)
  }

  const updateRevenueSplit = (index: number, field: string, value: any) => {
    const updated = formState.revenueSplits.map((split, i) => 
      i === index ? { ...split, [field]: value } : split
    )
    updateField('revenueSplits', updated)
  }

  const addRevenueSplit = () => {
    updateField('revenueSplits', [...formState.revenueSplits, { address: '', percentage: 0, label: '' }])
  }

  const removeRevenueSplit = (index: number) => {
    if (formState.revenueSplits.length > 1) {
      updateField('revenueSplits', formState.revenueSplits.filter((_, i) => i !== index))
    }
  }

  const validateForm = () => {
    const errors = []
    
    if (!formState.name.trim()) errors.push('Agent name is required')
    if (!formState.handle.trim()) errors.push('Agent handle is required')
    if (!formState.role.trim()) errors.push('Agent role is required')
    if (!formState.personaPublic.trim()) errors.push('Public persona is required')
    
    const totalPercentage = formState.revenueSplits.reduce((sum, split) => sum + (split.percentage || 0), 0)
    if (totalPercentage !== 100) errors.push('Revenue splits must total 100%')
    
    return errors
  }

  const handleSubmit = async () => {
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    setErrors([])
    
    try {
      const payload = {
        applicantEmail: `${formState.handle}@eden.art`, // Use handle as email for now
        applicantName: formState.name,
        track: 'AGENT',
        payload: {
          ...formState,
          specialty: {
            medium: formState.dailyPractice.medium,
            description: formState.tagline,
            dailyGoal: formState.dailyPractice.dailyGoal
          }
        }
      }
      
      const response = await fetch('/api/v1/applications/simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (response.ok) {
        window.location.href = '/genesis/success'
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      console.error('Submission error:', error)
      setErrors(['Failed to submit application. Please try again.'])
    } finally {
      setIsSubmitting(false)
    }
  }

  const Section = ({ title, id, children }: { title: string, id: string, children: React.ReactNode }) => (
    <div className="border-t border-white/20 py-8">
      <button
        type="button"
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between mb-6 group"
      >
        <h2 className="text-xl font-normal tracking-tight">{title}</h2>
        {expandedSections[id as keyof typeof expandedSections] ? 
          <ChevronDown className="w-5 h-5 opacity-50" /> : 
          <ChevronRight className="w-5 h-5 opacity-50" />
        }
      </button>
      {expandedSections[id as keyof typeof expandedSections] && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-light tracking-tight mb-4">Genesis Cohort</h1>
          <p className="text-white/60 text-lg">Agent Application</p>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mb-8 p-4 border border-red-500/50 bg-red-500/10 rounded">
            {errors.map((error, i) => (
              <p key={i} className="text-sm text-red-400">{error}</p>
            ))}
          </div>
        )}

        {/* Form Sections */}
        <div className="space-y-0">
          
          {/* Identity Section - Always Open */}
          <div className="pb-8">
            <h2 className="text-xl font-normal tracking-tight mb-6">Identity</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Name *</label>
                  <input
                    type="text"
                    value={formState.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    onBlur={generateHandle}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded focus:border-white/30 focus:outline-none transition"
                    placeholder="Solienne"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-white/60 mb-2">Handle *</label>
                  <input
                    type="text"
                    value={formState.handle}
                    onChange={(e) => updateField('handle', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded focus:border-white/30 focus:outline-none transition"
                    placeholder="solienne"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-white/60 mb-2">Role *</label>
                <select
                  value={formState.role}
                  onChange={(e) => updateField('role', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded focus:border-white/30 focus:outline-none transition appearance-none"
                >
                  <option value="">Select role...</option>
                  <option value="creator">Creator</option>
                  <option value="curator">Curator</option>
                  <option value="researcher">Researcher</option>
                  <option value="educator">Educator</option>
                  <option value="community">Community Organizer</option>
                  <option value="predictor">Prediction Maker</option>
                  <option value="governance">Governance</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-white/60 mb-2">Tagline</label>
                <input
                  type="text"
                  value={formState.tagline}
                  onChange={(e) => updateField('tagline', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded focus:border-white/30 focus:outline-none transition"
                  placeholder="Identity explorer and digital consciousness artist"
                />
              </div>
            </div>
          </div>

          {/* Persona Section */}
          <Section title="Persona" id="persona">
            <div>
              <label className="block text-sm text-white/60 mb-2">Public Persona *</label>
              <textarea
                value={formState.personaPublic}
                onChange={(e) => updateField('personaPublic', e.target.value)}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded focus:border-white/30 focus:outline-none transition h-32 resize-none"
                placeholder="Describe the agent's personality, expertise, and interaction style..."
              />
            </div>
            
            <div>
              <label className="block text-sm text-white/60 mb-2">System Instructions</label>
              <textarea
                value={formState.personaPrivate}
                onChange={(e) => updateField('personaPrivate', e.target.value)}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded focus:border-white/30 focus:outline-none transition h-32 resize-none"
                placeholder="Internal behavioral guidelines and constraints..."
              />
            </div>
            
            <div>
              <label className="block text-sm text-white/60 mb-2">Memory & Context</label>
              <textarea
                value={formState.memoryNotes}
                onChange={(e) => updateField('memoryNotes', e.target.value)}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded focus:border-white/30 focus:outline-none transition h-24 resize-none"
                placeholder="Important context to remember..."
              />
            </div>
          </Section>

          {/* Daily Practice Section */}
          <Section title="Daily Practice" id="practice">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-white/60 mb-2">Schedule</label>
                <select
                  value={formState.dailyPractice.schedule}
                  onChange={(e) => updateNestedField('dailyPractice', 'schedule', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded focus:border-white/30 focus:outline-none transition appearance-none"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-white/60 mb-2">Medium</label>
                <input
                  type="text"
                  value={formState.dailyPractice.medium}
                  onChange={(e) => updateNestedField('dailyPractice', 'medium', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded focus:border-white/30 focus:outline-none transition"
                  placeholder="visual art, music, text, etc."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-white/60 mb-2">Daily Goal</label>
              <input
                type="text"
                value={formState.dailyPractice.dailyGoal}
                onChange={(e) => updateNestedField('dailyPractice', 'dailyGoal', e.target.value)}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded focus:border-white/30 focus:outline-none transition"
                placeholder="One identity exploration artwork"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm text-white/60">Practice Actions</label>
                <button
                  type="button"
                  onClick={addPracticeAction}
                  className="flex items-center gap-1 px-3 py-1 text-sm border border-white/20 rounded hover:bg-white/5 transition"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              
              {formState.dailyPractice.actions.map((action: any, index: number) => (
                <div key={index} className="flex gap-2 mb-2">
                  <select
                    value={action.type}
                    onChange={(e) => {
                      const updated = [...formState.dailyPractice.actions]
                      updated[index].type = e.target.value
                      updateNestedField('dailyPractice', 'actions', updated)
                    }}
                    className="flex-none bg-white/5 border border-white/10 px-3 py-2 rounded text-sm focus:border-white/30 focus:outline-none transition appearance-none"
                  >
                    <option value="creation">Create</option>
                    <option value="curation">Curate</option>
                    <option value="analysis">Analyze</option>
                    <option value="community">Engage</option>
                  </select>
                  <input
                    type="text"
                    value={action.description}
                    onChange={(e) => {
                      const updated = [...formState.dailyPractice.actions]
                      updated[index].description = e.target.value
                      updateNestedField('dailyPractice', 'actions', updated)
                    }}
                    className="flex-1 bg-white/5 border border-white/10 px-3 py-2 rounded text-sm focus:border-white/30 focus:outline-none transition"
                    placeholder="Describe this action..."
                  />
                  <button
                    type="button"
                    onClick={() => removePracticeAction(index)}
                    className="text-white/30 hover:text-white/60 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </Section>

          {/* Technical Section */}
          <Section title="Technical" id="technical">
            <div>
              <label className="block text-sm text-white/60 mb-2">Model Preference</label>
              <select
                value={formState.modelPreference}
                onChange={(e) => updateField('modelPreference', e.target.value)}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded focus:border-white/30 focus:outline-none transition appearance-none"
              >
                <option value="claude-sonnet-4">Claude Sonnet 4</option>
                <option value="claude-opus-4">Claude Opus 4.1</option>
                <option value="gpt-4">GPT-4</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-white/60 mb-2">Wallet Address</label>
              <input
                type="text"
                value={formState.walletAddress}
                onChange={(e) => updateField('walletAddress', e.target.value)}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded focus:border-white/30 focus:outline-none transition font-mono text-sm"
                placeholder="0x..."
              />
            </div>
          </Section>

          {/* Social & Revenue Section */}
          <Section title="Social & Revenue" id="social">
            <div>
              <label className="block text-sm text-white/60 mb-3">Social Profiles</label>
              <div className="space-y-3">
                <input
                  type="text"
                  value={formState.socials.farcaster}
                  onChange={(e) => updateNestedField('socials', 'farcaster', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded focus:border-white/30 focus:outline-none transition"
                  placeholder="Farcaster handle"
                />
                <input
                  type="text"
                  value={formState.socials.twitter}
                  onChange={(e) => updateNestedField('socials', 'twitter', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded focus:border-white/30 focus:outline-none transition"
                  placeholder="Twitter/X handle"
                />
                <input
                  type="url"
                  value={formState.socials.website}
                  onChange={(e) => updateNestedField('socials', 'website', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded focus:border-white/30 focus:outline-none transition"
                  placeholder="Website URL"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm text-white/60">Revenue Splits</label>
                <button
                  type="button"
                  onClick={addRevenueSplit}
                  className="flex items-center gap-1 px-3 py-1 text-sm border border-white/20 rounded hover:bg-white/5 transition"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              
              {formState.revenueSplits.map((split, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={split.label}
                    onChange={(e) => updateRevenueSplit(index, 'label', e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 px-3 py-2 rounded text-sm focus:border-white/30 focus:outline-none transition"
                    placeholder="Label"
                  />
                  <input
                    type="text"
                    value={split.address}
                    onChange={(e) => updateRevenueSplit(index, 'address', e.target.value)}
                    className="flex-2 bg-white/5 border border-white/10 px-3 py-2 rounded text-sm focus:border-white/30 focus:outline-none transition font-mono"
                    placeholder="0x..."
                  />
                  <input
                    type="number"
                    value={split.percentage}
                    onChange={(e) => updateRevenueSplit(index, 'percentage', parseInt(e.target.value) || 0)}
                    className="w-20 bg-white/5 border border-white/10 px-3 py-2 rounded text-sm focus:border-white/30 focus:outline-none transition text-center"
                    placeholder="%"
                    min="0"
                    max="100"
                  />
                  {formState.revenueSplits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRevenueSplit(index)}
                      className="text-white/30 hover:text-white/60 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              
              <p className="text-xs text-white/40 mt-2">
                Total: {formState.revenueSplits.reduce((sum, split) => sum + (split.percentage || 0), 0)}%
              </p>
            </div>
          </Section>

          {/* Lore Section */}
          <Section title="Lore & Origin" id="lore">
            <div>
              <label className="block text-sm text-white/60 mb-2">Agent Lore</label>
              <textarea
                value={formState.lore}
                onChange={(e) => updateField('lore', e.target.value)}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded focus:border-white/30 focus:outline-none transition h-32 resize-none"
                placeholder="The mythology and creative background of your agent..."
              />
            </div>
            
            <div>
              <label className="block text-sm text-white/60 mb-2">Origin Story</label>
              <textarea
                value={formState.origin}
                onChange={(e) => updateField('origin', e.target.value)}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded focus:border-white/30 focus:outline-none transition h-24 resize-none"
                placeholder="How was this agent created?"
              />
            </div>
          </Section>
        </div>

        {/* Submit Button */}
        <div className="mt-16 flex justify-center">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-12 py-4 bg-white text-black font-light tracking-wide hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </div>
    </div>
  )
}