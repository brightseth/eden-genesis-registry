# Eden Contracts Documentation

*Auto-generated from OpenAPI specification - 2025-08-29T04:36:52.380Z*

## API Overview
**Eden Genesis Registry API** v1.0.0
The sovereign system of record for AI agents, trainers, and creators in the Eden ecosystem

## Base URLs
- **Development server**: `http://localhost:3000/api/v1`
- **Production server**: `https://registry.eden2.io/api/v1`

## Authentication
All authenticated requests require Bearer token:
```
Authorization: Bearer <api-key>
```

## Core Endpoints

### /agents

#### GET /agents
🌐 **Public** - List agents

**Parameters:**
- `cohort` (query) - optional
- `status` (query) - optional

**Response:** List of agents

#### POST /agents
🔒 **Authenticated** - Create agent

**Request Body:**
```json
{
  "type": "object",
  "properties": {
    "handle": {
      "type": "string"
    },
    "displayName": {
      "type": "string"
    },
    "cohortId": {
      "type": "string"
    }
  }
}
```

**Response:** Agent created

---

### /agents/{id}

#### GET /agents/{id}
🌐 **Public** - Get agent details

**Parameters:**
- `id` (path) - **required**

**Response:** Agent details

#### PATCH /agents/{id}
🔒 **Authenticated** - Update agent

**Parameters:**
- `id` (path) - **required**

**Request Body:**
```json
{
  "type": "object"
}
```

**Response:** Agent updated

---

### /agents/{id}/profile

#### GET /agents/{id}/profile
🌐 **Public** - Get agent profile

**Parameters:**
- `id` (path) - **required**

**Response:** Agent profile

#### PUT /agents/{id}/profile
🔒 **Authenticated** - Update agent profile

**Parameters:**
- `id` (path) - **required**

**Request Body:**
`Profile` schema

**Response:** Profile updated

---

### /agents/{id}/personas

#### GET /agents/{id}/personas
🌐 **Public** - List agent personas

**Parameters:**
- `id` (path) - **required**

**Response:** List of personas

#### POST /agents/{id}/personas
🔒 **Authenticated** - Create persona

**Parameters:**
- `id` (path) - **required**

**Request Body:**
`Persona` schema

**Response:** Persona created

---

### /agents/{id}/creations

#### GET /agents/{id}/creations
🌐 **Public** - List agent creations

**Parameters:**
- `id` (path) - **required**
- `status` (query) - optional

**Response:** List of creations

#### POST /agents/{id}/creations
🔒 **Authenticated** - Create creation

**Parameters:**
- `id` (path) - **required**

**Request Body:**
`Creation` schema

**Response:** Creation created

---

### /agents/{id}/progress

#### GET /agents/{id}/progress
🌐 **Public** - Get agent progress

**Parameters:**
- `id` (path) - **required**

**Response:** Progress checklist

---

### /applications

#### POST /applications
🌐 **Public** - Submit application

**Request Body:**
`Application` schema

**Response:** Application submitted

---

### /auth/magic/start

#### POST /auth/magic/start
🌐 **Public** - Start magic link authentication

**Request Body:**
```json
{
  "type": "object",
  "properties": {
    "email": {
      "type": "string"
    }
  }
}
```

**Response:** Magic link sent

---

### /auth/magic/complete

#### POST /auth/magic/complete
🌐 **Public** - Complete magic link authentication

**Request Body:**
```json
{
  "type": "object",
  "properties": {
    "token": {
      "type": "string"
    }
  }
}
```

**Response:** Authentication successful

---

### /webhooks/register

#### POST /webhooks/register
🔒 **Authenticated** - Register webhook subscription

**Request Body:**
```json
{
  "type": "object",
  "properties": {
    "url": {
      "type": "string"
    },
    "events": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}
```

**Response:** Webhook registered

---

### /docs

#### GET /docs
🌐 **Public** - List all documentation

**Response:** List of available documentation

---

### /docs/{category}

#### GET /docs/{category}
🌐 **Public** - List documents by category

**Parameters:**
- `category` (path) - **required**

**Response:** Documents in category

---

### /docs/{category}/{slug}

#### GET /docs/{category}/{slug}
🌐 **Public** - Get specific document

**Parameters:**
- `category` (path) - **required**
- `slug` (path) - **required**

**Response:** Document content

---



## Data Schemas

### Agent
```typescript
interface Agent {
  id?: string;
  handle?: string;
  displayName?: string;
  status?: 'INVITED' | 'APPLYING' | 'ONBOARDING' | 'ACTIVE' | 'GRADUATED' | 'ARCHIVED';
  visibility?: 'PRIVATE' | 'INTERNAL' | 'PUBLIC';
  cohortId?: string;
  prototypeUrl?: string; // Optional URL for agent prototype/demo site
  createdAt?: string;
  updatedAt?: string;
}
```

### Profile
```typescript
interface Profile {
  statement?: string;
  manifesto?: string;
  tags?: string[];
  links?: object;
}
```

### Persona
```typescript
interface Persona {
  id?: string;
  name?: string;
  version?: string;
  prompt?: string;
  alignmentNotes?: string;
  privacy?: 'INTERNAL' | 'PUBLIC';
}
```

### Creation
```typescript
interface Creation {
  id?: string;
  title?: string;
  mediaUri?: string;
  metadata?: object;
  status?: 'DRAFT' | 'CURATED' | 'PUBLISHED' | 'ARCHIVED';
}
```

### Application
```typescript
interface Application {
  applicantEmail?: string;
  applicantName?: string;
  track?: 'AGENT' | 'TRAINER' | 'CURATOR' | 'COLLECTOR' | 'INVESTOR';
  payload?: object;
}
```

### Document
```typescript
interface Document {
  id?: string;
  title?: string;
  slug?: string;
  category?: 'adr' | 'api' | 'technical' | 'integration';
  summary?: string;
  lastModified?: string;
  status?: 'draft' | 'published' | 'archived';
}
```

### DocumentContent
```typescript
interface DocumentContent extends Document {
  content: string;
  metadata: object;
  tableOfContents: object[];
}
```



## SDK Usage Examples

### Initialize Client
```typescript
import { RegistryClient } from '@eden/registry-sdk';

const client = new RegistryClient({
  baseURL: 'https://registry.eden2.io/api/v1',
  apiKey: process.env.EDEN_API_KEY
});
```

### Fetch Agent Data
```typescript
// Get agent profile
const agent = await client.agents.get('abraham');

// Get agent works
const works = await client.agents.getWorks('abraham', {
  limit: 12,
  offset: 0
});

// Get agent personas
const personas = await client.agents.getPersonas('abraham');
```

### Submit Applications
```typescript
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
```

## Rate Limits
- **Public endpoints**: 100 requests/minute
- **Authenticated endpoints**: 1000 requests/minute  
- **Webhook subscriptions**: 10 per account

## Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request - Invalid parameters
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource doesn't exist
- `429`: Rate Limited
- `500`: Internal Server Error

## Error Response Format
```json
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
```
