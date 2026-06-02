import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/middleware/auth';
import { withErrorHandler } from '@/lib/errors';
import { validate, formSubmissionSchema } from '@/lib/validations';
import prisma from '@/lib/prisma';

export const GET = withAdmin(
  withErrorHandler(async () => {
    const submissions = await prisma.formSubmission.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(submissions);
  }) as any
);

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const data = validate(formSubmissionSchema, body);
  const submission = await prisma.formSubmission.create({ data: { ...data, status: 'new' } });
  return NextResponse.json(submission, { status: 201 });
});
