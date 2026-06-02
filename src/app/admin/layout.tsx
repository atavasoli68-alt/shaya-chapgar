'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, Tag, ShoppingBag, Users,
  Settings, FileText, Menu, X, LogOut, ChevronLeft,
  Bell, Store
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin/dashboard', label: 'داشبورد', icon: LayoutDashboard },
  { href: '/admin/products', label: 'محصولات', icon: Package },
  { href: '/admin/categories', label: 'دسته‌بندی‌ها', icon: Tag },
  { href: '/admin/orders', label: 'سفارش‌ها', icon: ShoppingBag },
  { href: '/admin/blog', label: 'مقالات', icon: FileText },
  { href: '/admin/forms', label: 'فرم‌های ثبت شده', icon: FileText },
  { href: '/admin/users', label: 'کاربران', icon: Users },
  { href: '/admin/blog', label: 'وبلاگ', icon: FileText },
  { href: '/admin/settings', label: 'تنظیمات', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      if (window.innerWidth < 1024) { setSidebarOpen(false); setMobile(true); }
      else { setSidebarOpen(true); setMobile(false); }
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Sidebar overlay */}
      {mobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 right-0 h-full bg-navy-900 text-white z-40 flex flex-col transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-0 overflow-hidden',
        !mobile && 'relative'
      )}>
        {/* Logo */}
        <div className="p-5 border-b border-navy-700 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center font-bold text-navy-900 text-lg">ش</div>
          <div>
            <div className="font-bold text-sm">شایا چاپگر آریا</div>
            <div className="text-navy-400 text-xs">پنل مدیریت</div>
          </div>
          {mobile && (
            <button onClick={() => setSidebarOpen(false)} className="mr-auto text-navy-400 hover:text-white">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => mobile && setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-gold-500 text-white shadow-md'
                    : 'text-navy-300 hover:bg-navy-700 hover:text-white'
                )}
              >
                <Icon size={18} />
                {item.label}
                {active && <ChevronLeft size={14} className="mr-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-navy-700 space-y-1 shrink-0">
          <Link href="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-navy-400 hover:bg-navy-700 hover:text-white transition-colors">
            <Store size={18} />
            مشاهده سایت
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
            <LogOut size={18} />
            خروج از سیستم
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-600 transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="w-9 h-9 bg-navy-700 rounded-xl flex items-center justify-center text-white font-bold text-sm">م</div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
