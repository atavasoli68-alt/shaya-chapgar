import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/modules/products/product.service';
import { withAdmin } from '@/middleware/auth';
import { withErrorHandler } from '@/lib/errors';
import { PAGINATION } from '@/config';

/**
 * GET /api/products
 * لیست محصولات با فیلتر، جستجو و صفحه‌بندی
 */
export const GET = withErrorHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  const result = await productService.getProductList(
    {
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      featured: searchParams.get('featured') === 'true',
      brand: searchParams.get('brand') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      inStock: searchParams.get('inStock') === 'true',
    },
    {
      page: Number(searchParams.get('page')) || PAGINATION.defaultPage,
      limit: Math.min(Number(searchParams.get('limit')) || PAGINATION.defaultLimit, PAGINATION.maxLimit),
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    }
  );

  return NextResponse.json(result);
});

/**
 * POST /api/products
 * ایجاد محصول جدید — فقط ادمین
 */
export const POST = withAdmin(
  withErrorHandler(async (req: NextRequest) => {
    const body = await req.json();
    const product = await productService.createProduct(body);
    return NextResponse.json(product, { status: 201 });
  }) as any
);
