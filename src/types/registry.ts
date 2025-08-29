/**
 * Registry API Types
 * Auto-generated from OpenAPI specification
 */

export interface Agent {
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

export interface Profile {
  statement?: string;
  manifesto?: string;
  tags?: string[];
  links?: object;
}

export interface Persona {
  id?: string;
  name?: string;
  version?: string;
  prompt?: string;
  alignmentNotes?: string;
  privacy?: 'INTERNAL' | 'PUBLIC';
}

export interface Creation {
  id?: string;
  title?: string;
  mediaUri?: string;
  metadata?: object;
  status?: 'DRAFT' | 'CURATED' | 'PUBLISHED' | 'ARCHIVED';
}

export interface Application {
  applicantEmail?: string;
  applicantName?: string;
  track?: 'AGENT' | 'TRAINER' | 'CURATOR' | 'COLLECTOR' | 'INVESTOR';
  payload?: object;
}

export interface Document {
  id?: string;
  title?: string;
  slug?: string;
  category?: 'adr' | 'api' | 'technical' | 'integration';
  summary?: string;
  lastModified?: string;
  status?: 'draft' | 'published' | 'archived';
}

export interface DocumentContent extends Document {
  content: string;
  metadata: object;
  tableOfContents: Array<{
    level: number;
    title: string;
    anchor: string;
  }>;
}