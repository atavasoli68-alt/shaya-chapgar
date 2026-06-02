import { NextRequest, NextResponse } from 'next/server';
import { blogService } from '@/modules/blog/blog.service';
import { withAdmin } from '@/middleware/auth';
import { withErrorHandler } from '@/lib/errors';
import { getServerUser } from '@/middleware/auth';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const admin = searchParams.get('admin') === 'true';

  if (admin) {
    const result = await blogService.getAllPosts({
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 20,
    });
    return NextResponse.json(result);
  }

  const result = await blogService.getPublishedPosts({
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 9,
    categorySlug: searchParams.get('category') || '',
    tag: searchParams.get('tag') || '',
    search: searchParams.get('search') || '',
  });
  return NextResponse.json(result);
});

export const POST = withAdmin(
  withErrorHandler(async (req: NextRequest) => {
    const body = await req.json();
    const user = await getServerUser();
    const post = await blogService.createPost({ ...body, authorId: user?.id });
    return NextResponse.json(post, { status: 201 });
  }) as any
);
