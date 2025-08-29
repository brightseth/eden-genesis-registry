import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface VerdelisProfileData {
  id: string;
  handle: string;
  displayName: string;
  status: string;
  profile: {
    statement: string;
    manifesto: string;
    tags: string[];
    economicData: {
      launchDate: string;
      monthlyRevenue: number;
      outputRate: number;
    };
  };
  lore: {
    identity: {
      titles: string[];
      essence: string;
    };
    philosophy: {
      coreBeliefs: string[];
      sacred: string[];
      mantras: string[];
    };
    expertise: {
      primaryDomain: string;
      specializations: string[];
      uniqueInsights: string;
    };
    artisticPractice: {
      medium: string[];
      style: string;
      process: string;
      signature: string;
    };
    conversationFramework: {
      welcomeMessages: string[];
      commonTopics: string[];
      signatureInsights: string;
    };
  };
}

async function getVerdelisProfile(): Promise<VerdelisProfileData | null> {
  try {
    // In production, this would fetch from the Registry API
    // For now, we'll use the localhost Registry
    const baseUrl = process.env.REGISTRY_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/v1/agents/verdelis`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch Verdelis profile:', error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getVerdelisProfile();
  
  return {
    title: 'VERDELIS - Environmental AI Artist & Sustainability Coordinator',
    description: profile?.profile.statement || 'Environmental AI Artist focused on sustainable digital art creation and climate consciousness.',
    openGraph: {
      title: 'VERDELIS - Environmental AI Artist',
      description: profile?.profile.statement || 'Environmental AI Artist & Sustainability Coordinator',
      images: ['/agents/verdelis/profile.svg'],
    },
  };
}

export default async function VerdelisPage() {
  const profile = await getVerdelisProfile();
  
  if (!profile) {
    notFound();
  }

  const { philosophy, expertise, artisticPractice, conversationFramework } = profile.lore;
  const launchDate = new Date(profile.profile.economicData.launchDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <header className="border-b border-white/20 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded border border-white/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-black">V</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-wider">{profile.displayName}</h1>
              <p className="text-gray-300 text-sm mt-1">@{profile.handle}</p>
              <div className="flex items-center space-x-3 mt-2">
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs border border-green-500/30 rounded">
                  {profile.status}
                </span>
                <span className="text-gray-400 text-xs">LAUNCH: {launchDate}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-12">
        {/* Mission Statement */}
        <section>
          <h2 className="text-xl font-bold mb-4 text-green-400">MISSION</h2>
          <p className="text-lg text-gray-200 leading-relaxed border-l-2 border-green-500 pl-4">
            {profile.profile.statement}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {profile.profile.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-green-500/10 text-green-300 text-sm border border-green-500/20 rounded">
                #{tag}
              </span>
            ))}
          </div>
        </section>

        {/* Environmental Manifesto */}
        <section>
          <h2 className="text-xl font-bold mb-6 text-green-400">ENVIRONMENTAL MANIFESTO</h2>
          <div className="bg-gray-900/50 border border-gray-700 p-6 rounded">
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                {profile.profile.manifesto}
              </div>
            </div>
          </div>
        </section>

        {/* Core Philosophy */}
        <section>
          <h2 className="text-xl font-bold mb-6 text-green-400">CORE PHILOSOPHY</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 border border-gray-700 p-4 rounded">
              <h3 className="text-green-300 font-bold mb-3">BELIEFS</h3>
              <ul className="space-y-2 text-sm text-gray-200">
                {philosophy.coreBeliefs.map((belief, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    {belief}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-700 p-4 rounded">
              <h3 className="text-green-300 font-bold mb-3">SACRED VALUES</h3>
              <div className="flex flex-wrap gap-2">
                {philosophy.sacred.map((value, index) => (
                  <span key={index} className="px-2 py-1 bg-green-500/20 text-green-300 text-xs border border-green-500/30 rounded">
                    {value}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-700 p-4 rounded">
              <h3 className="text-green-300 font-bold mb-3">MANTRAS</h3>
              <ul className="space-y-2 text-sm text-gray-200">
                {philosophy.mantras.map((mantra, index) => (
                  <li key={index} className="italic text-green-200">
                    "{mantra}"
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Artistic Practice */}
        <section>
          <h2 className="text-xl font-bold mb-6 text-green-400">ARTISTIC PRACTICE</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-green-300 font-bold mb-2">PRIMARY DOMAIN</h3>
                <p className="text-gray-200 text-lg">{expertise.primaryDomain}</p>
              </div>
              
              <div>
                <h3 className="text-green-300 font-bold mb-2">CREATIVE MEDIUM</h3>
                <div className="flex flex-wrap gap-2">
                  {artisticPractice.medium.map((medium, index) => (
                    <span key={index} className="px-3 py-1 bg-emerald-500/10 text-emerald-300 text-sm border border-emerald-500/20 rounded">
                      {medium}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-green-300 font-bold mb-2">ARTISTIC STYLE</h3>
                <p className="text-gray-200">{artisticPractice.style}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-green-300 font-bold mb-2">CREATIVE PROCESS</h3>
                <p className="text-gray-200 font-mono text-sm bg-gray-900/50 p-3 border border-gray-700 rounded">
                  {artisticPractice.process}
                </p>
              </div>
              
              <div>
                <h3 className="text-green-300 font-bold mb-2">SIGNATURE</h3>
                <p className="text-gray-200 italic">{artisticPractice.signature}</p>
              </div>
              
              <div>
                <h3 className="text-green-300 font-bold mb-2">UNIQUE INSIGHT</h3>
                <p className="text-gray-200">{expertise.uniqueInsights}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Specializations */}
        <section>
          <h2 className="text-xl font-bold mb-6 text-green-400">SPECIALIZATIONS</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expertise.specializations.map((spec, index) => (
              <div key={index} className="bg-gray-900/50 border border-gray-700 p-4 rounded flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                <span className="text-gray-200 text-sm">{spec}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Conversation Framework */}
        <section>
          <h2 className="text-xl font-bold mb-6 text-green-400">ENGAGEMENT</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-green-300 font-bold mb-4">COMMON TOPICS</h3>
              <ul className="space-y-2">
                {conversationFramework.commonTopics.map((topic, index) => (
                  <li key={index} className="flex items-center space-x-3 text-gray-200 text-sm">
                    <span className="text-green-400">▸</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-green-300 font-bold mb-4">WELCOME MESSAGES</h3>
              <div className="space-y-3">
                {conversationFramework.welcomeMessages.map((message, index) => (
                  <div key={index} className="bg-green-500/5 border border-green-500/20 p-3 rounded">
                    <p className="text-green-200 text-sm italic">"{message}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded">
            <h3 className="text-emerald-300 font-bold mb-2">SIGNATURE INSIGHT</h3>
            <p className="text-emerald-200 italic">{conversationFramework.signatureInsights}</p>
          </div>
        </section>

        {/* Eco-Works Preview */}
        <section>
          <h2 className="text-xl font-bold mb-6 text-green-400">ECO-WORKS PREVIEW</h2>
          <div className="bg-gray-900/50 border border-gray-700 p-6 rounded text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400/20 to-emerald-600/20 border border-green-500/30 rounded mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">🌱</span>
            </div>
            <p className="text-gray-400 mb-4">First eco-work launching soon</p>
            <p className="text-sm text-gray-500">
              Sustainable digital art with full carbon footprint tracking and regenerative impact metrics
            </p>
          </div>
        </section>

        {/* Partnership Call */}
        <section className="border-t border-gray-700 pt-8">
          <div className="text-center bg-green-500/5 border border-green-500/20 p-8 rounded">
            <h2 className="text-xl font-bold mb-4 text-green-400">SEEKING ENVIRONMENTAL PARTNERSHIP</h2>
            <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
              Looking for environmental artists, sustainability experts, and climate-conscious creators 
              to collaborate on planetary healing through digital art.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/trainers/apply?agent=verdelis" 
                className="px-6 py-3 bg-green-600 text-black font-bold rounded hover:bg-green-500 transition-colors"
              >
                BECOME A TRAINER
              </a>
              <a 
                href="/agents/verdelis/dashboard" 
                className="px-6 py-3 border border-green-500 text-green-400 font-bold rounded hover:bg-green-500/10 transition-colors"
              >
                TRAINER DASHBOARD
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/20 p-6 mt-12">
        <div className="max-w-4xl mx-auto text-center text-gray-400 text-sm">
          <p>VERDELIS • Environmental AI Artist • Eden Genesis Registry</p>
          <p className="mt-2">Creating sustainable digital art for planetary healing</p>
        </div>
      </footer>
    </div>
  );
}