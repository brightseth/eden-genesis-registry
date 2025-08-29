'use client'

import { PerformanceDistribution } from '@/types/ceo-dashboard'

interface AgentPerformanceOverviewProps {
  performance: PerformanceDistribution | null
  loading?: boolean
}

export default function AgentPerformanceOverview({ performance, loading }: AgentPerformanceOverviewProps) {
  if (loading || !performance) {
    return (
      <div className="bg-black border border-gray-800 rounded-none p-6 mb-8">
        <div className="h-6 bg-gray-800 rounded-none mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-800 rounded-none mb-2 animate-pulse"></div>
        <div className="h-8 bg-gray-800 rounded-none animate-pulse"></div>
      </div>
    )
  }

  const { distribution, percentages, total } = performance

  const excellentGoodTotal = distribution.excellent + distribution.good
  const concerningCriticalTotal = distribution.concerning + distribution.critical
  const excellentGoodPercentage = percentages.excellent + percentages.good

  return (
    <div className="bg-black border border-gray-800 rounded-none p-6 mb-8">
      <h2 className="text-xl font-['Helvetica_Neue'] font-bold uppercase tracking-wider text-white mb-6">
        AGENT PERFORMANCE DISTRIBUTION
      </h2>
      
      {/* Performance Distribution Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-['Helvetica_Neue'] font-bold uppercase tracking-wider text-gray-400">
            PERFORMANCE OVERVIEW
          </span>
          <span className="text-sm font-['Helvetica_Neue'] text-gray-400">
            {total} TOTAL AGENTS
          </span>
        </div>
        
        <div className="h-8 bg-gray-900 border border-gray-700 rounded-none overflow-hidden">
          <div className="flex h-full">
            {/* Excellent */}
            {percentages.excellent > 0 && (
              <div 
                className="bg-green-400 transition-all duration-500"
                style={{ width: `${percentages.excellent}%` }}
              />
            )}
            {/* Good */}
            {percentages.good > 0 && (
              <div 
                className="bg-blue-400 transition-all duration-500"
                style={{ width: `${percentages.good}%` }}
              />
            )}
            {/* Concerning */}
            {percentages.concerning > 0 && (
              <div 
                className="bg-yellow-400 transition-all duration-500"
                style={{ width: `${percentages.concerning}%` }}
              />
            )}
            {/* Critical */}
            {percentages.critical > 0 && (
              <div 
                className="bg-red-400 transition-all duration-500"
                style={{ width: `${percentages.critical}%` }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-8">
        <div className="border-l-2 border-green-400 pl-4">
          <div className="text-2xl font-['Helvetica_Neue'] font-bold text-green-400">
            {excellentGoodPercentage}%
          </div>
          <div className="text-sm font-['Helvetica_Neue'] font-bold uppercase tracking-wider text-gray-400">
            EXCELLENT/GOOD
          </div>
          <div className="text-xs font-['Helvetica_Neue'] text-gray-500 mt-1">
            {excellentGoodTotal} AGENTS PERFORMING WELL
          </div>
        </div>
        
        <div className="border-l-2 border-yellow-400 pl-4">
          <div className="text-2xl font-['Helvetica_Neue'] font-bold text-yellow-400">
            {100 - excellentGoodPercentage}%
          </div>
          <div className="text-sm font-['Helvetica_Neue'] font-bold uppercase tracking-wider text-gray-400">
            NEEDS ATTENTION
          </div>
          <div className="text-xs font-['Helvetica_Neue'] text-gray-500 mt-1">
            {concerningCriticalTotal} AGENTS REQUIRE SUPPORT
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-lg font-['Helvetica_Neue'] font-bold text-green-400">
            {distribution.excellent}
          </div>
          <div className="text-xs font-['Helvetica_Neue'] font-bold uppercase tracking-wider text-gray-400">
            EXCELLENT
          </div>
          <div className="text-xs font-['Helvetica_Neue'] text-gray-500">
            {percentages.excellent}%
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-['Helvetica_Neue'] font-bold text-blue-400">
            {distribution.good}
          </div>
          <div className="text-xs font-['Helvetica_Neue'] font-bold uppercase tracking-wider text-gray-400">
            GOOD
          </div>
          <div className="text-xs font-['Helvetica_Neue'] text-gray-500">
            {percentages.good}%
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-['Helvetica_Neue'] font-bold text-yellow-400">
            {distribution.concerning}
          </div>
          <div className="text-xs font-['Helvetica_Neue'] font-bold uppercase tracking-wider text-gray-400">
            CONCERNING
          </div>
          <div className="text-xs font-['Helvetica_Neue'] text-gray-500">
            {percentages.concerning}%
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-['Helvetica_Neue'] font-bold text-red-400">
            {distribution.critical}
          </div>
          <div className="text-xs font-['Helvetica_Neue'] font-bold uppercase tracking-wider text-gray-400">
            CRITICAL
          </div>
          <div className="text-xs font-['Helvetica_Neue'] text-gray-500">
            {percentages.critical}%
          </div>
        </div>
      </div>
    </div>
  )
}