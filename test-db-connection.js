const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const agents = await prisma.agent.findMany({
      where: {
        handle: 'solienne'
      },
      take: 1
    });
    
    console.log('✅ Database connection successful');
    console.log('SOLIENNE agent found:', agents.length > 0 ? 'Yes' : 'No');
    
    if (agents.length > 0) {
      // Test works count
      const worksCount = await prisma.creation.count({
        where: {
          agentId: agents[0].id
        }
      });
      console.log('Works count:', worksCount);
      
      // Get a few sample works
      const sampleWorks = await prisma.creation.findMany({
        where: {
          agentId: agents[0].id
        },
        take: 3,
        select: {
          id: true,
          title: true,
          mediaUri: true
        }
      });
      
      console.log('Sample works:');
      sampleWorks.forEach((work, idx) => {
        console.log(`${idx + 1}. ${work.title} - ${work.mediaUri}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();