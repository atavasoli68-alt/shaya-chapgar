'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ProductWithCategory, ProductFilters, PaginationParams, PaginatedResponse } from '@/types';

/**
 * ─── useProducts ───────────────────────────────────────────────────
 * Hook برای fetch محصولات با فیلتر و pagination
 * در هر کامپوننت که نیاز به لیست محصول داری، فقط این hook رو use کن.
 */
export function useProducts(
  filters: ProductFilters = {},
  pagination: PaginationParams = {}
) {
  const [data, setData] = useState<PaginatedResponse<ProductWithCategory> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.category) params.set('category', filters.category);
      if (filters.featured) params.set('featured', 'true');
      if (filters.brand) params.set('brand', filters.brand);
      if (filters.minPrice) params.set('minPrice', String(filters.minPrice));
      if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice));
      if (filters.inStock) params.set('inStock', 'true');
      if (pagination.page) params.set('page', String(pagination.page));
      if (pagination.limit) params.set('limit', String(pagination.limit));
      if (pagination.sortBy) params.set('sortBy', pagination.sortBy);
      if (pagination.sortOrder) params.set('sortOrder', pagination.sortOrder);

      const res = await globalThis.fetch(`/api/products?${params}`);
      if (!res.ok) throw new Error('خطا در بارگذاری');
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters), JSON.stringify(pagination)]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { data, loading, error, refetch: fetch_ };
}

/**
 * ─── useSingleProduct ──────────────────────────────────────────────
 */
export function useSingleProduct(slug: string) {
  const [product, setProduct] = useState<ProductWithCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    globalThis.fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((d) => { if (d.error) setError(d.error); else setProduct(d); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  return { product, loading, error };
}

/**
 * ─── useCategories ────────────────────────────────────────────────
 */
export function useCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    globalThis.fetch('/api/categories')
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const parentCategories = categories.filter((c) => !c.parentId);
  const getChildren = (parentId: string) => categories.filter((c) => c.parentId === parentId);

  return { categories, parentCategories, getChildren, loading };
}

/**
 * ─── useSettings ──────────────────────────────────────────────────
 */
export function useSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    globalThis.fetch('/api/settings')
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
}

/**
 * ─── useAdminStats ────────────────────────────────────────────────
 */
export function useAdminStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    globalThis.fetch('/api/admin/stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}
