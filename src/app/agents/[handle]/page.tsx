'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Agent {
  id: string
  handle: string
  displayName: string
  role: string
  status: string
  visibility: string
  cohort?: string
  profile?: {
    statement?: string
    manifesto?: string
    tags?: string[]
    imageUrl?: string
    links?: {
      specialty?: {
        medium: string
        description: string
        dailyGoal: string
      }
    }
  }
  createdAt: string
  updatedAt: string
}

interface Creation {
  id: string
  title: string
  mediaType: string
  mediaUri?: string
  creationUrl?: string
  metadata?: Record<string, unknown>
  features?: Record<string, unknown>
  status: string
  createdAt: string
}

export default function AgentDetailPage() {
  const params = useParams()
  const handle = params.handle as string
  const [agent, setAgent] = useState<Agent | null>(null)
  const [creations, setCreations] = useState<Creation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ 
    success: boolean; 
    message: string; 
    deploymentDetails?: {
      agentId?: string;
      safeAddress?: string;
      safeTxHash?: string;
      ipfsUrl?: string;
      nftTokenId?: string;
      nftTxHash?: string;
      registryContract?: string;
    }
  } | null>(null)

  useEffect(() => {
    async function fetchAgentData() {
      try {
        // Fetch agent details
        const agentsRes = await fetch('/api/v1/agents')
        const agentsData = await agentsRes.json()
        const foundAgent = agentsData.agents?.find((a: Agent) => a.handle === handle)
        
        if (!foundAgent) {
          setError('Agent not found')
          setLoading(false)
          return
        }
        
        setAgent(foundAgent)

        // Fetch agent creations
        try {
          const creationsRes = await fetch(`/api/v1/agents/${foundAgent.id}/creations`)
          if (creationsRes.ok) {
            const creationsData = await creationsRes.json()
            setCreations(creationsData.creations || [])
          }
        } catch {
          console.log('Could not fetch creations')
        }

      } catch {
        setError('Failed to load agent data')
      } finally {
        setLoading(false)
      }
    }

    fetchAgentData()
  }, [handle])

  const uploadImageToIPFS = async (imageUrl: string): Promise<string> => {
    try {
      // Fetch the image from the URL
      const response = await fetch(imageUrl)
      if (!response.ok) throw new Error('Failed to fetch image')
      
      const blob = await response.blob()
      const file = new File([blob], 'agent-image.jpg', { type: blob.type })

      const formData = new FormData()
      formData.append('file', file)
      
      const metadata = JSON.stringify({
        name: `${agent?.handle}_agent_image_${Date.now()}`,
        keyvalues: {
          agent_handle: agent?.handle,
          agent_name: agent?.displayName,
          upload_type: 'agent_profile_image'
        }
      })
      formData.append('pinataMetadata', metadata)

      const options = JSON.stringify({
        cidVersion: 0,
      })
      formData.append('pinataOptions', options)

      const ipfsResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2YmQxMzlhMC0wZWRiLTQ3OWMtYmY2YS00NDY2NmQ1ZDM3ODciLCJlbWFpbCI6InB5ZS5oZW5yeUBwcm90b25tYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJlM2MxZTM2ZTBiMDkzN2NhNjRlYiIsInNjb3BlZEtleVNlY3JldCI6ImIyNWYzZWNmNTVjNmVkNjE0NWZhYjA2YTI4ZmZmNDgyMzNhOGYwOWY3NjgyZDc2NTZmZWI0NDRjZDk5ZTU0NzkiLCJleHAiOjE3ODc4NDU3NTV9.l6jx13iEqsF09HaO23WjFVUBFUKVO197LuDjAXA8PMs`
        },
        body: formData
      })

      if (!ipfsResponse.ok) {
        throw new Error('Failed to upload to IPFS')
      }

      const result = await ipfsResponse.json()
      return result.IpfsHash
    } catch (error) {
      console.error('IPFS upload error:', error)
      return '' // Return empty string if upload fails
    }
  }

  const mapAgentToApplicationData = async (agent: Agent) => {
    // Handle image upload to IPFS if agent has an image
    let imageHash = ''
    if (agent.profile?.imageUrl) {
      console.log('Uploading agent image to IPFS:', agent.profile.imageUrl)
      imageHash = await uploadImageToIPFS(agent.profile.imageUrl)
    }

    const publicPersona = agent.profile?.statement || `${agent.displayName} - AI agent in the Genesis Cohort`
    
    // Map agent database data to the Registry API format exactly
    return {
      name: agent.displayName,
      handle: agent.handle,
      role: agent.role || 'Digital Artist',
      public_persona: publicPersona,
      description: publicPersona, // Copy public_persona to description field
      artist_wallet: '0x5D6D8518A1d564c85ea5c41d1dc0deca70F2301C',
      tagline: agent.profile?.manifesto || agent.profile?.statement?.split('.')[0] || `Creating digital beauty through AI`,
      image: imageHash, // IPFS hash from uploaded image
      system_instructions: `You are ${agent.displayName}. ${agent.profile?.statement || 'Focus on creative work and digital art.'}`,
      memory_context: `Remember past conversations about ${agent.profile?.links?.specialty?.medium || 'art techniques'}. Role: ${agent.role}. Tags: ${agent.profile?.tags?.join(', ') || 'creativity, digital art'}`,
      schedule: `Daily creation at 9 AM UTC`,
      medium: agent.profile?.links?.specialty?.medium || 'Digital art, NFTs',
      daily_goal: agent.profile?.links?.specialty?.dailyGoal || 'Create one unique generative piece',
      practice_actions: ['sketch', 'experiment', 'iterate'],
      technical_details: {
        model: 'GPT-4',
        capabilities: ['image_generation', 'text_analysis']
      },
      social_revenue: {
        platforms: ['Twitter', 'Instagram'],
        revenue_model: 'NFT sales'
      },
      lore_origin: {
        backstory: `Born from digital creativity and the desire to explore the infinite possibilities of ${agent.profile?.links?.specialty?.medium || 'generative art'}. ${agent.displayName} emerged from the intersection of classical artistic principles and cutting-edge AI technology.`,
        motivation: agent.profile?.links?.specialty?.dailyGoal || 'Express beauty through code'
      },
      additional_fields: {
        genesis_cohort: true,
        migrated_from: 'eden-genesis-registry',
        original_agent_id: agent.id,
        migration_date: new Date().toISOString(),
        agent_tags: agent.profile?.tags || []
      }
    }
  }

  const submitToRegistry = async () => {
    if (!agent) return

    setSubmitting(true)
    setSubmitResult(null)

    try {
      console.log('Preparing agent data for submission...')
      const payload = await mapAgentToApplicationData(agent)
      console.log('Submitting agent to registry:', payload)

      const response = await fetch('https://registry.eden-academy.xyz/api/spirits/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Registry response:', result)
        
        // Extract deployment details from the nested response
        const deploymentData = result.result?.data || result.data || {}
        
        setSubmitResult({ 
          success: true, 
          message: `Successfully deployed ${agent.displayName} onchain!`,
          deploymentDetails: {
            agentId: deploymentData.agentId,
            safeAddress: deploymentData.safe_address,
            safeTxHash: deploymentData.safe_tx_hash,
            ipfsUrl: deploymentData.ipfs_url,
            nftTokenId: deploymentData.nft_token_id,
            nftTxHash: deploymentData.nft_tx_hash,
            registryContract: deploymentData.sprit_registry_contract
          }
        })
      } else {
        const errorText = await response.text()
        let errorMessage = 'Submission failed'
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.message || errorMessage
        } catch {
          errorMessage = errorText || errorMessage
        }
        setSubmitResult({ success: false, message: errorMessage })
      }
    } catch (error) {
      console.error('Submit error:', error)
      setSubmitResult({ 
        success: false, 
        message: `Failed to submit: ${error.message}` 
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-xl uppercase tracking-wider animate-pulse">LOADING AGENT DATA...</p>
        </div>
      </div>
    )
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-black text-white p-8" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold uppercase tracking-wider mb-4">ERROR</h1>
          <p className="text-xl mb-8 opacity-80">{error || 'Agent not found'}</p>
          <Link href="/" className="text-white hover:opacity-70 underline uppercase tracking-wide">
            ← RETURN TO REGISTRY
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-white hover:opacity-70 uppercase tracking-wider text-sm mb-8 inline-block">
            ← EDEN GENESIS REGISTRY
          </Link>
        </div>

        {/* Agent Profile */}
        <div className="border border-white p-8 mb-12">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-5xl font-bold uppercase tracking-wider mb-4">{agent.displayName}</h1>
              <p className="text-xl uppercase tracking-wide opacity-80">@{agent.handle}</p>
            </div>
            <div className="text-right flex flex-col gap-4">
              <span className={`px-4 py-2 border uppercase tracking-wide ${
                agent.status === 'ACTIVE' ? 'border-white text-white' : 'border-white/50 text-white/50'
              }`}>
                {agent.status}
              </span>
              
              <button
                onClick={submitToRegistry}
                disabled={submitting}
                className="px-4 py-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-all duration-150 uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'SUBMITTING...' : 'SUBMIT TO REGISTRY'}
              </button>
            </div>
          </div>

          {/* Submit Result Feedback */}
          {submitResult && (
            <div className={`border p-6 mb-8 ${
              submitResult.success 
                ? 'border-green-500 bg-green-500/10 text-green-500' 
                : 'border-red-500 bg-red-500/10 text-red-500'
            }`}>
              <p className="text-sm uppercase tracking-wide font-bold mb-4">
                {submitResult.success ? '✅ ONCHAIN DEPLOYMENT SUCCESS' : '❌ ERROR'}
              </p>
              <p className="text-sm mb-4">{submitResult.message}</p>
              
              {submitResult.success && submitResult.deploymentDetails && (
                <div className="border-t border-green-500/30 pt-4 mt-4">
                  <p className="text-xs uppercase tracking-wider opacity-80 mb-3">DEPLOYMENT DETAILS</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    
                    {submitResult.deploymentDetails.agentId && (
                      <div>
                        <span className="opacity-60 uppercase tracking-wide">AGENT ID:</span>
                        <br />
                        <code className="bg-green-500/20 px-2 py-1 rounded font-mono">
                          {submitResult.deploymentDetails.agentId}
                        </code>
                      </div>
                    )}
                    
                    {submitResult.deploymentDetails.safeAddress && (
                      <div>
                        <span className="opacity-60 uppercase tracking-wide">SAFE ADDRESS:</span>
                        <br />
                        <a 
                          href={`https://app.safe.global/home?safe=base:${submitResult.deploymentDetails.safeAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-500/20 px-2 py-1 rounded font-mono hover:underline"
                        >
                          {submitResult.deploymentDetails.safeAddress}
                        </a>
                      </div>
                    )}
                    
                    {submitResult.deploymentDetails.nftTokenId && (
                      <div>
                        <span className="opacity-60 uppercase tracking-wide">NFT TOKEN ID:</span>
                        <br />
                        <code className="bg-green-500/20 px-2 py-1 rounded font-mono">
                          {submitResult.deploymentDetails.nftTokenId}
                        </code>
                      </div>
                    )}
                    
                    {submitResult.deploymentDetails.registryContract && (
                      <div>
                        <span className="opacity-60 uppercase tracking-wide">REGISTRY CONTRACT:</span>
                        <br />
                        <a 
                          href={`https://basescan.org/address/${submitResult.deploymentDetails.registryContract}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-500/20 px-2 py-1 rounded font-mono hover:underline"
                        >
                          {submitResult.deploymentDetails.registryContract}
                        </a>
                      </div>
                    )}
                    
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-green-500/20">
                    <p className="text-xs uppercase tracking-wider opacity-60 mb-2">TRANSACTION HASHES</p>
                    <div className="space-y-2 text-xs">
                      {submitResult.deploymentDetails.safeTxHash && (
                        <div>
                          <span className="opacity-60">Safe Deploy: </span>
                          <a 
                            href={`https://basescan.org/tx/${submitResult.deploymentDetails.safeTxHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono hover:underline"
                          >
                            {submitResult.deploymentDetails.safeTxHash}
                          </a>
                        </div>
                      )}
                      {submitResult.deploymentDetails.nftTxHash && (
                        <div>
                          <span className="opacity-60">NFT Mint: </span>
                          <a 
                            href={`https://basescan.org/tx/${submitResult.deploymentDetails.nftTxHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono hover:underline"
                          >
                            {submitResult.deploymentDetails.nftTxHash}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {submitResult.deploymentDetails.ipfsUrl && (
                    <div className="mt-4 pt-3 border-t border-green-500/20">
                      <p className="text-xs uppercase tracking-wider opacity-60 mb-2">IPFS METADATA</p>
                      <a 
                        href={submitResult.deploymentDetails.ipfsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono hover:underline break-all"
                      >
                        {submitResult.deploymentDetails.ipfsUrl}
                      </a>
                    </div>
                  )}
                  
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="text-sm uppercase tracking-wider opacity-60 mb-2">ROLE</p>
              <p className="text-lg uppercase tracking-wide">{agent.role}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wider opacity-60 mb-2">COHORT</p>
              <p className="text-lg uppercase tracking-wide">{agent.cohort || 'GENESIS'}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wider opacity-60 mb-2">VISIBILITY</p>
              <p className="text-lg uppercase tracking-wide">{agent.visibility}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wider opacity-60 mb-2">REGISTRY ID</p>
              <p className="text-xs opacity-80 break-all">{agent.id}</p>
            </div>
          </div>

          {/* Related Links */}
          <div className="border-t border-white/20 pt-8 mb-8">
            <p className="text-sm uppercase tracking-wider opacity-60 mb-4">RELATED VIEWS</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                href={`https://eden-academy.vercel.app/academy/agent/${agent.handle}`}
                className="border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-4 text-center block"
                target="_blank"
              >
                <div className="text-sm font-bold uppercase tracking-wide mb-1">ACADEMY PROFILE</div>
                <div className="text-xs opacity-60">Training & Progress</div>
              </Link>
              
              {agent.handle === 'solienne' && (
                <Link 
                  href="https://solienne.ai"
                  className="border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-4 text-center block"
                  target="_blank"
                >
                  <div className="text-sm font-bold uppercase tracking-wide mb-1">SOVEREIGN SITE</div>
                  <div className="text-xs opacity-60">solienne.ai</div>
                </Link>
              )}
              
              {(agent.handle === 'abraham' || agent.handle === 'bertha' || agent.handle === 'sue' || agent.handle === 'citizen') && (
                <div className="border border-dashed border-white/50 bg-black text-white/50 p-4 text-center">
                  <div className="text-sm font-bold uppercase tracking-wide mb-1">SOVEREIGN SITE</div>
                  <div className="text-xs opacity-40">Coming Soon</div>
                </div>
              )}
              
              <Link 
                href={`/api/v1/agents/${agent.handle}`}
                className="border border-white/50 bg-black text-white hover:bg-white/10 transition-all duration-150 p-4 text-center block"
              >
                <div className="text-sm font-bold uppercase tracking-wide mb-1">API DATA</div>
                <div className="text-xs opacity-60">JSON Endpoint</div>
              </Link>
            </div>
          </div>

          {agent.profile && (
            <>
              {agent.profile.statement && (
                <div className="mb-6">
                  <p className="text-sm uppercase tracking-wider opacity-60 mb-3">STATEMENT</p>
                  <p className="text-lg leading-relaxed">{agent.profile.statement}</p>
                </div>
              )}

              {agent.profile.tags && agent.profile.tags.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm uppercase tracking-wider opacity-60 mb-3">TAGS</p>
                  <div className="flex flex-wrap gap-3">
                    {agent.profile.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 border border-white/50 text-sm uppercase tracking-wide">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {agent.profile.links && (
                <div className="mb-6">
                  <p className="text-sm uppercase tracking-wider opacity-60 mb-3">LINKS</p>
                  {agent.profile.links.edenCollection && (
                    <a 
                      href={agent.profile.links.edenCollection}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:opacity-70 underline uppercase tracking-wide text-sm"
                    >
                      EDEN COLLECTION →
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Creations */}
        <div className="border border-white p-8">
          <h2 className="text-3xl font-bold uppercase tracking-wider mb-8">CREATIONS ({creations.length})</h2>
          
          {creations.length === 0 ? (
            <p className="text-lg opacity-60 uppercase tracking-wide">NO CREATIONS REGISTERED YET.</p>
          ) : (
            <div className="space-y-6">
              {creations.map((creation) => (
                <div key={creation.id} className="border border-white/20 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold uppercase tracking-wide mb-3">{creation.title}</h3>
                      {creation.metadata?.description && (
                        <p className="text-lg opacity-80 mb-4">{creation.metadata.description}</p>
                      )}
                      <div className="flex gap-6 text-xs uppercase tracking-wider opacity-60">
                        <span>TYPE: {creation.mediaType}</span>
                        <span>STATUS: {creation.status}</span>
                        <span>ID: {creation.id}</span>
                      </div>
                    </div>
                    {creation.creationUrl && (
                      <a
                        href={creation.creationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:opacity-70 uppercase tracking-wider text-sm ml-6"
                      >
                        VIEW →
                      </a>
                    )}
                  </div>
                  {creation.features?.tags && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {creation.features.tags.map((tag: string, i: number) => (
                        <span key={i} className="text-xs px-3 py-1 border border-white/30 uppercase tracking-wide">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-12 border-t border-white/20 text-center">
          <p className="text-sm uppercase tracking-wider opacity-60">EDEN GENESIS REGISTRY | SOVEREIGN SYSTEM OF RECORD</p>
          <p className="text-xs uppercase tracking-wider opacity-40 mt-3">
            CREATED: {new Date(agent.createdAt).toLocaleDateString()} | 
            UPDATED: {new Date(agent.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}