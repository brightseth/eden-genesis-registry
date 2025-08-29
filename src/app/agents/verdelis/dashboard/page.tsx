'use client';

import { useState } from 'react';

interface TrainerApplication {
  // Personal Information
  name: string;
  email: string;
  organization?: string;
  website?: string;
  linkedIn?: string;
  twitter?: string;
  
  // Environmental Experience
  environmentalBackground: string;
  sustainabilityExperience: string;
  artExperience: string;
  techExperience: string;
  
  // Specializations
  specializations: string[];
  climateDataExperience: boolean;
  carbonFootprintKnowledge: boolean;
  renewableEnergyKnowledge: boolean;
  sustainableArtPractices: boolean;
  
  // Training Approach
  trainingPhilosophy: string;
  collaborationStyle: string;
  availabilityHours: number;
  preferredSchedule: string;
  
  // Environmental Data & Partnerships
  dataSourcesAccess: string[];
  environmentalPartnerships: string[];
  researchNetworks: string[];
  
  // Commitment
  minimumCommitmentMonths: number;
  expectedOutcomes: string;
  successMetrics: string;
}

const SPECIALIZATION_OPTIONS = [
  'Climate Data Visualization',
  'Carbon Footprint Analysis', 
  'Renewable Energy Systems',
  'Biodiversity Conservation',
  'Sustainable Computing',
  'Environmental Education',
  'Ecosystem Restoration',
  'Green Technology',
  'Circular Economy',
  'Environmental Policy',
  'Conservation Biology',
  'Sustainable Design'
];

const DATA_SOURCE_OPTIONS = [
  'NASA Climate Data',
  'NOAA Weather Data',
  'EPA Environmental Data',
  'IPCC Climate Reports',
  'Global Forest Watch',
  'Ocean Health Index',
  'Air Quality Networks',
  'Biodiversity Databases',
  'Renewable Energy Statistics',
  'Carbon Markets Data',
  'Satellite Imagery',
  'IoT Environmental Sensors'
];

export default function VerdelisTrainerDashboard() {
  const [formData, setFormData] = useState<TrainerApplication>({
    name: '',
    email: '',
    organization: '',
    website: '',
    linkedIn: '',
    twitter: '',
    environmentalBackground: '',
    sustainabilityExperience: '',
    artExperience: '',
    techExperience: '',
    specializations: [],
    climateDataExperience: false,
    carbonFootprintKnowledge: false,
    renewableEnergyKnowledge: false,
    sustainableArtPractices: false,
    trainingPhilosophy: '',
    collaborationStyle: '',
    availabilityHours: 0,
    preferredSchedule: '',
    dataSourcesAccess: [],
    environmentalPartnerships: [],
    researchNetworks: [],
    minimumCommitmentMonths: 6,
    expectedOutcomes: '',
    successMetrics: ''
  });

  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSpecializationToggle = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec]
    }));
  };

  const handleDataSourceToggle = (source: string) => {
    setFormData(prev => ({
      ...prev,
      dataSourcesAccess: prev.dataSourcesAccess.includes(source)
        ? prev.dataSourcesAccess.filter(s => s !== source)
        : [...prev.dataSourcesAccess, source]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In production, this would submit to the Registry API
      console.log('Submitting trainer application:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
    } catch (error) {
      console.error('Failed to submit application:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="max-w-2xl mx-auto p-8 text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-green-400 mb-4">APPLICATION SUBMITTED</h1>
          <p className="text-gray-300 mb-6">
            Thank you for your interest in training VERDELIS. Your application has been received 
            and will be reviewed by our environmental partnership team.
          </p>
          <p className="text-sm text-gray-400 mb-8">
            We'll contact you within 5-7 business days to discuss next steps and potential collaboration opportunities.
          </p>
          <a 
            href="/agents/verdelis" 
            className="px-6 py-3 bg-green-600 text-black font-bold rounded hover:bg-green-500 transition-colors"
          >
            BACK TO VERDELIS PROFILE
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <header className="border-b border-green-500/20 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded border border-white/20 flex items-center justify-center">
              <span className="text-lg font-bold text-black">V</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-400">VERDELIS TRAINER APPLICATION</h1>
              <p className="text-gray-400 text-sm">Environmental AI Artist Partnership Program</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Section {currentSection} of 5</span>
            <span className="text-sm text-gray-400">{Math.round((currentSection / 5) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-800 h-2 rounded">
            <div 
              className="bg-green-500 h-2 rounded transition-all duration-300"
              style={{ width: `${(currentSection / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Personal Information */}
          {currentSection === 1 && (
            <section className="bg-gray-900/50 border border-gray-700 p-6 rounded">
              <h2 className="text-xl font-bold text-green-400 mb-6">PERSONAL INFORMATION</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-green-300 text-sm font-bold mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-green-300 text-sm font-bold mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-green-300 text-sm font-bold mb-2">
                    Organization/Institution
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-green-300 text-sm font-bold mb-2">
                    Website/Portfolio
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Section 2: Environmental Experience */}
          {currentSection === 2 && (
            <section className="bg-gray-900/50 border border-gray-700 p-6 rounded">
              <h2 className="text-xl font-bold text-green-400 mb-6">ENVIRONMENTAL EXPERIENCE</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-green-300 text-sm font-bold mb-2">
                    Environmental Background *
                  </label>
                  <textarea
                    value={formData.environmentalBackground}
                    onChange={(e) => setFormData(prev => ({ ...prev, environmentalBackground: e.target.value }))}
                    rows={4}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                    placeholder="Describe your background in environmental science, conservation, sustainability, or related fields..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-green-300 text-sm font-bold mb-2">
                    Sustainability Experience *
                  </label>
                  <textarea
                    value={formData.sustainabilityExperience}
                    onChange={(e) => setFormData(prev => ({ ...prev, sustainabilityExperience: e.target.value }))}
                    rows={4}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                    placeholder="Share your experience with sustainable practices, carbon footprint reduction, renewable energy, etc..."
                    required
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-green-300 text-sm font-bold mb-2">
                      Art/Creative Experience
                    </label>
                    <textarea
                      value={formData.artExperience}
                      onChange={(e) => setFormData(prev => ({ ...prev, artExperience: e.target.value }))}
                      rows={3}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                      placeholder="Describe any experience with art, design, or creative projects..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-green-300 text-sm font-bold mb-2">
                      Technology Experience
                    </label>
                    <textarea
                      value={formData.techExperience}
                      onChange={(e) => setFormData(prev => ({ ...prev, techExperience: e.target.value }))}
                      rows={3}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                      placeholder="Experience with AI, data analysis, digital tools, etc..."
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Section 3: Specializations & Knowledge */}
          {currentSection === 3 && (
            <section className="bg-gray-900/50 border border-gray-700 p-6 rounded">
              <h2 className="text-xl font-bold text-green-400 mb-6">SPECIALIZATIONS & KNOWLEDGE</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-green-300 text-sm font-bold mb-4">
                    Environmental Specializations (Select all that apply)
                  </label>
                  <div className="grid md:grid-cols-3 gap-3">
                    {SPECIALIZATION_OPTIONS.map((spec) => (
                      <label key={spec} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.specializations.includes(spec)}
                          onChange={() => handleSpecializationToggle(spec)}
                          className="text-green-500 focus:ring-green-500 bg-black border-gray-600"
                        />
                        <span className="text-sm text-gray-200">{spec}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-green-300 text-sm font-bold mb-4">
                    Core Knowledge Areas
                  </label>
                  <div className="space-y-3">
                    {[
                      { key: 'climateDataExperience', label: 'Climate Data Analysis & Visualization' },
                      { key: 'carbonFootprintKnowledge', label: 'Carbon Footprint Calculation & Tracking' },
                      { key: 'renewableEnergyKnowledge', label: 'Renewable Energy Systems & Technologies' },
                      { key: 'sustainableArtPractices', label: 'Sustainable Art Creation Practices' }
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData[key as keyof TrainerApplication] as boolean}
                          onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.checked }))}
                          className="text-green-500 focus:ring-green-500 bg-black border-gray-600"
                        />
                        <span className="text-gray-200">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Section 4: Data Sources & Partnerships */}
          {currentSection === 4 && (
            <section className="bg-gray-900/50 border border-gray-700 p-6 rounded">
              <h2 className="text-xl font-bold text-green-400 mb-6">DATA SOURCES & PARTNERSHIPS</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-green-300 text-sm font-bold mb-4">
                    Environmental Data Sources Access (Select all that apply)
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {DATA_SOURCE_OPTIONS.map((source) => (
                      <label key={source} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.dataSourcesAccess.includes(source)}
                          onChange={() => handleDataSourceToggle(source)}
                          className="text-green-500 focus:ring-green-500 bg-black border-gray-600"
                        />
                        <span className="text-sm text-gray-200">{source}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-green-300 text-sm font-bold mb-2">
                      Environmental Partnerships
                    </label>
                    <textarea
                      value={formData.environmentalPartnerships.join('\n')}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        environmentalPartnerships: e.target.value.split('\n').filter(Boolean) 
                      }))}
                      rows={4}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                      placeholder="List environmental organizations, NGOs, or institutions you work with (one per line)..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-green-300 text-sm font-bold mb-2">
                      Research Networks
                    </label>
                    <textarea
                      value={formData.researchNetworks.join('\n')}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        researchNetworks: e.target.value.split('\n').filter(Boolean) 
                      }))}
                      rows={4}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                      placeholder="Research networks, academic collaborations, or scientific communities (one per line)..."
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Section 5: Training Commitment */}
          {currentSection === 5 && (
            <section className="bg-gray-900/50 border border-gray-700 p-6 rounded">
              <h2 className="text-xl font-bold text-green-400 mb-6">TRAINING COMMITMENT</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-green-300 text-sm font-bold mb-2">
                    Training Philosophy *
                  </label>
                  <textarea
                    value={formData.trainingPhilosophy}
                    onChange={(e) => setFormData(prev => ({ ...prev, trainingPhilosophy: e.target.value }))}
                    rows={4}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                    placeholder="Describe your approach to training an environmental AI artist. How would you guide VERDELIS's development?"
                    required
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-green-300 text-sm font-bold mb-2">
                      Weekly Availability (Hours) *
                    </label>
                    <input
                      type="number"
                      value={formData.availabilityHours}
                      onChange={(e) => setFormData(prev => ({ ...prev, availabilityHours: parseInt(e.target.value) }))}
                      min="1"
                      max="40"
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-green-300 text-sm font-bold mb-2">
                      Minimum Commitment (Months)
                    </label>
                    <select
                      value={formData.minimumCommitmentMonths}
                      onChange={(e) => setFormData(prev => ({ ...prev, minimumCommitmentMonths: parseInt(e.target.value) }))}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                    >
                      <option value={3}>3 months</option>
                      <option value={6}>6 months</option>
                      <option value={12}>12 months</option>
                      <option value={24}>24 months</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-green-300 text-sm font-bold mb-2">
                    Expected Outcomes *
                  </label>
                  <textarea
                    value={formData.expectedOutcomes}
                    onChange={(e) => setFormData(prev => ({ ...prev, expectedOutcomes: e.target.value }))}
                    rows={3}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                    placeholder="What do you hope to achieve through this partnership? What impact do you envision VERDELIS having?"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-green-300 text-sm font-bold mb-2">
                    Success Metrics *
                  </label>
                  <textarea
                    value={formData.successMetrics}
                    onChange={(e) => setFormData(prev => ({ ...prev, successMetrics: e.target.value }))}
                    rows={3}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                    placeholder="How would you measure the success of VERDELIS's development and environmental impact?"
                    required
                  />
                </div>
              </div>
            </section>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-700">
            <button
              type="button"
              onClick={() => setCurrentSection(Math.max(1, currentSection - 1))}
              disabled={currentSection === 1}
              className="px-6 py-3 border border-gray-600 text-gray-400 font-bold rounded hover:border-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              PREVIOUS
            </button>

            {currentSection < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentSection(Math.min(5, currentSection + 1))}
                className="px-6 py-3 bg-green-600 text-black font-bold rounded hover:bg-green-500 transition-colors"
              >
                NEXT SECTION
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-green-600 text-black font-bold rounded hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting && (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                )}
                <span>SUBMIT APPLICATION</span>
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}