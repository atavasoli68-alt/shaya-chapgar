import { NextRequest, NextResponse } from 'next/server';
import { blogService } from '@/modules/blog/blog.service';
import { withAdmin } from '@/middleware/auth';
import { withErrorHandler } from '@/lib/errors';

export const GET = withErrorHandler(
  async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const post = await blogService.getAdminPost(id);
    return NextResponse.json(post);
  }
);

export const PUT = withAdmin(
  withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const body = await req.json();
    const post = await blogService.updatePost(id, body);
    return NextResponse.json(post);
  }) as any
);

export const DELETE = withAdmin(
  withErrorHandler(async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    await blogService.deletePost(id);
    return NextResponse.json({ success: true });
  }) as any
);
