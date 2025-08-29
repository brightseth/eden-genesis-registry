/**
 * Test Registry System
 * Validate schema validation, write gates, and webhooks
 */

import { getValidationStatus, validateWithGates } from './src/lib/validation-gates'
import { checkWriteGate, WriteOperation, getWriteGatesSummary } from './src/lib/write-gates'
import { Role } from '@prisma/client'

async function testValidationSystem() {
  console.log('🧪 Testing Registry Validation System...\n')

  // Test validation status
  console.log('1️⃣ Validation Status:')
  const status = getValidationStatus()
  console.log(JSON.stringify(status, null, 2))
  console.log()

  // Test validation with gates - use simplified data with validation bypass
  console.log('2️⃣ Testing Validation Gates:')
  
  // Test with minimal valid agent data instead of complex lore
  const testAgentData = {
    handle: 'test-agent',
    displayName: 'Test Agent',
    role: 'CREATOR',
    status: 'TRAINING', 
    timezone: 'America/New_York',
    languages: ['en']
  }

  const validationResult = validateWithGates('agent', testAgentData)
  console.log(`Agent validation: ${validationResult.valid ? '✅ Valid' : '❌ Invalid'}`)
  if (!validationResult.valid && validationResult.errors) {
    console.log('Errors:', validationResult.errors.slice(0, 3).map(e => `${e.path.join('.')}: ${e.message}`))
  }
  if (validationResult.warnings) {
    console.log('Warnings:', validationResult.warnings?.slice(0, 3))
  }
  console.log()

  // Test write gates
  console.log('3️⃣ Testing Write Gates:')
  
  const testContext = {
    userId: 'test-user',
    userRole: Role.TRAINER,
    agentId: 'test-agent',
    operation: WriteOperation.UPDATE as WriteOperation,
    collection: 'lore'
  }

  const writeResult = checkWriteGate('lore', WriteOperation.UPDATE, testContext)
  console.log(`TRAINER lore write: ${writeResult.allowed ? '✅ Allowed' : '❌ Denied'}`)
  if (!writeResult.allowed) {
    console.log('Reason:', writeResult.reason)
  }

  const adminStatusContext = {
    userId: 'test-user', 
    userRole: Role.ADMIN,
    agentId: 'test-agent',
    operation: WriteOperation.UPDATE as WriteOperation,
    collection: 'agent_status'
  }

  const adminResult = checkWriteGate('agent_status', WriteOperation.UPDATE, adminStatusContext)
  console.log(`ADMIN status write: ${adminResult.allowed ? '✅ Allowed' : '❌ Denied'}`)
  
  const trainerStatusContext = {
    ...adminStatusContext,
    userRole: Role.TRAINER
  }
  
  const trainerResult = checkWriteGate('agent_status', WriteOperation.UPDATE, trainerStatusContext)
  console.log(`TRAINER status write: ${trainerResult.allowed ? '✅ Allowed' : '❌ Denied'}`)
  if (!trainerResult.allowed) {
    console.log('Reason:', trainerResult.reason)
  }
  console.log()

  // Test write gates summary
  console.log('4️⃣ Write Gates Summary:')
  const summary = getWriteGatesSummary()
  Object.entries(summary).forEach(([collection, gates]) => {
    console.log(`${collection}:`)
    Object.entries(gates.operations).forEach(([op, config]) => {
      console.log(`  ${op}: ${config.requiredRole}`)
    })
  })
  
  console.log('\n✅ Registry System Tests Complete!')
}

// Run tests
testValidationSystem().catch(console.error)