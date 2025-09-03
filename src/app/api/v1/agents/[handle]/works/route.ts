export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma, withTimeout } from '@/lib/db';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';
import { z } from 'zod';

// Initialize Supabase client for signed URL generation
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Query params schema
const querySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(50),
  cursor: z.string().optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'DRAFT']).optional()
});

// Storage mode cache
type Cache = { ts: number; keys: string[] };
const storageCache: Record<string, Cache> = {};

async function listStorageKeys(handle: string) {
  const key = `works:${handle}`;
  const now = Date.now();
  const hit = storageCache[key];
  if (hit && now - hit.ts < 10 * 60 * 1000) return hit.keys; // 10 min cache

  // storage list (no DB)
  const prefix = `${handle}/generations/`;
  const out: string[] = [];
  
  try {
    const { data, error } = await supabase.storage.from('eden').list(prefix, { 
      limit: 1000 
    });
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      out.push(...data
        .filter(f => f.name && f.name.endsWith('.png'))
        .map(f => `${prefix}${f.name}`)
      );
    }
  } catch (e) {
    console.error('[storage] List error:', e);
  }

  // sort numerically by ordinal (desc)
  out.sort((a, b) => {
    const na = parseInt(a.split('/').pop()!.replace('.png',''), 10);
    const nb = parseInt(b.split('/').pop()!.replace('.png',''), 10);
    return nb - na;
  });

  storageCache[key] = { ts: now, keys: out };
  return out;
}

function paginateStorage<T>(arr: T[], cursor?: string, limit = 60) {
  let start = 0;
  if (cursor) {
    const last = Buffer.from(cursor, 'base64').toString();
    const idx = arr.findIndex(item => String(item) === last);
    if (idx >= 0) start = idx + 1;
  }
  const page = arr.slice(start, start + limit);
  const nextCursor = page.length === limit ? 
    Buffer.from(String(page[page.length - 1])).toString('base64') : null;
  return { page, nextCursor };
}

// Storage mode handler (no DB)
async function handleStorageMode(
  request: NextRequest,
  handle: string
) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const query = querySchema.parse(searchParams);
    
    const keys = await listStorageKeys(handle);
    const { page, nextCursor } = paginateStorage(keys, query.cursor, query.limit);

    const items = await Promise.all(page.map(async (path) => {
      const ordinal = parseInt(path.split('/').pop()!.replace('.png',''), 10);
      const { data, error } = await supabase.storage.from('eden').createSignedUrl(path, 30 * 60); // 30m
      
      if (error) {
        console.error('[storage] Sign error:', error);
        return { 
          id: `${handle}-${ordinal}`, 
          ordinal, 
          signed_url: null,
          error: 'Failed to sign URL'
        };
      }
      
      return { 
        id: `${handle}-${ordinal}`, 
        ordinal, 
        signed_url: data?.signedUrl || null,
        title: `Generation ${ordinal}`,
        mimeType: 'image/png',
        storagePath: path,
        visibility: 'PUBLIC'
      };
    }));

    return NextResponse.json({ 
      items, 
      nextCursor,
      hasMore: !!nextCursor,
      agent: { handle, displayName: handle },
      mode: 'storage'
    });
  } catch (e) {
    console.error('[works] storage mode error', e);
    return NextResponse.json(
      { error: 'Storage mode failed', details: String(e) },
      { status: 503 }
    );
  }
}

// DB mode handler (original)
async function handleDbMode(
  request: NextRequest,
  handle: string
) {
  try {
    console.log('[works] DB mode for', handle);
    
    // Parse query params
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const query = querySchema.parse(searchParams);
    
    // Parse cursor if provided
    let cursor = null;
    if (query.cursor) {
      try {
        const cursorSchema = z.object({
          ordinal: z.number(),
          id: z.string()
        });
        cursor = cursorSchema.parse(
          JSON.parse(Buffer.from(query.cursor, 'base64').toString())
        );
      } catch {
        return NextResponse.json(
          { error: 'Invalid cursor format' },
          { status: 400 }
        );
      }
    }
    
    // Find agent by handle with timeout
    let agent;
    try {
      agent = await withTimeout(
        prisma.agent.findUnique({
          where: { handle },
          select: { id: true, handle: true, displayName: true }
        }),
        5000
      );
    } catch (timeoutError) {
      console.error('[works] DB timeout:', timeoutError);
      // Fall back to storage mode if DB times out
      return handleStorageMode(request, handle);
    }
    
    if (!agent) {
      // If agent not found in DB, try storage mode
      return handleStorageMode(request, handle);
    }
    
    // Build query conditions
    const where: any = {
      agentId: agent.id,
      status: 'ACTIVE'
    };
    
    if (query.visibility) {
      where.visibility = query.visibility;
    } else {
      where.visibility = 'PUBLIC';
    }
    
    // Apply cursor for keyset pagination
    if (cursor) {
      where.OR = [
        { ordinal: { lt: cursor.ordinal } },
        { 
          ordinal: cursor.ordinal,
          id: { lt: cursor.id }
        }
      ];
    }
    
    // Fetch works with keyset pagination
    let works;
    try {
      works = await withTimeout(
        prisma.work.findMany({
          where,
          orderBy: [
            { ordinal: 'desc' },
            { id: 'desc' }
          ],
          take: query.limit + 1, // Fetch one extra to determine if there's more
          select: {
            id: true,
            ordinal: true,
            title: true,
            description: true,
            storageBucket: true,
            storagePath: true,
            visibility: true,
            mimeType: true,
            width: true,
            height: true,
            metadata: true,
            publishedAt: true,
            createdAt: true
          }
        }),
        5000
      );
    } catch (timeoutError) {
      console.error('[works] Query timeout:', timeoutError);
      // Fall back to storage mode if query times out
      return handleStorageMode(request, handle);
    }
    
    // Determine if there are more results
    const hasMore = works.length > query.limit;
    const items = hasMore ? works.slice(0, -1) : works;
    
    // Generate signed URLs for each work
    const itemsWithSignedUrls = await Promise.all(
      items.map(async (work) => {
        try {
          const { data, error } = await supabase.storage
            .from(work.storageBucket)
            .createSignedUrl(work.storagePath, 30 * 60); // 30m
          
          if (error) throw error;
          
          return {
            ...work,
            signed_url: data?.signedUrl || null
          };
        } catch (error) {
          console.error(`Failed to sign URL for work ${work.id}:`, error);
          return {
            ...work,
            signed_url: null,
            error: 'Failed to generate signed URL'
          };
        }
      })
    );
    
    // Generate next cursor if there are more results
    let nextCursor = null;
    if (hasMore && items.length > 0) {
      const lastItem = items[items.length - 1];
      nextCursor = Buffer.from(
        JSON.stringify({
          ordinal: lastItem.ordinal,
          id: lastItem.id
        })
      ).toString('base64');
    }
    
    return NextResponse.json({
      items: itemsWithSignedUrls,
      nextCursor,
      hasMore,
      agent,
      mode: 'db'
    });
    
  } catch (error) {
    console.error('Works DB mode error:', error);
    // Fall back to storage mode on any DB error
    return handleStorageMode(request, handle);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { handle: string } }
) {
  const mode = process.env.WORKS_READ_MODE || 'storage';
  
  console.log('[works] GET request', { 
    handle: params.handle,
    mode,
    url: request.url
  });
  
  // Use storage mode if configured or as fallback
  if (mode === 'storage') {
    return handleStorageMode(request, params.handle);
  }
  
  // Try DB mode with automatic fallback to storage
  return handleDbMode(request, params.handle);
}

// POST endpoint for creating/updating works (used by backfill)
export async function POST(
  request: NextRequest,
  { params }: { params: { handle: string } }
) {
  try {
    console.log('[works] POST request', { 
      handle: params.handle,
      hasServiceKey: !!request.headers.get('x-registry-service')
    });
    
    // Verify service role key
    const serviceKey = request.headers.get('x-registry-service');
    if (serviceKey !== process.env.REGISTRY_SERVICE_KEY) {
      console.error('[works] Auth failed');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Find agent
    const agent = await prisma.agent.findUnique({
      where: { handle: params.handle },
      select: { id: true }
    });
    
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }
    
    // Batch upsert works
    const works = body.works as Array<{
      ordinal: number;
      storagePath: string;
      title?: string;
      metadata?: any;
    }>;
    
    const results = await Promise.all(
      works.map(async (work) => {
        const checksum = createHash('sha256')
          .update(`${agent.id}:${work.ordinal}`)
          .digest('hex');
        
        return prisma.work.upsert({
          where: {
            agentId_ordinal: {
              agentId: agent.id,
              ordinal: work.ordinal
            }
          },
          create: {
            agentId: agent.id,
            ordinal: work.ordinal,
            storageBucket: 'eden',
            storagePath: work.storagePath,
            title: work.title || `Work #${work.ordinal}`,
            checksum,
            mimeType: 'image/png',
            visibility: 'PUBLIC',
            status: 'ACTIVE',
            metadata: work.metadata || {},
            publishedAt: new Date()
          },
          update: {
            storagePath: work.storagePath,
            status: 'ACTIVE',
            lastVerifiedAt: new Date()
          }
        });
      })
    );
    
    return NextResponse.json({
      created: results.length,
      message: 'Works upserted successfully'
    });
    
  } catch (error) {
    console.error('Works POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}