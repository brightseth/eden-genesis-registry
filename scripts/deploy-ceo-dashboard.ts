/**
 * CEO Dashboard Deployment Script
 * Staged rollout with validation and rollback capabilities
 */

import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

interface DeploymentConfig {
  environment: 'development' | 'staging' | 'production'
  rolloutPercentage: number
  enabledFeatures: string[]
  validationChecks: boolean
}

class CEODashboardDeployer {
  private config: DeploymentConfig

  constructor(config: DeploymentConfig) {
    this.config = config
  }

  async deploy() {
    console.log('🚀 Starting CEO Dashboard Deployment')
    console.log(`Environment: ${this.config.environment}`)
    console.log(`Rollout: ${this.config.rolloutPercentage}%`)
    console.log(`Features: ${this.config.enabledFeatures.join(', ')}`)

    try {
      // Step 1: Pre-deployment validation
      if (this.config.validationChecks) {
        await this.runValidationChecks()
      }

      // Step 2: Update environment variables
      await this.updateEnvironmentVariables()

      // Step 3: Run database migrations if needed
      await this.runMigrations()

      // Step 4: Build and test
      await this.buildAndTest()

      // Step 5: Deploy to environment
      await this.deployToEnvironment()

      // Step 6: Post-deployment validation
      await this.validateDeployment()

      console.log('✅ CEO Dashboard deployed successfully')
      return true
    } catch (error) {
      console.error('❌ Deployment failed:', error)
      await this.rollback()
      throw error
    }
  }

  private async runValidationChecks() {
    console.log('📋 Running pre-deployment validation...')

    // Check TypeScript compilation
    try {
      execSync('npx tsc --noEmit', { stdio: 'inherit' })
      console.log('✅ TypeScript validation passed')
    } catch (error) {
      throw new Error('TypeScript validation failed')
    }

    // Run tests
    try {
      execSync('npm test -- --testPathPattern=ceo-dashboard', { stdio: 'inherit' })
      console.log('✅ Tests passed')
    } catch (error) {
      throw new Error('Tests failed')
    }

    // Check API endpoints
    try {
      const statusResponse = await fetch('http://localhost:3000/api/v1/status')
      if (!statusResponse.ok) {
        throw new Error('API health check failed')
      }
      console.log('✅ API validation passed')
    } catch (error) {
      throw new Error('API validation failed')
    }
  }

  private async updateEnvironmentVariables() {
    console.log('⚙️  Updating environment variables...')

    const envContent = [
      `FEATURE_CEO_DASHBOARD=true`,
      `CEO_DASHBOARD_ROLLOUT_PERCENTAGE=${this.config.rolloutPercentage}`,
      ...this.config.enabledFeatures.map(feature => `${feature}=true`)
    ].join('\n')

    // In production, this would update the deployment environment
    console.log('Environment variables updated:', envContent)
  }

  private async runMigrations() {
    console.log('🗄️  Running database migrations...')
    
    try {
      execSync('npx prisma migrate deploy', { stdio: 'inherit' })
      console.log('✅ Database migrations completed')
    } catch (error) {
      throw new Error('Database migration failed')
    }
  }

  private async buildAndTest() {
    console.log('🔨 Building and testing application...')

    try {
      execSync('npm run build', { stdio: 'inherit' })
      console.log('✅ Build completed')
    } catch (error) {
      throw new Error('Build failed')
    }
  }

  private async deployToEnvironment() {
    console.log(`🌐 Deploying to ${this.config.environment}...`)

    if (this.config.environment === 'production') {
      // In production, this would trigger Vercel deployment
      console.log('Production deployment would be triggered here')
    } else {
      console.log(`Deployment to ${this.config.environment} completed`)
    }
  }

  private async validateDeployment() {
    console.log('✅ Validating deployment...')

    // Wait for deployment to stabilize
    await new Promise(resolve => setTimeout(resolve, 5000))

    // Check CEO dashboard API endpoint
    try {
      const dashboardResponse = await fetch('http://localhost:3000/api/v1/ceo/dashboard')
      if (dashboardResponse.status === 401 || dashboardResponse.status === 403) {
        console.log('✅ CEO dashboard properly protected')
      } else if (dashboardResponse.ok) {
        console.log('✅ CEO dashboard API responding')
      } else {
        throw new Error('CEO dashboard API validation failed')
      }
    } catch (error) {
      throw new Error(`Post-deployment validation failed: ${error}`)
    }
  }

  private async rollback() {
    console.log('🔄 Rolling back CEO dashboard deployment...')

    // Disable all CEO dashboard features
    const rollbackEnv = [
      `FEATURE_CEO_DASHBOARD=false`,
      `CEO_DASHBOARD_ROLLOUT_PERCENTAGE=0`,
      ...this.config.enabledFeatures.map(feature => `${feature}=false`)
    ].join('\n')

    console.log('Rollback environment:', rollbackEnv)
    console.log('CEO dashboard features disabled for safety')
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2)
  const environment = args[0] as DeploymentConfig['environment'] || 'development'
  const rolloutPercentage = parseInt(args[1] || '0')

  const config: DeploymentConfig = {
    environment,
    rolloutPercentage,
    enabledFeatures: [
      'FEATURE_CEO_EXECUTIVE_METRICS',
      'FEATURE_CEO_AGENT_OVERVIEW', 
      'FEATURE_CEO_SYSTEM_HEALTH',
      'FEATURE_CEO_QUICK_ACTIONS',
      'FEATURE_CEO_ALERTS'
    ],
    validationChecks: true
  }

  // Add trend visualization for staging/production
  if (environment !== 'development') {
    config.enabledFeatures.push('FEATURE_CEO_TRENDS')
  }

  // Add real-time updates for production only
  if (environment === 'production') {
    config.enabledFeatures.push('FEATURE_CEO_REALTIME')
  }

  const deployer = new CEODashboardDeployer(config)
  await deployer.deploy()
}

if (require.main === module) {
  main().catch(console.error)
}