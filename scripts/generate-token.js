const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function generateToken() {
  try {
    console.log('🔧 Generating Academy JWT token...');
    
    // Get the Academy admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'academy@eden.art' }
    });
    
    if (!adminUser) {
      console.error('❌ Admin user not found');
      process.exit(1);
    }

    // Generate JWT token
    const payload = {
      userId: adminUser.id,
      email: adminUser.email,
      role: adminUser.role
    };
    
    const token = jwt.sign(payload, 'dev-registry-jwt-secret-2024', { expiresIn: '7d' });
    
    console.log('🔑 Academy JWT Token Generated:');
    console.log('\n' + token + '\n');
    console.log('💡 Role:', adminUser.role);
    console.log('📧 Email:', adminUser.email);
    
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('❌ Token generation failed:', error.message);
    process.exit(1);
  }
}

generateToken();