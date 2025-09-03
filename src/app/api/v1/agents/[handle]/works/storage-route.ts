export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';

const s = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Cache = { ts: number; keys: string[] };
const mem: Record<string, Cache> = {};

async function listKeys(handle: string) {
  const key = `works:${handle}`;
  const now = Date.now();
  const hit = mem[key];
  if (hit && now - hit.ts < 10 * 60 * 1000) return hit.keys; // 10 min cache

  // storage list (no DB)
  const prefix = `${handle}/generations/`;
  const out: string[] = [];
  
  try {
    const { data, error } = await s.storage.from('eden').list(prefix, { 
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

  mem[key] = { ts: now, keys: out };
  return out;
}

function paginate<T>(arr: T[], cursor?: string, limit = 60) {
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

export async function GET(req: Request, { params }: { params: { handle: string }}) {
  try {
    const url = new URL(req.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '60', 10), 200);
    const cursor = url.searchParams.get('cursor') || undefined;

    const keys = await listKeys(params.handle);
    const { page, nextCursor } = paginate(keys, cursor, limit);

    const items = await Promise.all(page.map(async (path) => {
      const ordinal = parseInt(path.split('/').pop()!.replace('.png',''), 10);
      const { data, error } = await s.storage.from('eden').createSignedUrl(path, 30 * 60); // 30m
      if (error) {
        console.error('[storage] Sign error:', error);
        return { 
          id: `${params.handle}-${ordinal}`, 
          ordinal, 
          signed_url: null,
          error: 'Failed to sign URL'
        };
      }
      return { 
        id: `${params.handle}-${ordinal}`, 
        ordinal, 
        signed_url: data?.signedUrl || null,
        title: `Generation ${ordinal}`,
        mimeType: 'image/png'
      };
    }));

    return Response.json({ 
      items, 
      nextCursor,
      hasMore: !!nextCursor,
      agent: { handle: params.handle, displayName: params.handle }
    });
  } catch (e) {
    console.error('[works] storage path error', e);
    return new Response(
      JSON.stringify({ error: 'Temporary storage path failed' }), 
      { 
        status: 503, 
        headers: { 'content-type': 'application/json' }
      }
    );
  }
}