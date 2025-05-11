import { NextResponse } from 'next/server';
import { serverConfig } from '@/config/server';

export async function GET() {
  return NextResponse.json(serverConfig);
} 