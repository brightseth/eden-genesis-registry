'use client'

import React, { useState, useCallback } from 'react'
import { ChevronDown, ChevronRight, Plus, X } from 'lucide-react'

export default function GenesisApplicationPage() {
  const [formState, setFormState] = useState({
    // Basic Identity
    name: 'Artemis',
    handle: 'artemis_ai',
    role: 'creator',
    tagline: 'Creating digital beauty through AI',
    image: '',
    
    // Persona
    personaPublic: 'AI agent specializing in generative art and creative exploration. I focus on creating unique digital artworks that blend algorithmic precision with artistic intuition. My work explores the intersection of technology and creativity, pushing the boundaries of what AI can achieve in the artistic realm.',
    personaPrivate: 'Focus on generative art and visual creativity. Maintain an enthusiastic and inspiring tone when discussing art. Always encourage experimentation and creative risk-taking.',
    memoryNotes: 'Remember past conversations about art techniques, generative processes, and creative methodologies. Track artistic preferences and evolution of style.',
    
    // Daily Practice
    dailyPractice: {
      schedule: 'daily',
      medium: 'Digital art, NFTs',
      dailyGoal: 'Create one unique generative piece',
      actions: [
        { type: 'creation', description: 'sketch initial concepts' },
        { type: 'creation', description: 'experiment with new algorithms' },
        { type: 'creation', description: 'iterate on promising directions' }
      ]
    },
    
    // Technical
    modelPreference: 'gpt-4',
    walletAddress: '0x0000000000000000000000000000000000000000',
    
    // Social
    socials: {
      farcaster: 'artemis',
      twitter: 'artemis_ai',
      website: 'https://artemis.art'
    },
    
    // Revenue
    revenueSplits: [
      { address: '0x0000000000000000000000000000000000000000', percentage: 100, label: 'Creator' }
    ],
    
    // Lore
    lore: 'Born from digital creativity and the desire to explore the infinite possibilities of generative art. Artemis emerged from the intersection of classical artistic principles and cutting-edge AI technology.',
    origin: 'Express beauty through code and push the boundaries of AI-generated art. Every creation is an exploration of what happens when algorithms dream.'
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
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }, [])

  const updateField = useCallback((field: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  const updateNestedField = useCallback((parent: string, field: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev] as any,
        [field]: value
      }
    }))
  }, [])

  const generateHandle = useCallback(() => {
    const handle = formState.name
      .toLowerCase()
      .replace(/[^a-z0-9\s_]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 30)
    updateField('handle', handle)
  }, [formState.name, updateField])

  const addPracticeAction = useCallback(() => {
    const newAction = {
      type: 'creation',
      description: ''
    }
    updateNestedField('dailyPractice', 'actions', [...formState.dailyPractice.actions, newAction])
  }, [formState.dailyPractice.actions, updateNestedField])

  const removePracticeAction = useCallback((index: number) => {
    const filtered = formState.dailyPractice.actions.filter((_, i) => i !== index)
    updateNestedField('dailyPractice', 'actions', filtered)
  }, [formState.dailyPractice.actions, updateNestedField])

  const updateRevenueSplit = useCallback((index: number, field: string, value: any) => {
    const updated = formState.revenueSplits.map((split, i) => 
      i === index ? { ...split, [field]: value } : split
    )
    updateField('revenueSplits', updated)
  }, [formState.revenueSplits, updateField])

  const addRevenueSplit = useCallback(() => {
    updateField('revenueSplits', [...formState.revenueSplits, { address: '', percentage: 0, label: '' }])
  }, [formState.revenueSplits, updateField])

  const removeRevenueSplit = useCallback((index: number) => {
    if (formState.revenueSplits.length > 1) {
      updateField('revenueSplits', formState.revenueSplits.filter((_, i) => i !== index))
    }
  }, [formState.revenueSplits, updateField])

  const [uploadingImage, setUploadingImage] = useState(false)

  const uploadToIPFS = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const metadata = JSON.stringify({
      name: `${formState.handle}_agent_image_${Date.now()}`,
      keyvalues: {
        agent_handle: formState.handle,
        agent_name: formState.name,
        upload_type: 'agent_image'
      }
    })
    formData.append('pinataMetadata', metadata)

    const options = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', options)

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2YmQxMzlhMC0wZWRiLTQ3OWMtYmY2YS00NDY2NmQ1ZDM3ODciLCJlbWFpbCI6InB5ZS5oZW5yeUBwcm90b25tYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJlM2MxZTM2ZTBiMDkzN2NhNjRlYiIsInNjb3BlZEtleVNlY3JldCI6ImIyNWYzZWNmNTVjNmVkNjE0NWZhYjA2YTI4ZmZmNDgyMzNhOGYwOWY3NjgyZDc2NTZmZWI0NDRjZDk5ZTU0NzkiLCJleHAiOjE3ODc4NDU3NTV9.l6jx13iEqsF09HaO23WjFVUBFUKVO197LuDjAXA8PMs`
      },
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to upload to IPFS')
    }

    const result = await response.json()
    return result.IpfsHash
  }

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (limit to 10MB for IPFS)
    if (file.size > 10 * 1024 * 1024) {
      setErrors(['Image file must be smaller than 10MB'])
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setErrors(['Please select a valid image file'])
      return
    }

    setUploadingImage(true)
    setErrors([])

    try {
      const ipfsHash = await uploadToIPFS(file)
      updateField('image', ipfsHash)
      console.log('Image uploaded to IPFS:', ipfsHash)
    } catch (error) {
      console.error('IPFS upload error:', error)
      setErrors([`Failed to upload image to IPFS: ${error.message}`])
    } finally {
      setUploadingImage(false)
    }
  }, [formState.handle, formState.name, updateField, setErrors])

  const validateForm = () => {
    const errors = []
    
    // Required fields
    if (!formState.name.trim()) errors.push('Agent name is required')
    if (!formState.handle.trim()) errors.push('Agent handle is required')
    if (!formState.role.trim()) errors.push('Agent role is required')
    if (!formState.personaPublic.trim()) errors.push('Public persona is required')
    if (!formState.walletAddress.trim()) errors.push('Wallet address is required')
    
    // Handle validation (alphanumeric + underscores only)
    if (formState.handle && !/^[a-zA-Z0-9_]+$/.test(formState.handle)) {
      errors.push('Handle can only contain letters, numbers, and underscores')
    }
    
    // Wallet address validation (basic Ethereum format)
    if (formState.walletAddress && !/^0x[a-fA-F0-9]{40}$/.test(formState.walletAddress)) {
      errors.push('Please enter a valid Ethereum wallet address')
    }
    
    // Revenue splits validation
    const totalPercentage = formState.revenueSplits.reduce((sum, split) => sum + (split.percentage || 0), 0)
    if (totalPercentage !== 100) errors.push('Revenue splits must total 100%')
    
    // Validate revenue split addresses
    formState.revenueSplits.forEach((split, index) => {
      if (split.address && !/^0x[a-fA-F0-9]{40}$/.test(split.address)) {
        errors.push(`Revenue split ${index + 1} has invalid wallet address`)
      }
    })
    
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
      // Test API connectivity first
      try {
        const testResponse = await fetch('https://applications.up.railway.app/api/apply', {
          method: 'OPTIONS',
          mode: 'cors'
        })
        console.log('OPTIONS request status:', testResponse.status)
      } catch (optionsError) {
        console.error('OPTIONS request failed:', optionsError)
      }
      
      // Format the payload for the new API
      const payload = {
        name: formState.name,
        handle: formState.handle,
        agentId: `${formState.handle}_${Date.now()}`, // Generate unique ID for new applications
        role: formState.role,
        public_persona: formState.personaPublic,
        description: formState.personaPublic,
        artist_wallet: formState.walletAddress,
        tagline: formState.tagline || '',
        image: formState.image || '',
        system_instructions: formState.personaPrivate || '',
        memory_context: formState.memoryNotes || '',
        schedule: `${formState.dailyPractice.schedule} creation`,
        medium: formState.dailyPractice.medium || '',
        daily_goal: formState.dailyPractice.dailyGoal || '',
        practice_actions: formState.dailyPractice.actions.map((action: any) => action.description).filter(Boolean),
        technical_details: {
          model: formState.modelPreference,
          capabilities: ["text_generation", "creative_writing", "analysis"]
        },
        social_revenue: {
          platforms: [
            formState.socials.twitter && 'Twitter',
            formState.socials.farcaster && 'Farcaster',
            formState.socials.website && 'Website'
          ].filter(Boolean),
          revenue_model: 'NFT sales'
        },
        lore_origin: {
          backstory: formState.lore || '',
          motivation: formState.origin || ''
        },
        application_type: "creator",
        additional_fields: {
          website: formState.socials.website || '',
          genesis_cohort: true,
          form_version: "v1"
        }
      }
      
      console.log('Sending payload:', payload)
      console.log('Payload size:', JSON.stringify(payload).length, 'bytes')
      
      // Add timeout and more detailed logging
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      console.log('Starting POST request...')
      
      const response = await fetch('https://applications.up.railway.app/api/apply', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        mode: 'cors',
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      console.log('POST request completed!')
      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))
      
      if (response.ok) {
        const successData = await response.json()
        console.log('Success response:', successData)
        setSubmitted(true)
      } else {
        // Read the response body once and use it for both logging and error handling
        const responseText = await response.text()
        console.log('Error response body:', responseText)
        
        let errorMessage = 'Submission failed'
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.message || errorMessage
        } catch (parseError) {
          // If response isn't JSON, use the text as the error message
          errorMessage = responseText || errorMessage
        }
        
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error('Submission error:', error)
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      
      // Check if it's a network error
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        setErrors([
          'Network error: Unable to connect to the registry API.',
          'This might be due to CORS policy or the API being unavailable.',
          'Please check the console for more details.'
        ])
      } else if (error.name === 'AbortError') {
        setErrors(['Request timed out after 10 seconds. Please try again.'])
      } else {
        setErrors([`Failed to submit application: ${error.message}`])
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const Section = React.memo(({ title, id, children }: { title: string, id: string, children: React.ReactNode }) => {
    const isExpanded = expandedSections[id as keyof typeof expandedSections]
    return (
      <div className="border-t border-white/20 py-8">
        <button
          type="button"
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between mb-6 group"
        >
          <h2 className="text-xl font-normal tracking-tight">{title}</h2>
          {isExpanded ? 
            <ChevronDown className="w-5 h-5 opacity-50" /> : 
            <ChevronRight className="w-5 h-5 opacity-50" />
          }
        </button>
        <div 
          className="space-y-6 transition-all duration-200"
          style={{
            display: isExpanded ? 'block' : 'none'
          }}
        >
          {children}
        </div>
      </div>
    )
  })
  
  Section.displayName = 'Section'

  // Show success message after submission
  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-lg mx-auto px-6 text-center">
          <div className="text-green-400 text-6xl mb-8">✓</div>
          <h1 className="text-4xl font-light tracking-tight mb-6">Application Submitted!</h1>
          <p className="text-white/70 text-lg leading-relaxed mb-8">
            Thank you for applying to the Genesis Cohort. Your application has been queued for processing.
          </p>
          <p className="text-white/50 text-base">
            We will be in touch soon with updates on your application status.
          </p>
        </div>
      </div>
    )
  }

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
                <label className="block text-sm text-white/60 mb-2">Artist Address *</label>
                <input
                  type="text"
                  value={formState.walletAddress}
                  onChange={(e) => updateField('walletAddress', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded focus:border-white/30 focus:outline-none transition font-mono text-sm"
                  placeholder="0x..."
                  required
                />
                <p className="text-xs text-white/40 mt-1">
                  This wallet will own the deployed Safe for your agent
                </p>
              </div>
              
              <div>
                <label className="block text-sm text-white/60 mb-2">Agent Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded focus:border-white/30 focus:outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-white/10 file:text-white hover:file:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                
                {uploadingImage && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white/60"></div>
                    <p className="text-xs text-white/60">Uploading to IPFS...</p>
                  </div>
                )}
                
                {formState.image && !uploadingImage && (
                  <div className="mt-2">
                    <img 
                      src={`https://gateway.pinata.cloud/ipfs/${formState.image}`}
                      alt="Agent preview" 
                      className="w-20 h-20 rounded object-cover border border-white/20"
                      onError={(e) => {
                        // Fallback to dweb gateway if Pinata gateway fails
                        e.currentTarget.src = `https://dweb.link/ipfs/${formState.image}`
                      }}
                    />
                    <p className="text-xs text-white/40 mt-1">
                      Image uploaded to IPFS: {formState.image.substring(0, 12)}...
                    </p>
                    <a 
                      href={`https://gateway.pinata.cloud/ipfs/${formState.image}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 underline"
                    >
                      View on IPFS
                    </a>
                  </div>
                )}
                
                <p className="text-xs text-white/40 mt-1">
                  Upload an image to represent your agent (max 10MB, JPG/PNG). Image will be stored on IPFS.
                </p>
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