#!/usr/bin/env node

// This script seeds the production database via API
// Run with: npx tsx scripts/seed-production.ts

const PRODUCTION_URL = 'https://eden-genesis-registry.vercel.app';

async function seedProduction() {
  console.log('🌱 Seeding production database via API...');
  
  try {
    // First check current status
    const statusRes = await fetch(`${PRODUCTION_URL}/api/v1/agents`);
    const statusData = await statusRes.json();
    
    console.log(`Current agents in production: ${statusData.totalCount || 0}`);
    
    if ((statusData.totalCount || 0) > 0) {
      console.log('✅ Production already has agents. Skipping seed.');
      return;
    }
    
    // Trigger seed via a special endpoint (we'll need to create this)
    console.log('📝 No agents found. Production needs seeding.');
    console.log('Please run the following in production:');
    console.log('1. Connect to your production database');
    console.log('2. Run: npx prisma db push');
    console.log('3. Run: npx prisma db seed');
    
  } catch (error) {
    console.error('❌ Error checking production:', error);
  }
}

seedProduction();