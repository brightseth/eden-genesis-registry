export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    sha: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
    timestamp: new Date().toISOString()
  }), { 
    headers: { 'content-type': 'application/json' }
  });
}