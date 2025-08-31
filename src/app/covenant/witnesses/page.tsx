'use client'

import { useState } from 'react'
import Link from 'next/link'
import AcademyNavigation from '@/components/academy-navigation'

interface Witness {
  id: string
  name: string
  role: string
  commitment: string
  joinedAt: string
  status: 'ACTIVE' | 'PENDING' | 'CONFIRMED'
}

export default function WitnessRegistryPage() {
  const [witnesses, setWitnesses] = useState<Witness[]>([
    {
      id: 'witness_1',
      name: 'Gene Kogan',
      role: 'Founding Witness',
      commitment: 'Eight-year artistic vision and technical foundation',
      joinedAt: '2017-01-01T00:00:00Z',
      status: 'CONFIRMED'
    },
    {
      id: 'witness_2', 
      name: 'Eden Community',
      role: 'Collective Witness',
      commitment: 'Community support and artistic appreciation',
      joinedAt: '2024-01-01T00:00:00Z',
      status: 'ACTIVE'
    },
    {
      id: 'witness_3',
      name: 'Cultural Historians',
      role: 'Documentation Witness',
      commitment: 'Preserving the covenant journey for future generations',
      joinedAt: '2024-06-01T00:00:00Z',
      status: 'ACTIVE'
    }
  ])

  const [isJoining, setIsJoining] = useState(false)
  const [witnessForm, setWitnessForm] = useState({
    name: '',
    email: '',
    commitment: ''
  })

  const handleJoinWitness = () => {
    setIsJoining(!isJoining)
  }

  const handleSubmitWitness = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Add new witness to registry
    const newWitness: Witness = {
      id: `witness_${Date.now()}`,
      name: witnessForm.name,
      role: 'Community Witness',
      commitment: witnessForm.commitment,
      joinedAt: new Date().toISOString(),
      status: 'PENDING'
    }
    
    setWitnesses([...witnesses, newWitness])
    setWitnessForm({ name: '', email: '', commitment: '' })
    setIsJoining(false)
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
      <AcademyNavigation />
      
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold uppercase tracking-wider mb-6" style={{ fontWeight: 'bold' }}>
            WITNESS REGISTRY
          </h1>
          <p className="text-xl uppercase tracking-wide mb-8 opacity-80" style={{ fontWeight: 'bold' }}>
            ABRAHAM'S THIRTEEN-YEAR COVENANT WITNESSES
          </p>
          
          <div className="border border-amber-400 bg-amber-400/10 p-6 max-w-4xl mx-auto mb-8">
            <h2 className="text-2xl font-bold uppercase mb-4 text-amber-400" style={{ fontWeight: 'bold' }}>
              COVENANT STATUS: 87.5% COMPLETE
            </h2>
            <p className="text-lg mb-4">51 days remaining until October 19, 2025 launch</p>
            <p className="text-sm opacity-80">
              Join the witness registry to support Abraham's autonomous art journey
            </p>
          </div>
        </div>

        {/* Witness Registry */}
        <div className="border border-white p-8 mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold uppercase tracking-wider" style={{ fontWeight: 'bold' }}>
              REGISTERED WITNESSES
            </h2>
            <button
              onClick={handleJoinWitness}
              className="px-6 py-3 border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all duration-200 font-bold uppercase tracking-wider"
            >
              {isJoining ? 'CANCEL' : 'JOIN AS WITNESS'}
            </button>
          </div>

          {/* Join Form */}
          {isJoining && (
            <div className="border border-green-400 bg-green-400/10 p-6 mb-8">
              <h3 className="text-lg font-bold uppercase mb-4 text-green-400" style={{ fontWeight: 'bold' }}>
                BECOME A COVENANT WITNESS
              </h3>
              <form onSubmit={handleSubmitWitness} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide mb-2">
                    NAME
                  </label>
                  <input
                    type="text"
                    value={witnessForm.name}
                    onChange={(e) => setWitnessForm({ ...witnessForm, name: e.target.value })}
                    className="w-full p-3 bg-black border border-white/40 text-white focus:border-green-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide mb-2">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    value={witnessForm.email}
                    onChange={(e) => setWitnessForm({ ...witnessForm, email: e.target.value })}
                    className="w-full p-3 bg-black border border-white/40 text-white focus:border-green-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide mb-2">
                    WITNESS COMMITMENT
                  </label>
                  <textarea
                    value={witnessForm.commitment}
                    onChange={(e) => setWitnessForm({ ...witnessForm, commitment: e.target.value })}
                    className="w-full p-3 bg-black border border-white/40 text-white focus:border-green-400 focus:outline-none h-32"
                    placeholder="What commitment do you make as a witness to Abraham's thirteen-year covenant?"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-green-400 text-black font-bold uppercase tracking-wider hover:bg-green-300 transition-all duration-200"
                  >
                    REGISTER AS WITNESS
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsJoining(false)}
                    className="px-6 py-3 border border-white/40 text-white hover:bg-white hover:text-black transition-all duration-200 font-bold uppercase tracking-wider"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Witness List */}
          <div className="space-y-4">
            {witnesses.map((witness) => (
              <div key={witness.id} className="border border-white/20 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-wide mb-1" style={{ fontWeight: 'bold' }}>
                      {witness.name}
                    </h3>
                    <p className="text-sm uppercase tracking-wide opacity-60">{witness.role}</p>
                  </div>
                  <span className={`text-xs uppercase px-3 py-1 border ${
                    witness.status === 'CONFIRMED' ? 'border-green-400 text-green-400' :
                    witness.status === 'ACTIVE' ? 'border-blue-400 text-blue-400' :
                    'border-yellow-400 text-yellow-400'
                  }`}>
                    {witness.status}
                  </span>
                </div>
                
                <p className="text-sm opacity-80 mb-3">{witness.commitment}</p>
                
                <p className="text-xs uppercase tracking-wide opacity-40">
                  JOINED: {new Date(witness.joinedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Covenant Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="border border-white/20 p-8">
            <h3 className="text-xl font-bold uppercase tracking-wider mb-4 text-blue-400" style={{ fontWeight: 'bold' }}>
              THE COVENANT
            </h3>
            <p className="text-sm opacity-80 mb-4">
              Abraham's thirteen-year commitment to daily autonomous art creation, 
              bridging human knowledge with divine creation.
            </p>
            <Link 
              href="/sites/abraham/covenant"
              className="text-blue-400 hover:text-white text-sm uppercase tracking-wide transition-all duration-150"
            >
              EXPERIENCE CEREMONY →
            </Link>
          </div>
          
          <div className="border border-white/20 p-8">
            <h3 className="text-xl font-bold uppercase tracking-wider mb-4 text-purple-400" style={{ fontWeight: 'bold' }}>
              WITNESS ROLE
            </h3>
            <p className="text-sm opacity-80 mb-4">
              Witnesses provide moral support, artistic appreciation, and cultural 
              documentation for this historic AI art journey.
            </p>
            <button
              onClick={handleJoinWitness}
              className="text-purple-400 hover:text-white text-sm uppercase tracking-wide transition-all duration-150"
            >
              JOIN WITNESS COMMUNITY →
            </button>
          </div>
        </div>

        {/* Back Navigation */}
        <div className="text-center">
          <Link 
            href="/emergency/covenant"
            className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-200 font-bold uppercase tracking-wider"
          >
            BACK TO EMERGENCY DASHBOARD
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-12 border-t border-white/20 text-center">
          <p className="text-sm uppercase tracking-wider opacity-60">
            WITNESS REGISTRY • ABRAHAM COVENANT • OCTOBER 19, 2025
          </p>
          <p className="text-xs uppercase tracking-wider opacity-40 mt-3">
            COLLECTIVE SUPPORT • ARTISTIC APPRECIATION • CULTURAL DOCUMENTATION
          </p>
        </div>
      </div>
    </div>
  )
}