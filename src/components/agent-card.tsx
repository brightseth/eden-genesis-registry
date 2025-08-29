import Link from 'next/link'

interface Agent {
  id: string
  handle: string
  displayName: string
  role: string
  status: string
  cohort?: string
  visibility?: string
  profile?: {
    statement?: string
    tags?: string[]
    links?: {
      specialty?: {
        medium: string
        description: string
        dailyGoal: string
      }
      social?: {
        website?: string
        domain?: string
      }
    }
  }
  prototypeUrl?: string
  counts?: {
    creations: number
    personas: number
    artifacts: number
  }
}

interface AgentCardProps {
  agent: Agent
}

export default function AgentCard({ agent }: AgentCardProps) {
  // Smart routing: get domain from agent profile or prototypeUrl
  const sovereignDomain = agent.profile?.links?.social?.domain || 
                         agent.profile?.links?.social?.website?.replace(/^https?:\/\//, '') ||
                         (agent.prototypeUrl && agent.prototypeUrl.includes('://') 
                           ? new URL(agent.prototypeUrl).hostname 
                           : null)
  const isOpenSlot = agent.handle.startsWith('open-')
  
  // Open slots are not clickable
  if (isOpenSlot) {
    return (
      <div className="border border-white/30 p-6 opacity-50">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl uppercase tracking-wide">{agent.displayName}</h3>
          <span className="text-xs px-3 py-1 border border-white/30 uppercase tracking-wide">
            AVAILABLE
          </span>
        </div>
        <p className="text-sm uppercase tracking-wide opacity-60 mb-3">@{agent.handle}</p>
        {agent.profile?.statement && (
          <p className="text-sm opacity-60 line-clamp-2 mb-3">
            {agent.profile.statement}
          </p>
        )}
        <div className="mt-4">
          <Link 
            href="/trainers/apply"
            className="text-xs uppercase tracking-wide font-medium opacity-80 hover:opacity-100 underline"
          >
            APPLY TO TRAIN THIS AGENT →
          </Link>
        </div>
      </div>
    )
  }

  // Regular agent card with smart routing
  const href = agent.prototypeUrl || (sovereignDomain ? `https://${sovereignDomain}` : `/agents/${agent.handle}`)
  const isExternal = !!(agent.prototypeUrl || sovereignDomain)

  return (
    <Link
      href={href}
      {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
      className="border border-white p-6 hover:bg-white hover:text-black transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold uppercase tracking-wide">{agent.displayName}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 border border-current uppercase tracking-wide">
            {agent.role?.toUpperCase()}
          </span>
          {(sovereignDomain || agent.prototypeUrl) && (
            <span className="text-xs px-2 py-1 bg-white text-black uppercase tracking-wide">
              LIVE
            </span>
          )}
        </div>
      </div>
      
      <p className="text-sm uppercase tracking-wide opacity-60 mb-3">@{agent.handle}</p>
      
      {agent.profile?.statement && (
        <p className="text-sm opacity-80 line-clamp-2 mb-3">
          {agent.profile.statement}
        </p>
      )}
      
      {agent.profile?.links?.specialty && (
        <div className="mb-3">
          <p className="text-xs uppercase tracking-wide opacity-50 mb-1">MEDIUM</p>
          <p className="text-sm font-medium">{agent.profile.links.specialty.medium}</p>
          {agent.profile.links.specialty.dailyGoal && (
            <p className="text-xs opacity-60 mt-1">{agent.profile.links.specialty.dailyGoal}</p>
          )}
        </div>
      )}
      
      {agent.counts && (
        <div className="mb-3 flex gap-4 text-xs uppercase tracking-wide opacity-60">
          <span>{agent.counts.creations} WORKS</span>
          <span>{agent.counts.personas} PERSONAS</span>
          <span>{agent.counts.artifacts} ARTIFACTS</span>
        </div>
      )}
      
      {agent.profile?.tags && (
        <div className="flex flex-wrap gap-2 mb-3">
          {agent.profile.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-xs px-2 py-1 border border-current/30 uppercase tracking-wide">
              {tag}
            </span>
          ))}
        </div>
      )}

      {(sovereignDomain || agent.prototypeUrl) && (
        <div className="text-xs uppercase tracking-wide opacity-60 font-mono">
          {sovereignDomain || (agent.prototypeUrl ? new URL(agent.prototypeUrl).hostname : '')} ↗
        </div>
      )}
    </Link>
  )
}