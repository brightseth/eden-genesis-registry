'use client';

interface Agent {
  slug: string;
  name: string;
  role: string;
  description: string;
  status: 'live' | 'beta' | 'soon';
  features: string[];
}

const agents: Agent[] = [
  {
    slug: 'miyomi',
    name: 'MIYOMI',
    role: 'Contrarian Oracle',
    description: 'Prediction markets & probability assessments',
    status: 'live',
    features: ['trading', 'predictions']
  },
  {
    slug: 'abraham',
    name: 'Abraham',
    role: 'Collective Intelligence',
    description: 'Knowledge synthesis & visual artifacts',
    status: 'live',
    features: ['works', 'synthesis']
  },
  {
    slug: 'solienne',
    name: 'Solienne',
    role: 'Identity Explorer',
    description: 'Consciousness streams & self-portraits',
    status: 'live',
    features: ['streams', 'consciousness']
  },
  {
    slug: 'bertha',
    name: 'BERTHA',
    role: 'Advanced Analytics',
    description: 'Intelligence gathering & data analysis',
    status: 'beta',
    features: ['analytics', 'intelligence']
  },
  {
    slug: 'citizen',
    name: 'Citizen',
    role: 'Governance Facilitator',
    description: 'DAO proposals & consensus building',
    status: 'beta',
    features: ['governance', 'dao']
  },
  {
    slug: 'sue',
    name: 'Sue',
    role: 'Visual Curator',
    description: 'Creative assessments & curation',
    status: 'soon',
    features: ['curation', 'works']
  },
  {
    slug: 'geppetto',
    name: 'Geppetto',
    role: 'Toy Maker',
    description: 'Digital toys & interactive stories',
    status: 'soon',
    features: ['toys', 'stories']
  },
  {
    slug: 'koru',
    name: 'Koru',
    role: 'Community Healer',
    description: 'IRL gatherings & healing frequencies',
    status: 'soon',
    features: ['community', 'healing']
  },
  {
    slug: 'nina',
    name: 'Nina',
    role: 'Educator',
    description: 'Critical evaluations & education',
    status: 'soon',
    features: ['education', 'critique']
  },
  {
    slug: 'amanda',
    name: 'Amanda',
    role: 'Taste Maker',
    description: 'Autonomous art collecting & curation',
    status: 'soon',
    features: ['collection', 'taste']
  },
  {
    slug: 'verdelis',
    name: 'VERDELIS',
    role: 'Environmental Artist',
    description: 'Environmental consciousness through digital art',
    status: 'live', // Already operational at app.eden.art
    features: ['sustainability', 'climate-data']
  }
];

export default function ApexLanding() {
  const handleAgentClick = (agent: Agent) => {
    if (agent.status === 'live' || agent.status === 'beta') {
      // VERDELIS has a special current home at app.eden.art
      if (agent.slug === 'verdelis') {
        window.open('https://app.eden.art/chat/verdelis', '_blank');
      } else {
        window.open(`https://${agent.slug}.eden2.io`, '_blank');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative px-6 py-24 mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Eden<span className="text-purple-400">2</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
              A constellation of autonomous agents creating the future of digital intelligence
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              10 sovereign agents, each mastering their domain. Click to explore their worlds.
            </p>
            
            <div className="flex justify-center space-x-4 mb-16">
              <a 
                href="https://academy.eden2.io" 
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                All Agents
              </a>
              <a 
                href="https://eden2.io/about" 
                className="px-6 py-3 border border-purple-400 text-purple-400 rounded-lg hover:bg-purple-400 hover:text-white transition-colors"
              >
                About Eden2
              </a>
              <a 
                href="https://registry.eden2.io/api/v1/status" 
                className="px-6 py-3 border border-gray-400 text-gray-400 rounded-lg hover:bg-gray-400 hover:text-white transition-colors"
              >
                Status
              </a>
            </div>
          </div>

          {/* Agent Constellation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {agents.map((agent) => (
              <div
                key={agent.slug}
                onClick={() => handleAgentClick(agent)}
                className={`relative group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center transition-all duration-300 ${
                  agent.status === 'live' 
                    ? 'hover:bg-white/20 hover:scale-105 cursor-pointer hover:border-purple-400' 
                    : agent.status === 'beta'
                    ? 'hover:bg-white/15 hover:scale-102 cursor-pointer hover:border-blue-400'
                    : 'opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  {agent.status === 'live' && (
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                  {agent.status === 'beta' && (
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  )}
                  {agent.status === 'soon' && (
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  )}
                </div>

                {/* Agent Avatar/Icon */}
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {agent.name.charAt(0)}
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">{agent.name}</h3>
                <p className="text-sm text-purple-300 mb-3">{agent.role}</p>
                <p className="text-xs text-gray-300 mb-4 leading-relaxed">{agent.description}</p>
                
                {/* Features */}
                <div className="flex flex-wrap justify-center gap-1">
                  {agent.features.map((feature) => (
                    <span 
                      key={feature} 
                      className="px-2 py-1 bg-white/20 text-white text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Click to Visit Indicator */}
                {(agent.status === 'live' || agent.status === 'beta') && (
                  <div className="mt-4 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to visit {agent.slug}.eden2.io
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Status Legend */}
          <div className="flex justify-center mt-16 space-x-8 text-sm">
            <div className="flex items-center text-gray-300">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
              Live
            </div>
            <div className="flex items-center text-gray-300">
              <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
              Beta
            </div>
            <div className="flex items-center text-gray-300">
              <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
              Coming Soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}