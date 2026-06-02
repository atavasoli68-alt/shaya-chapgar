import { NextResponse } from 'next/server';
import { userRepository } from '@/modules/users/user.repository';
import { withAdmin } from '@/middleware/auth';
import { withErrorHandler } from '@/lib/errors';

export const GET = withAdmin(
  withErrorHandler(async () => {
    const users = await userRepository.findAll();
    return NextResponse.json(users);
  }) as any
);
