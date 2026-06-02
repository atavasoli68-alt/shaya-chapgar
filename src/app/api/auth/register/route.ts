import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/modules/users/user.repository';
import { signToken } from '@/lib/auth';
import { validate, registerSchema } from '@/lib/validations';
import { withErrorHandler } from '@/lib/errors';
import { AUTH_CONFIG } from '@/config';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const data = validate(registerSchema, body);

  const user = await userService.register(data);
  const token = signToken(user);

  const response = NextResponse.json({ user }, { status: 201 });
  response.cookies.set(AUTH_CONFIG.cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: AUTH_CONFIG.cookieMaxAge,
    path: '/',
  });
  return response;
});
