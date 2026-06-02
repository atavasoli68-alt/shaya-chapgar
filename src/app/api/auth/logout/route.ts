import { NextResponse } from 'next/server';
import { AUTH_CONFIG } from '@/config';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(AUTH_CONFIG.cookieName, '', { maxAge: 0, path: '/' });
  return response;
}
