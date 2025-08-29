'use client'

import { useRouter } from 'next/navigation'
import { QuickAction } from '@/types/ceo-dashboard'

interface QuickActionsPanelProps {
  onAction?: (actionId: string) => void
}

export default function QuickActionsPanel({ onAction }: QuickActionsPanelProps) {
  const router = useRouter()

  const quickActions: QuickAction[] = [
    {
      id: 'launch_agent',
      label: 'LAUNCH',
      description: 'Deploy agent to production',
      category: 'launch',
      enabled: true,
      action: () => {
        router.push('/admin/launch')
        onAction?.('launch_agent')
      }
    },
    {
      id: 'monitor_system',
      label: 'MONITOR',
      description: 'View system performance',
      category: 'monitor',
      enabled: true,
      action: () => {
        router.push('/admin')
        onAction?.('monitor_system')
      }
    },
    {
      id: 'create_agent',
      label: 'CREATE',
      description: 'Add new agent to registry',
      category: 'create',
      enabled: true,
      action: () => {
        // This would trigger the create modal from admin dashboard
        router.push('/admin?action=create')
        onAction?.('create_agent')
      }
    },
    {
      id: 'escalate_issue',
      label: 'ESCALATE',
      description: 'Emergency system controls',
      category: 'escalate',
      enabled: true,
      action: () => {
        // This would trigger an emergency escalation modal
        onAction?.('escalate_issue')
      }
    }
  ]

  const getCategoryColor = (category: QuickAction['category']) => {
    switch (category) {
      case 'launch': return 'border-green-400 hover:bg-green-400 hover:text-black'
      case 'monitor': return 'border-blue-400 hover:bg-blue-400 hover:text-black'
      case 'create': return 'border-yellow-400 hover:bg-yellow-400 hover:text-black'
      case 'escalate': return 'border-red-400 hover:bg-red-400 hover:text-black'
      default: return 'border-gray-400 hover:bg-gray-400 hover:text-black'
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Quick Actions */}
      <div className="bg-black border border-gray-800 rounded-none p-6">
        <h2 className="text-xl font-['Helvetica_Neue'] font-bold uppercase tracking-wider text-white mb-6">
          QUICK ACTIONS
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={action.action}
              disabled={!action.enabled}
              className={`
                bg-black border-2 rounded-none p-4 
                font-['Helvetica_Neue'] font-bold uppercase tracking-wider
                transition-all duration-200
                ${action.enabled 
                  ? `${getCategoryColor(action.category)} text-white hover:scale-105 cursor-pointer`
                  : 'border-gray-600 text-gray-600 cursor-not-allowed'
                }
              `}
            >
              <div className="text-sm mb-1">{action.label}</div>
              <div className="text-xs font-normal normal-case tracking-normal opacity-80">
                {action.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-black border border-gray-800 rounded-none p-6">
        <h2 className="text-xl font-['Helvetica_Neue'] font-bold uppercase tracking-wider text-white mb-6">
          SYSTEM STATUS
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-['Helvetica_Neue'] font-bold uppercase tracking-wider text-gray-400">
              DATABASE
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-['Helvetica_Neue'] text-green-400">ONLINE</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-['Helvetica_Neue'] font-bold uppercase tracking-wider text-gray-400">
              REGISTRY
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-['Helvetica_Neue'] text-green-400">OPERATIONAL</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-['Helvetica_Neue'] font-bold uppercase tracking-wider text-gray-400">
              ACADEMY
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-['Helvetica_Neue'] text-green-400">ACTIVE</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-['Helvetica_Neue'] font-bold uppercase tracking-wider text-gray-400">
              MONITORING
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-['Helvetica_Neue'] text-green-400">COLLECTING</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}