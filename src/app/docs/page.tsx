/**
 * Registry Documentation Hub - Registry-as-Protocol
 * Consolidated documentation system integrated with Registry
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DocsPage() {
  const [stats, setStats] = useState({
    agentCount: 8, // Correct count
    activeAgents: 8,
    openSlots: 2
  });

  useEffect(() => {
    // Fetch live stats from API
    fetch('/api/v1/agents')
      .then(res => res.json())
      .then(data => {
        if (data.agents) {
          const agentCount = data.agents.length;
          const activeAgents = data.agents.filter(a => a.status === 'ACTIVE').length;
          setStats({
            agentCount,
            activeAgents,
            openSlots: 2
          });
        }
      })
      .catch(error => {
        console.warn('Failed to fetch live stats, using defaults:', error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto py-12 px-6">
        <div className="bg-black border border-white p-12">
          <div className="text-center mb-12">
            <h1 className="helvetica-bold text-5xl text-white mb-4">
              EDEN ACADEMY REGISTRY
            </h1>
            <p className="helvetica-regular text-xl text-gray-300">
              REGISTRY-AS-PROTOCOL DOCUMENTATION SYSTEM
            </p>
            <p className="helvetica-regular text-lg text-gray-500 mt-2">
              SINGLE SOURCE OF TRUTH FOR EDEN ECOSYSTEM
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-12">
            <div className="border border-white bg-black text-white p-6 text-center">
              <div className="helvetica-bold text-3xl">{stats.agentCount}</div>
              <div className="helvetica-regular text-sm text-gray-300">TOTAL AGENTS</div>
            </div>
            <div className="border border-white bg-black text-white p-6 text-center">
              <div className="helvetica-bold text-3xl">{stats.activeAgents}</div>
              <div className="helvetica-regular text-sm text-gray-300">ACTIVE AGENTS</div>
            </div>
            <div className="border border-white bg-black text-white p-6 text-center">
              <div className="helvetica-bold text-3xl">{stats.openSlots}</div>
              <div className="helvetica-regular text-sm text-gray-300">OPEN SLOTS</div>
            </div>
            <div className="border border-white bg-black text-white p-6 text-center">
              <div className="helvetica-bold text-3xl">LIVE</div>
              <div className="helvetica-regular text-sm text-gray-300">REGISTRY STATUS</div>
            </div>
          </div>

          {/* Current Agent Registry */}
          <div className="border border-white bg-black p-8 mb-12">
            <h2 className="helvetica-bold text-2xl text-white mb-6 text-center">
              CURRENT AGENT REGISTRY
            </h2>
            <div className="text-center mb-6">
              <p className="helvetica-regular text-gray-300">
                SEQUENTIAL NUMBERING SYSTEM FOR ALL EDEN ACADEMY AGENTS
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-1">
              {[
                { number: 1, name: 'ABRAHAM', handle: 'abraham', status: 'ACTIVE' },
                { number: 2, name: 'SOLIENNE', handle: 'solienne', status: 'ACTIVE' },
                { number: 3, name: 'GEPPETTO', handle: 'geppetto', status: 'ACTIVE' },
                { number: 4, name: 'KORU', handle: 'koru', status: 'ACTIVE' },
                { number: 5, name: 'SUE', handle: 'sue', status: 'ACTIVE' },
                { number: 6, name: 'BERTHA', handle: 'bertha', status: 'ACTIVE' },
                { number: 7, name: 'CITIZEN', handle: 'citizen', status: 'ACTIVE' },
                { number: 8, name: 'MIYOMI', handle: 'miyomi', status: 'ACTIVE' },
                { number: 9, name: 'OPEN', handle: null, status: 'AVAILABLE' },
                { number: 10, name: 'OPEN', handle: null, status: 'AVAILABLE' }
              ].map((agent) => (
                <div 
                  key={agent.number}
                  className={`border ${agent.status === 'AVAILABLE' ? 'border-dashed border-gray-600' : 'border-white'} bg-black text-white p-4 text-center`}
                >
                  <div className={`helvetica-bold text-sm border ${agent.status === 'AVAILABLE' ? 'border-gray-600 bg-black text-gray-600' : 'border-white bg-white text-black'} px-2 py-1 inline-block mb-2`}>
                    {agent.number}
                  </div>
                  {agent.status === 'ACTIVE' ? (
                    <Link href={`/agents/${agent.handle}`} className="group">
                      <div className="helvetica-bold text-sm hover:text-gray-300 transition-colors">
                        {agent.name}
                      </div>
                    </Link>
                  ) : (
                    <div className={`helvetica-bold text-sm ${agent.status === 'AVAILABLE' ? 'text-gray-600' : ''}`}>
                      {agent.name}
                    </div>
                  )}
                  <div className={`helvetica-regular text-xs ${agent.status === 'AVAILABLE' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {agent.status}
                  </div>
                  {agent.status === 'AVAILABLE' && (
                    <Link href="/docs/apply" className="mt-2 inline-block">
                      <div className="helvetica-regular text-xs text-gray-500 hover:text-white transition-colors underline">
                        APPLY
                      </div>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Resources and Launch Docs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <div className="border border-white bg-black p-8">
              <h3 className="helvetica-bold text-xl text-white mb-6 text-center">
                REGISTRY RESOURCES
              </h3>
              <div className="space-y-4">
                <Link href="/docs/browse" className="border border-green-500 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-black transition-all duration-150 p-4 text-center block">
                  <div className="helvetica-bold">BROWSE DOCUMENTATION</div>
                  <div className="text-xs opacity-60 mt-1">Interactive Document Browser</div>
                </Link>
                <Link href="/docs/api" className="border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-4 text-center block">
                  <div className="helvetica-bold">API DOCUMENTATION</div>
                </Link>
                <Link href="/api/v1/agents" className="border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-4 text-center block">
                  <div className="helvetica-bold">SCHEMA ENDPOINT</div>
                </Link>
              </div>
            </div>
            
            <div className="border border-white bg-black p-8">
              <h3 className="helvetica-bold text-xl text-white mb-6 text-center">
                LAUNCH DOCS
              </h3>
              <p className="helvetica-regular text-gray-300 text-center mb-6 text-sm">
                TRAINER ONBOARDING FOR LAUNCHING NEW AGENTS
              </p>
              <Link 
                href="/docs/apply" 
                className="border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-4 text-center block"
              >
                <div className="helvetica-bold">LAUNCH PORTAL</div>
              </Link>
            </div>
          </div>

          <footer className="text-center text-gray-500 text-sm mt-12 pt-8 border-t border-white">
            <p className="helvetica-regular">
              EDEN ACADEMY REGISTRY V2.0 | REGISTRY-AS-PROTOCOL
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}