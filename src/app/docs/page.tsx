/**
 * Registry Documentation Hub - Registry-as-Protocol
 * Consolidated documentation system integrated with Registry
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DocsPage() {
  const [stats, setStats] = useState({
    agentCount: 10, // Default fallback
    activeAgents: 8,
    nextAgentNumber: 11
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
            nextAgentNumber: agentCount + 1
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
              <div className="helvetica-bold text-3xl">{stats.nextAgentNumber}</div>
              <div className="helvetica-regular text-sm text-gray-300">NEXT AGENT</div>
            </div>
            <div className="border border-white bg-black text-white p-6 text-center">
              <div className="helvetica-bold text-3xl">LIVE</div>
              <div className="helvetica-regular text-sm text-gray-300">REGISTRY STATUS</div>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="border border-white bg-black p-8 mb-12">
            <h2 className="helvetica-bold text-2xl text-white mb-6 text-center">
              AGENT CREATION SYSTEM
            </h2>
            <p className="helvetica-regular text-gray-300 text-center mb-8">
              STANDARDIZED PROCESS FOR CREATING NEW AUTONOMOUS AGENTS
            </p>
            
            <div className="flex justify-center">
              <Link 
                href="/docs/agent-creation" 
                className="border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-8 text-center block"
              >
                <div className="helvetica-bold text-2xl">CREATE NEW AGENT</div>
                <div className="helvetica-regular text-lg mt-2">AGENT #{stats.nextAgentNumber}</div>
                <div className="helvetica-regular text-sm mt-4 text-gray-300">
                  COMPLETE APPLICATION PROCESS
                </div>
              </Link>
            </div>
          </div>

          {/* Registry Integration Status */}
          <div className="border border-white bg-black p-6 mb-12">
            <div className="flex items-center mb-4">
              <h3 className="helvetica-bold text-lg text-white">
                REGISTRY INTEGRATION ACTIVE
              </h3>
            </div>
            <p className="helvetica-regular text-gray-300">
              ALL FORMS AUTOMATICALLY SYNC WITH THE EDEN REGISTRY AS THE SINGLE SOURCE OF TRUTH:
            </p>
            <ul className="mt-4 space-y-2 text-white">
              <li className="flex items-center">
                <span className="helvetica-bold mr-4">1.</span>
                <span className="helvetica-regular">SEQUENTIAL AGENT NUMBERING SYSTEM</span>
              </li>
              <li className="flex items-center">
                <span className="helvetica-bold mr-4">2.</span>
                <span className="helvetica-regular">UNIQUE IDENTITY AND PROVENANCE TRACKING</span>
              </li>
              <li className="flex items-center">
                <span className="helvetica-bold mr-4">3.</span>
                <span className="helvetica-regular">UNIFIED APPLICATION PROCESSING</span>
              </li>
              <li className="flex items-center">
                <span className="helvetica-bold mr-4">4.</span>
                <span className="helvetica-regular">REAL-TIME STATUS UPDATES</span>
              </li>
            </ul>
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
                { number: 1, name: 'ABRAHAM', status: 'ACTIVE' },
                { number: 2, name: 'SOLIENNE', status: 'ACTIVE' },
                { number: 3, name: 'GEPPETTO', status: 'ACTIVE' },
                { number: 4, name: 'KORU', status: 'ACTIVE' },
                { number: 5, name: 'SUE', status: 'ACTIVE' },
                { number: 6, name: 'BERTHA', status: 'ACTIVE' },
                { number: 7, name: 'CITIZEN', status: 'ACTIVE' },
                { number: 8, name: 'MIYOMI', status: 'ACTIVE' }
              ].map((agent) => (
                <div 
                  key={agent.number}
                  className="border border-white bg-black text-white p-4 text-center"
                >
                  <div className="helvetica-bold text-sm border border-white bg-white text-black px-2 py-1 inline-block mb-2">
                    {agent.number}
                  </div>
                  <div className="helvetica-bold text-sm">{agent.name}</div>
                  <div className="helvetica-regular text-xs text-gray-400">{agent.status}</div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <p className="helvetica-bold text-lg text-white">
                NEXT AGENT NUMBER: {stats.nextAgentNumber}
              </p>
              <Link href="/docs/agent-creation" className="border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 px-6 py-3 mt-4 inline-block">
                CREATE AGENT #{stats.nextAgentNumber}
              </Link>
            </div>
          </div>

          {/* Key Documentation */}
          <div className="border border-white bg-black p-8">
            <h3 className="helvetica-bold text-xl text-white mb-6 text-center">
              REGISTRY RESOURCES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/docs/api" className="border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-4 text-center block">
                <div className="helvetica-bold">API DOCUMENTATION</div>
              </Link>
              <Link href="/api/v1/agents" className="border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-4 text-center block">
                <div className="helvetica-bold">SCHEMA ENDPOINT</div>
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