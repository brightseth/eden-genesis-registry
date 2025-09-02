export const GET = () => new Response(
  JSON.stringify({ 
    sha: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  }),
  { headers: { 'content-type': 'application/json' } }
);