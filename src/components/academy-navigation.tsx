'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface AcademyNavigationProps {
  agentHandle?: string
  currentTier?: 'profile' | 'site' | 'dashboard'
  className?: string
}

export default function AcademyNavigation({ 
  agentHandle, 
  currentTier, 
  className = "" 
}: AcademyNavigationProps) {
  const pathname = usePathname()
  
  const isActive = (path: string) => pathname === path
  
  return (
    <nav className={`academy-navigation ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Navigation */}
        <div className="flex items-center justify-between py-4 border-b border-white/20">
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-xl font-bold uppercase tracking-wider hover:opacity-70"
            >
              EDEN ACADEMY
            </Link>
            
            <div className="flex items-center space-x-6 text-sm uppercase tracking-wide">
              <Link 
                href="/agents" 
                className={`hover:text-white transition-colors ${
                  isActive('/agents') ? 'text-white' : 'text-white/60'
                }`}
              >
                AGENTS
              </Link>
              <Link 
                href="/status" 
                className={`hover:text-white transition-colors ${
                  isActive('/status') ? 'text-white' : 'text-white/60'
                }`}
              >
                STATUS
              </Link>
              <Link 
                href="/emergency/covenant" 
                className={`hover:text-amber-400 transition-colors ${
                  isActive('/emergency/covenant') ? 'text-amber-400' : 'text-amber-400/60'
                }`}
              >
                COVENANT EMERGENCY
              </Link>
            </div>
          </div>
          
          <div className="text-xs uppercase tracking-wider opacity-60">
            {process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'DEVELOPMENT'}
          </div>
        </div>

        {/* Agent-specific Navigation */}
        {agentHandle && (
          <div className="py-4 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-sm text-white/60">
                <Link href="/" className="hover:text-white">Academy</Link>
                <span>/</span>
                <Link href="/agents" className="hover:text-white">Agents</Link>
                <span>/</span>
                <span className="text-white font-bold uppercase">{agentHandle}</span>
              </div>
              
              {/* Three-Tier Navigation */}
              <div className="flex items-center space-x-4">
                <Link 
                  href={`/academy/agent/${agentHandle}`}
                  className={`px-3 py-1 border text-xs uppercase tracking-wide transition-all duration-150 ${
                    currentTier === 'profile' 
                      ? 'border-white text-white bg-white/10' 
                      : 'border-white/40 text-white/60 hover:border-white hover:text-white'
                  }`}
                >
                  PROFILE
                </Link>
                <Link 
                  href={`/sites/${agentHandle}`}
                  className={`px-3 py-1 border text-xs uppercase tracking-wide transition-all duration-150 ${
                    currentTier === 'site' 
                      ? 'border-white text-white bg-white/10' 
                      : 'border-white/40 text-white/60 hover:border-white hover:text-white'
                  }`}
                >
                  SITE
                </Link>
                <Link 
                  href={`/dashboard/${agentHandle}`}
                  className={`px-3 py-1 border text-xs uppercase tracking-wide transition-all duration-150 ${
                    currentTier === 'dashboard' 
                      ? 'border-amber-400 text-amber-400 bg-amber-400/10' 
                      : 'border-amber-400/40 text-amber-400/60 hover:border-amber-400 hover:text-amber-400'
                  }`}
                >
                  DASHBOARD
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Covenant Emergency Alert */}
        {pathname.includes('covenant') && (
          <div className="py-3 bg-amber-500/10 border-l-4 border-amber-500">
            <div className="flex items-center space-x-3">
              <span className="text-amber-500 font-bold">⚠️ COVENANT EMERGENCY</span>
              <div className="flex items-center space-x-4 text-sm">
                <Link 
                  href="/emergency/covenant" 
                  className="text-amber-400 hover:text-amber-300 underline"
                >
                  Emergency Dashboard
                </Link>
                <Link 
                  href="/sites/abraham/covenant" 
                  className="text-amber-400 hover:text-amber-300 underline"
                >
                  Auction Interface
                </Link>
                <Link 
                  href="/covenant/witnesses" 
                  className="text-amber-400 hover:text-amber-300 underline"
                >
                  Witness Registry
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// Navigation utility functions
export const getAgentNavigationProps = (handle: string, tier: 'profile' | 'site' | 'dashboard') => ({
  agentHandle: handle,
  currentTier: tier
})

export const navigationConfig = {
  covenant: {
    emergency: '/emergency/covenant',
    auction: '/sites/abraham/covenant', 
    witnesses: '/covenant/witnesses'
  },
  agents: {
    catalog: '/academy',
    profile: (handle: string) => `/academy/agent/${handle}`,
    site: (handle: string) => `/sites/${handle}`,
    dashboard: (handle: string) => `/dashboard/${handle}`
  },
  api: {
    agents: '/api/v1/agents',
    status: '/api/v1/status'
  }
}