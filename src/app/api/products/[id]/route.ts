import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/modules/products/product.service';
import { withAdmin } from '@/middleware/auth';
import { withErrorHandler } from '@/lib/errors';

export const GET = withErrorHandler(
  async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const product = await productService.getProductBySlug(id);
    return NextResponse.json(product);
  }
);

export const PUT = withAdmin(
  withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const body = await req.json();
    const product = await productService.updateProduct(id, body);
    return NextResponse.json(product);
  }) as any
);

export const DELETE = withAdmin(
  withErrorHandler(async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    await productService.deleteProduct(id);
    return NextResponse.json({ success: true });
  }) as any
);
