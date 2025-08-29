import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'eden2-agent-shell',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
    uptime: process.uptime(),
  });
}