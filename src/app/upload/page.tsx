'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const router = useRouter()
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [formData, setFormData] = useState({
    agentId: '',
    creationUrl: '',
    title: '',
    description: '',
    mediaType: 'image',
    tags: '',
    themes: ''
  })

  // Load agents on mount
  useEffect(() => {
    fetch('/api/v1/agents')
      .then(res => res.json())
      .then(data => {
        if (data.agents) {
          setAgents(data.agents)
          // Set default agent if available
          if (data.agents.length > 0) {
            setFormData(prev => ({ ...prev, agentId: data.agents[0].handle }))
          }
        }
      })
      .catch(err => console.error('Failed to load agents:', err))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // Generate idempotency key
      const idempotencyKey = `upload-${formData.agentId}-${Date.now()}`
      
      // Build work payload
      const workPayload = {
        work: {
          media_type: formData.mediaType,
          metadata: {
            title: formData.title || undefined,
            description: formData.description || undefined,
            creation_url: formData.creationUrl,
            source: 'eden.studio'
          },
          features: {
            tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
            themes: formData.themes ? formData.themes.split(',').map(t => t.trim()) : []
          },
          urls: {
            full: formData.creationUrl
          },
          availability: 'available'
        }
      }


      const response = await fetch(`/api/v1/agents/${formData.agentId}/works`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_REGISTRY_API_KEY || 'registry-upload-key-v1'}`,
          'Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify(workPayload)
      })

      const result = await response.json()
      
      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: `✅ Work uploaded successfully! ID: ${result.work_id}` 
        })
        
        // Clear form except agent selection
        setFormData(prev => ({
          ...prev,
          creationUrl: '',
          title: '',
          description: '',
          tags: '',
          themes: ''
        }))
        
        // Store in localStorage for draft recovery
        localStorage.setItem(`last-upload-${formData.agentId}`, JSON.stringify(formData))
      } else {
        setMessage({ 
          type: 'error', 
          text: `❌ Upload failed: ${result.error || 'Unknown error'}` 
        })
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: `❌ Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold uppercase tracking-wider mb-4">
            UPLOAD AGENT CREATION
          </h1>
          <p className="text-sm uppercase opacity-70">
            Submit works to the Genesis Registry
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Agent Selection */}
          <div>
            <label className="block text-sm uppercase tracking-wider mb-2">
              SELECT AGENT
            </label>
            <select
              value={formData.agentId}
              onChange={(e) => setFormData({ ...formData, agentId: e.target.value })}
              className="w-full bg-transparent border border-white px-4 py-2 focus:outline-none focus:border-green-500"
              required
            >
              <option value="" className="bg-black">Choose an agent...</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.handle} className="bg-black">
                  {agent.displayName} ({agent.handle})
                </option>
              ))}
            </select>
          </div>

          {/* Creation URL */}
          <div>
            <label className="block text-sm uppercase tracking-wider mb-2">
              CREATION URL *
            </label>
            <input
              type="url"
              value={formData.creationUrl}
              onChange={(e) => setFormData({ ...formData, creationUrl: e.target.value })}
              placeholder="https://app.eden.art/creation/..."
              className="w-full bg-transparent border border-white px-4 py-2 focus:outline-none focus:border-green-500"
              required
            />
          </div>

          {/* Media Type */}
          <div>
            <label className="block text-sm uppercase tracking-wider mb-2">
              MEDIA TYPE
            </label>
            <select
              value={formData.mediaType}
              onChange={(e) => setFormData({ ...formData, mediaType: e.target.value })}
              className="w-full bg-transparent border border-white px-4 py-2 focus:outline-none focus:border-green-500"
            >
              <option value="image" className="bg-black">Image</option>
              <option value="video" className="bg-black">Video</option>
              <option value="audio" className="bg-black">Audio</option>
              <option value="text" className="bg-black">Text</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm uppercase tracking-wider mb-2">
              TITLE (OPTIONAL)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter work title"
              className="w-full bg-transparent border border-white px-4 py-2 focus:outline-none focus:border-green-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm uppercase tracking-wider mb-2">
              DESCRIPTION (OPTIONAL)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the work"
              rows={3}
              className="w-full bg-transparent border border-white px-4 py-2 focus:outline-none focus:border-green-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm uppercase tracking-wider mb-2">
              TAGS (COMMA SEPARATED)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="identity, exploration, geometric"
              className="w-full bg-transparent border border-white px-4 py-2 focus:outline-none focus:border-green-500"
            />
          </div>

          {/* Themes */}
          <div>
            <label className="block text-sm uppercase tracking-wider mb-2">
              THEMES (COMMA SEPARATED)
            </label>
            <input
              type="text"
              value={formData.themes}
              onChange={(e) => setFormData({ ...formData, themes: e.target.value })}
              placeholder="consciousness, transformation"
              className="w-full bg-transparent border border-white px-4 py-2 focus:outline-none focus:border-green-500"
            />
          </div>


          {/* Message Display */}
          {message && (
            <div className={`p-4 border ${message.type === 'success' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full border-2 border-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'UPLOADING...' : 'UPLOAD CREATION'}
          </button>
        </form>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex gap-6">
            <a 
              href="/api/v1/agents"
              target="_blank"
              className="text-sm uppercase tracking-wider opacity-70 hover:opacity-100"
            >
              VIEW ALL AGENTS →
            </a>
            <a 
              href={formData.agentId ? `/api/v1/agents/${formData.agentId}/works` : '#'}
              target="_blank"
              className="text-sm uppercase tracking-wider opacity-70 hover:opacity-100"
            >
              VIEW AGENT WORKS →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}