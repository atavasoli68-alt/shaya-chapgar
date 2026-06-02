'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Menu, X, Phone, ChevronDown, User } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { items } = useCartStore();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => setCategories(data.filter((c: any) => !c.parentId).slice(0, 6)))
      .catch(() => {});
  }, []);

  const navLinks = [
    { label: 'خانه', href: '/' },
    { label: 'محصولات', href: '/shop/products' },
    { label: 'خدمات', href: '/#services' },
    { label: 'درخواست تعمیر', href: '/forms/repair' },
    { label: 'درباره ما', href: '/#about' },
    { label: 'وبلاگ', href: '/blog' },
    { label: 'تماس', href: '/#contact' },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="bg-navy-800 text-white text-xs py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Phone size={12} />
              ۰۲۱-۸۸۱۲۳۴۵۶
            </span>
            <span>شنبه تا چهارشنبه ۸ تا ۱۷</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/forms/consultation" className="hover:text-gold-400 transition-colors">مشاوره رایگان</Link>
            <span className="text-navy-400">|</span>
            <Link href="/auth/login" className="hover:text-gold-400 transition-colors flex items-center gap-1">
              <User size={12} />
              ورود / ثبت‌نام
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 bg-navy-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-navy">
                ش
              </div>
              <div className="hidden sm:block">
                <div className="text-navy-800 font-bold text-base leading-tight">شایا چاپگر آریا</div>
                <div className="text-gold-500 text-xs">فروش و خدمات تجهیزات اداری</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-600 hover:text-navy-700 hover:bg-navy-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
              {categories.length > 0 && (
                <div className="relative group">
                  <button className="text-gray-600 hover:text-navy-700 hover:bg-navy-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1">
                    دسته‌بندی‌ها
                    <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-card-hover border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {categories.map(cat => (
                      <Link
                        key={cat.id}
                        href={`/shop/products?category=${cat.slug}`}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-navy-50 hover:text-navy-700 first:rounded-t-2xl last:rounded-b-2xl transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-600 hover:text-navy-700 transition-colors"
              >
                <Search size={20} />
              </button>

              <Link
                href="/shop/cart"
                className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-600 hover:text-navy-700 transition-colors"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -left-1 w-5 h-5 bg-gold-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-gray-100 bg-white px-4 py-3 animate-fade-in">
            <div className="max-w-2xl mx-auto relative">
              <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="جستجوی محصول..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    window.location.href = `/shop/products?search=${encodeURIComponent(searchQuery)}`;
                  }
                }}
                className="w-full border border-gray-200 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white animate-fade-in">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-gray-700 hover:bg-navy-50 hover:text-navy-700 rounded-xl text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-100 flex items-center gap-4 text-sm text-gray-600">
                <Phone size={14} />
                <span>۰۲۱-۸۸۱۲۳۴۵۶</span>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
