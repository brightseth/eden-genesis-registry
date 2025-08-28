// Generated TypeScript types from Eden Registry OpenAPI schema
// Do not edit manually - regenerate using: npm run generate:sdk

export interface Agent {
  id: string;
  handle: string;
  displayName: string;
  status: string;
  visibility: string;
  cohortId: string;
  prototypeUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  statement?: string;
  manifesto?: string;
  tags: string[];
  links?: any;
  economicData?: any;
  launchDate?: string;
  launchStatus?: string;
}

export interface Persona {
  id: string;
  name: string;
  version: string;
  prompt: string;
  alignmentNotes?: string;
  privacy: string;
}

export interface Creation {
  id: string;
  title: string;
  mediaUri: string;
  metadata: any;
  status: string;
}

export interface Application {
  applicantEmail: string;
  applicantName: string;
  track: string;
  payload: any;
}

export interface Document {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  lastModified: string;
  status: string;
}

export interface DocumentContent {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  lastModified: string;
  status: string;
  content: string;
  metadata: any;
  tableOfContents: Array<{
    level: number;
    title: string;
    anchor: string;
  }>;
}

// Common types for Eden Registry SDK

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
}