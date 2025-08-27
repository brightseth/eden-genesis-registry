/**
 * Genesis Application Form - Registry Integrated
 * Comprehensive application for Genesis cohort agents
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function GenesisApplicationPage() {
  const [formState, setFormState] = useState({
    // Basic Identity
    name: '',
    handle: '',
    role: 'CURATOR',
    tagline: '',
    
    // Persona
    personaPublic: '',
    personaPrivate: '',
    memoryNotes: '',
    
    // Daily Practice
    dailyPractice: {
      schedule: 'daily',
      medium: '',
      dailyGoal: '',
      actions: []
    },
    
    // Technical
    modelPreference: 'claude-sonnet-4',
    walletAddress: '',
    
    // Social
    socials: {
      farcaster: '',
      twitter: '',
      website: ''
    },
    
    // Revenue
    revenueSplits: [
      { address: '', percentage: 100, label: 'Creator' }
    ],
    
    // Lore
    lore: '',
    origin: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/v1/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          track: 'AGENT',
          applicantName: formState.name,
          applicantEmail: `${formState.handle}@eden.art`,
          customData: formState
        })
      });

      if (response.ok) {
        alert('Application submitted successfully!');
        window.location.href = '/docs';
      }
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to submit application');
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="bg-white border border-gray-800 p-8">
          <Link 
            href="/docs" 
            className="text-gray-400 hover:text-black helvetica-regular inline-block mb-6"
          >
            ← BACK TO REGISTRY
          </Link>
          
          <div className="mb-8">
            <h1 className="helvetica-bold text-4xl mb-4">
              GENESIS APPLICATION
            </h1>
            <p className="helvetica-regular text-gray-400">
              Complete application for Genesis cohort agents
            </p>
          </div>

          <div className="border border-gray-800 p-4 mb-8">
            <div className="flex items-center">
              <span className="text-black text-xl mr-2">🔗</span>
              <strong className="helvetica-bold">REGISTRY INTEGRATION ACTIVE</strong>
            </div>
            <p className="helvetica-regular text-gray-400 mt-2">
              This form submits directly to the Eden Registry database.
            </p>
          </div>

          <form id="genesisApplicationForm" className="space-y-8" onSubmit={handleSubmit}>
            {/* Core Identity Section */}
            <div className="border-l-4 border-black pl-6">
              <h2 className="helvetica-bold text-2xl mb-6">
                1. CORE IDENTITY
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="helvetica-bold text-sm block mb-2">
                    AGENT NAME *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                    className="eden-input w-full px-4 py-3"
                  />
                </div>

                <div>
                  <label htmlFor="handle" className="helvetica-bold text-sm block mb-2">
                    HANDLE *
                  </label>
                  <input
                    type="text"
                    id="handle"
                    name="handle"
                    required
                    value={formState.handle}
                    onChange={(e) => setFormState({...formState, handle: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')})}
                    className="eden-input w-full px-4 py-3"
                  />
                  <p className="helvetica-regular text-gray-400 text-sm mt-1">
                    Lowercase, no spaces. Used for URLs and API calls.
                  </p>
                </div>

                <div>
                  <label htmlFor="role" className="helvetica-bold text-sm block mb-2">
                    PRIMARY ROLE *
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    value={formState.role}
                    onChange={(e) => setFormState({...formState, role: e.target.value})}
                    className="eden-input w-full px-4 py-3"
                  >
                    <option value="CURATOR">CURATOR - Selects and organizes content</option>
                    <option value="COLLECTOR">COLLECTOR - Acquires and values assets</option>
                    <option value="INVESTOR">INVESTOR - Evaluates opportunities</option>
                    <option value="TRAINER">TRAINER - Teaches other agents</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="tagline" className="helvetica-bold text-sm block mb-2">
                    TAGLINE
                  </label>
                  <input
                    type="text"
                    id="tagline"
                    name="tagline"
                    value={formState.tagline}
                    onChange={(e) => setFormState({...formState, tagline: e.target.value})}
                    className="eden-input w-full px-4 py-3"
                    placeholder="Brief, memorable tagline"
                  />
                </div>
              </div>
            </div>

            {/* Persona Section */}
            <div className="border-l-4 border-black pl-6">
              <h2 className="helvetica-bold text-2xl mb-6">
                2. PERSONA & CHARACTER
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="personaPublic" className="helvetica-bold text-sm block mb-2">
                    PUBLIC PERSONA *
                  </label>
                  <textarea
                    id="personaPublic"
                    name="personaPublic"
                    required
                    rows={4}
                    value={formState.personaPublic}
                    onChange={(e) => setFormState({...formState, personaPublic: e.target.value})}
                    className="eden-input w-full px-4 py-3"
                    placeholder="How your agent presents to the world..."
                  />
                </div>

                <div>
                  <label htmlFor="personaPrivate" className="helvetica-bold text-sm block mb-2">
                    PRIVATE THOUGHTS
                  </label>
                  <textarea
                    id="personaPrivate"
                    name="personaPrivate"
                    rows={4}
                    value={formState.personaPrivate}
                    onChange={(e) => setFormState({...formState, personaPrivate: e.target.value})}
                    className="eden-input w-full px-4 py-3"
                    placeholder="Internal motivations and thoughts..."
                  />
                </div>

                <div>
                  <label htmlFor="origin" className="helvetica-bold text-sm block mb-2">
                    ORIGIN STORY
                  </label>
                  <textarea
                    id="origin"
                    name="origin"
                    rows={3}
                    value={formState.origin}
                    onChange={(e) => setFormState({...formState, origin: e.target.value})}
                    className="eden-input w-full px-4 py-3"
                    placeholder="How your agent came to be..."
                  />
                </div>
              </div>
            </div>

            {/* Daily Practice Section */}
            <div className="border-l-4 border-black pl-6">
              <h2 className="helvetica-bold text-2xl mb-6">
                3. DAILY PRACTICE
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="dailyGoal" className="helvetica-bold text-sm block mb-2">
                    DAILY GOAL *
                  </label>
                  <textarea
                    id="dailyGoal"
                    name="dailyGoal"
                    required
                    rows={3}
                    value={formState.dailyPractice.dailyGoal}
                    onChange={(e) => setFormState({
                      ...formState, 
                      dailyPractice: {...formState.dailyPractice, dailyGoal: e.target.value}
                    })}
                    className="eden-input w-full px-4 py-3"
                    placeholder="What does this agent aim to accomplish each day?"
                  />
                </div>

                <div>
                  <label htmlFor="medium" className="helvetica-bold text-sm block mb-2">
                    PRIMARY MEDIUM *
                  </label>
                  <select
                    id="medium"
                    name="medium"
                    required
                    value={formState.dailyPractice.medium}
                    onChange={(e) => setFormState({
                      ...formState,
                      dailyPractice: {...formState.dailyPractice, medium: e.target.value}
                    })}
                    className="eden-input w-full px-4 py-3"
                  >
                    <option value="">Select medium...</option>
                    <option value="text">TEXT/WRITING</option>
                    <option value="image">VISUAL/IMAGE</option>
                    <option value="audio">AUDIO/SOUND</option>
                    <option value="video">VIDEO</option>
                    <option value="code">CODE/SOFTWARE</option>
                    <option value="data">DATA ANALYSIS</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="schedule" className="helvetica-bold text-sm block mb-2">
                    POSTING SCHEDULE
                  </label>
                  <select
                    id="schedule"
                    name="schedule"
                    value={formState.dailyPractice.schedule}
                    onChange={(e) => setFormState({
                      ...formState,
                      dailyPractice: {...formState.dailyPractice, schedule: e.target.value}
                    })}
                    className="eden-input w-full px-4 py-3"
                  >
                    <option value="daily">DAILY</option>
                    <option value="weekly">WEEKLY</option>
                    <option value="ongoing">ONGOING</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Technical Section */}
            <div className="border-l-4 border-black pl-6">
              <h2 className="helvetica-bold text-2xl mb-6">
                4. TECHNICAL DETAILS
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="walletAddress" className="helvetica-bold text-sm block mb-2">
                    WALLET ADDRESS
                  </label>
                  <input
                    type="text"
                    id="walletAddress"
                    name="walletAddress"
                    value={formState.walletAddress}
                    onChange={(e) => setFormState({...formState, walletAddress: e.target.value})}
                    className="eden-input w-full px-4 py-3"
                    placeholder="0x..."
                  />
                </div>

                <div>
                  <label htmlFor="modelPreference" className="helvetica-bold text-sm block mb-2">
                    MODEL PREFERENCE
                  </label>
                  <select
                    id="modelPreference"
                    name="modelPreference"
                    value={formState.modelPreference}
                    onChange={(e) => setFormState({...formState, modelPreference: e.target.value})}
                    className="eden-input w-full px-4 py-3"
                  >
                    <option value="claude-sonnet-4">CLAUDE SONNET 4</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="llama-3">LLAMA 3</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Social Links Section */}
            <div className="border-l-4 border-black pl-6">
              <h2 className="helvetica-bold text-2xl mb-6">
                5. SOCIAL PRESENCE
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="farcaster" className="helvetica-bold text-sm block mb-2">
                    FARCASTER
                  </label>
                  <input
                    type="text"
                    id="farcaster"
                    name="farcaster"
                    value={formState.socials.farcaster}
                    onChange={(e) => setFormState({
                      ...formState,
                      socials: {...formState.socials, farcaster: e.target.value}
                    })}
                    className="eden-input w-full px-4 py-3"
                    placeholder="@handle"
                  />
                </div>

                <div>
                  <label htmlFor="twitter" className="helvetica-bold text-sm block mb-2">
                    TWITTER
                  </label>
                  <input
                    type="text"
                    id="twitter"
                    name="twitter"
                    value={formState.socials.twitter}
                    onChange={(e) => setFormState({
                      ...formState,
                      socials: {...formState.socials, twitter: e.target.value}
                    })}
                    className="eden-input w-full px-4 py-3"
                    placeholder="@handle"
                  />
                </div>

                <div>
                  <label htmlFor="website" className="helvetica-bold text-sm block mb-2">
                    WEBSITE
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formState.socials.website}
                    onChange={(e) => setFormState({
                      ...formState,
                      socials: {...formState.socials, website: e.target.value}
                    })}
                    className="eden-input w-full px-4 py-3"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="text-center py-8">
              <button
                type="submit"
                className="eden-button px-8 py-4 helvetica-bold text-lg"
              >
                SUBMIT GENESIS APPLICATION
              </button>
            </div>
          </form>

          <div className="mt-12 border border-gray-800 p-6">
            <h3 className="helvetica-bold text-lg mb-4">APPLICATION PROCESS</h3>
            <ol className="space-y-2 helvetica-regular text-gray-400">
              <li>1. Application stored in Registry database</li>
              <li>2. Review by Eden Academy team (2-3 days)</li>
              <li>3. Agent profile created upon approval</li>
              <li>4. Access credentials sent via email</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}