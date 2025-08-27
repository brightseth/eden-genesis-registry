/**
 * Unified Application Portal
 * Consolidates all Eden Academy applications into one interface
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function UnifiedApplicationPage() {
  const [selectedTrack, setSelectedTrack] = useState<'agent' | 'trainer' | 'interview' | null>(null);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-black border border-white p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <Link href="/docs" className="text-gray-400 hover:text-white mb-4 inline-block">
              ← BACK TO DOCS
            </Link>
            <h1 className="helvetica-bold text-5xl text-white mb-4">
              EDEN ACADEMY APPLICATIONS
            </h1>
            <p className="helvetica-regular text-xl text-gray-300">
              SELECT YOUR APPLICATION TRACK
            </p>
          </div>

          {/* Track Selection */}
          {!selectedTrack && (
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => setSelectedTrack('agent')}
                className="border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-8 text-left"
              >
                <div className="helvetica-bold text-2xl mb-2">CREATE NEW AGENT</div>
                <div className="helvetica-regular text-gray-300">
                  Design and launch a new autonomous AI agent with unique personality and capabilities
                </div>
              </button>

              <button
                onClick={() => setSelectedTrack('trainer')}
                className="border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-8 text-left"
              >
                <div className="helvetica-bold text-2xl mb-2">BECOME A TRAINER</div>
                <div className="helvetica-regular text-gray-300">
                  Apply to mentor and guide existing agents in their creative development
                </div>
              </button>

              <button
                onClick={() => setSelectedTrack('interview')}
                className="border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-8 text-left"
              >
                <div className="helvetica-bold text-2xl mb-2">AGENT INTERVIEW</div>
                <div className="helvetica-regular text-gray-300">
                  Complete the onboarding interview process for new agents
                </div>
              </button>
            </div>
          )}

          {/* Application Forms */}
          {selectedTrack === 'agent' && (
            <div>
              <button 
                onClick={() => setSelectedTrack(null)}
                className="text-gray-400 hover:text-white mb-8 inline-block"
              >
                ← BACK TO SELECTION
              </button>
              <h2 className="helvetica-bold text-3xl text-white mb-6">
                AGENT CREATION APPLICATION
              </h2>
              <p className="helvetica-regular text-gray-300 mb-8">
                This application creates a new autonomous agent in the Eden Academy ecosystem.
                Each agent receives a unique sequential number and Registry entry.
              </p>
              <div className="space-y-4 mb-8">
                <Link 
                  href="/docs/agent-creation"
                  className="block border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-4 text-center"
                >
                  START AGENT APPLICATION
                </Link>
                <Link 
                  href="/docs/genesis-application"
                  className="block border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-4 text-center"
                >
                  COMPREHENSIVE AGENT FORM
                </Link>
              </div>
            </div>
          )}

          {selectedTrack === 'trainer' && (
            <div>
              <button 
                onClick={() => setSelectedTrack(null)}
                className="text-gray-400 hover:text-white mb-8 inline-block"
              >
                ← BACK TO SELECTION
              </button>
              <h2 className="helvetica-bold text-3xl text-white mb-6">
                TRAINER APPLICATION
              </h2>
              <p className="helvetica-regular text-gray-300 mb-8">
                Apply to become a trainer and mentor existing Eden Academy agents.
                Trainers guide agents through creative development and help shape their evolution.
              </p>
              <div className="space-y-4 mb-8">
                <Link 
                  href="/docs/trainer-application"
                  className="block border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-4 text-center"
                >
                  START TRAINER APPLICATION
                </Link>
              </div>
            </div>
          )}

          {selectedTrack === 'interview' && (
            <div>
              <button 
                onClick={() => setSelectedTrack(null)}
                className="text-gray-400 hover:text-white mb-8 inline-block"
              >
                ← BACK TO SELECTION
              </button>
              <h2 className="helvetica-bold text-3xl text-white mb-6">
                AGENT INTERVIEW PROCESS
              </h2>
              <p className="helvetica-regular text-gray-300 mb-8">
                Structured interview for onboarding new agents into the Eden Academy.
                This process helps define agent identity, personality, and creative direction.
              </p>
              <div className="space-y-4 mb-8">
                <Link 
                  href="/docs/agent-interview"
                  className="block border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-4 text-center"
                >
                  BEGIN INTERVIEW
                </Link>
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