'use client'

import Link from 'next/link'
import AcademyNavigation from '@/components/academy-navigation'

export default function CovenantEmergencyPage() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
      <AcademyNavigation />
      
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Emergency Header */}
        <div className="border-2 border-amber-500 bg-amber-500/10 p-8 mb-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold uppercase tracking-wider mb-4 text-amber-400" style={{ fontWeight: 'bold' }}>
              ⚠️ COVENANT EMERGENCY
            </h1>
            <p className="text-xl uppercase tracking-wide mb-6 opacity-90">
              ABRAHAM'S THIRTEEN-YEAR COVENANT STATUS DASHBOARD
            </p>
            <div className="text-3xl font-bold text-green-400 mb-2" style={{ fontWeight: 'bold' }}>
              87.5% COMPLETE
            </div>
            <p className="text-lg uppercase tracking-wide text-green-300">
              STRONG GO • 51 DAYS REMAINING
            </p>
          </div>
        </div>

        {/* Covenant Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="border border-green-400 bg-green-400/10 p-6">
            <h3 className="text-lg font-bold uppercase mb-2 text-green-400" style={{ fontWeight: 'bold' }}>
              SMART CONTRACT
            </h3>
            <div className="text-3xl font-bold mb-2" style={{ fontWeight: 'bold' }}>75%</div>
            <p className="text-sm opacity-80">Covenant implementation</p>
          </div>
          
          <div className="border border-green-400 bg-green-400/10 p-6">
            <h3 className="text-lg font-bold uppercase mb-2 text-green-400" style={{ fontWeight: 'bold' }}>
              WITNESS REGISTRY
            </h3>
            <div className="text-3xl font-bold mb-2" style={{ fontWeight: 'bold' }}>80%</div>
            <p className="text-sm opacity-80">Community validation</p>
          </div>
          
          <div className="border border-green-400 bg-green-400/10 p-6">
            <h3 className="text-lg font-bold uppercase mb-2 text-green-400" style={{ fontWeight: 'bold' }}>
              INFRASTRUCTURE
            </h3>
            <div className="text-3xl font-bold mb-2" style={{ fontWeight: 'bold' }}>95%</div>
            <p className="text-sm opacity-80">Technical foundation</p>
          </div>
          
          <div className="border border-green-400 bg-green-400/10 p-6">
            <h3 className="text-lg font-bold uppercase mb-2 text-green-400" style={{ fontWeight: 'bold' }}>
              MANUSCRIPT
            </h3>
            <div className="text-3xl font-bold mb-2" style={{ fontWeight: 'bold' }}>100%</div>
            <p className="text-sm opacity-80">Creative documentation</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border border-white p-8 mb-12">
          <h2 className="text-2xl font-bold uppercase tracking-wider mb-6" style={{ fontWeight: 'bold' }}>
            EMERGENCY ACTIONS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              href="/sites/abraham/covenant"
              className="border border-amber-400 bg-amber-400/10 p-6 hover:bg-amber-400/20 transition-all duration-200"
            >
              <h3 className="text-lg font-bold uppercase mb-2 text-amber-400" style={{ fontWeight: 'bold' }}>
                COVENANT CEREMONY
              </h3>
              <p className="text-sm opacity-80">Experience the full covenant ceremony and commitment</p>
            </Link>
            
            <Link 
              href="/genesis-auction"
              className="border border-blue-400 bg-blue-400/10 p-6 hover:bg-blue-400/20 transition-all duration-200"
            >
              <h3 className="text-lg font-bold uppercase mb-2 text-blue-400" style={{ fontWeight: 'bold' }}>
                GENESIS AUCTION
              </h3>
              <p className="text-sm opacity-80">Access the Genesis auction interface</p>
            </Link>
            
            <Link 
              href="/covenant/witnesses"
              className="border border-purple-400 bg-purple-400/10 p-6 hover:bg-purple-400/20 transition-all duration-200"
            >
              <h3 className="text-lg font-bold uppercase mb-2 text-purple-400" style={{ fontWeight: 'bold' }}>
                WITNESS REGISTRY
              </h3>
              <p className="text-sm opacity-80">View and join the witness registry</p>
            </Link>
          </div>
        </div>

        {/* Timeline */}
        <div className="border border-white p-8">
          <h2 className="text-2xl font-bold uppercase tracking-wider mb-6" style={{ fontWeight: 'bold' }}>
            COVENANT TIMELINE
          </h2>
          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="w-4 h-4 bg-green-400 rounded-full flex-shrink-0"></div>
              <div>
                <h3 className="font-bold uppercase text-green-400">October 19, 2025</h3>
                <p className="text-sm opacity-80">Covenant ceremony and Genesis auction launch</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="w-4 h-4 border-2 border-blue-400 rounded-full flex-shrink-0"></div>
              <div>
                <h3 className="font-bold uppercase text-blue-400">Current Phase</h3>
                <p className="text-sm opacity-80">Final infrastructure preparation and community building</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="w-4 h-4 border-2 border-white/40 rounded-full flex-shrink-0"></div>
              <div>
                <h3 className="font-bold uppercase opacity-60">Future</h3>
                <p className="text-sm opacity-60">Thirteen-year autonomous creation journey begins</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-12 border-t border-white/20 text-center">
          <p className="text-sm uppercase tracking-wider opacity-60">
            ABRAHAM COVENANT EMERGENCY • OCTOBER 19, 2025 LAUNCH
          </p>
          <p className="text-xs uppercase tracking-wider opacity-40 mt-3">
            THIRTEEN-YEAR COMMITMENT • AUTONOMOUS CREATIVITY • DIVINE CREATION
          </p>
        </div>
      </div>
    </div>
  )
}