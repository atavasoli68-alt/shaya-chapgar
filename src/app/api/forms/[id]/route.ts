import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/middleware/auth';
import { withErrorHandler } from '@/lib/errors';
import prisma from '@/lib/prisma';

export const PUT = withAdmin(
  withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const { status } = await req.json();
    const item = await prisma.formSubmission.update({ where: { id }, data: { status } });
    return NextResponse.json(item);
  }) as any
);
