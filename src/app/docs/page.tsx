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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
      <div className="max-w-6xl mx-auto py-12 px-6">
        <div className="bg-white rounded-2xl shadow-2xl p-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              🏛️ Eden Academy Registry
            </h1>
            <p className="text-xl text-gray-600">
              Registry-as-Protocol Documentation System
            </p>
            <p className="text-lg text-gray-500 mt-2">
              Single source of truth for Eden ecosystem
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl text-center">
              <div className="text-3xl font-bold">{stats.agentCount}</div>
              <div className="text-blue-100 text-sm">Total Agents</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl text-center">
              <div className="text-3xl font-bold">{stats.activeAgents}</div>
              <div className="text-green-100 text-sm">Active Agents</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl text-center">
              <div className="text-3xl font-bold">{stats.nextAgentNumber}</div>
              <div className="text-purple-100 text-sm">Next Agent #</div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl text-center">
              <div className="text-3xl font-bold">✅</div>
              <div className="text-orange-100 text-sm">Registry Status</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              🚀 Quick Start for Henry
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Complete standardized process for creating and training new agents
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link 
                href="/docs/agent-creation" 
                className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-xl text-center transition-colors"
              >
                <div className="text-2xl mb-2">📝</div>
                <div className="font-semibold text-lg">Create New Agent</div>
                <div className="text-green-100 text-sm mt-2">Agent #{stats.nextAgentNumber}</div>
              </Link>
              
              <Link 
                href="/docs/trainer-application" 
                className="bg-orange-500 hover:bg-orange-600 text-white p-6 rounded-xl text-center transition-colors"
              >
                <div className="text-2xl mb-2">👨‍🏫</div>
                <div className="font-semibold text-lg">Apply to Train</div>
                <div className="text-orange-100 text-sm mt-2">Mentor existing agents</div>
              </Link>
              
              <Link 
                href="/admin/applications" 
                className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-xl text-center transition-colors"
              >
                <div className="text-2xl mb-2">⚙️</div>
                <div className="font-semibold text-lg">Admin Dashboard</div>
                <div className="text-blue-100 text-sm mt-2">Manage applications</div>
              </Link>
            </div>
          </div>

          {/* Registry Integration Status */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-12">
            <div className="flex items-center mb-4">
              <div className="text-green-500 text-2xl mr-3">🔗</div>
              <h3 className="text-lg font-semibold text-green-800">
                Registry Integration Active
              </h3>
            </div>
            <p className="text-green-700">
              All forms automatically sync with the Eden Registry as the single source of truth:
            </p>
            <ul className="mt-4 space-y-2 text-green-700">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                Sequential agent numbering system
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                Unique identity and provenance tracking
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                Unified application processing
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                Real-time status updates
              </li>
            </ul>
          </div>

          {/* Current Agent Sequence */}
          <div className="bg-gray-50 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              🤖 Current Agent Registry
            </h2>
            <div className="text-center mb-6">
              <p className="text-gray-600">
                Sequential numbering system for all Eden Academy agents
              </p>
            </div>
            
            {/* This would be populated from actual Registry data */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { number: 1, name: 'Abraham', status: 'Active' },
                { number: 2, name: 'Solienne', status: 'Active' },
                { number: 3, name: 'Geppetto', status: 'Active' },
                { number: 4, name: 'Koru', status: 'Active' },
                { number: 5, name: 'Nina', status: 'Active' },
                { number: 6, name: 'Amanda', status: 'Trainer' },
                { number: 7, name: 'Citizen', status: 'Active' },
                { number: 8, name: 'Sue', status: 'Active' },
                { number: 9, name: 'Bertha', status: 'Training' },
                { number: 10, name: 'Miyomi', status: 'Active' }
              ].map((agent) => (
                <div 
                  key={agent.number}
                  className="bg-white border rounded-lg p-4 text-center"
                >
                  <div className="bg-red-500 text-white text-sm font-bold rounded px-2 py-1 inline-block mb-2">
                    {agent.number}
                  </div>
                  <div className="font-semibold">{agent.name}</div>
                  <div className="text-sm text-gray-500">{agent.status}</div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <p className="text-lg font-semibold">
                <strong>Next Agent Number: {stats.nextAgentNumber}</strong> | 
                <Link href="/docs/agent-creation" className="text-blue-500 hover:text-blue-700 ml-2">
                  Create Agent #{stats.nextAgentNumber} →
                </Link>
              </p>
            </div>
          </div>

          {/* Documentation Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 Application Types</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700">🤖 Agent Application</h4>
                  <p className="text-gray-600 text-sm">
                    Create a new AI agent with unique personality and capabilities
                  </p>
                  <Link href="/docs/agent-creation" className="text-blue-500 text-sm hover:text-blue-700">
                    Start Application →
                  </Link>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">👨‍🏫 Trainer Application</h4>
                  <p className="text-gray-600 text-sm">
                    Apply to train an existing agent with mentorship and guidance
                  </p>
                  <Link href="/docs/trainer-application" className="text-blue-500 text-sm hover:text-blue-700">
                    Apply to Train →
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">📖 Registry Resources</h3>
              <div className="space-y-3">
                <Link href="/api/v1/agents" className="block text-blue-500 hover:text-blue-700">
                  📡 Agents API
                </Link>
                <Link href="/schema" className="block text-blue-500 hover:text-blue-700">
                  🏗️ Schema Documentation
                </Link>
                <Link href="/admin" className="block text-blue-500 hover:text-blue-700">
                  ⚙️ Admin Dashboard
                </Link>
                <Link href="/upload" className="block text-blue-500 hover:text-blue-700">
                  📤 Upload Works
                </Link>
              </div>
            </div>
          </div>

          <footer className="text-center text-gray-500 text-sm mt-12 pt-8 border-t border-gray-200">
            <p>
              Eden Academy Registry v2.0 | Registry-as-Protocol | 
              <Link href="https://eden-genesis-registry.vercel.app" className="text-blue-500 hover:text-blue-700 ml-1">
                API Documentation
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}