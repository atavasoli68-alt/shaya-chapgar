import { productRepository } from './product.repository';
import { validate, createProductSchema, updateProductSchema } from '@/lib/validations';
import { ApiError } from '@/lib/errors';
import { slugify } from '@/lib/utils';
import type { ProductFilters, PaginationParams } from '@/types';

/**
 * ─── Product Service ───────────────────────────────────────────────
 * منطق تجاری محصولات اینجاست — نه در Repository (DB) نه در Route (HTTP).
 *
 * مثال افزودن Feature جدید:
 * اگر بخوای "قیمت‌گذاری پویا" اضافه کنی، فقط اینجا یه متد اضافه می‌کنی
 * بدون اینکه کد Route یا Repository رو لمس کنی.
 */
export class ProductService {
  async getProductList(filters: ProductFilters, pagination: PaginationParams) {
    return productRepository.findMany(filters, pagination);
  }

  async getAdminProductList(pagination: PaginationParams) {
    return productRepository.findAll(pagination);
  }

  async getProductBySlug(slug: string) {
    const product = await productRepository.findBySlugOrId(slug);
    if (!product) throw ApiError.notFound('محصول');
    return product;
  }

  async getFeaturedProducts(limit = 6) {
    return productRepository.getFeatured(limit);
  }

  async createProduct(body: unknown) {
    const data = validate(createProductSchema, body);
    // Check slug uniqueness
    if (data.slug) {
      const existing = await productRepository.findBySlugOrId(data.slug);
      if (existing) throw ApiError.conflict('این slug قبلاً استفاده شده است');
    }
    return productRepository.create(data);
  }

  async updateProduct(id: string, body: unknown) {
    const data = validate(updateProductSchema, body);
    return productRepository.update(id, data);
  }

  async deleteProduct(id: string) {
    const product = await productRepository.findBySlugOrId(id);
    if (!product) throw ApiError.notFound('محصول');
    return productRepository.delete(id);
  }

  async getBrands() {
    return productRepository.getBrands();
  }
}

export const productService = new ProductService();
