import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { ApiError } from '@/lib/errors';
import type { JwtPayload } from '@/types';

/**
 * ─── Auth Middleware ───────────────────────────────────────────────
 * برای محافظت از هر route، کافیه handler رو در این تابع بپیچی:
 *
 * export const GET = withAuth(async (req, ctx, user) => {
 *   return NextResponse.json({ userId: user.id });
 * });
 *
 * export const POST = withAdmin(async (req, ctx, user) => {
 *   // فقط ادمین‌ها دسترسی دارند
 * });
 */

type AuthHandler = (
  req: NextRequest,
  ctx: any,
  user: JwtPayload
) => Promise<NextResponse>;

export function withAuth(handler: AuthHandler) {
  return async (req: NextRequest, ctx: any): Promise<NextResponse> => {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('auth_token')?.value;
      if (!token) throw ApiError.unauthorized();

      const payload = verifyToken(token) as JwtPayload | null;
      if (!payload) throw ApiError.unauthorized();

      return await handler(req, ctx, payload);
    } catch (error) {
      if (error instanceof ApiError) return error.toResponse();
      return ApiError.unauthorized().toResponse();
    }
  };
}

export function withAdmin(handler: AuthHandler) {
  return withAuth(async (req, ctx, user) => {
    if (user.role !== 'admin') throw ApiError.forbidden();
    return handler(req, ctx, user);
  });
}

/**
 * ─── Auth Helper برای Server Components ──────────────────────────
 */
export async function getServerUser(): Promise<JwtPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;
    return verifyToken(token) as JwtPayload | null;
  } catch {
    return null;
  }
}
