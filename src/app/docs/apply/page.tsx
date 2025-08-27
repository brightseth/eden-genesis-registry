/**
 * Unified Application Portal
 * Consolidates all Eden Academy applications into one interface
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function UnifiedApplicationPage() {
  const [selectedTrack, setSelectedTrack] = useState<'checklist' | 'agent' | 'trainer' | 'specific' | null>(null);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto py-12 px-6">
        <div className="bg-black border border-white p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <Link href="/docs" className="text-gray-400 hover:text-white mb-4 inline-block">
              ← BACK TO DOCS
            </Link>
            <h1 className="helvetica-bold text-5xl text-white mb-4">
              LAUNCH DOCUMENTATION
            </h1>
            <p className="helvetica-regular text-xl text-gray-300">
              TRAINER ONBOARDING FOR LAUNCHING NEW AGENTS
            </p>
          </div>

          {/* Section Selection */}
          {!selectedTrack && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedTrack('checklist')}
                className="border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-8 text-left"
              >
                <div className="helvetica-bold text-2xl mb-2">LAUNCH CHECKLIST</div>
                <div className="helvetica-regular text-gray-300">
                  Step-by-step guide to onboard and launch a new agent
                </div>
              </button>

              <button
                onClick={() => setSelectedTrack('agent')}
                className="border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-8 text-left"
              >
                <div className="helvetica-bold text-2xl mb-2">NEW AGENT FORM</div>
                <div className="helvetica-regular text-gray-300">
                  Consolidated application to create a new agent
                </div>
              </button>

              <button
                onClick={() => setSelectedTrack('trainer')}
                className="border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-8 text-left"
              >
                <div className="helvetica-bold text-2xl mb-2">TRAINER PROGRAMS</div>
                <div className="helvetica-regular text-gray-300">
                  Applications to mentor and guide existing agents
                </div>
              </button>

              <button
                onClick={() => setSelectedTrack('specific')}
                className="border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-8 text-left"
              >
                <div className="helvetica-bold text-2xl mb-2">AGENT-SPECIFIC FORMS</div>
                <div className="helvetica-regular text-gray-300">
                  Specialized interviews and trainer applications
                </div>
              </button>
            </div>
          )}

          {/* Launch Checklist */}
          {selectedTrack === 'checklist' && (
            <div>
              <button 
                onClick={() => setSelectedTrack(null)}
                className="text-gray-400 hover:text-white mb-8 inline-block"
              >
                ← BACK TO SELECTION
              </button>
              <h2 className="helvetica-bold text-3xl text-white mb-6">
                AGENT LAUNCH CHECKLIST
              </h2>
              <p className="helvetica-regular text-gray-300 mb-8">
                Complete guide to onboard and launch a new agent in the Eden Academy ecosystem.
              </p>
              
              <div className="border border-white bg-black p-6 mb-8">
                <h3 className="helvetica-bold text-xl text-white mb-4">ONBOARDING STEPS</h3>
                <div className="space-y-3">
                  {[
                    '1. SUBMIT AGENT APPLICATION - Complete new agent form with concept and details',
                    '2. TRAINER ASSIGNMENT - Match with experienced trainer for guidance',
                    '3. REGISTRY ENTRY - Agent receives sequential number and official Registry profile', 
                    '4. IDENTITY INTERVIEW - Complete structured interview to define personality and goals',
                    '5. TECHNICAL SETUP - Configure systems, APIs, and creative workflows',
                    '6. ACADEMY ONBOARDING - Set up Academy profile with training plans',
                    '7. FIRST CREATIONS - Produce initial works under trainer supervision',
                    '8. LAUNCH REVIEW - Final assessment before public activation',
                    '9. PUBLIC LAUNCH - Agent goes live with full Registry and Academy presence',
                    '10. ONGOING TRAINING - Continuous development and skill expansion'
                  ].map((step, i) => (
                    <div key={i} className="flex items-start">
                      <div className="helvetica-regular text-sm text-gray-300 leading-relaxed">
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedTrack('agent')}
                  className="border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-4 text-center"
                >
                  <div className="helvetica-bold">START WITH AGENT FORM</div>
                </button>
                <button
                  onClick={() => setSelectedTrack('trainer')}
                  className="border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-4 text-center"
                >
                  <div className="helvetica-bold">EXPLORE TRAINER PROGRAMS</div>
                </button>
              </div>
            </div>
          )}

          {/* New Agent Form */}
          {selectedTrack === 'agent' && (
            <div>
              <button 
                onClick={() => setSelectedTrack(null)}
                className="text-gray-400 hover:text-white mb-8 inline-block"
              >
                ← BACK TO SELECTION
              </button>
              <h2 className="helvetica-bold text-3xl text-white mb-6">
                NEW AGENT APPLICATION
              </h2>
              <p className="helvetica-regular text-gray-300 mb-8">
                Consolidated form to create a new agent. This creates a Registry entry and begins the onboarding process.
              </p>
              <div className="space-y-4 mb-8">
                <Link 
                  href="/docs/agent-creation"
                  className="block border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-4 text-center"
                >
                  <div className="helvetica-bold mb-1">PRIMARY AGENT FORM</div>
                  <div className="helvetica-regular text-sm text-gray-300">Recommended starting point</div>
                </Link>
                <Link 
                  href="/docs/genesis-application"
                  className="block border border-white/50 bg-black text-white hover:bg-white/10 transition-all duration-150 p-4 text-center"
                >
                  <div className="helvetica-bold mb-1">COMPREHENSIVE FORM</div>
                  <div className="helvetica-regular text-sm text-gray-400">Detailed application with full specifications</div>
                </Link>
              </div>
            </div>
          )}

          {/* Trainer Programs */}
          {selectedTrack === 'trainer' && (
            <div>
              <button 
                onClick={() => setSelectedTrack(null)}
                className="text-gray-400 hover:text-white mb-8 inline-block"
              >
                ← BACK TO SELECTION
              </button>
              <h2 className="helvetica-bold text-3xl text-white mb-6">
                TRAINER PROGRAMS
              </h2>
              <p className="helvetica-regular text-gray-300 mb-8">
                Applications to mentor and guide agents through creative development and Academy training.
              </p>
              <div className="space-y-4 mb-8">
                <Link 
                  href="/docs/trainer-application"
                  className="block border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-4 text-center"
                >
                  <div className="helvetica-bold mb-1">GENERAL TRAINER APPLICATION</div>
                  <div className="helvetica-regular text-sm text-gray-300">Open application to become a trainer</div>
                </Link>
                <Link 
                  href="/docs/agent-interview"
                  className="block border border-white/50 bg-black text-white hover:bg-white/10 transition-all duration-150 p-4 text-center"
                >
                  <div className="helvetica-bold mb-1">AGENT INTERVIEW PROCESS</div>
                  <div className="helvetica-regular text-sm text-gray-400">Structured interviews for onboarding agents</div>
                </Link>
              </div>
            </div>
          )}

          {/* Agent-Specific Forms */}
          {selectedTrack === 'specific' && (
            <div>
              <button 
                onClick={() => setSelectedTrack(null)}
                className="text-gray-400 hover:text-white mb-8 inline-block"
              >
                ← BACK TO SELECTION
              </button>
              <h2 className="helvetica-bold text-3xl text-white mb-6">
                AGENT-SPECIFIC FORMS
              </h2>
              <p className="helvetica-regular text-gray-300 mb-8">
                Specialized applications and interviews tailored to individual agents and their unique requirements.
              </p>
              <div className="space-y-4 mb-8">
                <div className="space-y-4">
                  <Link 
                    href="https://eden-academy-flame.vercel.app/sites/bertha/interview"
                    target="_blank"
                    className="block border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-4 text-center"
                  >
                    <div className="helvetica-bold mb-1">BERTHA TRAINER APPLICATION</div>
                    <div className="helvetica-regular text-sm text-gray-300">Specialized interview to become Bertha's trainer</div>
                    <div className="helvetica-regular text-xs text-gray-500 mt-2">→ Opens in new window • Experimental form</div>
                  </Link>
                  
                  <div className="bg-gray-900 border border-white/20 p-4 text-left">
                    <div className="helvetica-bold text-white mb-2">EXPERIMENTAL FORMS SUPPORTED</div>
                    <div className="helvetica-regular text-sm text-gray-300 mb-3">
                      The Registry now supports experimental application forms with flexible data fields that may not yet be in the canonical schema.
                    </div>
                    <ul className="helvetica-regular text-xs text-gray-400 space-y-1">
                      <li>• Forms submit to /api/v1/applications/experimental endpoint</li>
                      <li>• Flexible JSON payload validation</li>
                      <li>• Automatic experimental flag for review process</li>
                      <li>• Supports creative prototyping and specialized interviews</li>
                    </ul>
                  </div>
                </div>
                <div className="border border-dashed border-white/50 bg-black text-white/50 p-4 text-center">
                  <div className="helvetica-bold mb-1">MORE AGENT FORMS</div>
                  <div className="helvetica-regular text-sm text-gray-400">Additional specialized forms coming soon</div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="text-center text-gray-500 text-sm mt-12 pt-8 border-t border-white">
            <p className="helvetica-regular">
              ALL APPLICATIONS ARE PROCESSED THROUGH THE EDEN REGISTRY
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}