'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/shop/ProductCard';
import ChatWidget from '@/components/ui/ChatWidget';
import { Search, Filter, ChevronDown, X } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('newest');
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (selectedCategory) params.set('category', selectedCategory);
    params.set('page', String(page));
    params.set('limit', '12');

    fetch(`/api/products?${params}`)
      .then(r => r.json())
      .then(data => {
        let prods = data.products || [];
        // Client-side sort
        if (sortBy === 'price-asc') prods = [...prods].sort((a, b) => a.price - b.price);
        if (sortBy === 'price-desc') prods = [...prods].sort((a, b) => b.price - a.price);
        if (sortBy === 'newest') prods = [...prods].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        // Price filter
        if (priceRange.min) prods = prods.filter((p: any) => p.price >= Number(priceRange.min) * 1000);
        if (priceRange.max) prods = prods.filter((p: any) => p.price <= Number(priceRange.max) * 1000);
        setProducts(prods);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [search, selectedCategory, page, sortBy]);

  const parentCategories = categories.filter(c => !c.parentId);
  const totalPages = Math.ceil(total / 12);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-100 py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-navy-800 mb-1">محصولات</h1>
            <p className="text-gray-500 text-sm">
              {total} محصول یافت شد
              {selectedCategory && categories.find(c => c.slug === selectedCategory) &&
                ` در دسته "${categories.find(c => c.slug === selectedCategory)?.name}"`}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl shadow-card p-4 mb-6 flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="flex-1 min-w-48 relative">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="جستجو در محصولات..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full border border-gray-200 rounded-xl pr-9 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
              />
            </div>

            {/* Category select */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={e => { setSelectedCategory(e.target.value); setPage(1); }}
                className="appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 pl-8 bg-white"
              >
                <option value="">همه دسته‌بندی‌ها</option>
                {parentCategories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 pl-8 bg-white"
              >
                <option value="newest">جدیدترین</option>
                <option value="price-asc">ارزان‌ترین</option>
                <option value="price-desc">گران‌ترین</option>
              </select>
              <ChevronDown size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
            >
              <Filter size={14} />
              فیلتر قیمت
            </button>

            {(search || selectedCategory) && (
              <button
                onClick={() => { setSearch(''); setSelectedCategory(''); setPage(1); }}
                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
              >
                <X size={14} />
                پاک کردن فیلترها
              </button>
            )}
          </div>

          {/* Price filter */}
          {filterOpen && (
            <div className="bg-white rounded-2xl shadow-card p-4 mb-6 flex items-center gap-4 animate-fade-in">
              <span className="text-sm text-gray-600">بازه قیمت (هزار تومان):</span>
              <input
                type="number"
                placeholder="از"
                value={priceRange.min}
                onChange={e => setPriceRange(p => ({ ...p, min: e.target.value }))}
                className="w-28 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
              />
              <span className="text-gray-400">تا</span>
              <input
                type="number"
                placeholder="تا"
                value={priceRange.max}
                onChange={e => setPriceRange(p => ({ ...p, max: e.target.value }))}
                className="w-28 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
              />
              <button
                onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 100); }}
                className="bg-navy-700 text-white px-4 py-2 rounded-xl text-sm hover:bg-navy-800 transition-colors"
              >
                اعمال
              </button>
            </div>
          )}

          {/* Product grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">محصولی یافت نشد</h3>
              <p className="text-gray-500">فیلترها را تغییر دهید یا عبارت دیگری جستجو کنید</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                    page === i + 1
                      ? 'bg-navy-700 text-white shadow-navy'
                      : 'bg-white text-gray-600 hover:bg-navy-50 border border-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-navy-700 border-t-transparent rounded-full" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
