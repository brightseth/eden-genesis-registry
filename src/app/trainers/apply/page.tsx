'use client'

import React, { useState, useCallback } from 'react'
import { ChevronDown, ChevronRight, Upload, X, Plus } from 'lucide-react'

export default function TrainerApplicationPage() {
  const [formState, setFormState] = useState({
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@airesearch.edu',
    description: 'AI Research Scientist with 8+ years of experience in machine learning, computer vision, and neural network architectures. Specialized in training large language models and multimodal AI systems. Passionate about advancing the field through education and mentorship of next-generation AI agents.',
    expertise: ['Machine Learning', 'Computer Vision', 'Natural Language Processing', 'Neural Architecture Search'],
    experience: 'PhD in Computer Science from Stanford University with focus on deep learning architectures. Previously Principal Research Scientist at DeepMind where I led teams developing advanced training methodologies for large language models. Published 50+ papers in top-tier conferences including NeurIPS, ICML, and ICLR. Extensive experience training foundation models and developing novel optimization techniques for AI systems.',
    portfolio: 'https://sarahchen.ai',
    image: '',
    socialLinks: {
      twitter: '@sarahchen_ai',
      linkedin: 'https://linkedin.com/in/sarahchen-ai',
      website: 'https://sarahchen.ai'
    },
    availability: 'part-time',
    motivation: 'I am deeply motivated to contribute to Eden Academy because I believe the future of AI lies in creating agents that can truly understand and collaborate with humans. My experience training foundation models has shown me the immense potential of AI systems when properly guided and aligned. I want to help shape the next generation of AI agents to be not just powerful, but also ethical, creative, and genuinely beneficial to society.'
  })

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    profile: true,
    experience: true,
    availability: true
  })

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [imageUploading, setImageUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  // IPFS Upload Function
  const uploadImageToIPFS = async (file: File): Promise<string> => {
    setImageUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhMzBjZTkzOC00NzFhLTQyMzMtOWRmNi1lMDI4YzA4NDg2ZWQiLCJlbWFpbCI6InNldGhAZWRlbi5hcnQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5SW5mb3JtYXRpb24iOnsic2NvcGVzIjpbeyJhcGlfa2V5IjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SjFjMlZ5U1c1bWIzSnRZWFJwYjI0aU9uc2lhV1FpT2lKaE16QmpaVGt6T0MwME56RmhMVFF5TXpNdE9XUm1OaTFsTURJNFl6QTROE0ZqTmlWa0lpd2laVzFoYVd3aU9pSnpaWFJvUUdWa1pXNHVZWEowSWl3aVpXMWhhV3hmZG1WeWFXWnBaV1FpT25SeWRXVXNJbkJwYmw5d2IyeHBZM2tpT25zaWNtVm5hVzl1Y3lJNlczc2laR1Z6YVhKbFpGSmxjR3hwWTJGMGFXOXVRMjkxYm5RaU9qRXNJbWxrSWpvaVJsSkJNU0o5WFN3aWRtVnljMmx2YmlJNk1YMHNJbTFtWVY5bGJtRmliR1ZrSWpwbVlXeHpaU3dpYzNSaGRIVnpJam9pUVVOVVNWWkZJbjBzSW1GMWRHaGxiblJwWTJGMGFXOXVWSGx3WlNJNkluTmpiM0JsWkV0bGVTSXNJbk5qYjNCbFpFdGxlVWx1Wm05eWJXRjBhVzl1SWpwN0luTmpiM0JsY3lJNld5SmhjR2xmYTJWNUlsMHNJblZ6WlhKVFpXTnlaWFJmYVhOZmFXNGlPaUpzY0hWMUwySXhPRmNpZlgwLlFjNzZSSDNBaGpJTW9fUE9nSGdKdTlNbmtOcDJoYUVTZlotYXhrWklHbWMiLCJiaWQiOiI1NzUwNTY5Mi00ODcwLTRhOWYtOGQzYi1iZDBkOGYxNTgzMGMiLCJ3b3JrZXIiOiIxNTcxNTU4IiwidXNlcklkIjoidHJhZm9yd1djQjUxVjJBclhWRiJ9XQ.dkPbShOyTEjpOHH2GW1d6TkKaI_e9zHJbvTzGJYS_Eg`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Failed to upload to IPFS: ${response.statusText}`)
      }

      const result = await response.json()
      const ipfsHash = result.IpfsHash
      return ipfsHash

    } catch (error) {
      console.error('IPFS upload error:', error)
      throw new Error('Failed to upload image to IPFS')
    } finally {
      setImageUploading(false)
    }
  }

  // Form handlers
  const updateFormState = useCallback((field: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  const updateNestedField = useCallback((parent: string, field: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }))
  }, [])

  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }, [])

  const addExpertise = useCallback(() => {
    if (formState.expertise.length < 5) {
      setFormState(prev => ({
        ...prev,
        expertise: [...prev.expertise, '']
      }))
    }
  }, [formState.expertise])

  const updateExpertise = useCallback((index: number, value: string) => {
    setFormState(prev => ({
      ...prev,
      expertise: prev.expertise.map((item, i) => i === index ? value : item)
    }))
  }, [])

  const removeExpertise = useCallback((index: number) => {
    setFormState(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index)
    }))
  }, [])

  // File upload handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      await handleImageUpload(files[0])
    }
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await handleImageUpload(files[0])
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      const ipfsHash = await uploadImageToIPFS(file)
      setFormState(prev => ({
        ...prev,
        image: ipfsHash
      }))
    } catch (error) {
      setErrors(['Failed to upload image. Please try again.'])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrors([])
    
    try {
      // Validate required fields
      const requiredFields = ['name', 'email', 'description', 'experience']
      const missingFields = requiredFields.filter(field => !formState[field])
      
      if (missingFields.length > 0) {
        setErrors([`Please fill in all required fields: ${missingFields.join(', ')}`])
        setSubmitting(false)
        return
      }

      // Format payload for trainer application
      const payload = {
        name: formState.name,
        email: formState.email,
        description: formState.description,
        expertise: formState.expertise.filter(e => e.trim()),
        experience: formState.experience,
        portfolio: formState.portfolio,
        image: formState.image,
        socialLinks: formState.socialLinks,
        availability: formState.availability,
        motivation: formState.motivation,
        applicationId: `trainer_${formState.email}_${Date.now()}`
      }

      console.log('Submitting trainer application:', payload)

      const response = await fetch('https://registry.eden-academy.xyz/api/trainers/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Trainer application submitted:', result)
        setSubmitted(true)
      } else {
        const errorText = await response.text()
        console.error('Submission error:', errorText)
        setErrors(['Submission failed. Please try again.'])
      }
    } catch (error) {
      console.error('Submission error:', error)
      setErrors(['Submission failed. Please check your connection and try again.'])
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">✨</div>
            <h1 className="text-4xl font-bold uppercase tracking-wider mb-4">
              APPLICATION SUBMITTED
            </h1>
            <p className="text-lg opacity-90 mb-6">
              Thank you for your interest in becoming a trainer at Eden Academy!
            </p>
            <p className="text-sm opacity-70 mb-8">
              We've received your application and will review it carefully. Our team will be in touch within 5-7 business days with next steps.
            </p>
            <div className="space-y-4">
              <div className="p-4 border border-green-500/20 bg-green-500/5 text-left">
                <p className="text-sm font-medium mb-2 text-green-400">What happens next:</p>
                <ul className="text-sm opacity-80 space-y-1 list-disc list-inside">
                  <li>Application review by Eden Academy team</li>
                  <li>Interview scheduling for qualified candidates</li>
                  <li>Skills assessment and portfolio review</li>
                  <li>Final decision and onboarding process</li>
                </ul>
              </div>
            </div>
            <div className="mt-8">
              <a 
                href="/" 
                className="inline-block px-6 py-3 border border-white/40 hover:border-white hover:bg-white hover:text-black transition-all duration-200 uppercase tracking-wider text-sm"
              >
                Return Home
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const Section = React.memo(({ title, id, children }: { title: string, id: string, children: React.ReactNode }) => {
    const isExpanded = expandedSections[id as keyof typeof expandedSections]
    return (
      <div className="border-t border-white/20 py-8">
        <button
          type="button"
          onClick={() => toggleSection(id)}
          className="flex items-center justify-between w-full text-left mb-6 hover:opacity-80 transition-opacity"
        >
          <h2 className="text-xl font-bold uppercase tracking-wider">{title}</h2>
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
        <div 
          className="space-y-6 transition-all duration-200"
          style={{ display: isExpanded ? 'block' : 'none' }}
        >
          {children}
        </div>
      </div>
    )
  })

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold uppercase tracking-wider mb-4">
            TRAINER APPLICATION
          </h1>
          <p className="text-sm uppercase opacity-70">
            Join Eden Academy's training team
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-0">
          <Section title="Basic Information" id="basic">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => updateFormState('name', e.target.value)}
                  placeholder="Your full name"
                  className="w-full bg-transparent border border-white px-4 py-2 focus:outline-none focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-wider mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(e) => updateFormState('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-transparent border border-white px-4 py-2 focus:outline-none focus:border-green-500"
                  required
                />
              </div>
            </div>
          </Section>

          <Section title="Profile & Image" id="profile">
            <div>
              <label className="block text-sm uppercase tracking-wider mb-2">
                Profile Description *
              </label>
              <textarea
                value={formState.description}
                onChange={(e) => updateFormState('description', e.target.value)}
                placeholder="Tell us about yourself and your approach to training AI agents..."
                rows={4}
                className="w-full bg-transparent border border-white px-4 py-2 focus:outline-none focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm uppercase tracking-wider mb-2">
                Profile Image
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
                  dragOver 
                    ? 'border-green-500 bg-green-500/10' 
                    : 'border-white/40 hover:border-white/60'
                }`}
                onClick={() => document.getElementById('imageInput')?.click()}
              >
                {formState.image ? (
                  <div className="space-y-4">
                    <img 
                      src={`https://gateway.pinata.cloud/ipfs/${formState.image}`}
                      alt="Profile preview"
                      className="w-32 h-32 object-cover mx-auto border border-white/20"
                    />
                    <div className="text-green-500 text-sm">
                      ✓ Image uploaded to IPFS
                    </div>
                  </div>
                ) : imageUploading ? (
                  <div className="space-y-2">
                    <div className="text-xl opacity-50">⏳</div>
                    <div className="text-sm opacity-70">Uploading to IPFS...</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-2xl opacity-50">📸</div>
                    <div className="text-sm opacity-70">
                      Drag and drop an image here, or click to browse
                    </div>
                    <div className="text-xs opacity-50">
                      Supports: JPG, PNG, GIF (Max 10MB)
                    </div>
                  </div>
                )}
              </div>
              <input
                id="imageInput"
                type="file"
                onChange={handleFileInput}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div>
              <label className="block text-sm uppercase tracking-wider mb-2">
                Areas of Expertise
              </label>
              <div className="space-y-2">
                {formState.expertise.map((expertise, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={expertise}
                      onChange={(e) => updateExpertise(index, e.target.value)}
                      placeholder="e.g., Computer Vision, NLP, Generative AI"
                      className="flex-1 bg-transparent border border-white px-4 py-2 focus:outline-none focus:border-green-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeExpertise(index)}
                      className="px-3 py-2 border border-red-500/40 hover:border-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                {formState.expertise.length < 5 && (
                  <button
                    type="button"
                    onClick={addExpertise}
                    className="flex items-center gap-2 px-4 py-2 border border-white/40 hover:border-white transition-colors"
                  >
                    <Plus size={16} />
                    Add Expertise Area
                  </button>
                )}
              </div>
            </div>
          </Section>

          <Section title="Experience & Background" id="experience">
            <div>
              <label className="block text-sm uppercase tracking-wider mb-2">
                Relevant Experience *
              </label>
              <textarea
                value={formState.experience}
                onChange={(e) => updateFormState('experience', e.target.value)}
                placeholder="Describe your background in AI, machine learning, training, or related fields..."
                rows={4}
                className="w-full bg-transparent border border-white px-4 py-2 focus:outline-none focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm uppercase tracking-wider mb-2">
                Portfolio/Website
              </label>
              <input
                type="url"
                value={formState.portfolio}
                onChange={(e) => updateFormState('portfolio', e.target.value)}
                placeholder="https://your-portfolio.com"
                className="w-full bg-transparent border border-white px-4 py-2 focus:outline-none focus:border-green-500"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm uppercase tracking-wider mb-2">
                  Twitter
                </label>
                <input
                  type="text"
                  value={formState.socialLinks.twitter}
                  onChange={(e) => updateNestedField('socialLinks', 'twitter', e.target.value)}
                  placeholder="@username"
                  className="w-full bg-transparent border border-white px-4 py-2 focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-wider mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={formState.socialLinks.linkedin}
                  onChange={(e) => updateNestedField('socialLinks', 'linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full bg-transparent border border-white px-4 py-2 focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-wider mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={formState.socialLinks.website}
                  onChange={(e) => updateNestedField('socialLinks', 'website', e.target.value)}
                  placeholder="https://your-site.com"
                  className="w-full bg-transparent border border-white px-4 py-2 focus:outline-none focus:border-green-500"
                />
              </div>
            </div>
          </Section>

          <Section title="Availability & Motivation" id="availability">
            <div>
              <label className="block text-sm uppercase tracking-wider mb-2">
                Availability
              </label>
              <select
                value={formState.availability}
                onChange={(e) => updateFormState('availability', e.target.value)}
                className="w-full bg-transparent border border-white px-4 py-2 focus:outline-none focus:border-green-500"
              >
                <option value="part-time" className="bg-black">Part-time (10-20 hours/week)</option>
                <option value="full-time" className="bg-black">Full-time (40+ hours/week)</option>
                <option value="project-based" className="bg-black">Project-based</option>
                <option value="flexible" className="bg-black">Flexible</option>
              </select>
            </div>

            <div>
              <label className="block text-sm uppercase tracking-wider mb-2">
                Why do you want to be a trainer at Eden Academy?
              </label>
              <textarea
                value={formState.motivation}
                onChange={(e) => updateFormState('motivation', e.target.value)}
                placeholder="What motivates you to train AI agents? What unique perspective would you bring?"
                rows={4}
                className="w-full bg-transparent border border-white px-4 py-2 focus:outline-none focus:border-green-500"
              />
            </div>
          </Section>

          {/* Error Display */}
          {errors.length > 0 && (
            <div className="p-4 border border-red-500 bg-red-500/10 text-red-400">
              {errors.map((error, index) => (
                <p key={index} className="text-sm">{error}</p>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-8">
            <button
              type="submit"
              disabled={submitting || imageUploading}
              className="w-full border-2 border-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-200 disabled:opacity-50"
            >
              {submitting ? 'SUBMITTING APPLICATION...' : 'SUBMIT TRAINER APPLICATION'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}