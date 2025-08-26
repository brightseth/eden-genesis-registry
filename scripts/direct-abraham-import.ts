#!/usr/bin/env npx tsx
import fs from 'fs';

async function importAbrahamWorks() {
  // Read the Abraham works data
  const abrahamWorks = JSON.parse(
    fs.readFileSync('/Users/seth/eden-genesis-registry/data/migrations/abraham-works-1756225915304.json', 'utf8')
  );

  console.log(`Starting import of ${abrahamWorks.length} Abraham works...`);
  
  let successCount = 0;
  let errorCount = 0;
  
  // Import works in batches
  const batchSize = 10;
  for (let i = 0; i < Math.min(100, abrahamWorks.length); i += batchSize) {
    const batch = abrahamWorks.slice(i, i + batchSize);
    
    // Process batch in parallel
    const promises = batch.map(async (work: any, index: number) => {
      try {
        const workPayload = {
          media_type: 'image',
          metadata: {
            title: work.title || `Abraham Work #${work.dayNumber || 'Unknown'}`,
            description: work.prompt || work.description || 'Knowledge synthesis work',
            creation_url: `https://app.eden.art/creations/abraham-${work.dayNumber || work.id}`,
            source: 'eden.academy',
            dayNumber: work.dayNumber,
            model: work.model,
            academyId: work.id,
            originalFilename: work.originalFilename,
            knowledgeDomain: work.knowledgeDomain || [],
            synthesisLevel: work.synthesisLevel || 'basic',
            historicalPeriod: work.historicalPeriod || [],
            culturalContext: work.culturalContext || []
          },
          urls: {
            full: work.files?.[0]?.url || work.fileUrl,
            preview: work.files?.[0]?.url || work.fileUrl,
            thumbnail: work.files?.[0]?.url || work.fileUrl
          },
          status: 'PUBLISHED'
        };

        const response = await fetch('http://localhost:3005/api/v1/agents/abraham/works', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer registry-upload-key-v1',
            'idempotency-key': `abraham-${work.id || work.legacyId || Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          },
          body: JSON.stringify(workPayload)
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`✅ Imported work: ${work.title || work.id}`);
          return { success: true, work: result };
        } else {
          const error = await response.text();
          console.log(`❌ Failed work: ${work.title || work.id} - ${response.status}: ${error}`);
          return { success: false, error };
        }
      } catch (error) {
        console.log(`❌ Error importing work ${work.title || work.id}:`, error);
        return { success: false, error: error.message };
      }
    });

    const results = await Promise.all(promises);
    
    // Count results
    results.forEach(result => {
      if (result.success) {
        successCount++;
      } else {
        errorCount++;
      }
    });

    console.log(`Batch ${Math.floor(i / batchSize) + 1} complete. Success: ${successCount}, Errors: ${errorCount}`);
    
    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n📊 Import complete!`);
  console.log(`✅ Successfully imported: ${successCount} works`);
  console.log(`❌ Failed: ${errorCount} works`);
}

importAbrahamWorks().catch(console.error);