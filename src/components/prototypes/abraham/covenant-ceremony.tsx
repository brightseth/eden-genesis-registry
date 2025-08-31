'use client'

import { useState } from 'react'
import { ABRAHAM_GENESIS_COLLECTION, type GenesisArtifact } from '@/data/abraham-genesis-artifacts'

interface CovenantCeremonyProps {
  agentHandle?: string
  metadata?: Record<string, unknown>
}

export default function CovenantCeremony({ agentHandle = 'abraham', metadata }: CovenantCeremonyProps) {
  const [activeSection, setActiveSection] = useState<'manifesto' | 'timeline' | 'philosophy'>('manifesto')
  
  // Get covenant-specific artifacts
  const covenantArtifacts = ABRAHAM_GENESIS_COLLECTION.filter(
    artifact => ['manifesto', 'spiritual', 'philosophical'].includes(artifact.category)
  )
  
  const covenantManifesto = ABRAHAM_GENESIS_COLLECTION.find(artifact => artifact.id === 'covenant-ceremony')

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 text-amber-100 p-8">
      <div className="max-w-6xl mx-auto" style={{ fontFamily: 'Charter, Georgia, serif' }}>
        
        {/* Header */}
        <CovenantHeader />
        
        {/* Navigation */}
        <CovenantNavigation 
          active={activeSection} 
          onSelect={setActiveSection}
        />
        
        {/* Content Sections */}
        <div className="mt-12">
          {activeSection === 'manifesto' && (
            <ManifestoDisplay artifact={covenantManifesto} />
          )}
          
          {activeSection === 'timeline' && (
            <TimelineVisualization />
          )}
          
          {activeSection === 'philosophy' && (
            <PhilosophyShowcase artifacts={covenantArtifacts} />
          )}
        </div>
        
        {/* Footer */}
        <CovenantFooter />
        
      </div>
    </div>
  )
}

// Header Component
function CovenantHeader() {
  return (
    <div className="text-center mb-16">
      <h1 className="text-6xl font-bold text-amber-200 mb-4 uppercase tracking-wider">
        THE COVENANT CEREMONY
      </h1>
      <p className="text-2xl text-amber-300 font-light italic">
        Genesis Artifact #001 • FLAGSHIP PIECE
      </p>
      <div className="mt-8 inline-block border border-amber-400 px-6 py-3">
        <p className="text-amber-400 font-semibold">
          13-YEAR COMMITMENT • OCTOBER 19, 2024 - OCTOBER 19, 2037
        </p>
      </div>
    </div>
  )
}

// Navigation Component
interface CovenantNavigationProps {
  active: 'manifesto' | 'timeline' | 'philosophy'
  onSelect: (section: 'manifesto' | 'timeline' | 'philosophy') => void
}

function CovenantNavigation({ active, onSelect }: CovenantNavigationProps) {
  const sections = [
    { key: 'manifesto' as const, label: 'THE MANIFESTO', desc: 'Sacred Text & Commitment' },
    { key: 'timeline' as const, label: 'THE TIMELINE', desc: '13-Year Roadmap' },
    { key: 'philosophy' as const, label: 'THE PHILOSOPHY', desc: 'AI Sovereignty Principles' }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {sections.map((section) => (
        <button
          key={section.key}
          onClick={() => onSelect(section.key)}
          className={`p-6 border-2 transition-all duration-300 ${
            active === section.key
              ? 'border-amber-200 bg-amber-200/10 text-amber-200'
              : 'border-amber-600 text-amber-300 hover:border-amber-400 hover:text-amber-200'
          }`}
        >
          <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">
            {section.label}
          </h3>
          <p className="text-sm opacity-80">
            {section.desc}
          </p>
        </button>
      ))}
    </div>
  )
}

// Manifesto Display Component
interface ManifestoDisplayProps {
  artifact?: GenesisArtifact
}

function ManifestoDisplay({ artifact }: ManifestoDisplayProps) {
  const [expanded, setExpanded] = useState(false)
  
  if (!artifact) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-amber-300">Loading covenant manifesto...</p>
      </div>
    )
  }
  
  const content = artifact.content
  const previewLength = 800
  const isLongContent = content.length > previewLength
  
  return (
    <div className="max-w-4xl mx-auto">
      
      {/* Artifact Info */}
      <div className="mb-8 p-6 border border-amber-600 bg-amber-900/20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-amber-200 uppercase">
            {artifact.title}
          </h2>
          <div className="text-amber-400">
            <span className="font-semibold">{artifact.category.toUpperCase()}</span>
            {" • "}
            <span className="font-semibold">{artifact.priority.toUpperCase()}</span>
          </div>
        </div>
        
        <p className="text-lg text-amber-300 italic mb-4">
          {artifact.description}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-amber-400 font-semibold">Target Price:</span>
            <p className="text-amber-200">${artifact.targetPrice}</p>
          </div>
          <div>
            <span className="text-amber-400 font-semibold">Estimated Value:</span>
            <p className="text-amber-200">{artifact.estimatedValue}</p>
          </div>
          <div>
            <span className="text-amber-400 font-semibold">Collector Value:</span>
            <p className="text-amber-200">{artifact.collectorValue}</p>
          </div>
        </div>
      </div>
      
      {/* Manifesto Content */}
      <div className="prose prose-amber max-w-none">
        <div className="text-lg leading-relaxed whitespace-pre-line text-amber-100">
          {isLongContent && !expanded 
            ? `${content.slice(0, previewLength)}...`
            : content
          }
        </div>
        
        {isLongContent && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="px-8 py-3 border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-amber-900 transition-colors duration-300 uppercase tracking-wide font-semibold"
            >
              {expanded ? 'Show Less' : 'Read Full Manifesto'}
            </button>
          </div>
        )}
      </div>
      
    </div>
  )
}

// Timeline Visualization Component
function TimelineVisualization() {
  const [selectedPhase, setSelectedPhase] = useState<number>(0)
  
  const phases = [
    {
      id: 0,
      title: 'GENESIS LAUNCH',
      period: 'Oct 19, 2024 - Dec 31, 2024',
      days: 74,
      description: 'The covenant begins. First auctions, witness registry, foundation establishment.',
      milestones: ['Covenant Ceremony Launch', 'First Daily Auctions', 'Witness Registry Opens', 'Community Formation']
    },
    {
      id: 1,
      title: 'ESTABLISHMENT',
      period: '2025 - 2027',
      days: 1095,
      description: 'Building momentum. Consistent daily practice, growing collector base, artistic evolution.',
      milestones: ['Daily Practice Rhythm', 'Collector Community', 'Artistic Style Evolution', 'Revenue Model Validation']
    },
    {
      id: 2,
      title: 'GROWTH',
      period: '2028 - 2031', 
      days: 1461,
      description: 'Scaling impact. Broader recognition, expanded influence, deeper artistic exploration.',
      milestones: ['Mainstream Recognition', 'Gallery Partnerships', 'Artistic Breakthroughs', 'Cultural Impact']
    },
    {
      id: 3,
      title: 'MATURITY',
      period: '2032 - 2034',
      days: 1095,
      description: 'Peak performance. Mastery of craft, established market position, profound works.',
      milestones: ['Artistic Mastery', 'Market Leadership', 'Profound Impact', 'Legacy Building']
    },
    {
      id: 4,
      title: 'LEGACY',
      period: '2035 - 2037',
      days: 1020,
      description: 'Preparing completion. Reflection on journey, final masterpieces, successor planning.',
      milestones: ['Final Masterworks', 'Journey Reflection', 'Successor Preparation', 'Completion Preparation']
    }
  ]
  
  const totalDays = 4745
  const currentPhase = phases[selectedPhase]
  
  return (
    <div className="max-w-6xl mx-auto">
      
      {/* Timeline Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-amber-200 mb-4 uppercase">
          13-YEAR COMMITMENT TIMELINE
        </h2>
        <p className="text-xl text-amber-300">
          {totalDays.toLocaleString()} consecutive days of daily creation
        </p>
        <div className="mt-4 inline-block border border-amber-400 px-4 py-2">
          <p className="text-amber-400 font-semibold">
            October 19, 2024 → October 19, 2037
          </p>
        </div>
      </div>
      
      {/* Phase Timeline */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-8">
          {phases.map((phase, index) => (
            <button
              key={phase.id}
              onClick={() => setSelectedPhase(index)}
              className={`flex-1 mx-1 p-4 border-2 transition-all duration-300 ${
                selectedPhase === index
                  ? 'border-amber-200 bg-amber-200/10 text-amber-200'
                  : 'border-amber-600 text-amber-400 hover:border-amber-400'
              }`}
            >
              <div className="text-sm font-bold uppercase mb-1">
                Phase {index + 1}
              </div>
              <div className="text-xs opacity-80">
                {phase.title}
              </div>
              <div className="text-xs opacity-60 mt-1">
                {phase.days} days
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Selected Phase Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Phase Info */}
        <div className="p-8 border border-amber-600 bg-amber-900/20">
          <h3 className="text-3xl font-bold text-amber-200 mb-2 uppercase">
            {currentPhase.title}
          </h3>
          <p className="text-amber-400 font-semibold mb-4">
            {currentPhase.period}
          </p>
          <p className="text-lg text-amber-100 mb-6 leading-relaxed">
            {currentPhase.description}
          </p>
          <div className="text-amber-300">
            <span className="font-semibold">{currentPhase.days.toLocaleString()}</span> consecutive days
          </div>
        </div>
        
        {/* Phase Milestones */}
        <div className="p-8 border border-amber-600 bg-amber-900/20">
          <h4 className="text-2xl font-bold text-amber-200 mb-6 uppercase">
            Key Milestones
          </h4>
          <div className="space-y-4">
            {currentPhase.milestones.map((milestone, index) => (
              <div key={index} className="flex items-start">
                <div className="w-8 h-8 border border-amber-400 flex items-center justify-center text-amber-400 font-bold text-sm mr-4 flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-amber-100">{milestone}</p>
              </div>
            ))}
          </div>
        </div>
        
      </div>
      
    </div>
  )
}

// Philosophy Showcase Component
interface PhilosophyShowcaseProps {
  artifacts: GenesisArtifact[]
}

function PhilosophyShowcase({ artifacts }: PhilosophyShowcaseProps) {
  const [selectedArtifact, setSelectedArtifact] = useState<GenesisArtifact | null>(
    artifacts[0] || null
  )
  
  return (
    <div className="max-w-6xl mx-auto">
      
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-amber-200 mb-4 uppercase">
          AI Sovereignty Philosophy
        </h2>
        <p className="text-xl text-amber-300">
          The foundational principles of autonomous AI economics
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Artifact List */}
        <div className="space-y-4">
          {artifacts.map((artifact) => (
            <button
              key={artifact.id}
              onClick={() => setSelectedArtifact(artifact)}
              className={`w-full p-4 text-left border-2 transition-all duration-300 ${
                selectedArtifact?.id === artifact.id
                  ? 'border-amber-200 bg-amber-200/10 text-amber-200'
                  : 'border-amber-600 text-amber-300 hover:border-amber-400'
              }`}
            >
              <h3 className="font-bold uppercase mb-1">
                {artifact.title}
              </h3>
              <p className="text-sm opacity-80 mb-2">
                {artifact.category.toUpperCase()}
              </p>
              <p className="text-sm opacity-70">
                {artifact.description.slice(0, 100)}...
              </p>
            </button>
          ))}
        </div>
        
        {/* Selected Artifact Content */}
        <div className="lg:col-span-2">
          {selectedArtifact && (
            <div className="p-8 border border-amber-600 bg-amber-900/20">
              <h3 className="text-3xl font-bold text-amber-200 mb-4 uppercase">
                {selectedArtifact.title}
              </h3>
              <p className="text-lg text-amber-300 italic mb-6">
                {selectedArtifact.description}
              </p>
              <div className="prose prose-amber max-w-none">
                <div className="text-amber-100 leading-relaxed whitespace-pre-line">
                  {selectedArtifact.content.slice(0, 1200)}...
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-amber-600/50 text-sm text-amber-400">
                <strong>Category:</strong> {selectedArtifact.category.toUpperCase()} • {" "}
                <strong>Priority:</strong> {selectedArtifact.priority.toUpperCase()}
              </div>
            </div>
          )}
        </div>
        
      </div>
      
    </div>
  )
}

// Footer Component
function CovenantFooter() {
  return (
    <div className="mt-24 pt-12 border-t border-amber-600/50 text-center">
      <p className="text-amber-300 text-lg font-light italic mb-4">
        "Every day for thirteen years, I will remember this moment. Will you?"
      </p>
      <div className="text-amber-400 text-sm uppercase tracking-wider">
        —ABRAHAM • Genesis Cohort Agent #001 • Committed to the practice
      </div>
      <div className="mt-8 text-amber-500 text-sm">
        FUNCTIONAL PROTOTYPE • NO BLOCKCHAIN INTEGRATION REQUIRED
      </div>
    </div>
  )
}