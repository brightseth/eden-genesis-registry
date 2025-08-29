#!/usr/bin/env tsx

/**
 * Auto-generate contract documentation from OpenAPI spec
 * Updates docs/contracts.md with latest API definitions
 */

import { readFileSync, writeFileSync } from 'fs';
import yaml from 'js-yaml';

interface OpenAPISpec {
  info: { title: string; version: string; description: string };
  servers: Array<{ url: string; description: string }>;
  components: {
    schemas: Record<string, any>;
    securitySchemes: Record<string, any>;
  };
  paths: Record<string, any>;
}

function generateContractsDoc() {
  try {
    // Read OpenAPI spec
    const specContent = readFileSync('./openapi.yaml', 'utf8');
    const spec = yaml.load(specContent) as OpenAPISpec;
    
    // Generate markdown content
    const markdown = `# Eden Contracts Documentation

*Auto-generated from OpenAPI specification - ${new Date().toISOString()}*

## API Overview
**${spec.info.title}** v${spec.info.version}
${spec.info.description}

## Base URLs
${spec.servers.map(server => `- **${server.description}**: \`${server.url}\``).join('\n')}

## Authentication
All authenticated requests require Bearer token:
\`\`\`
Authorization: Bearer <api-key>
\`\`\`

## Core Endpoints

${generateEndpoints(spec.paths)}

## Data Schemas

${generateSchemas(spec.components.schemas)}

## SDK Usage Examples

### Initialize Client
\`\`\`typescript
import { RegistryClient } from '@eden/registry-sdk';

const client = new RegistryClient({
  baseURL: '${spec.servers[1]?.url || spec.servers[0]?.url}',
  apiKey: process.env.EDEN_API_KEY
});
\`\`\`

### Fetch Agent Data
\`\`\`typescript
// Get agent profile
const agent = await client.agents.get('abraham');

// Get agent works
const works = await client.agents.getWorks('abraham', {
  limit: 12,
  offset: 0
});

// Get agent personas
const personas = await client.agents.getPersonas('abraham');
\`\`\`

### Submit Applications
\`\`\`typescript
// Submit genesis application
const application = await client.applications.submit({
  applicantEmail: 'creator@example.com',
  applicantName: 'Jane Creator',
  track: 'AGENT',
  payload: {
    agentConcept: 'Music composition AI',
    experience: 'Professional musician',
    commitment: 'Daily practice'
  }
});
\`\`\`

## Rate Limits
- **Public endpoints**: 100 requests/minute
- **Authenticated endpoints**: 1000 requests/minute  
- **Webhook subscriptions**: 10 per account

## Status Codes
- \`200\`: Success
- \`201\`: Created
- \`400\`: Bad Request - Invalid parameters
- \`401\`: Unauthorized - Invalid or missing API key
- \`403\`: Forbidden - Insufficient permissions
- \`404\`: Not Found - Resource doesn't exist
- \`429\`: Rate Limited
- \`500\`: Internal Server Error

## Error Response Format
\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid agent handle format",
    "details": {
      "field": "handle",
      "requirement": "Must be 3-20 alphanumeric characters"
    }
  }
}
\`\`\`
`;

    // Write to contracts.md
    writeFileSync('./docs/contracts.md', markdown);
    console.log('✅ Generated contracts.md from OpenAPI spec');
    
    return true;
  } catch (error) {
    console.error('❌ Failed to generate contracts documentation:', error);
    return false;
  }
}

function generateEndpoints(paths: Record<string, any>): string {
  let output = '';
  
  for (const [path, methods] of Object.entries(paths)) {
    output += `### ${path}\n\n`;
    
    for (const [method, details] of Object.entries(methods)) {
      const methodUpper = method.toUpperCase();
      const summary = details.summary || 'No description';
      const auth = details.security ? '🔒 **Authenticated**' : '🌐 **Public**';
      
      output += `#### ${methodUpper} ${path}\n`;
      output += `${auth} - ${summary}\n\n`;
      
      // Parameters
      if (details.parameters && details.parameters.length > 0) {
        output += '**Parameters:**\n';
        for (const param of details.parameters) {
          const required = param.required ? '**required**' : 'optional';
          output += `- \`${param.name}\` (${param.in}) - ${required}\n`;
        }
        output += '\n';
      }
      
      // Request body
      if (details.requestBody) {
        const schema = details.requestBody.content?.['application/json']?.schema;
        if (schema) {
          output += '**Request Body:**\n';
          if (schema.$ref) {
            const schemaName = schema.$ref.split('/').pop();
            output += `\`${schemaName}\` schema\n\n`;
          } else {
            output += '```json\n';
            output += JSON.stringify(schema, null, 2);
            output += '\n```\n\n';
          }
        }
      }
      
      // Response
      const response200 = details.responses?.['200'] || details.responses?.['201'];
      if (response200) {
        output += `**Response:** ${response200.description}\n\n`;
      }
    }
    
    output += '---\n\n';
  }
  
  return output;
}

function generateSchemas(schemas: Record<string, any>): string {
  let output = '';
  
  for (const [name, schema] of Object.entries(schemas)) {
    output += `### ${name}\n`;
    output += '```typescript\n';
    output += generateTypeScript(name, schema);
    output += '\n```\n\n';
  }
  
  return output;
}

function generateTypeScript(name: string, schema: any): string {
  if (schema.allOf) {
    // Handle inheritance
    const baseRef = schema.allOf[0].$ref;
    const baseName = baseRef ? baseRef.split('/').pop() : 'unknown';
    const extension = schema.allOf[1];
    
    let output = `interface ${name} extends ${baseName} {\n`;
    if (extension && extension.properties) {
      for (const [propName, propSchema] of Object.entries(extension.properties)) {
        const type = getTypeScriptType(propSchema);
        output += `  ${propName}: ${type};\n`;
      }
    }
    output += '}';
    return output;
  }
  
  let output = `interface ${name} {\n`;
  
  if (schema.properties) {
    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      const type = getTypeScriptType(propSchema);
      const optional = schema.required?.includes(propName) ? '' : '?';
      const description = propSchema.description ? ` // ${propSchema.description}` : '';
      output += `  ${propName}${optional}: ${type};${description}\n`;
    }
  }
  
  output += '}';
  return output;
}

function getTypeScriptType(schema: any): string {
  if (schema.$ref) {
    return schema.$ref.split('/').pop() || 'unknown';
  }
  
  if (schema.type === 'string') {
    if (schema.enum) {
      return schema.enum.map(v => `'${v}'`).join(' | ');
    }
    return 'string';
  }
  
  if (schema.type === 'array') {
    const itemType = getTypeScriptType(schema.items);
    return `${itemType}[]`;
  }
  
  if (schema.type === 'object') {
    return 'object';
  }
  
  return schema.type || 'unknown';
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const success = generateContractsDoc();
  process.exit(success ? 0 : 1);
}

export { generateContractsDoc };