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
  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url')

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

  // File upload handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (selectedFile: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'audio/mp3', 'audio/wav', 'text/plain']
    
    if (!validTypes.includes(selectedFile.type)) {
      setMessage({
        type: 'error',
        text: 'Invalid file type. Please upload an image, video, audio, or text file.'
      })
      return
    }

    // Validate file size (50MB max)
    if (selectedFile.size > 50 * 1024 * 1024) {
      setMessage({
        type: 'error',
        text: 'File too large. Please upload a file smaller than 50MB.'
      })
      return
    }

    setFile(selectedFile)
    setUploadMode('file')
    
    // Auto-detect media type
    if (selectedFile.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, mediaType: 'image' }))
    } else if (selectedFile.type.startsWith('video/')) {
      setFormData(prev => ({ ...prev, mediaType: 'video' }))
    } else if (selectedFile.type.startsWith('audio/')) {
      setFormData(prev => ({ ...prev, mediaType: 'audio' }))
    } else if (selectedFile.type.startsWith('text/')) {
      setFormData(prev => ({ ...prev, mediaType: 'text' }))
    }

    // Auto-fill title if empty
    if (!formData.title) {
      const nameWithoutExtension = selectedFile.name.replace(/\.[^/.]+$/, '')
      setFormData(prev => ({ ...prev, title: nameWithoutExtension }))
    }

    setMessage(null)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const removeFile = () => {
    setFile(null)
    setUploadMode('url')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // Generate idempotency key
      const idempotencyKey = `upload-${formData.agentId}-${Date.now()}`
      
      let response: Response

      if (uploadMode === 'file' && file) {
        // File upload mode - use FormData
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)
        uploadFormData.append('agentId', formData.agentId)
        uploadFormData.append('mediaType', formData.mediaType)
        if (formData.title) uploadFormData.append('title', formData.title)
        if (formData.description) uploadFormData.append('description', formData.description)
        if (formData.tags) uploadFormData.append('tags', formData.tags)
        if (formData.themes) uploadFormData.append('themes', formData.themes)

        response = await fetch(`/api/v1/agents/${formData.agentId}/works`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_REGISTRY_API_KEY || 'registry-upload-key-v1'}`,
            'Idempotency-Key': idempotencyKey
          },
          body: uploadFormData
        })
      } else {
        // URL mode - use JSON payload
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

        response = await fetch(`/api/v1/agents/${formData.agentId}/works`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_REGISTRY_API_KEY || 'registry-upload-key-v1'}`,
            'Idempotency-Key': idempotencyKey
          },
          body: JSON.stringify(workPayload)
        })
      }

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
        setFile(null)
        setUploadMode('url')
        
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

          {/* Upload Mode Toggle */}
          <div>
            <label className="block text-sm uppercase tracking-wider mb-2">
              UPLOAD METHOD
            </label>
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => setUploadMode('url')}
                className={`px-4 py-2 border uppercase tracking-wider transition-colors ${
                  uploadMode === 'url' 
                    ? 'bg-white text-black border-white' 
                    : 'border-white/40 hover:border-white'
                }`}
              >
                URL
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                className={`px-4 py-2 border uppercase tracking-wider transition-colors ${
                  uploadMode === 'file' 
                    ? 'bg-white text-black border-white' 
                    : 'border-white/40 hover:border-white'
                }`}
              >
                FILE UPLOAD
              </button>
            </div>
          </div>

          {/* File Upload Area */}
          {uploadMode === 'file' && (
            <div>
              <label className="block text-sm uppercase tracking-wider mb-2">
                DROP FILE OR CLICK TO BROWSE
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
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                {file ? (
                  <div className="space-y-4">
                    <div className="text-green-500">
                      ✓ {file.name} ({(file.size / (1024 * 1024)).toFixed(1)}MB)
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile()
                      }}
                      className="text-sm uppercase tracking-wider opacity-70 hover:opacity-100 border border-white/20 px-3 py-1"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-2xl opacity-50">📁</div>
                    <div className="text-sm opacity-70">
                      Drag and drop files here, or click to browse
                    </div>
                    <div className="text-xs opacity-50">
                      Supports: Images, Videos, Audio, Text (Max 50MB)
                    </div>
                  </div>
                )}
              </div>
              <input
                id="fileInput"
                type="file"
                onChange={handleFileInput}
                accept="image/*,video/*,audio/*,text/plain"
                className="hidden"
              />
            </div>
          )}

          {/* Creation URL */}
          {uploadMode === 'url' && (
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
          )}

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
            disabled={loading || (uploadMode === 'url' && !formData.creationUrl) || (uploadMode === 'file' && !file)}
            className="w-full border-2 border-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'UPLOADING...' : `UPLOAD ${uploadMode === 'file' ? 'FILE' : 'FROM URL'}`}
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