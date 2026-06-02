'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Printer, Copy, ScanLine, Package, Cpu, Settings } from 'lucide-react';

const categoryIcons: Record<string, React.ElementType> = {
  'printer': Printer,
  'copier': Copy,
  'scanner': ScanLine,
  'accessories': Package,
  'hp-printer': Printer,
  'laser-printer': Printer,
};

const categoryColors = [
  'from-blue-500 to-navy-600',
  'from-gold-400 to-gold-600',
  'from-green-500 to-teal-600',
  'from-purple-500 to-purple-700',
  'from-red-500 to-rose-600',
  'from-orange-500 to-amber-600',
];

export default function CategoriesSection() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => setCategories(data.filter((c: any) => !c.parentId)))
      .catch(() => {});
  }, []);

  if (!categories.length) return null;

  return (
    <section className="py-14 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="section-title">دسته‌بندی محصولات</h2>
          <p className="section-subtitle">جستجو بر اساس نوع تجهیزات</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((cat, i) => {
            const Icon = categoryIcons[cat.slug] || Cpu;
            const gradient = categoryColors[i % categoryColors.length];
            return (
              <Link
                key={cat.id}
                href={`/shop/products?category=${cat.slug}`}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-card-hover transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={26} className="text-white" />
                </div>
                <span className="text-gray-700 text-sm font-medium text-center group-hover:text-navy-700 transition-colors">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
