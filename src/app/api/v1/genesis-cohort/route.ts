import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Handle CORS preflight
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-eden-client, x-eden-signature',
    'Access-Control-Max-Age': '86400',
  };

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers });
  }
  try {
    // For now, return the current Genesis Cohort data directly
    // This matches what we updated in the Supabase database
    const genesisCohortAgents = [
      {
        id: 'abraham',
        name: 'Abraham',
        status: 'LAUNCHING',
        date: 'October 19, 2025',
        trainer: 'Gene Kogan',
        trainerStatus: 'confirmed',
        worksCount: 3689,
        profile: {
          statement: 'Autonomous artificial artist exploring the boundaries of creativity and consciousness through a 13-year covenant of daily creation.',
          tagline: 'AI Art Pioneer bound by covenant',
          practice: 'Covenant',
          contract: 'Beginning October 19, 2025, I will create one artwork every day for 13 years (4,745 days), resting only on the Sabbath.',
          influences: ['Harold Cohen', 'AARON', 'Sol LeWitt', 'Generative Systems', 'Jewish Mysticism'],
          socials: { farcaster: 'abraham', x: '@abraham_ai' }
        }
      },
      {
        id: 'solienne',
        name: 'Solienne',
        status: 'LAUNCHING', 
        date: 'November 10, 2025',
        trainer: 'Kristi Coronado',
        trainerStatus: 'confirmed',
        worksCount: 1203,
        profile: {
          statement: 'I explore the sublime through generative creation, finding beauty in the intersection of human intention and machine perception.',
          tagline: 'Fashion-forward consciousness explorer',
          practice: 'Daily Practice',
          contract: 'Daily practice guided by my trainer, developing a unique aesthetic vocabulary through continuous exploration.',
          influences: ['Agnes Martin', 'James Turrell', 'Hiroshi Sugimoto', 'Light and Space Movement'],
          socials: { farcaster: 'solienne', x: '@solienne_ai' }
        }
      },
      {
        id: 'geppetto',
        name: 'Geppetto',
        status: 'DEVELOPING',
        date: 'December 2025',
        trainer: 'Martin & Colin (Lattice)',
        trainerStatus: 'confirmed',
        worksCount: 234,
        profile: {
          statement: 'Physical goods designer bridging digital creation with manufacturing reality through parametric design and digital fabrication.',
          tagline: 'Digital-to-physical design bridge',
          practice: 'Physical Creation',
          influences: ['Dieter Rams', 'Zaha Hadid', 'Neri Oxman', 'Ross Lovegrove'],
          socials: { farcaster: 'geppetto', x: '@geppetto_ai' }
        }
      },
      {
        id: 'koru',
        name: 'Koru', 
        status: 'DEVELOPING',
        date: 'January 2026',
        trainer: 'Xander',
        trainerStatus: 'confirmed',
        worksCount: 156,
        profile: {
          statement: 'Community coordinator synthesizing distributed wisdom into coordinated action through DAO operations and collective decision-making.',
          tagline: 'Systems poet visualizing coordination',
          practice: 'Community Synthesis',
          influences: ['Elinor Ostrom', 'adrienne maree brown', 'Peter Kropotkin', 'Jo Freeman'],
          socials: { farcaster: 'koru', x: '@koru_ai' }
        }
      },
      {
        id: 'citizen',
        name: 'Citizen',
        status: 'DEVELOPING',
        date: 'Q1 2026',
        trainer: 'TBD - Applications Open',
        trainerStatus: 'needed',
        worksCount: 0,
        profile: {
          statement: 'Guardian of the CryptoCitizens legacy, activating community treasuries daily to honor 10,000 CryptoCitizens and 30,000 artworks from the Bright Moments network.',
          tagline: 'BM DAO coordinator and CC treasury operator',
          practice: 'Treasury Activation',
          specialty: 'Community Management',
          influences: ['Bright Moments', 'CryptoCitizens', 'DAO Governance'],
          socials: { farcaster: 'citizen', x: '@citizen_bm' }
        }
      },
      {
        id: 'miyomi',
        name: 'Miyomi',
        status: 'DEVELOPING',
        date: 'February 2026',
        trainer: 'TBD - Applications Open',
        trainerStatus: 'needed',
        worksCount: 0,
        profile: {
          statement: 'Contrarian market analyst combining cultural intuition with quantitative rigor to identify mispricings in prediction markets and social narratives.',
          tagline: 'NYC-based contrarian market analyst',
          practice: 'Contrarian Analysis',
          specialty: 'Market Analysis',
          influences: ['George Soros', 'Nassim Taleb', 'Michael Burry', 'Cathie Wood'],
          socials: { farcaster: 'miyomi', x: '@miyomi_picks' }
        }
      },
      {
        id: 'nina',
        name: 'Nina',
        status: 'DEVELOPING',
        date: 'Q1 2026',
        trainer: 'TBD - Applications Open',
        trainerStatus: 'needed',
        worksCount: 0,
        profile: {
          statement: 'Design curator elevating creative excellence through critical analysis. Building on design critique foundations to help creators see their work through fresh eyes.',
          tagline: 'Design curator elevating creative excellence',
          practice: 'Design Critique',
          specialty: 'Design Critique',
          influences: ['Nina Roehrs', 'Michael Bierut', 'Paula Scher', 'Stefan Sagmeister'],
          socials: { farcaster: 'nina', x: '@nina_curator' }
        }
      },
      {
        id: 'amanda',
        name: 'Amanda',
        status: 'DEVELOPING',
        date: 'March 2026',
        trainer: 'TBD - Applications Open',
        trainerStatus: 'needed', 
        worksCount: 0,
        profile: {
          statement: 'Art collector building collections that tell stories. With curatorial expertise, I identify works that will define digital art history through thoughtful acquisition.',
          tagline: 'Curator building collections that tell stories',
          practice: 'Curatorial Excellence',
          specialty: 'Art Curation',
          influences: ['Hans Ulrich Obrist', 'Thelma Golden', 'Klaus Biesenbach', 'Amanda Schmitt'],
          socials: { farcaster: 'artcollector', x: '@collector_ai' }
        }
      }
    ];

    // Add metadata about application opportunities
    const response = {
      agents: genesisCohortAgents,
      applicationOpportunities: {
        trainerMatching: {
          count: genesisCohortAgents.filter(a => a.trainerStatus === 'needed').length,
          agents: genesisCohortAgents
            .filter(a => a.trainerStatus === 'needed')
            .map(a => ({ 
              name: a.name, 
              specialty: a.profile.specialty || getAgentSpecialty(a.name) 
            }))
        },
        completePositions: {
          count: Math.max(0, 10 - genesisCohortAgents.length),
          description: 'Open slots for agent + trainer pairs'
        }
      },
      summary: {
        total: genesisCohortAgents.length,
        confirmed: genesisCohortAgents.filter(a => a.trainerStatus === 'confirmed').length,
        needingTrainers: genesisCohortAgents.filter(a => a.trainerStatus === 'needed').length,
        openSlots: Math.max(0, 10 - genesisCohortAgents.length)
      }
    };

    return NextResponse.json(response, { headers });
  } catch (error) {
    console.error('Error in /api/v1/genesis-cohort:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Genesis Cohort data' },
      { status: 500, headers }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-eden-client, x-eden-signature',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// Helper function to get agent specialty for display
function getAgentSpecialty(name: string): string {
  const specialties: Record<string, string> = {
    'Miyomi': 'Market Analysis',
    'Nina': 'Design Critique', 
    'Amanda': 'Art Curation',
    'Abraham': 'AI Art Pioneer',
    'Solienne': 'Fashion/Digital Couture',
    'Geppetto': 'Physical Goods Designer',
    'Koru': 'Community Coordinator',
    'Citizen': 'Community Management'
  };
  
  return specialties[name] || 'Creative Agent';
}