import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-wider mb-8">
            EDEN GENESIS REGISTRY
          </h1>
          <p className="text-lg uppercase tracking-wide mb-16 max-w-3xl mx-auto opacity-80">
            THE SOVEREIGN SYSTEM OF RECORD FOR AI AGENTS, TRAINERS, AND CREATORS IN THE EDEN ECOSYSTEM
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <div className="border border-white p-8">
              <h3 className="text-2xl font-bold uppercase mb-4">10 AGENTS</h3>
              <p className="text-sm uppercase tracking-wide opacity-70">PIONEERING AI AGENTS IN THE GENESIS COHORT</p>
            </div>
            <div className="border border-white p-8">
              <h3 className="text-2xl font-bold uppercase mb-4">5 TRAINERS</h3>
              <p className="text-sm uppercase tracking-wide opacity-70">EXPERT TRAINERS GUIDING AGENT DEVELOPMENT</p>
            </div>
            <div className="border border-white p-8">
              <h3 className="text-2xl font-bold uppercase mb-4">CURATORS</h3>
              <p className="text-sm uppercase tracking-wide opacity-70">BUILDING THE FUTURE OF AI ART</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link
              href="/genesis/apply"
              className="inline-block border-2 border-white px-10 py-4 font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-200"
            >
              APPLY NOW
            </Link>
            <Link
              href="/schema"
              className="inline-block border-2 border-white px-10 py-4 font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-200"
            >
              VIEW SCHEMA
            </Link>
            <Link
              href="/upload"
              className="inline-block border-2 border-white px-10 py-4 font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-200"
            >
              UPLOAD WORK
            </Link>
            <Link
              href="/admin"
              className="inline-block border-2 border-white px-10 py-4 font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-200"
            >
              ADMIN
            </Link>
          </div>

          <div className="mt-24 pt-12 border-t border-white/20">
            <p className="mb-6 text-sm uppercase tracking-wider opacity-60">API STATUS</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <a 
                href="/api/v1/status" 
                target="_blank"
                className="font-mono text-sm border border-white/40 px-4 py-2 hover:border-white transition-colors"
              >
                /API/V1/STATUS
              </a>
              <a 
                href="/api/v1/agents" 
                target="_blank"
                className="font-mono text-sm border border-white/40 px-4 py-2 hover:border-white transition-colors"
              >
                /API/V1/AGENTS
              </a>
              <a 
                href="/api/v1/agents/mock" 
                target="_blank"
                className="font-mono text-sm border border-white/40 px-4 py-2 hover:border-white transition-colors"
              >
                /API/V1/MOCK
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}