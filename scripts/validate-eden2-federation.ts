#!/usr/bin/env node
/**
 * Eden2.io Federation Alignment Validation Script
 * 
 * Validates that all components are properly aligned with Eden2.io federation architecture:
 * 1. Domain references updated from vercel.app to eden2.io
 * 2. Three-tier architecture fully implemented
 * 3. Registry-driven discovery working
 * 4. Academy integration validated
 * 5. Production environment compatibility
 */

import fs from 'fs'
import path from 'path'
import { registryClient } from '../src/lib/registry-client'

interface ValidationResult {
  category: string
  test: string
  status: 'PASS' | 'FAIL' | 'WARNING'
  message: string
  details?: any
}

class Eden2FederationValidator {
  private results: ValidationResult[] = []
  private readonly baseDir = process.cwd()

  private log(category: string, test: string, status: 'PASS' | 'FAIL' | 'WARNING', message: string, details?: any) {
    this.results.push({ category, test, status, message, details })
    const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️'
    console.log(`${icon} [${category}] ${test}: ${message}`)
    if (details) console.log(`   ${JSON.stringify(details, null, 2)}`)
  }

  async validateDomainReferences() {
    console.log('\n🔍 Validating Domain References...')
    
    // Check for remaining vercel.app references
    const criticalFiles = [
      'src/lib/cors.ts',
      'src/lib/registry-client.ts', 
      'src/app/agents/[handle]/page.tsx',
      'src/app/docs/apply/page.tsx',
      'src/app/docs/api/page.tsx',
      'src/app/api/v1/agents/[id]/works/route.ts'
    ]

    for (const file of criticalFiles) {
      const filePath = path.join(this.baseDir, file)
      
      if (!fs.existsSync(filePath)) {
        this.log('Domain', file, 'WARNING', 'File not found')
        continue
      }

      const content = fs.readFileSync(filePath, 'utf8')
      
      // Check for old vercel.app domains (excluding allowed exceptions)
      const vercelRefs = content.match(/https:\/\/eden-[^"'\s]+\.vercel\.app/g)
      if (vercelRefs && vercelRefs.length > 0) {
        this.log('Domain', file, 'FAIL', 'Still contains vercel.app references', vercelRefs)
      } else {
        this.log('Domain', file, 'PASS', 'No vercel.app references found')
      }

      // Check for correct eden2.io references
      const eden2Refs = content.match(/https:\/\/[^"'\s]+\.eden2\.io/g)
      if (eden2Refs && eden2Refs.length > 0) {
        this.log('Domain', file, 'PASS', 'Contains eden2.io references', eden2Refs)
      } else {
        this.log('Domain', file, 'WARNING', 'No eden2.io references found')
      }
    }
  }

  async validateThreeTierArchitecture() {
    console.log('\n🏗️ Validating Three-Tier Architecture...')
    
    // Get active agents from various sources
    const agents = ['abraham', 'solienne', 'bertha', 'citizen', 'sue', 'miyomi']
    
    for (const agent of agents) {
      // Check for Registry Profile (Tier 1) - handled by agents/[handle]/page.tsx
      const profilePath = path.join(this.baseDir, 'src/app/agents/[handle]/page.tsx')
      if (fs.existsSync(profilePath)) {
        this.log('Three-Tier', `${agent} Profile`, 'PASS', 'Registry profile route exists')
      } else {
        this.log('Three-Tier', `${agent} Profile`, 'FAIL', 'Registry profile route missing')
      }

      // Check for Agent Site (Tier 2)
      const sitePath = path.join(this.baseDir, `src/app/sites/${agent}/page.tsx`)
      if (fs.existsSync(sitePath)) {
        this.log('Three-Tier', `${agent} Site`, 'PASS', 'Agent site page exists')
      } else {
        this.log('Three-Tier', `${agent} Site`, 'FAIL', 'Agent site page missing')
      }

      // Check for Agent Dashboard (Tier 3)
      const dashboardPath = path.join(this.baseDir, `src/app/dashboard/${agent}/page.tsx`)
      if (fs.existsSync(dashboardPath)) {
        this.log('Three-Tier', `${agent} Dashboard`, 'PASS', 'Agent dashboard page exists')
      } else {
        this.log('Three-Tier', `${agent} Dashboard`, 'FAIL', 'Agent dashboard page missing')
      }
    }
  }

  async validateRegistryDrivenDiscovery() {
    console.log('\n🔄 Validating Registry-Driven Discovery...')
    
    // Check agent-shell generateStaticParams
    const agentShellPath = path.join(this.baseDir, 'apps/agent-shell/src/app/[agent]/page.tsx')
    
    if (!fs.existsSync(agentShellPath)) {
      this.log('Registry-Discovery', 'Agent Shell', 'WARNING', 'Agent shell not found')
      return
    }

    const content = fs.readFileSync(agentShellPath, 'utf8')
    
    // Check if using Registry API call instead of hardcoded list
    if (content.includes('fetch') && content.includes('api/v1/agents')) {
      this.log('Registry-Discovery', 'Agent Shell', 'PASS', 'Uses Registry API for discovery')
    } else {
      this.log('Registry-Discovery', 'Agent Shell', 'FAIL', 'Still uses hardcoded agent list')
    }

    // Check fallback mechanism
    if (content.includes('fallbackAgents') || content.includes('catch (error)')) {
      this.log('Registry-Discovery', 'Fallback', 'PASS', 'Has fallback mechanism for offline Registry')
    } else {
      this.log('Registry-Discovery', 'Fallback', 'WARNING', 'No fallback mechanism found')
    }
  }

  async validateRegistryClientConfiguration() {
    console.log('\n🔌 Validating Registry Client Configuration...')
    
    // Check Registry client base URL
    const registryClientPath = path.join(this.baseDir, 'src/lib/registry-client.ts')
    
    if (!fs.existsSync(registryClientPath)) {
      this.log('Registry-Config', 'Client', 'FAIL', 'Registry client not found')
      return
    }

    const content = fs.readFileSync(registryClientPath, 'utf8')
    
    if (content.includes('registry.eden2.io')) {
      this.log('Registry-Config', 'Base URL', 'PASS', 'Uses eden2.io domain')
    } else {
      this.log('Registry-Config', 'Base URL', 'FAIL', 'Does not use eden2.io domain')
    }

    // Test Registry client connection (if possible)
    try {
      // This will only work if Registry is actually available
      const response = await registryClient.agents.list({ limit: 1 })
      this.log('Registry-Config', 'Connection', 'PASS', `Registry accessible, ${response.data.length} agents found`)
    } catch (error) {
      this.log('Registry-Config', 'Connection', 'WARNING', 'Registry not accessible', error.message)
    }
  }

  async validateEnvironmentCompatibility() {
    console.log('\n🌍 Validating Environment Compatibility...')
    
    // Check environment variables setup
    const requiredEnvVars = [
      'REGISTRY_BASE_URL',
      'REGISTRY_VALIDATION_AGENT',
      'REGISTRY_VALIDATION_LORE', 
      'REGISTRY_VALIDATION_PROFILE'
    ]

    for (const envVar of requiredEnvVars) {
      if (process.env[envVar]) {
        this.log('Environment', envVar, 'PASS', `Set to: ${process.env[envVar]}`)
      } else {
        this.log('Environment', envVar, 'WARNING', 'Environment variable not set')
      }
    }

    // Check for production-ready configuration
    const nextConfigPath = path.join(this.baseDir, 'next.config.js')
    
    if (fs.existsSync(nextConfigPath)) {
      const content = fs.readFileSync(nextConfigPath, 'utf8')
      
      if (content.includes('eden2.io')) {
        this.log('Environment', 'Next.js Config', 'PASS', 'Includes eden2.io domain patterns')
      } else {
        this.log('Environment', 'Next.js Config', 'WARNING', 'No eden2.io domain patterns found')
      }

      // Check for proper image domain configuration
      if (content.includes('images') && content.includes('remotePatterns')) {
        this.log('Environment', 'Image Domains', 'PASS', 'Remote image patterns configured')
      } else {
        this.log('Environment', 'Image Domains', 'WARNING', 'Image domain configuration not found')
      }
    } else {
      this.log('Environment', 'Next.js Config', 'FAIL', 'next.config.js not found')
    }
  }

  async validateCORSConfiguration() {
    console.log('\n🔒 Validating CORS Configuration...')
    
    const corsPath = path.join(this.baseDir, 'src/lib/cors.ts')
    
    if (!fs.existsSync(corsPath)) {
      this.log('CORS', 'Config File', 'FAIL', 'CORS configuration not found')
      return
    }

    const content = fs.readFileSync(corsPath, 'utf8')
    
    // Check for eden2.io domains
    const eden2Domains = [
      'registry.eden2.io',
      'academy.eden2.io', 
      'studio.eden2.io',
      'curator.eden2.io'
    ]

    for (const domain of eden2Domains) {
      if (content.includes(domain)) {
        this.log('CORS', domain, 'PASS', 'Domain included in CORS config')
      } else {
        this.log('CORS', domain, 'WARNING', 'Domain not in CORS config')
      }
    }

    // Check that old vercel.app domains are replaced
    if (content.includes('eden-academy-flame.vercel.app')) {
      this.log('CORS', 'Legacy Domains', 'FAIL', 'Still contains legacy vercel.app domains')
    } else {
      this.log('CORS', 'Legacy Domains', 'PASS', 'Legacy domains removed')
    }
  }

  async generateReport() {
    console.log('\n📊 Generating Validation Report...')
    
    const passed = this.results.filter(r => r.status === 'PASS').length
    const failed = this.results.filter(r => r.status === 'FAIL').length
    const warnings = this.results.filter(r => r.status === 'WARNING').length
    
    const reportContent = `# Eden2.io Federation Validation Report
Generated: ${new Date().toISOString()}

## Summary
- ✅ Passed: ${passed}
- ❌ Failed: ${failed}  
- ⚠️ Warnings: ${warnings}
- Total Tests: ${this.results.length}

## Results by Category

${Object.entries(this.groupResultsByCategory()).map(([category, results]) => `
### ${category}
${results.map(r => `- ${r.status === 'PASS' ? '✅' : r.status === 'FAIL' ? '❌' : '⚠️'} ${r.test}: ${r.message}`).join('\n')}
`).join('\n')}

## Failed Tests
${this.results.filter(r => r.status === 'FAIL').map(r => `
### ❌ ${r.category} - ${r.test}
**Message**: ${r.message}
${r.details ? `**Details**: \`\`\`json\n${JSON.stringify(r.details, null, 2)}\n\`\`\`` : ''}
`).join('\n')}

## Action Items
${failed > 0 ? `
### Critical Issues (${failed})
These must be fixed before production deployment:
${this.results.filter(r => r.status === 'FAIL').map(r => `- Fix ${r.category}: ${r.test}`).join('\n')}
` : '✅ No critical issues found'}

${warnings > 0 ? `
### Warnings (${warnings})
These should be addressed for optimal functionality:
${this.results.filter(r => r.status === 'WARNING').map(r => `- Review ${r.category}: ${r.test}`).join('\n')}
` : '✅ No warnings'}

## Production Readiness
${failed === 0 ? '✅ **READY FOR PRODUCTION**' : `❌ **NOT READY**: ${failed} critical issues must be resolved`}

## Environment Setup
For production deployment, ensure these environment variables are set:
\`\`\`bash
REGISTRY_BASE_URL=https://registry.eden2.io
REGISTRY_VALIDATION_AGENT=enforce
REGISTRY_VALIDATION_LORE=enforce
REGISTRY_VALIDATION_PROFILE=enforce
\`\`\`
`

    const reportPath = path.join(this.baseDir, 'EDEN2-FEDERATION-VALIDATION.md')
    fs.writeFileSync(reportPath, reportContent)
    
    console.log(`\n📄 Report saved to: ${reportPath}`)
    
    return {
      passed,
      failed,
      warnings,
      total: this.results.length,
      productionReady: failed === 0
    }
  }

  private groupResultsByCategory() {
    return this.results.reduce((acc, result) => {
      if (!acc[result.category]) acc[result.category] = []
      acc[result.category].push(result)
      return acc
    }, {} as Record<string, ValidationResult[]>)
  }

  async runAllValidations() {
    console.log('🚀 Starting Eden2.io Federation Validation...\n')
    
    await this.validateDomainReferences()
    await this.validateThreeTierArchitecture()
    await this.validateRegistryDrivenDiscovery()
    await this.validateRegistryClientConfiguration()
    await this.validateEnvironmentCompatibility()
    await this.validateCORSConfiguration()
    
    return await this.generateReport()
  }
}

// Main execution
async function main() {
  const validator = new Eden2FederationValidator()
  
  try {
    const report = await validator.runAllValidations()
    
    console.log('\n🎯 Validation Complete!')
    console.log(`✅ Passed: ${report.passed}`)
    console.log(`❌ Failed: ${report.failed}`)
    console.log(`⚠️ Warnings: ${report.warnings}`)
    console.log(`📊 Total: ${report.total}`)
    
    if (report.productionReady) {
      console.log('\n🎉 READY FOR PRODUCTION DEPLOYMENT!')
      process.exit(0)
    } else {
      console.log(`\n⚠️ ${report.failed} critical issues must be resolved before production`)
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Validation failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main().catch(console.error)
}

export { Eden2FederationValidator }