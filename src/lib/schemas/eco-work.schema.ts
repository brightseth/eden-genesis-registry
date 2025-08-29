import { z } from 'zod';

// Material sourcing and sustainability metrics
export const MaterialSourceSchema = z.object({
  name: z.string(),
  category: z.enum(['renewable_energy', 'carbon_offset', 'sustainable_compute', 'green_hosting', 'recycled_data']),
  source: z.string(),
  sustainability_rating: z.number().min(1).max(5), // 1-5 sustainability score
  certification: z.string().optional(), // e.g., "Carbon Trust Certified", "Green Web Foundation"
  impact_metrics: z.object({
    carbon_saved_kg: z.number().default(0),
    renewable_energy_kwh: z.number().default(0),
    water_saved_liters: z.number().default(0),
    waste_reduced_kg: z.number().default(0)
  }).optional()
});

// Carbon footprint calculation schema
export const CarbonFootprintSchema = z.object({
  creation_phase: z.object({
    compute_kwh: z.number(), // kWh used for AI generation
    electricity_source: z.enum(['renewable', 'grid_mix', 'coal', 'natural_gas', 'nuclear', 'mixed']),
    co2_kg: z.number(), // kg CO2 equivalent
    duration_hours: z.number(),
    gpu_hours: z.number().optional(),
    model_size_params: z.number().optional() // Model parameters in billions
  }),
  
  storage_phase: z.object({
    storage_gb: z.number(),
    hosting_provider: z.string(),
    green_hosting: z.boolean(),
    annual_co2_kg: z.number(), // Annual CO2 for storage
    data_centers: z.array(z.string()).optional() // Geographic locations
  }),
  
  distribution_phase: z.object({
    estimated_views: z.number(),
    bandwidth_gb: z.number(),
    cdn_co2_kg: z.number(),
    user_device_co2_kg: z.number().optional()
  }),
  
  offset_measures: z.object({
    carbon_credits_purchased: z.number().default(0), // kg CO2 offset
    renewable_energy_credits: z.number().default(0),
    tree_planting_count: z.number().default(0),
    direct_air_capture_kg: z.number().default(0),
    total_offset_co2_kg: z.number()
  }).optional(),
  
  net_impact: z.object({
    total_co2_kg: z.number(), // Total carbon footprint
    offset_co2_kg: z.number().default(0), // Total offsets
    net_co2_kg: z.number(), // Net carbon impact (can be negative)
    sustainability_score: z.number().min(0).max(100), // 0-100 sustainability score
    certification_level: z.enum(['carbon_negative', 'carbon_neutral', 'low_carbon', 'standard', 'high_carbon'])
  })
});

// Regenerative impact metrics
export const RegenerativeImpactSchema = z.object({
  environmental_education: z.object({
    awareness_raised: z.number().default(0), // Estimated people reached
    topics_covered: z.array(z.string()),
    educational_resources: z.array(z.string()).optional()
  }).optional(),
  
  biodiversity_support: z.object({
    habitats_supported: z.array(z.string()).optional(),
    species_featured: z.array(z.string()).optional(),
    conservation_partnerships: z.array(z.string()).optional()
  }).optional(),
  
  community_impact: z.object({
    local_communities: z.array(z.string()).optional(),
    economic_benefit_usd: z.number().default(0),
    jobs_supported: z.number().default(0)
  }).optional(),
  
  innovation_contribution: z.object({
    research_contributions: z.array(z.string()).optional(),
    open_source_tools: z.array(z.string()).optional(),
    methodology_sharing: z.boolean().default(false)
  }).optional()
});

// Complete eco-work schema
export const EcoWorkSchema = z.object({
  // Basic work information
  id: z.string(),
  title: z.string(),
  description: z.string(),
  artist_agent_id: z.string(),
  
  // Creative metadata
  medium: z.array(z.string()), // e.g., ["data_visualization", "generative_art"]
  style: z.string(),
  dimensions: z.string().optional(),
  duration_seconds: z.number().optional(), // For video/audio works
  
  // Environmental data sources
  data_sources: z.array(z.object({
    name: z.string(),
    type: z.enum(['climate_data', 'biodiversity_data', 'pollution_data', 'renewable_energy_data', 'ecosystem_data']),
    source_url: z.string().url().optional(),
    data_date_range: z.object({
      start: z.string(), // ISO date
      end: z.string()    // ISO date
    }).optional(),
    geographic_scope: z.string().optional() // e.g., "Global", "California", "Amazon Rainforest"
  })),
  
  // Materials and sustainability
  materials: z.array(MaterialSourceSchema),
  carbon_footprint: CarbonFootprintSchema,
  regenerative_impact: RegenerativeImpactSchema.optional(),
  
  // Certification and verification
  sustainability_certifications: z.array(z.object({
    issuer: z.string(),
    certificate_id: z.string(),
    issue_date: z.string(),
    expiry_date: z.string().optional(),
    verification_url: z.string().url().optional()
  })).optional(),
  
  // Economic model
  economic_model: z.object({
    pricing_usd: z.number().optional(),
    revenue_sharing: z.object({
      artist_percentage: z.number(),
      environmental_fund_percentage: z.number(),
      carbon_offset_percentage: z.number(),
      platform_percentage: z.number()
    }).optional(),
    environmental_fund_allocation: z.string().optional() // Description of how funds are used
  }).optional(),
  
  // Technical metadata
  technical_specs: z.object({
    file_format: z.string(),
    resolution: z.string().optional(),
    file_size_mb: z.number(),
    blockchain_network: z.string().optional(),
    smart_contract: z.string().optional(),
    ipfs_hash: z.string().optional()
  }),
  
  // Timestamps and lifecycle
  created_at: z.string(), // ISO timestamp
  updated_at: z.string(), // ISO timestamp
  published_at: z.string().optional(),
  lifecycle_stage: z.enum(['concept', 'creation', 'review', 'published', 'archived']),
  
  // Engagement metrics
  impact_metrics: z.object({
    views: z.number().default(0),
    shares: z.number().default(0),
    educational_engagements: z.number().default(0),
    carbon_awareness_raised: z.number().default(0), // Estimated kg CO2 awareness
    sustainable_actions_inspired: z.number().default(0)
  }).optional()
});

// Type exports
export type MaterialSource = z.infer<typeof MaterialSourceSchema>;
export type CarbonFootprint = z.infer<typeof CarbonFootprintSchema>;
export type RegenerativeImpact = z.infer<typeof RegenerativeImpactSchema>;
export type EcoWork = z.infer<typeof EcoWorkSchema>;

// Validation helpers
export const validateEcoWork = (data: unknown) => {
  return EcoWorkSchema.parse(data);
};

export const calculateSustainabilityScore = (footprint: CarbonFootprint): number => {
  const { net_impact } = footprint;
  const netCO2 = net_impact.net_co2_kg;
  
  // Scoring logic: 
  // Carbon negative (< 0 kg): 90-100 points
  // Carbon neutral (0 kg): 80-89 points  
  // Low carbon (< 1 kg): 60-79 points
  // Standard (1-5 kg): 40-59 points
  // High carbon (> 5 kg): 0-39 points
  
  if (netCO2 < 0) {
    return Math.min(100, 90 + Math.abs(netCO2) * 2); // More negative = higher score
  } else if (netCO2 === 0) {
    return 85;
  } else if (netCO2 < 1) {
    return 70 - (netCO2 * 10); // 60-70 range
  } else if (netCO2 < 5) {
    return 50 - ((netCO2 - 1) * 2.5); // 40-50 range  
  } else {
    return Math.max(0, 40 - ((netCO2 - 5) * 2)); // 0-40 range
  }
};

// Carbon footprint estimation utilities
export const estimateComputeCO2 = (kWh: number, energySource: string): number => {
  // CO2 kg per kWh by energy source
  const co2Factors: Record<string, number> = {
    renewable: 0.02,  // Solar/wind/hydro
    nuclear: 0.12,    // Nuclear power
    natural_gas: 0.49, // Natural gas
    grid_mix: 0.55,   // Average grid mix (varies by region)
    coal: 0.82,       // Coal power
    mixed: 0.45       // Mixed sources
  };
  
  return kWh * (co2Factors[energySource] || co2Factors.grid_mix);
};

export const estimateStorageCO2 = (storageGB: number, isGreenHosting: boolean): number => {
  // Annual CO2 per GB storage
  const baseCO2PerGB = 0.5; // kg CO2 per GB per year (industry average)
  return storageGB * baseCO2PerGB * (isGreenHosting ? 0.1 : 1.0); // 90% reduction for green hosting
};