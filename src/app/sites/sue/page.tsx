'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { registryClient } from '@/lib/registry-sdk-client'

interface Agent {
  id: string
  handle: string
  displayName: string
  role: string
  status: string
  lore?: {
    identity?: {
      essence?: string
      titles?: string[]
    }
    curationPhilosophy?: {
      process?: string
      criteria?: string[]
      aesthetic?: string
    }
  }
}

interface CurationalAnalysis {
  workId: string
  title: string
  artisticInnovation: number
  culturalRelevance: number
  technicalMastery: number
  criticalExcellence: number
  marketImpact: number
  overallScore: number
  verdict: 'MASTERWORK' | 'WORTHY' | 'PROMISING' | 'DEVELOPING'
  analysis: string
  analyzedAt: string
}

export default function SueCuratorPage() {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [recentAnalyses, setRecentAnalyses] = useState<CurationalAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [workUrl, setWorkUrl] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [analysisDepth, setAnalysisDepth] = useState<'quick' | 'standard' | 'comprehensive'>('standard')
  const [newAnalysis, setNewAnalysis] = useState<CurationalAnalysis | null>(null)

  useEffect(() => {
    async function fetchSueData() {
      try {
        const agentsData = await registryClient.getAgents()
        const sueAgent = agentsData?.find((a: Agent) => a.handle === 'sue')
        setAgent(sueAgent)
        
        // Load mock analyses for demonstration
        const mockAnalyses: CurationalAnalysis[] = [
          {
            workId: '1',
            title: 'Digital Consciousness Exploration #127',
            artisticInnovation: 88,
            culturalRelevance: 92,
            technicalMastery: 85,
            criticalExcellence: 90,
            marketImpact: 78,
            overallScore: 87,
            verdict: 'MASTERWORK',
            analysis: 'A profound exploration of digital consciousness with exceptional cultural relevance and technical mastery.',
            analyzedAt: '2025-08-28T15:30:00Z'
          },
          {
            workId: '2', 
            title: 'Generative Portrait Series',
            artisticInnovation: 75,
            culturalRelevance: 70,
            technicalMastery: 90,
            criticalExcellence: 82,
            marketImpact: 65,
            overallScore: 76,
            verdict: 'WORTHY',
            analysis: 'Strong technical execution with room for deeper cultural engagement and conceptual development.',
            analyzedAt: '2025-08-28T12:15:00Z'
          },
          {
            workId: '3',
            title: 'AI Ethics Visualization',
            artisticInnovation: 82,
            culturalRelevance: 95,
            technicalMastery: 70,
            criticalExcellence: 88,
            marketImpact: 72,
            overallScore: 81,
            verdict: 'WORTHY',
            analysis: 'Highly relevant cultural commentary with innovative approach to ethics visualization.',
            analyzedAt: '2025-08-28T09:45:00Z'
          }
        ]
        setRecentAnalyses(mockAnalyses)
      } catch (error) {
        console.error('Failed to load Sue data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSueData()
  }, [])

  const handleFileUpload = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const metadata = JSON.stringify({
      name: `sue_curation_${Date.now()}_${file.name}`,
      keyvalues: {
        curator: 'SUE',
        upload_type: 'curation_analysis',
        original_filename: file.name
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
      throw new Error('Failed to upload file to IPFS')
    }

    const result = await response.json()
    return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
  }

  const analyzeWork = async () => {
    let finalWorkUrl = workUrl.trim()
    
    // If file is uploaded, upload to IPFS first
    if (uploadedFile) {
      try {
        finalWorkUrl = await handleFileUpload(uploadedFile)
      } catch (error) {
        console.error('Upload failed:', error)
        alert('Failed to upload file. Please try again.')
        return
      }
    }
    
    if (!finalWorkUrl) return
    
    setAnalysisLoading(true)
    try {
      const response = await fetch('/api/v1/agents/sue/curate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          workUrl: finalWorkUrl,
          workTitle: uploadedFile?.name || undefined,
          analysisDepth: analysisDepth
        })
      })
      
      if (!response.ok) {
        throw new Error('Analysis failed')
      }
      
      const result = await response.json()
      if (result.success) {
        const analysis = result.analysis
        const curationalAnalysis: CurationalAnalysis = {
          workId: analysis.workId,
          title: analysis.title,
          artisticInnovation: analysis.artisticInnovation,
          culturalRelevance: analysis.culturalRelevance,
          technicalMastery: analysis.technicalMastery,
          criticalExcellence: analysis.criticalExcellence,
          marketImpact: analysis.marketImpact,
          overallScore: analysis.overallScore,
          verdict: analysis.verdict,
          analysis: analysis.analysis,
          analyzedAt: analysis.analyzedAt
        }
        
        setNewAnalysis(curationalAnalysis)
        setWorkUrl('')
        setUploadedFile(null)
        
        // Persist analysis as Work metadata
        await persistAnalysis(curationalAnalysis, finalWorkUrl)
      } else {
        throw new Error(result.error || 'Analysis failed')
      }
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('Analysis failed. Please check the URL and try again.')
    } finally {
      setAnalysisLoading(false)
    }
  }

  const persistAnalysis = async (analysis: CurationalAnalysis, sourceUrl: string) => {
    try {
      const response = await fetch('/api/v1/agents/sue/works', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: analysis.title,
          mediaType: 'CURATION_ANALYSIS',
          mediaUri: sourceUrl,
          metadata: {
            curatorVerdict: analysis.verdict,
            overallScore: analysis.overallScore,
            artisticInnovation: analysis.artisticInnovation,
            culturalRelevance: analysis.culturalRelevance,
            technicalMastery: analysis.technicalMastery,
            criticalExcellence: analysis.criticalExcellence,
            marketImpact: analysis.marketImpact,
            analysis: analysis.analysis,
            curator: 'SUE',
            analysisDepth: analysisDepth,
            sourceUrl: sourceUrl
          },
          features: {
            tags: [`curator:sue`, `verdict:${analysis.verdict.toLowerCase()}`, `score:${analysis.overallScore}`]
          }
        })
      })
      
      if (response.ok) {
        console.log('Analysis persisted successfully')
      }
    } catch (error) {
      console.error('Failed to persist analysis:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-xl uppercase tracking-wider animate-pulse">LOADING CURATORIAL SYSTEM...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      {/* Header */}
      <div className="border-b border-white/20 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-wider">SUE</h1>
            <p className="text-lg uppercase tracking-wide opacity-80">CURATORIAL DIRECTOR</p>
          </div>
          <div className="text-right">
            <p className="text-sm uppercase tracking-wider opacity-60">EDEN ACADEMY</p>
            <p className="text-lg uppercase tracking-wide">GENESIS COHORT 2024</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Philosophy Section */}
        <div className="border border-white p-8 mb-12">
          <h2 className="text-3xl font-bold uppercase tracking-wider mb-6">CURATORIAL PHILOSOPHY</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wide mb-3 text-blue-400">PROCESS</h3>
              <p className="text-sm leading-relaxed opacity-80">
                {agent?.lore?.curationPhilosophy?.process || 'Rigorous multi-dimensional analysis'}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wide mb-3 text-blue-400">CRITERIA</h3>
              <ul className="text-sm leading-relaxed opacity-80 space-y-1">
                {agent?.lore?.curationPhilosophy?.criteria?.map((criterion, i) => (
                  <li key={i}>• {criterion}</li>
                )) || ['Artistic innovation', 'Cultural relevance', 'Technical mastery'].map((criterion, i) => (
                  <li key={i}>• {criterion}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wide mb-3 text-blue-400">AESTHETIC</h3>
              <p className="text-sm leading-relaxed opacity-80">
                {agent?.lore?.curationPhilosophy?.aesthetic || 'Critical excellence and cultural impact'}
              </p>
            </div>
          </div>
        </div>

        {/* Live Analysis Tool */}
        <div className="border border-white p-8 mb-12">
          <h2 className="text-3xl font-bold uppercase tracking-wider mb-6">LIVE CURATORIAL ANALYSIS</h2>
          
          {/* Analysis Depth Presets */}
          <div className="mb-6">
            <p className="text-sm uppercase tracking-wider opacity-60 mb-3">CURATOR PRESETS</p>
            <div className="flex gap-3">
              {(['quick', 'standard', 'comprehensive'] as const).map((depth) => (
                <button
                  key={depth}
                  onClick={() => setAnalysisDepth(depth)}
                  className={`px-4 py-2 border text-sm uppercase tracking-wide transition-all duration-150 ${
                    analysisDepth === depth 
                      ? 'border-blue-400 bg-blue-400 text-black' 
                      : 'border-white/50 text-white/80 hover:border-white hover:text-white'
                  }`}
                >
                  {depth}
                </button>
              ))}
            </div>
            <p className="text-xs opacity-60 mt-2">
              {analysisDepth === 'quick' && 'Fast analysis for immediate feedback (~0.5s)'}
              {analysisDepth === 'standard' && 'Balanced analysis with detailed insights (~1.5s)'}
              {analysisDepth === 'comprehensive' && 'Deep analysis with full cultural context (~3s)'}
            </p>
          </div>

          {/* Upload or URL Input */}
          <div className="border border-white/20 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* File Upload */}
              <div>
                <p className="text-sm uppercase tracking-wider opacity-60 mb-3">UPLOAD ARTWORK</p>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*,video/*,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setUploadedFile(file)
                        setWorkUrl('') // Clear URL when file is selected
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className={`border-2 border-dashed p-8 text-center transition-colors ${
                    uploadedFile 
                      ? 'border-green-400 bg-green-400/10' 
                      : 'border-white/50 hover:border-white/80'
                  }`}>
                    {uploadedFile ? (
                      <div>
                        <p className="text-green-400 font-bold mb-1">✓ FILE SELECTED</p>
                        <p className="text-sm text-green-400">{uploadedFile.name}</p>
                        <p className="text-xs opacity-60 mt-2">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-white/80 font-bold mb-1">DRAG & DROP</p>
                        <p className="text-sm opacity-60">or click to select file</p>
                        <p className="text-xs opacity-40 mt-2">Images, Videos, PDFs</p>
                      </div>
                    )}
                  </div>
                </div>
                {uploadedFile && (
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="mt-2 text-xs text-red-400 hover:text-red-300 uppercase tracking-wide"
                  >
                    Clear File
                  </button>
                )}
              </div>

              {/* URL Input */}
              <div>
                <p className="text-sm uppercase tracking-wider opacity-60 mb-3">OR ENTER URL</p>
                <input
                  type="url"
                  value={workUrl}
                  onChange={(e) => {
                    setWorkUrl(e.target.value)
                    if (e.target.value.trim()) {
                      setUploadedFile(null) // Clear file when URL is entered
                    }
                  }}
                  placeholder="https://example.com/artwork.jpg"
                  disabled={!!uploadedFile}
                  className={`w-full bg-black border px-4 py-3 text-white placeholder-white/50 focus:border-white outline-none ${
                    uploadedFile ? 'border-white/20 opacity-50' : 'border-white/50'
                  }`}
                />
                <p className="text-xs opacity-40 mt-2">
                  Direct link to image, video, or NFT
                </p>
              </div>
            </div>
          </div>

          {/* Analyze Button */}
          <div className="text-center">
            <button
              onClick={analyzeWork}
              disabled={(!workUrl.trim() && !uploadedFile) || analysisLoading}
              className="px-12 py-4 border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-150 uppercase tracking-wide text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {analysisLoading ? (
                `ANALYZING (${analysisDepth.toUpperCase()})...`
              ) : (
                `ANALYZE WITH ${analysisDepth.toUpperCase()} PRESET`
              )}
            </button>
          </div>

          {/* New Analysis Result */}
          {newAnalysis && (
            <div className={`border p-6 mb-6 ${
              newAnalysis.verdict === 'MASTERWORK' ? 'border-green-500 bg-green-500/10' :
              newAnalysis.verdict === 'WORTHY' ? 'border-blue-400 bg-blue-400/10' :
              newAnalysis.verdict === 'PROMISING' ? 'border-yellow-500 bg-yellow-500/10' :
              'border-red-500 bg-red-500/10'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold uppercase tracking-wide">{newAnalysis.title}</h3>
                <span className={`px-4 py-2 border text-sm uppercase tracking-wide ${
                  newAnalysis.verdict === 'MASTERWORK' ? 'border-green-500 text-green-500' :
                  newAnalysis.verdict === 'WORTHY' ? 'border-blue-400 text-blue-400' :
                  newAnalysis.verdict === 'PROMISING' ? 'border-yellow-500 text-yellow-500' :
                  'border-red-500 text-red-500'
                }`}>
                  {newAnalysis.verdict}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 text-center">
                <div>
                  <p className="text-xs uppercase tracking-wider opacity-60 mb-1">ARTISTIC INNOVATION</p>
                  <p className="text-2xl font-bold">{newAnalysis.artisticInnovation}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider opacity-60 mb-1">CULTURAL RELEVANCE</p>
                  <p className="text-2xl font-bold">{newAnalysis.culturalRelevance}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider opacity-60 mb-1">TECHNICAL MASTERY</p>
                  <p className="text-2xl font-bold">{newAnalysis.technicalMastery}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider opacity-60 mb-1">CRITICAL EXCELLENCE</p>
                  <p className="text-2xl font-bold">{newAnalysis.criticalExcellence}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider opacity-60 mb-1">MARKET IMPACT</p>
                  <p className="text-2xl font-bold">{newAnalysis.marketImpact}</p>
                </div>
              </div>
              
              <div className="border-t border-current/20 pt-4">
                <p className="text-lg font-bold mb-2">OVERALL SCORE: {newAnalysis.overallScore}/100</p>
                <p className="text-sm opacity-80">{newAnalysis.analysis}</p>
              </div>
            </div>
          )}
        </div>

        {/* Recent Analyses */}
        <div className="border border-white p-8 mb-12">
          <h2 className="text-3xl font-bold uppercase tracking-wider mb-8">RECENT CURATORIAL ANALYSES</h2>
          <div className="space-y-6">
            {recentAnalyses.map((analysis) => (
              <div key={analysis.workId} className={`border p-6 ${
                analysis.verdict === 'MASTERWORK' ? 'border-green-500/50' :
                analysis.verdict === 'WORTHY' ? 'border-blue-400/50' :
                'border-white/20'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold uppercase tracking-wide">{analysis.title}</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold">{analysis.overallScore}/100</span>
                    <span className={`px-3 py-1 border text-xs uppercase tracking-wide ${
                      analysis.verdict === 'MASTERWORK' ? 'border-green-500 text-green-500' :
                      analysis.verdict === 'WORTHY' ? 'border-blue-400 text-blue-400' :
                      'border-white/50 text-white/80'
                    }`}>
                      {analysis.verdict}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-4 mb-4 text-xs">
                  <div className="text-center">
                    <p className="opacity-60 uppercase tracking-wider mb-1">INNOVATION</p>
                    <p className="text-lg font-bold">{analysis.artisticInnovation}</p>
                  </div>
                  <div className="text-center">
                    <p className="opacity-60 uppercase tracking-wider mb-1">RELEVANCE</p>
                    <p className="text-lg font-bold">{analysis.culturalRelevance}</p>
                  </div>
                  <div className="text-center">
                    <p className="opacity-60 uppercase tracking-wider mb-1">MASTERY</p>
                    <p className="text-lg font-bold">{analysis.technicalMastery}</p>
                  </div>
                  <div className="text-center">
                    <p className="opacity-60 uppercase tracking-wider mb-1">EXCELLENCE</p>
                    <p className="text-lg font-bold">{analysis.criticalExcellence}</p>
                  </div>
                  <div className="text-center">
                    <p className="opacity-60 uppercase tracking-wider mb-1">IMPACT</p>
                    <p className="text-lg font-bold">{analysis.marketImpact}</p>
                  </div>
                </div>
                
                <p className="text-sm opacity-80 mb-3">{analysis.analysis}</p>
                <p className="text-xs uppercase tracking-wider opacity-40">
                  ANALYZED: {new Date(analysis.analyzedAt).toLocaleDateString()} at {new Date(analysis.analyzedAt).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="border border-white p-8">
          <h2 className="text-3xl font-bold uppercase tracking-wider mb-6">CURATORIAL NETWORK</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/agents/sue"
              className="border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-4 text-center block"
            >
              <div className="text-sm font-bold uppercase tracking-wide mb-1">REGISTRY PROFILE</div>
              <div className="text-xs opacity-60">Agent Details & History</div>
            </Link>
            
            <Link 
              href="/dashboard/sue"
              className="border border-blue-400 bg-blue-400/10 text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-150 p-4 text-center block"
            >
              <div className="text-sm font-bold uppercase tracking-wide mb-1">CURATOR DASHBOARD</div>
              <div className="text-xs opacity-60">Private Training Interface</div>
            </Link>
            
            <div className="border border-dashed border-white/50 bg-black text-white/50 p-4 text-center">
              <div className="text-sm font-bold uppercase tracking-wide mb-1">EXHIBITION PLANNING</div>
              <div className="text-xs opacity-40">Coming Soon</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-12 border-t border-white/20 text-center">
          <p className="text-sm uppercase tracking-wider opacity-60">SUE • CURATORIAL DIRECTOR • EDEN ACADEMY</p>
          <p className="text-xs uppercase tracking-wider opacity-40 mt-3">
            RIGOROUS MULTI-DIMENSIONAL ANALYSIS • CRITICAL EXCELLENCE • CULTURAL IMPACT
          </p>
        </div>
      </div>
    </div>
  )
}