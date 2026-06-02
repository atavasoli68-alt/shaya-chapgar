import { NextRequest, NextResponse } from 'next/server';
import { blogService } from '@/modules/blog/blog.service';
import { withAdmin } from '@/middleware/auth';
import { withErrorHandler } from '@/lib/errors';

export const GET = withErrorHandler(async () => {
  const cats = await blogService.getCategories();
  return NextResponse.json(cats);
});

export const POST = withAdmin(
  withErrorHandler(async (req: NextRequest) => {
    const { name, color } = await req.json();
    const cat = await blogService.createCategory(name, color);
    return NextResponse.json(cat, { status: 201 });
  }) as any
);
