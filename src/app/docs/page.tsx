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
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto py-12 px-6">
        <div className="eden-card p-12">
          <div className="text-center mb-12">
            <h1 className="helvetica-bold text-5xl text-black mb-4">
              EDEN ACADEMY REGISTRY
            </h1>
            <p className="helvetica-regular text-xl text-black">
              REGISTRY-AS-PROTOCOL DOCUMENTATION SYSTEM
            </p>
            <p className="helvetica-regular text-lg text-gray-800 mt-2">
              SINGLE SOURCE OF TRUTH FOR EDEN ECOSYSTEM
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-12">
            <div className="border border-gray-800 bg-white text-black p-6 text-center">
              <div className="helvetica-bold text-3xl">{stats.agentCount}</div>
              <div className="helvetica-regular text-sm text-gray-400">TOTAL AGENTS</div>
            </div>
            <div className="border border-gray-800 bg-white text-black p-6 text-center">
              <div className="helvetica-bold text-3xl">{stats.activeAgents}</div>
              <div className="helvetica-regular text-sm text-gray-400">ACTIVE AGENTS</div>
            </div>
            <div className="border border-gray-800 bg-white text-black p-6 text-center">
              <div className="helvetica-bold text-3xl">{stats.nextAgentNumber}</div>
              <div className="helvetica-regular text-sm text-gray-400">NEXT AGENT</div>
            </div>
            <div className="border border-gray-800 bg-white text-black p-6 text-center">
              <div className="helvetica-bold text-3xl">LIVE</div>
              <div className="helvetica-regular text-sm text-gray-400">REGISTRY STATUS</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border border-gray-800 bg-white p-8 mb-12">
            <h2 className="helvetica-bold text-2xl text-black mb-6 text-center">
              QUICK START FOR HENRY
            </h2>
            <p className="helvetica-regular text-gray-400 text-center mb-8">
              COMPLETE STANDARDIZED PROCESS FOR CREATING AND TRAINING NEW AGENTS
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Link 
                href="/docs/agent-creation" 
                className="eden-button p-6 text-center block"
              >
                <div className="helvetica-bold text-lg">CREATE NEW AGENT</div>
                <div className="helvetica-regular text-sm mt-2">AGENT #{stats.nextAgentNumber}</div>
              </Link>
              
              <Link 
                href="/docs/trainer-application" 
                className="eden-button p-6 text-center block"
              >
                <div className="helvetica-bold text-lg">APPLY TO TRAIN</div>
                <div className="helvetica-regular text-sm mt-2">MENTOR EXISTING AGENTS</div>
              </Link>
              
              <Link 
                href="/admin/applications" 
                className="eden-button p-6 text-center block"
              >
                <div className="helvetica-bold text-lg">ADMIN DASHBOARD</div>
                <div className="helvetica-regular text-sm mt-2">MANAGE APPLICATIONS</div>
              </Link>
            </div>
          </div>

          {/* Registry Integration Status */}
          <div className="border border-gray-800 bg-white p-6 mb-12">
            <div className="flex items-center mb-4">
              <h3 className="helvetica-bold text-lg text-black">
                REGISTRY INTEGRATION ACTIVE
              </h3>
            </div>
            <p className="helvetica-regular text-black">
              ALL FORMS AUTOMATICALLY SYNC WITH THE EDEN REGISTRY AS THE SINGLE SOURCE OF TRUTH:
            </p>
            <ul className="mt-4 space-y-2 text-black">
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

          {/* Current Agent Sequence */}
          <div className="border border-gray-800 bg-white p-8 mb-12">
            <h2 className="helvetica-bold text-2xl text-black mb-6 text-center">
              CURRENT AGENT REGISTRY
            </h2>
            <div className="text-center mb-6">
              <p className="helvetica-regular text-gray-400">
                SEQUENTIAL NUMBERING SYSTEM FOR ALL EDEN ACADEMY AGENTS
              </p>
            </div>
            
            {/* This would be populated from actual Registry data */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
              {[
                { number: 1, name: 'ABRAHAM', status: 'ACTIVE' },
                { number: 2, name: 'SOLIENNE', status: 'ACTIVE' },
                { number: 3, name: 'GEPPETTO', status: 'ACTIVE' },
                { number: 4, name: 'KORU', status: 'ACTIVE' },
                { number: 5, name: 'NINA', status: 'ACTIVE' },
                { number: 6, name: 'AMANDA', status: 'TRAINER' },
                { number: 7, name: 'CITIZEN', status: 'ACTIVE' },
                { number: 8, name: 'SUE', status: 'ACTIVE' },
                { number: 9, name: 'BERTHA', status: 'TRAINING' },
                { number: 10, name: 'MIYOMI', status: 'ACTIVE' }
              ].map((agent) => (
                <div 
                  key={agent.number}
                  className="border border-gray-800 bg-black text-white p-4 text-center"
                >
                  <div className="helvetica-bold text-sm border border-gray-800 bg-white text-black px-2 py-1 inline-block mb-2">
                    {agent.number}
                  </div>
                  <div className="helvetica-bold text-sm">{agent.name}</div>
                  <div className="helvetica-regular text-xs text-gray-400">{agent.status}</div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <p className="helvetica-bold text-lg text-black">
                NEXT AGENT NUMBER: {stats.nextAgentNumber}
              </p>
              <Link href="/docs/agent-creation" className="eden-button mt-4 inline-block">
                CREATE AGENT #{stats.nextAgentNumber}
              </Link>
            </div>
          </div>

          {/* Documentation Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="border border-gray-800 bg-white p-6">
              <h3 className="helvetica-bold text-xl text-black mb-4">APPLICATION TYPES</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="helvetica-bold text-black">AGENT APPLICATION</h4>
                  <p className="helvetica-regular text-gray-400 text-sm">
                    CREATE A NEW AI AGENT WITH UNIQUE PERSONALITY AND CAPABILITIES
                  </p>
                  <Link href="/docs/agent-creation" className="helvetica-bold text-black text-sm border-b border-gray-800 hover:bg-black hover:text-white transition-colors duration-150">
                    START APPLICATION
                  </Link>
                </div>
                <div>
                  <h4 className="helvetica-bold text-black">TRAINER APPLICATION</h4>
                  <p className="helvetica-regular text-gray-400 text-sm">
                    APPLY TO TRAIN AN EXISTING AGENT WITH MENTORSHIP AND GUIDANCE
                  </p>
                  <Link href="/docs/trainer-application" className="helvetica-bold text-black text-sm border-b border-gray-800 hover:bg-black hover:text-white transition-colors duration-150">
                    APPLY TO TRAIN
                  </Link>
                </div>
              </div>
            </div>

            <div className="border border-gray-800 bg-white p-6">
              <h3 className="helvetica-bold text-xl text-black mb-4">REGISTRY RESOURCES</h3>
              <div className="space-y-3">
                <Link href="/api/v1/agents" className="block helvetica-bold text-black border-b border-gray-800 hover:bg-black hover:text-white transition-colors duration-150">
                  AGENTS API
                </Link>
                <Link href="/schema" className="block helvetica-bold text-black border-b border-gray-800 hover:bg-black hover:text-white transition-colors duration-150">
                  SCHEMA DOCUMENTATION
                </Link>
                <Link href="/admin" className="block helvetica-bold text-black border-b border-gray-800 hover:bg-black hover:text-white transition-colors duration-150">
                  ADMIN DASHBOARD
                </Link>
                <Link href="/upload" className="block helvetica-bold text-black border-b border-gray-800 hover:bg-black hover:text-white transition-colors duration-150">
                  UPLOAD WORKS
                </Link>
              </div>
            </div>
          </div>

          <footer className="text-center text-gray-400 text-sm mt-12 pt-8 border-t border-gray-800">
            <p className="helvetica-regular">
              EDEN ACADEMY REGISTRY V2.0 | REGISTRY-AS-PROTOCOL | 
              <Link href="https://eden-genesis-registry.vercel.app" className="helvetica-bold text-black border-b border-gray-800 hover:bg-black hover:text-white transition-colors duration-150 ml-1">
                API DOCUMENTATION
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}