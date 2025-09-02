import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
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

// Cursor schema for keyset pagination
const cursorSchema = z.object({
  ordinal: z.number(),
  id: z.string()
});

// TTL cache for signed URLs (90% of TTL)
const SIGNED_URL_TTL = 60 * 60; // 1 hour
const CACHE_TTL = SIGNED_URL_TTL * 0.9 * 1000; // 54 minutes in ms
const signedUrlCache = new Map<string, { url: string; expires: number }>();

async function getSignedUrl(bucket: string, path: string): Promise<string> {
  const cacheKey = `${bucket}:${path}`;
  const cached = signedUrlCache.get(cacheKey);
  
  if (cached && cached.expires > Date.now()) {
    return cached.url;
  }
  
  // Generate new signed URL
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, SIGNED_URL_TTL);
  
  if (error || !data?.signedUrl) {
    console.error('Failed to create signed URL:', error);
    throw new Error('Failed to create signed URL');
  }
  
  // Cache until 90% of TTL
  signedUrlCache.set(cacheKey, {
    url: data.signedUrl,
    expires: Date.now() + CACHE_TTL
  });
  
  return data.signedUrl;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { handle: string } }
) {
  try {
    // Parse query params
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const query = querySchema.parse(searchParams);
    
    // Parse cursor if provided
    let cursor = null;
    if (query.cursor) {
      try {
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
    
    // Find agent by handle
    const agent = await prisma.agent.findUnique({
      where: { handle: params.handle },
      select: { id: true, handle: true, displayName: true }
    });
    
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
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
    const works = await prisma.work.findMany({
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
    });
    
    // Determine if there are more results
    const hasMore = works.length > query.limit;
    const items = hasMore ? works.slice(0, -1) : works;
    
    // Generate signed URLs for each work
    const itemsWithSignedUrls = await Promise.all(
      items.map(async (work) => {
        try {
          const signedUrl = await getSignedUrl(work.storageBucket, work.storagePath);
          return {
            ...work,
            signed_url: signedUrl
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
      agent
    });
    
  } catch (error) {
    console.error('Works API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint for creating/updating works (used by backfill)
export async function POST(
  request: NextRequest,
  { params }: { params: { handle: string } }
) {
  try {
    // Verify service role key (basic auth for now)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.includes(process.env.SUPABASE_SERVICE_ROLE_KEY!)) {
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