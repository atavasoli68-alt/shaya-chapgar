import prisma from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import type { CreateProductInput, UpdateProductInput } from '@/lib/validations';
import type { ProductFilters, PaginationParams, PaginatedResponse, ProductWithCategory } from '@/types';

/**
 * ─── Product Repository ────────────────────────────────────────────
 * تمام عملیات دیتابیس مربوط به محصولات اینجاست.
 * هیچ SQL یا Prisma query‌ای نباید در API route وجود داشته باشه.
 * برای اضافه کردن query جدید، فقط یک متد به این کلاس اضافه کن.
 */
export class ProductRepository {
  /**
   * لیست محصولات با فیلتر، جستجو و صفحه‌بندی
   */
  async findMany(
    filters: ProductFilters = {},
    pagination: PaginationParams = {}
  ): Promise<PaginatedResponse<ProductWithCategory>> {
    const { search, category, featured, minPrice, maxPrice, brand, inStock } = filters;
    const { page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;

    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      const targetCat = await prisma.category.findFirst({
        where: { OR: [{ slug: category }, { id: category }] },
      });
      if (targetCat) {
        const children = await prisma.category.findMany({ where: { parentId: targetCat.id } });
        where.categoryId = { in: [targetCat.id, ...children.map((c: any) => c.id)] };
      }
    }

    if (featured) where.isFeatured = true;
    if (minPrice !== undefined) where.price = { ...where.price, gte: minPrice };
    if (maxPrice !== undefined) where.price = { ...where.price, lte: maxPrice };
    if (brand) where.brand = { equals: brand, mode: 'insensitive' };
    if (inStock) where.stock = { gt: 0 };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: { select: { name: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data: items.map((p: any) => ({ ...p, categoryName: p.category?.name })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * یک محصول بر اساس slug یا id
   */
  async findBySlugOrId(slugOrId: string): Promise<ProductWithCategory | null> {
    const product = await prisma.product.findFirst({
      where: { OR: [{ slug: slugOrId }, { id: slugOrId }], isActive: true },
      include: { category: { select: { name: true } } },
    });
    if (!product) return null;
    return { ...product, categoryName: product.category?.name };
  }

  /**
   * همه محصولات (ادمین)
   */
  async findAll(pagination: PaginationParams = {}): Promise<PaginatedResponse<ProductWithCategory>> {
    const { page = 1, limit = 50 } = pagination;
    const [items, total] = await Promise.all([
      prisma.product.findMany({
        include: { category: { select: { name: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count(),
    ]);
    return {
      data: items.map((p: any) => ({ ...p, categoryName: p.category?.name })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(data: CreateProductInput) {
    return prisma.product.create({
      data: {
        ...data,
        slug: data.slug || slugify(data.name),
        comparePrice: data.comparePrice ?? null,
        sku: data.sku ?? null,
        categoryId: data.categoryId ?? null,
      },
    });
  }

  async update(id: string, data: UpdateProductInput) {
    return prisma.product.update({
      where: { id },
      data: {
        ...data,
        comparePrice: data.comparePrice ?? null,
        categoryId: data.categoryId ?? null,
      },
    });
  }

  async delete(id: string) {
    return prisma.product.delete({ where: { id } });
  }

  async updateStock(id: string, quantity: number) {
    return prisma.product.update({
      where: { id },
      data: { stock: { decrement: quantity } },
    });
  }

  async getFeatured(limit = 6) {
    return prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { category: { select: { name: true } } },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBrands(): Promise<string[]> {
    const result = await prisma.product.groupBy({
      by: ['brand'],
      where: { isActive: true, brand: { not: null } },
    });
    return result.map((r: any) => r.brand!).filter(Boolean);
  }
}

export const productRepository = new ProductRepository();
