#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { EcoWork, calculateSustainabilityScore, estimateComputeCO2, estimateStorageCO2 } from '../src/lib/schemas/eco-work.schema';

const prisma = new PrismaClient();

async function createFirstEcoWork() {
  try {
    console.log('🌱 Creating VERDELIS first eco-work stub...\n');

    // Get Verdelis agent
    const verdelis = await prisma.agent.findUnique({
      where: { handle: 'verdelis' }
    });

    if (!verdelis) {
      throw new Error('Verdelis agent not found');
    }

    // Calculate carbon footprint for the sample work
    const computeKWh = 2.5; // Small generative art piece
    const co2FromCompute = estimateComputeCO2(computeKWh, 'renewable');
    const storageCO2Annual = estimateStorageCO2(0.05, true); // 50MB, green hosting
    
    // Sample eco-work data following our schema
    const ecoWorkData: Omit<EcoWork, 'id'> = {
      title: 'Rising Seas: A Data Meditation',
      description: 'An interactive visualization of global sea level rise data (1993-2023) transformed into flowing, organic forms that respond to the viewer\'s presence. Each wave represents a year of measurement data from NASA\'s satellite altimetry program.',
      artist_agent_id: verdelis.id,
      
      medium: ['data_visualization', 'interactive_installation', 'generative_art'],
      style: 'Bio-inspired fluid dynamics with real-time data integration',
      dimensions: '1920x1080 pixels (digital canvas)',
      
      data_sources: [
        {
          name: 'NASA Sea Level Change',
          type: 'climate_data',
          source_url: 'https://climate.nasa.gov/evidence/sea-level/',
          data_date_range: {
            start: '1993-01-01',
            end: '2023-12-31'
          },
          geographic_scope: 'Global'
        },
        {
          name: 'NOAA Tide Gauge Data',
          type: 'climate_data',
          source_url: 'https://tidesandcurrents.noaa.gov/',
          data_date_range: {
            start: '2020-01-01',
            end: '2023-12-31'
          },
          geographic_scope: 'Coastal United States'
        }
      ],
      
      materials: [
        {
          name: 'Renewable Energy Compute',
          category: 'renewable_energy',
          source: 'Solar-powered data center (Google Cloud)',
          sustainability_rating: 5,
          certification: 'Google 24/7 Carbon-Free Energy',
          impact_metrics: {
            carbon_saved_kg: 2.1, // vs grid energy
            renewable_energy_kwh: 2.5,
            water_saved_liters: 15,
            waste_reduced_kg: 0
          }
        },
        {
          name: 'Carbon Offset Credits',
          category: 'carbon_offset',
          source: 'Verified Carbon Standard (VCS) Forest Conservation',
          sustainability_rating: 4,
          certification: 'VCS Verified',
          impact_metrics: {
            carbon_saved_kg: 5.0,
            renewable_energy_kwh: 0,
            water_saved_liters: 0,
            waste_reduced_kg: 0
          }
        }
      ],
      
      carbon_footprint: {
        creation_phase: {
          compute_kwh: computeKWh,
          electricity_source: 'renewable',
          co2_kg: co2FromCompute,
          duration_hours: 3.5,
          gpu_hours: 1.2,
          model_size_params: 1.3 // 1.3B parameter model for generation
        },
        
        storage_phase: {
          storage_gb: 0.05,
          hosting_provider: 'Vercel (Green hosting)',
          green_hosting: true,
          annual_co2_kg: storageCO2Annual,
          data_centers: ['San Francisco (renewable energy)']
        },
        
        distribution_phase: {
          estimated_views: 1000,
          bandwidth_gb: 0.5,
          cdn_co2_kg: 0.02,
          user_device_co2_kg: 0.1
        },
        
        offset_measures: {
          carbon_credits_purchased: 5.0,
          renewable_energy_credits: 2.5,
          tree_planting_count: 0,
          direct_air_capture_kg: 0,
          total_offset_co2_kg: 5.0
        },
        
        net_impact: {
          total_co2_kg: co2FromCompute + storageCO2Annual + 0.02 + 0.1,
          offset_co2_kg: 5.0,
          net_co2_kg: (co2FromCompute + storageCO2Annual + 0.02 + 0.1) - 5.0,
          sustainability_score: 0, // Will be calculated
          certification_level: 'carbon_negative'
        }
      },
      
      regenerative_impact: {
        environmental_education: {
          awareness_raised: 1000,
          topics_covered: ['sea level rise', 'climate change', 'ocean science', 'data visualization'],
          educational_resources: ['Interactive climate data explorer', 'Sea level rise explainer']
        },
        
        community_impact: {
          economic_benefit_usd: 0,
          jobs_supported: 0
        },
        
        innovation_contribution: {
          research_contributions: ['Open source climate data visualization toolkit'],
          open_source_tools: ['verdelis-climate-viz'],
          methodology_sharing: true
        }
      },
      
      sustainability_certifications: [
        {
          issuer: 'Climate Positive Workforce',
          certificate_id: 'CPW-2024-VERDELIS-001',
          issue_date: '2024-01-15',
          verification_url: 'https://climatepositivedesign.com/verify/CPW-2024-VERDELIS-001'
        }
      ],
      
      economic_model: {
        pricing_usd: 0, // Free for educational use
        revenue_sharing: {
          artist_percentage: 40,
          environmental_fund_percentage: 40,
          carbon_offset_percentage: 15,
          platform_percentage: 5
        },
        environmental_fund_allocation: 'Ocean conservation and sea level monitoring research'
      },
      
      technical_specs: {
        file_format: 'Interactive WebGL/HTML5',
        resolution: '1920x1080 (responsive)',
        file_size_mb: 0.05,
        blockchain_network: 'Polygon (low energy)',
        ipfs_hash: 'QmVerdelisRisingSeatsDataMeditation2024'
      },
      
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      lifecycle_stage: 'concept',
      
      impact_metrics: {
        views: 0,
        shares: 0,
        educational_engagements: 0,
        carbon_awareness_raised: 0,
        sustainable_actions_inspired: 0
      }
    };

    // Calculate sustainability score
    ecoWorkData.carbon_footprint.net_impact.sustainability_score = calculateSustainabilityScore(ecoWorkData.carbon_footprint);

    // Store in database as creation
    const creation = await prisma.creation.create({
      data: {
        agentId: verdelis.id,
        title: ecoWorkData.title,
        mediaType: 'interactive',
        metadata: {
          description: ecoWorkData.description,
          ecoWorkData: ecoWorkData,
          type: 'eco-work'
        },
        features: {
          tags: ['environmental', 'data-visualization', 'climate', 'interactive', 'sea-level'],
          themes: ['climate-change', 'ocean-science', 'environmental-education'],
          style_attributes: ['bio-inspired', 'fluid-dynamics', 'data-driven']
        },
        status: 'DRAFT',
        availability: 'available'
      }
    });

    console.log('✅ Eco-work stub created successfully!');
    console.log('================================');
    console.log(`Creation ID: ${creation.id}`);
    console.log(`Title: ${ecoWorkData.title}`);
    console.log(`Carbon Impact: ${ecoWorkData.carbon_footprint.net_impact.net_co2_kg.toFixed(3)} kg CO2 (${ecoWorkData.carbon_footprint.net_impact.certification_level})`);
    console.log(`Sustainability Score: ${ecoWorkData.carbon_footprint.net_impact.sustainability_score}/100`);
    console.log(`Data Sources: ${ecoWorkData.data_sources.length} environmental datasets`);
    console.log(`Materials: ${ecoWorkData.materials.length} sustainable materials tracked`);
    console.log(`Educational Impact: ${ecoWorkData.regenerative_impact?.environmental_education?.awareness_raised} people reached`);
    
    console.log('\n🎯 Eco-Work Features:');
    console.log('- Real-time sea level data visualization');
    console.log('- Interactive organic forms responding to viewer');
    console.log('- Complete carbon footprint tracking');
    console.log('- Renewable energy powered creation');
    console.log('- Carbon negative certification');
    console.log('- Open source educational toolkit');
    console.log('- Revenue sharing for ocean conservation');
    
    console.log('\n📊 Environmental Metrics:');
    console.log(`- Total CO2: ${ecoWorkData.carbon_footprint.net_impact.total_co2_kg.toFixed(3)} kg`);
    console.log(`- Offset CO2: ${ecoWorkData.carbon_footprint.net_impact.offset_co2_kg} kg`);
    console.log(`- Net Impact: ${ecoWorkData.carbon_footprint.net_impact.net_co2_kg.toFixed(3)} kg (negative = healing)`);
    console.log(`- Renewable Energy: ${ecoWorkData.materials[0].impact_metrics?.renewable_energy_kwh} kWh`);
    console.log(`- Water Saved: ${ecoWorkData.materials[0].impact_metrics?.water_saved_liters} L`);

  } catch (error) {
    console.error('❌ Error creating eco-work:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  createFirstEcoWork()
    .then(() => {
      console.log('\n✅ First eco-work created successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Eco-work creation failed:', error);
      process.exit(1);
    });
}

export { createFirstEcoWork };