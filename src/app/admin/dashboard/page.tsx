'use client';

import { useState, useEffect } from 'react';
import { Package, ShoppingBag, Users, FileText, TrendingUp, DollarSign, Clock, ArrowUpRight } from 'lucide-react';
import { formatPrice, formatDate, statusLabels } from '@/lib/utils';
import Link from 'next/link';

interface Stats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  monthlyOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalUsers: number;
  newSubmissions: number;
  recentOrders: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: 'کل محصولات', value: stats.totalProducts, sub: `${stats.activeProducts} فعال`, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', href: '/admin/products' },
    { label: 'سفارش‌ها', value: stats.totalOrders, sub: `${stats.monthlyOrders} این ماه`, icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-50', href: '/admin/orders' },
    { label: 'فرم‌های جدید', value: stats.newSubmissions, sub: 'در انتظار بررسی', icon: FileText, color: 'text-gold-600', bg: 'bg-gold-50', href: '/admin/forms' },
    { label: 'کاربران', value: stats.totalUsers, sub: 'مجموع ثبت‌نام', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', href: '/admin/users' },
  ] : [];

  const revenueCards = stats ? [
    { label: 'درآمد این ماه', value: formatPrice(stats.monthlyRevenue), icon: TrendingUp, color: 'text-green-600' },
    { label: 'کل درآمد', value: formatPrice(stats.totalRevenue), icon: DollarSign, color: 'text-navy-600' },
  ] : [];

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-white rounded-2xl animate-pulse" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">داشبورد</h1>
        <p className="text-gray-500 text-sm mt-1">خلاصه وضعیت فروشگاه</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href}
              className="bg-white rounded-2xl shadow-card p-5 flex flex-col gap-3 hover:shadow-card-hover transition-shadow group">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center`}>
                  <Icon size={20} className={card.color} />
                </div>
                <ArrowUpRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{card.value}</div>
                <div className="text-gray-500 text-xs mt-0.5">{card.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{card.sub}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Revenue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {revenueCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl shadow-card p-6 flex items-center gap-5">
              <div className="w-14 h-14 bg-navy-50 rounded-2xl flex items-center justify-center">
                <Icon size={26} className={card.color} />
              </div>
              <div>
                <div className="text-gray-500 text-sm">{card.label}</div>
                <div className="text-xl font-bold text-gray-800 mt-0.5">{card.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800">سفارش‌های اخیر</h2>
          <Link href="/admin/orders" className="text-sm text-navy-600 hover:text-navy-800 transition-colors">مشاهده همه</Link>
        </div>
        {stats?.recentOrders?.length ? (
          <div className="divide-y divide-gray-50">
            {stats.recentOrders.map((order: any) => (
              <div key={order.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 bg-navy-50 rounded-xl flex items-center justify-center shrink-0">
                  <ShoppingBag size={16} className="text-navy-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 text-sm">{order.orderNumber}</div>
                  <div className="text-gray-500 text-xs">{order.customerName}</div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-800">{formatPrice(order.totalAmount)}</div>
                  <div className="text-xs text-gray-400">{formatDate(order.createdAt)}</div>
                </div>
                <span className={`badge shrink-0 ${
                  order.status === 'delivered' ? 'badge-success' :
                  order.status === 'cancelled' ? 'badge-error' :
                  order.status === 'processing' ? 'badge-info' : 'badge-warning'
                }`}>
                  {statusLabels[order.status] || order.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-400">
            <ShoppingBag size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">هنوز سفارشی ثبت نشده</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-card p-5">
        <h2 className="font-bold text-gray-800 mb-4">دسترسی سریع</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'افزودن محصول', href: '/admin/products?new=true', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
            { label: 'دسته‌بندی جدید', href: '/admin/categories?new=true', color: 'bg-green-50 text-green-700 hover:bg-green-100' },
            { label: 'بررسی فرم‌ها', href: '/admin/forms', color: 'bg-gold-50 text-gold-700 hover:bg-gold-100' },
            { label: 'تنظیمات سایت', href: '/admin/settings', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
          ].map(action => (
            <Link key={action.label} href={action.href}
              className={`${action.color} rounded-xl px-4 py-3 text-sm font-medium text-center transition-colors`}>
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
