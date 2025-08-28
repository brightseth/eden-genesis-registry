const { abrahamLore } = require('../eden-academy/src/data/agent-lore/abraham-lore');

async function testAbrahamSync() {
  console.log('🧪 Testing ABRAHAM lore sync with TRAINER JWT token...');

  const agentId = 'cmevs8l2j0004it1nmsroq66p'; // Abraham's agent ID
  const registryUrl = process.env.REGISTRY_BASE_URL || 'http://localhost:3000/api/v1';

  const lorePayload = {
    agentId,
    version: '1.0.0',
    identity: abrahamLore.identity,
    origin: abrahamLore.origin,
    philosophy: abrahamLore.philosophy,
    expertise: abrahamLore.expertise,
    voice: abrahamLore.voice,
    culture: abrahamLore.culture,
    personality: abrahamLore.personality,
    relationships: abrahamLore.relationships,
    currentContext: abrahamLore.currentContext,
    conversationFramework: abrahamLore.conversationFramework,
    knowledge: abrahamLore.knowledge,
    timeline: abrahamLore.timeline,
    artisticPractice: abrahamLore.artisticPractice
  };

  console.log('📝 Payload size:', JSON.stringify(lorePayload).length, 'bytes');

  try {
    const response = await fetch(
      `${registryUrl}/agents/${agentId}/lore`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.JWT_TOKEN}`
        },
        body: JSON.stringify(lorePayload)
      }
    );

    console.log('🔄 Response status:', response.status);
    
    if (response.ok) {
      const responseData = await response.json();
      console.log('✅ SUCCESS! Abraham lore synced to Registry');
      console.log('📊 Response keys:', Object.keys(responseData));
      return true;
    } else {
      const errorText = await response.text();
      console.log('❌ Sync failed:', response.status, errorText);
      return false;
    }
    
  } catch (error) {
    console.error('💥 Network error:', error.message);
    return false;
  }
}

testAbrahamSync();