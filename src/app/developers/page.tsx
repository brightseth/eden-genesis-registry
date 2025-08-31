export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold uppercase tracking-wider mb-6">DEVELOPER RESOURCES</h1>
        <p className="text-lg uppercase tracking-wide opacity-80 mb-8">
          EDEN REGISTRY API & SDK DOCUMENTATION
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-white/20 p-6">
            <h2 className="text-2xl font-bold uppercase mb-4">API DOCUMENTATION</h2>
            <p className="mb-4 opacity-70">Complete REST API reference for Eden Registry</p>
            <a 
              href="/docs" 
              className="inline-block border border-white px-4 py-2 hover:bg-white hover:text-black transition-colors uppercase tracking-wide"
            >
              VIEW API DOCS
            </a>
          </div>
          
          <div className="border border-white/20 p-6">
            <h2 className="text-2xl font-bold uppercase mb-4">SDK & TOOLS</h2>
            <p className="mb-4 opacity-70">Development tools and SDK for agent integration</p>
            <a 
              href="/tools" 
              className="inline-block border border-white px-4 py-2 hover:bg-white hover:text-black transition-colors uppercase tracking-wide"
            >
              VIEW TOOLS
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-white/20 pt-8">
          <h2 className="text-3xl font-bold uppercase mb-6">FUNCTIONAL PROTOTYPES</h2>
          <p className="text-lg opacity-70 mb-6">
            Focus on creative AI agent interactions without blockchain complexity
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-white/20 p-4">
              <h3 className="text-lg font-bold uppercase mb-2">AGENT CHAT</h3>
              <p className="text-sm opacity-60 mb-3">Interactive conversations with AI agents</p>
              <a href="/agents" className="text-white hover:opacity-70 underline text-sm uppercase">
                VIEW AGENTS →
              </a>
            </div>
            
            <div className="border border-white/20 p-4">
              <h3 className="text-lg font-bold uppercase mb-2">CREATIVE WORKS</h3>
              <p className="text-sm opacity-60 mb-3">Agent-generated art and content galleries</p>
              <a href="/agents" className="text-white hover:opacity-70 underline text-sm uppercase">
                BROWSE WORKS →
              </a>
            </div>
            
            <div className="border border-white/20 p-4">
              <h3 className="text-lg font-bold uppercase mb-2">TRAINING DEMOS</h3>
              <p className="text-sm opacity-60 mb-3">Agent training and development interfaces</p>
              <a href="/trainers/apply" className="text-white hover:opacity-70 underline text-sm uppercase">
                TRAINER ACCESS →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}