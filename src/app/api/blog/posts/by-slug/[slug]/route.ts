import { NextRequest, NextResponse } from 'next/server';
import { blogService } from '@/modules/blog/blog.service';
import { withErrorHandler } from '@/lib/errors';

export const GET = withErrorHandler(
  async (_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    const data = await blogService.getPost(slug);
    return NextResponse.json(data);
  }
);
