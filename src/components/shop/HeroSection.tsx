'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, Shield, Truck, Phone } from 'lucide-react';

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 overflow-hidden min-h-[580px] flex items-center">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.08) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className={`transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-500/30 text-gold-300 text-sm px-4 py-2 rounded-full mb-6">
              <Star size={14} fill="currentColor" />
              بیش از ۱۵ سال تجربه در صنعت
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
              تخصصی‌ترین مرکز
              <span className="text-gold-400 block mt-1">فروش و خدمات</span>
              تجهیزات اداری
            </h1>

            <p className="text-navy-200 text-base md:text-lg leading-8 mb-8">
              پرینتر، کپی‌مشین، اسکنر و لوازم جانبی با بهترین قیمت،
              ضمانت اصالت کالا و خدمات پس از فروش حرفه‌ای
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link href="/shop/products" className="btn-secondary text-base">
                مشاهده محصولات
              </Link>
              <Link href="/forms/consultation" className="btn-outline border-white/40 text-white hover:bg-white hover:text-navy-800 text-base">
                مشاوره رایگان
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6">
              {[
                { icon: Shield, text: 'ضمانت اصالت کالا' },
                { icon: Truck, text: 'ارسال سریع' },
                { icon: Phone, text: 'پشتیبانی ۲۴/۷' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-navy-200 text-sm">
                  <div className="w-8 h-8 bg-gold-500/20 rounded-lg flex items-center justify-center">
                    <Icon size={14} className="text-gold-400" />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual side */}
          <div className={`hidden lg:block transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {[
                    { label: 'محصول فعال', value: '+۲۰۰', color: 'text-gold-400' },
                    { label: 'مشتری راضی', value: '+۵۰۰۰', color: 'text-green-400' },
                    { label: 'برند معتبر', value: '+۱۵', color: 'text-blue-400' },
                    { label: 'سال تجربه', value: '+۱۵', color: 'text-purple-400' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white/10 rounded-2xl p-4 text-center">
                      <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                      <div className="text-navy-200 text-xs mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-white/10 rounded-2xl p-4">
                  <div className="text-white text-sm font-medium mb-3">محصولات پرفروش</div>
                  {[
                    { name: 'HP LaserJet Pro M404n', price: '۸,۵۰۰,۰۰۰ تومان' },
                    { name: 'Canon iR2625i', price: '۴۲,۰۰۰,۰۰۰ تومان' },
                    { name: 'HP Color LaserJet M255dw', price: '۱۴,۵۰۰,۰۰۰ تومان' },
                  ].map(product => (
                    <div key={product.name} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                      <span className="text-navy-200 text-xs">{product.name}</span>
                      <span className="text-gold-300 text-xs font-medium">{product.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white text-xs px-3 py-2 rounded-xl shadow-lg flex items-center gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                موجود در انبار
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gold-500 text-white text-xs px-3 py-2 rounded-xl shadow-lg">
                ✓ گارانتی اصالت
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60H1440V30C1440 30 1140 0 720 0C300 0 0 30 0 30V60Z" fill="#f8fafc" />
        </svg>
      </div>
    </section>
  );
}
