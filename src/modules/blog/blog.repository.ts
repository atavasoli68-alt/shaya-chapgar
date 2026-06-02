import prisma from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export interface CreateBlogPostInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  categoryId?: string;
  tags?: string[];
  isPublished?: boolean;
  isFeatured?: boolean;
  authorId?: string;
}

export class BlogRepository {
  // ─── Public queries ───────────────────────────────────────
  async findPublished({ page = 1, limit = 9, categorySlug = '', tag = '', search = '' } = {}) {
    const where: any = { isPublished: true };
    if (search) where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
    ];
    if (categorySlug) {
      const cat = await prisma.blogCategory.findUnique({ where: { slug: categorySlug } });
      if (cat) where.categoryId = cat.id;
    }
    if (tag) where.tags = { has: tag };

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: { category: true, author: { select: { name: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.blogPost.count({ where }),
    ]);
    return { posts, total, totalPages: Math.ceil(total / limit) };
  }

  async findFeatured(limit = 3) {
    return prisma.blogPost.findMany({
      where: { isPublished: true, isFeatured: true },
      include: { category: true, author: { select: { name: true } } },
      take: limit,
      orderBy: { publishedAt: 'desc' },
    });
  }

  async findLatest(limit = 4) {
    return prisma.blogPost.findMany({
      where: { isPublished: true },
      include: { category: true, author: { select: { name: true } } },
      take: limit,
      orderBy: { publishedAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    return prisma.blogPost.findUnique({
      where: { slug },
      include: { category: true, author: { select: { name: true } } },
    });
  }

  async incrementView(id: string) {
    return prisma.blogPost.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }

  async findRelated(post: any, limit = 3) {
    return prisma.blogPost.findMany({
      where: {
        isPublished: true,
        id: { not: post.id },
        OR: [
          { categoryId: post.categoryId },
          { tags: { hasSome: post.tags } },
        ],
      },
      include: { category: true },
      take: limit,
      orderBy: { publishedAt: 'desc' },
    });
  }

  // ─── Admin queries ────────────────────────────────────────
  async findAll({ page = 1, limit = 20 } = {}) {
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        include: { category: true, author: { select: { name: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.blogPost.count(),
    ]);
    return { posts, total };
  }

  async findById(id: string) {
    return prisma.blogPost.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async create(data: CreateBlogPostInput & { authorId?: string }) {
    const slug = data.slug || slugify(data.title);
    return prisma.blogPost.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt || '',
        content: data.content,
        coverImage: data.coverImage || null,
        categoryId: data.categoryId || null,
        tags: data.tags || [],
        isPublished: data.isPublished || false,
        isFeatured: data.isFeatured || false,
        authorId: data.authorId || null,
        publishedAt: data.isPublished ? new Date() : null,
      },
    });
  }

  async update(id: string, data: Partial<CreateBlogPostInput>) {
    const current = await this.findById(id);
    return prisma.blogPost.update({
      where: { id },
      data: {
        ...data,
        slug: data.slug || (data.title ? slugify(data.title) : undefined),
        categoryId: data.categoryId || null,
        publishedAt: data.isPublished && !current?.publishedAt ? new Date() : undefined,
      },
    });
  }

  async delete(id: string) {
    return prisma.blogPost.delete({ where: { id } });
  }

  // ─── Categories ───────────────────────────────────────────
  async getCategories() {
    return prisma.blogCategory.findMany({
      include: { _count: { select: { posts: { where: { isPublished: true } } } } },
      orderBy: { name: 'asc' },
    });
  }

  async createCategory(name: string, color = '#1e3a6e') {
    return prisma.blogCategory.create({
      data: { name, slug: slugify(name), color },
    });
  }
}

export const blogRepository = new BlogRepository();
