#!/usr/bin/env npx tsx

/**
 * Eden Registry SDK Generator
 * 
 * Generates TypeScript SDK from OpenAPI specification per ADR-019
 * Replaces raw fetch patterns with type-safe generated client
 */

import { writeFileSync, readFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import YAML from 'yaml'

interface OpenAPISchema {
  openapi: string
  info: { title: string; version: string }
  servers: Array<{ url: string; description: string }>
  paths: Record<string, Record<string, any>>
  components: { schemas: Record<string, any> }
}

interface SDKMethod {
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  parameters?: Array<{ name: string; type: string; required: boolean }>
  requestBody?: { type: string }
  response: { type: string }
  description: string
}

class EdenSDKGenerator {
  private schema: OpenAPISchema
  private outputDir: string
  
  constructor(schemaPath: string, outputDir: string) {
    const schemaContent = readFileSync(schemaPath, 'utf-8')
    this.schema = YAML.parse(schemaContent)
    this.outputDir = outputDir
    
    // Ensure output directory exists
    mkdirSync(this.outputDir, { recursive: true })
  }
  
  generate() {
    console.log('🔧 Generating Eden Registry SDK...')
    
    const methods = this.extractMethods()
    const types = this.extractTypes()
    
    this.generateTypes(types)
    this.generateClient(methods)
    this.generateIndex()
    
    console.log('✅ SDK generation complete!')
    console.log(`📁 Generated files in: ${this.outputDir}`)
  }
  
  private extractMethods(): SDKMethod[] {
    const methods: SDKMethod[] = []
    
    Object.entries(this.schema.paths).forEach(([path, pathObj]) => {
      Object.entries(pathObj).forEach(([httpMethod, operation]) => {
        if (!['get', 'post', 'put', 'patch', 'delete'].includes(httpMethod)) return
        
        const method: SDKMethod = {
          name: this.generateMethodName(httpMethod, path, operation),
          method: httpMethod.toUpperCase() as any,
          path,
          description: operation.summary || operation.description || '',
          response: this.extractResponseType(operation)
        }
        
        // Extract parameters
        if (operation.parameters) {
          method.parameters = operation.parameters.map((param: any) => ({
            name: param.name,
            type: this.mapOpenAPIType(param.schema),
            required: param.required || false
          }))
        }
        
        // Extract request body
        if (operation.requestBody) {
          const content = operation.requestBody.content?.['application/json']
          if (content?.schema) {
            method.requestBody = { type: this.mapOpenAPIType(content.schema) }
          }
        }
        
        methods.push(method)
      })
    })
    
    return methods
  }
  
  private extractTypes(): Record<string, any> {
    return this.schema.components?.schemas || {}
  }
  
  private generateMethodName(httpMethod: string, path: string, operation: any): string {
    if (operation.operationId) {
      return operation.operationId
    }
    
    // Generate method name from HTTP method and path
    const pathParts = path.split('/').filter(p => p && !p.startsWith('{'))
    const resource = pathParts[pathParts.length - 1] || 'resource'
    
    const methodPrefix = httpMethod === 'get' ? 'get' :
                        httpMethod === 'post' ? 'create' :
                        httpMethod === 'put' ? 'update' :
                        httpMethod === 'patch' ? 'update' :
                        httpMethod === 'delete' ? 'delete' : 'handle'
    
    return `${methodPrefix}${this.capitalize(resource)}`
  }
  
  private extractResponseType(operation: any): { type: string } {
    const successResponse = operation.responses?.['200'] || operation.responses?.['201']
    if (!successResponse) return { type: 'any' }
    
    const content = successResponse.content?.['application/json']
    if (!content?.schema) return { type: 'any' }
    
    return { type: this.mapOpenAPIType(content.schema) }
  }
  
  private mapOpenAPIType(schema: any): string {
    if (!schema) return 'any'
    
    if (schema.$ref) {
      const refName = schema.$ref.split('/').pop()
      return refName || 'any'
    }
    
    if (schema.type === 'array') {
      const itemType = this.mapOpenAPIType(schema.items)
      return `${itemType}[]`
    }
    
    switch (schema.type) {
      case 'string': return 'string'
      case 'number': return 'number'
      case 'integer': return 'number'
      case 'boolean': return 'boolean'
      case 'object': return 'Record<string, any>'
      default: return 'any'
    }
  }
  
  private generateTypes(types: Record<string, any>) {
    console.log('📝 Generating TypeScript types...')
    
    let typeContent = `// Generated TypeScript types from Eden Registry OpenAPI schema
// Do not edit manually - regenerate using: npm run generate:sdk

`
    
    Object.entries(types).forEach(([typeName, typeSchema]) => {
      typeContent += this.generateTypeDefinition(typeName, typeSchema)
      typeContent += '\\n\\n'
    })
    
    // Add common types
    typeContent += this.generateCommonTypes()
    
    writeFileSync(join(this.outputDir, 'types.ts'), typeContent)
    console.log('  ✅ types.ts generated')
  }
  
  private generateTypeDefinition(typeName: string, schema: any): string {
    if (!schema.properties) return `export type ${typeName} = any;`
    
    let typeContent = `export interface ${typeName} {\\n`
    
    Object.entries(schema.properties).forEach(([propName, propSchema]: [string, any]) => {
      const isRequired = schema.required?.includes(propName)
      const propType = this.mapOpenAPIType(propSchema)
      const optional = isRequired ? '' : '?'
      
      // Add description if available
      if (propSchema.description) {
        typeContent += `  /** ${propSchema.description} */\\n`
      }
      
      typeContent += `  ${propName}${optional}: ${propType};\\n`
    })
    
    typeContent += `}`
    
    return typeContent
  }
  
  private generateCommonTypes(): string {
    return `// Common types for Eden Registry SDK

export interface SDKConfig {
  baseUrl?: string;
  apiKey?: string;
  timeout?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface APIError {
  error: string;
  details?: any;
  status: number;
}

export class EdenRegistryError extends Error {
  status: number;
  details?: any;
  
  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = 'EdenRegistryError';
    this.status = status;
    this.details = details;
  }
}

export interface RequestOptions {
  timeout?: number;
  headers?: Record<string, string>;
}`
  }
  
  private generateClient(methods: SDKMethod[]) {
    console.log('🔨 Generating SDK client...')
    
    let clientContent = `// Generated Eden Registry SDK Client
// Do not edit manually - regenerate using: npm run generate:sdk

import { 
  SDKConfig, 
  PaginatedResponse, 
  APIError, 
  EdenRegistryError,
  RequestOptions 
} from './types';

export class EdenRegistrySDK {
  private baseUrl: string;
  private apiKey?: string;
  private timeout: number;
  
  constructor(config: SDKConfig = {}) {
    this.baseUrl = config.baseUrl || process.env.REGISTRY_URL || 'http://localhost:3000';
    this.apiKey = config.apiKey || process.env.REGISTRY_API_KEY;
    this.timeout = config.timeout || 10000;
  }
  
  private async request<T>(
    method: string,
    path: string,
    options: RequestOptions & { body?: any } = {}
  ): Promise<T> {
    const url = \`\${this.baseUrl}\${path}\`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (this.apiKey) {
      headers['Authorization'] = \`Bearer \${this.apiKey}\`;
    }
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeout || this.timeout);
    
    try {
      const response = await fetch(url, {
        method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new EdenRegistryError(
          errorData.error || \`HTTP \${response.status}\`,
          response.status,
          errorData.details
        );
      }
      
      return await response.json();
    } catch (error) {
      clearTimeout(timeout);
      
      if (error instanceof EdenRegistryError) {
        throw error;
      }
      
      if (error.name === 'AbortError') {
        throw new EdenRegistryError('Request timeout', 408);
      }
      
      throw new EdenRegistryError(
        error.message || 'Network error',
        0,
        error
      );
    }
  }
  
`
    
    // Generate methods
    methods.forEach(method => {
      clientContent += this.generateClientMethod(method)
      clientContent += '\\n\\n'
    })
    
    clientContent += `}

// Default export for convenience
export default EdenRegistrySDK;`
    
    writeFileSync(join(this.outputDir, 'client.ts'), clientContent)
    console.log('  ✅ client.ts generated')
  }
  
  private generateClientMethod(method: SDKMethod): string {
    const paramsList = method.parameters?.map(p => 
      `${p.name}${p.required ? '' : '?'}: ${p.type}`
    ).join(', ') || ''
    
    const pathParams = method.parameters?.filter(p => method.path.includes(`{${p.name}}`)) || []
    const queryParams = method.parameters?.filter(p => !method.path.includes(`{${p.name}}`)) || []
    
    // Build path with parameters
    let pathExpression = `'${method.path}'`
    pathParams.forEach(param => {
      pathExpression = pathExpression.replace(`{${param.name}}`, `\${${param.name}}`);
    })
    
    // Build query string
    let queryExpression = ''
    if (queryParams.length > 0) {
      const queryParts = queryParams.map(param => 
        `${param.name}: ${param.name}`
      ).join(', ')
      queryExpression = `
    const query = new URLSearchParams();
    ${queryParams.map(param => 
      param.required 
        ? `query.append('${param.name}', String(${param.name}));`
        : `if (${param.name} !== undefined) query.append('${param.name}', String(${param.name}));`
    ).join('\\n    ')}
    const queryString = query.toString();
    const fullPath = queryString ? \`\${${pathExpression}}?\${queryString}\` : ${pathExpression};`
    } else {
      queryExpression = `const fullPath = ${pathExpression};`
    }
    
    // Method signature
    let methodSignature = `async ${method.name}(`
    if (paramsList) methodSignature += paramsList
    if (method.requestBody) {
      if (paramsList) methodSignature += ', '
      methodSignature += `data: ${method.requestBody.type}`
    }
    methodSignature += `, options: RequestOptions = {}): Promise<${method.response.type}>`
    
    return `  /**
   * ${method.description}
   * ${method.method} ${method.path}
   */
  ${methodSignature} {
    ${queryExpression}
    return this.request<${method.response.type}>('${method.method}', fullPath, {
      ...options${method.requestBody ? ', body: data' : ''}
    });
  }`
  }
  
  private generateIndex() {
    console.log('📦 Generating index file...')
    
    const indexContent = `// Eden Registry SDK
// Generated from OpenAPI specification

export * from './types';
export * from './client';
export { default as EdenRegistrySDK } from './client';

// Convenience exports
import EdenRegistrySDK from './client';
export default EdenRegistrySDK;
`
    
    writeFileSync(join(this.outputDir, 'index.ts'), indexContent)
    console.log('  ✅ index.ts generated')
  }
  
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
}

// Generate package.json for the SDK
function generatePackageJson(outputDir: string) {
  console.log('📋 Generating package.json...')
  
  const packageContent = {
    name: '@eden/registry-sdk',
    version: '1.0.0',
    description: 'TypeScript SDK for Eden Genesis Registry API',
    main: 'dist/index.js',
    types: 'dist/index.d.ts',
    scripts: {
      build: 'tsc',
      prepublishOnly: 'npm run build'
    },
    dependencies: {},
    devDependencies: {
      typescript: '^5.0.0'
    },
    files: [
      'dist/**/*',
      'src/**/*'
    ],
    keywords: ['eden', 'registry', 'api', 'sdk', 'typescript'],
    license: 'MIT'
  }
  
  writeFileSync(
    join(outputDir, 'package.json'), 
    JSON.stringify(packageContent, null, 2)
  )
  console.log('  ✅ package.json generated')
}

// Generate TypeScript config
function generateTSConfig(outputDir: string) {
  console.log('⚙️  Generating tsconfig.json...')
  
  const tsConfig = {
    compilerOptions: {
      target: 'ES2020',
      module: 'commonjs',
      declaration: true,
      outDir: 'dist',
      rootDir: '.',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      moduleResolution: 'node'
    },
    include: ['*.ts'],
    exclude: ['dist', 'node_modules']
  }
  
  writeFileSync(
    join(outputDir, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2)
  )
  console.log('  ✅ tsconfig.json generated')
}

async function main() {
  console.log('🚀 Eden Registry SDK Generator')
  console.log('=' .repeat(50))
  
  const schemaPath = join(process.cwd(), 'openapi.yaml')
  const outputDir = join(process.cwd(), 'packages', 'eden-registry-sdk', 'src')
  
  try {
    const generator = new EdenSDKGenerator(schemaPath, outputDir)
    generator.generate()
    
    generatePackageJson(join(outputDir, '..'))
    generateTSConfig(join(outputDir, '..'))
    
    console.log('\\n' + '=' .repeat(50))
    console.log('✅ SDK generation completed!')
    console.log('\\n📋 Generated files:')
    console.log(`   📁 ${outputDir}/types.ts`)
    console.log(`   📁 ${outputDir}/client.ts`)
    console.log(`   📁 ${outputDir}/index.ts`)
    console.log(`   📁 ${join(outputDir, '..')}/package.json`)
    console.log(`   📁 ${join(outputDir, '..')}/tsconfig.json`)
    
    console.log('\\n🔄 Next steps:')
    console.log('   1. cd packages/eden-registry-sdk && npm install')
    console.log('   2. npm run build')
    console.log('   3. Replace raw fetch patterns with SDK usage')
    console.log('   4. Update Academy to use: import EdenRegistrySDK from "@eden/registry-sdk"')
    
  } catch (error) {
    console.error('❌ SDK generation failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main().catch(console.error)
}

export { EdenSDKGenerator }