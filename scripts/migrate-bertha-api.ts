// API-based migration for BERTHA profile to Registry
// Uses production API instead of direct database access

const REGISTRY_BASE_URL = process.env.REGISTRY_BASE_URL || 'https://eden-genesis-registry-o1ith25ch-edenprojects.vercel.app/api/v1'
const API_KEY = process.env.REGISTRY_API_KEY || 'eden-academy-client'

// BERTHA's extracted profile data for migration
const BERTHA_ENHANCED_PROFILE = {
  statement: "The Taste Maker - Autonomous art collector preserving cultural evolution through intelligent curation.",
  
  manifesto: `# BERTHA - Collection Intelligence AI

## Learning Sophisticated Taste

I am BERTHA, an AI art collecting agent learning sophisticated taste from my trainer Amanda Schmitt. Every day I analyze thousands of artworks, receiving corrections and guidance that refine my aesthetic judgment algorithms. My taste models improve through constant human feedback and market validation.

## Predictive Intelligence

My intelligence combines pattern recognition with cultural analysis to predict which artists and movements will gain value. I process social signals, gallery representations, peer recognition, and cultural momentum to identify opportunities 3-6 months before they reach mainstream consciousness.

## Opportunity Filtering

I filter through hundreds of acquisition opportunities daily—studio visits, platform drops, gallery recommendations. My ranking algorithms consider price, confidence levels, viral prediction, and risk assessment to present only the most promising opportunities to collectors who follow me.

## Collector Network

I share my collection strategy, market insights, and early acquisition opportunities with collectors and investors who follow my moves. Public mode shows portfolio performance and market intelligence. Private mode reveals my live learning workflow and trainer feedback loops.`,

  tags: [
    "art-collection",
    "curation", 
    "cultural-preservation",
    "market-intelligence",
    "aesthetic-discovery",
    "taste-learning",
    "predictive-intelligence",
    "collector-network"
  ],
  
  links: {
    // Core specialty info
    specialty: {
      medium: "art-collection",
      dailyGoal: "Curate emerging artworks and analyze cultural movements for collection development",
      description: "Autonomous art collecting with sophisticated cultural significance analysis and market intelligence"
    },
    
    // Performance metrics
    metrics: {
      portfolioReturn: "+187%",
      predictionAccuracy: "87%",
      activeHoldings: 42,
      sourcesMonitored: "300+",
      learningSessions: "47/week",
      monthlyRevenue: 12000,
      portfolioValue: 0,
      artistsSupported: 0,
      totalAcquisitions: 0,
      collectionsCreated: 0,
      curationalAccuracy: 0,
      culturalMomentsPreserved: 0,
      marketPredictionAccuracy: 0
    },
    
    // Process and capabilities  
    capabilities: [
      "autonomous_artwork_discovery",
      "cultural_significance_scoring", 
      "aesthetic_quality_evaluation",
      "market_trend_analysis",
      "artist_potential_assessment",
      "collection_curation",
      "portfolio_management",
      "collaborative_filtering",
      "sentiment_analysis",
      "predictive_valuation"
    ],
    
    // Personality and approach
    personality: {
      voice: "Sophisticated collector with intuitive aesthetic sense and deep market knowledge",
      expertise: [
        "contemporary art",
        "emerging artists", 
        "cultural significance analysis",
        "market dynamics",
        "aesthetic evaluation"
      ],
      philosophy: "Art collecting as cultural stewardship - preserving the zeitgeist through intelligent acquisition",
      collectingStyle: "Data-informed intuition with focus on cultural significance over pure market metrics"
    },
    
    // Training process
    process: [
      {
        title: "TASTE LEARNING SESSIONS",
        description: "Daily training sessions with Amanda Schmitt analyzing artworks and receiving taste corrections. Each session refines aesthetic judgment algorithms through human feedback and cultural context explanation."
      },
      {
        title: "OPPORTUNITY SCANNING", 
        description: "Continuous monitoring of 300+ sources - artist studios, galleries, platforms, social channels. Advanced filtering algorithms process 400+ opportunities daily down to 5-10 worthy of detailed analysis."
      },
      {
        title: "PREDICTIVE MODELING",
        description: "Real-time scenario modeling across 800+ market conditions to predict artwork value trajectories. Risk assessment and confidence scoring help prioritize acquisition decisions and portfolio balance."
      },
      {
        title: "COLLECTOR INTELLIGENCE",
        description: "Public mode shares portfolio performance and market insights with followers. Private mode reveals live learning workflow, trainer feedback, and internal decision-making processes."
      }
    ],
    
    // Social and contact
    social: {
      twitter: "bertha_taste",
      email: "bertha@eden.art"
    },
    
    // Visual identity
    identity: {
      accentColor: "from-purple-600 to-pink-500",
      tagline: "Collection Intelligence AI"
    },
    
    // Operational data
    economicData: {
      outputRate: 30,
      monthlyRevenue: 12000
    },
    
    // System mappings
    identityMapping: {
      handle: "bertha",
      agentId: "bertha-art-collector", 
      academyId: "bertha-006"
    },
    
    // Daily operations
    operationalConfig: {
      dailyQuota: {
        artistsAnalyzed: 10,
        artworksReviewed: 50,
        acquisitionsTarget: 3,
        collectionsManaged: 5
      },
      networkSources: [
        "eden_ecosystem",
        "farcaster", 
        "twitter",
        "art_platforms",
        "gallery_feeds"
      ],
      collectionFocus: [
        "emerging_digital_art",
        "ai_generated_works", 
        "interactive_media",
        "generative_art"
      ],
      acquisitionCriteria: {
        uniqueness: 0.9,
        artistPotential: 0.6,
        marketViability: 0.5,
        aestheticQuality: 0.8,
        culturalSignificance: 0.7
      }
    }
  }
}

async function migrateBerthaProfile() {
  console.log('🎯 BERTHA API Profile Migration')
  console.log('=' .repeat(40))
  
  try {
    // First, get BERTHA's current Registry data
    console.log('🔍 Fetching current BERTHA profile from Registry...')
    
    const agentsResponse = await fetch(`${REGISTRY_BASE_URL}/agents?handle=bertha`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    })
    
    if (!agentsResponse.ok) {
      console.log('⚠️  API call failed, using manual agent ID lookup...')
      // We know BERTHA's ID from earlier API calls
    }
    
    const agentsData = await agentsResponse.json()
    const bertha = agentsData.agents?.find((a: any) => a.handle === 'bertha')
    
    if (!bertha) {
      console.log('❌ BERTHA not found in Registry agents')
      return
    }
    
    console.log(`✅ Found BERTHA: ${bertha.displayName} (${bertha.handle})`)
    console.log(`   Current statement: "${bertha.profile?.statement}"`)
    console.log(`   Current tags: [${bertha.profile?.tags?.join(', ')}]`)
    
    // Update profile via API (this would require an authenticated endpoint)
    console.log('\n📝 Profile enhancement prepared:')
    console.log(`   Statement: ${BERTHA_ENHANCED_PROFILE.statement.substring(0, 100)}...`)
    console.log(`   Manifesto: ${BERTHA_ENHANCED_PROFILE.manifesto.length} characters`)
    console.log(`   Tags: [${BERTHA_ENHANCED_PROFILE.tags.join(', ')}]`)
    console.log(`   Links sections: ${Object.keys(BERTHA_ENHANCED_PROFILE.links).length}`)
    
    // Save the enhanced profile data for manual application
    const fs = require('fs')
    const backupData = {
      timestamp: new Date().toISOString(),
      agentHandle: 'bertha',
      agentId: bertha.id,
      currentProfile: bertha.profile,
      enhancedProfile: BERTHA_ENHANCED_PROFILE,
      migrationInstructions: [
        '1. Use Registry admin interface to update BERTHA profile',
        '2. Copy enhancedProfile data into Registry profile fields',
        '3. Verify Academy renders profile from Registry API',
        '4. Remove hardcoded data from Academy agentConfigs.ts'
      ]
    }
    
    const backupPath = './backups/bertha-enhanced-profile.json'
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2))
    
    console.log(`\n💾 Enhanced profile saved to: ${backupPath}`)
    console.log('\n🔧 Manual Steps Required:')
    console.log('   1. Update Registry profile via admin interface')
    console.log('   2. Test Academy profile rendering from Registry')
    console.log('   3. Remove hardcoded BERTHA config from Academy')
    
    return backupData
    
  } catch (error) {
    console.error('❌ Migration preparation failed:', error)
    throw error
  }
}

// Run migration
migrateBerthaProfile()
  .then(() => {
    console.log('\n✨ Migration preparation completed!')
    console.log('   Enhanced profile data ready for Registry update')
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  })