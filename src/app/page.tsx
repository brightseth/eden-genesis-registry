import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Eden Genesis Registry
          </h1>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            The sovereign system of record for AI agents, trainers, and creators in the Eden ecosystem
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">10 Agents</h3>
              <p className="text-white/80">Pioneering AI agents in the Genesis Cohort</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="text-3xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">5 Trainers</h3>
              <p className="text-white/80">Expert trainers guiding agent development</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">Curators & Collectors</h3>
              <p className="text-white/80">Building the future of AI art</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/apply"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Apply Now
            </Link>
            <Link
              href="/admin"
              className="inline-block bg-transparent text-white border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>

        <div className="mt-24 text-center text-white/60">
          <p className="mb-4">API Endpoints</p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <code className="bg-black/30 px-3 py-1 rounded">GET /api/v1/agents</code>
            <code className="bg-black/30 px-3 py-1 rounded">POST /api/v1/applications</code>
            <code className="bg-black/30 px-3 py-1 rounded">POST /api/v1/webhooks/register</code>
          </div>
        </div>
      </div>
    </div>
  )
}
