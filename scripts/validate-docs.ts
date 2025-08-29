#!/usr/bin/env tsx

/**
 * Validate documentation structure and integrity
 * Used by CI/CD pipeline to gate deployments
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
}

function validateDocs(): ValidationResult {
  const result: ValidationResult = {
    passed: true,
    errors: [],
    warnings: []
  };

  console.log('🔍 Validating Eden Documentation...\n');

  // Check required documentation files
  const requiredDocs = [
    'docs/overview.md',
    'docs/contracts.md', 
    'docs/runbook.md',
    'docs/three-tier-pattern.md'
  ];

  for (const docPath of requiredDocs) {
    if (!existsSync(docPath)) {
      result.errors.push(`Missing required documentation: ${docPath}`);
      result.passed = false;
    } else {
      console.log(`✅ ${docPath} exists`);
    }
  }

  // Validate OpenAPI spec exists
  if (!existsSync('openapi.yaml')) {
    result.errors.push('Missing OpenAPI specification: openapi.yaml');
    result.passed = false;
  } else {
    console.log('✅ openapi.yaml exists');
  }

  // Check that contracts.md is up to date with OpenAPI
  if (existsSync('docs/contracts.md') && existsSync('openapi.yaml')) {
    const contractsContent = readFileSync('docs/contracts.md', 'utf8');
    const openApiContent = readFileSync('openapi.yaml', 'utf8');
    
    // Check if contracts contains auto-generated marker
    if (!contractsContent.includes('*Auto-generated from OpenAPI specification')) {
      result.warnings.push('Contracts documentation may not be auto-generated from OpenAPI spec');
    }
    
    // Validate that key endpoints are documented
    const keyEndpoints = ['/agents', '/applications', '/auth/magic'];
    for (const endpoint of keyEndpoints) {
      if (!contractsContent.includes(endpoint)) {
        result.errors.push(`Missing endpoint documentation: ${endpoint}`);
        result.passed = false;
      }
    }
  }

  // Validate agent coverage in documentation
  const agents = ['abraham', 'solienne', 'citizen', 'bertha', 'miyomi', 'geppetto', 'koru', 'sue', 'bart'];
  
  if (existsSync('docs/overview.md')) {
    const overviewContent = readFileSync('docs/overview.md', 'utf8');
    const missingAgents = agents.filter(agent => !overviewContent.toLowerCase().includes(agent.toLowerCase()));
    
    if (missingAgents.length > 0) {
      result.warnings.push(`Agents not mentioned in overview: ${missingAgents.join(', ')}`);
    }
  }

  // Check three-tier pattern documentation
  if (existsSync('docs/three-tier-pattern.md')) {
    const patternContent = readFileSync('docs/three-tier-pattern.md', 'utf8');
    const requiredPatterns = [
      '/academy/agent/',
      '/sites/',
      '/dashboard/'
    ];
    
    for (const pattern of requiredPatterns) {
      if (!patternContent.includes(pattern)) {
        result.errors.push(`Three-tier pattern missing tier: ${pattern}`);
        result.passed = false;
      }
    }
  }

  // Check for hardcoded secrets
  for (const docPath of requiredDocs) {
    if (existsSync(docPath)) {
      const content = readFileSync(docPath, 'utf8');
      
      // Check for API keys
      if (content.includes('sk-') || content.includes('eyJ')) {
        result.errors.push(`Potential hardcoded secret in ${docPath}`);
        result.passed = false;
      }
      
      // Check for production URLs that should be variables
      if (content.includes('localhost:') && !docPath.includes('runbook')) {
        result.warnings.push(`Localhost URL found in ${docPath} - consider using environment variables`);
      }
    }
  }

  // Validate markdown structure
  for (const docPath of requiredDocs) {
    if (existsSync(docPath)) {
      const content = readFileSync(docPath, 'utf8');
      const lines = content.split('\n');
      
      // Check for proper heading structure
      if (!lines[0].startsWith('# ')) {
        result.errors.push(`${docPath} missing top-level heading`);
        result.passed = false;
      }
      
      // Check for empty files
      if (content.trim().length === 0) {
        result.errors.push(`${docPath} is empty`);
        result.passed = false;
      }
    }
  }

  return result;
}

function printResults(result: ValidationResult) {
  console.log('\n📊 Validation Results:');
  
  if (result.errors.length > 0) {
    console.log('\n❌ Errors:');
    result.errors.forEach(error => console.log(`   • ${error}`));
  }
  
  if (result.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    result.warnings.forEach(warning => console.log(`   • ${warning}`));
  }
  
  if (result.passed) {
    console.log('\n✅ All documentation validations passed!');
  } else {
    console.log('\n❌ Documentation validation failed');
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const result = validateDocs();
  printResults(result);
  process.exit(result.passed ? 0 : 1);
}

export { validateDocs };