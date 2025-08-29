import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  
  // Extract subdomain from host
  const [subdomain, ...rest] = host.split('.');
  
  // Allow apex or non-matching hosts to reach health checks, etc.
  if (!subdomain || subdomain === 'www' || subdomain === 'eden2' || rest.length < 2) {
    return NextResponse.next();
  }
  
  // Rewrite subdomain.eden2.io -> /[agent]/*
  const url = req.nextUrl.clone();
  url.pathname = `/${subdomain}${url.pathname}`;
  
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. Static files (e.g. /favicon.ico, /sitemap.xml, /robots.txt, etc.)
     */
    '/((?!api/|_next/|_static/|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};