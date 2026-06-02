'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('لطفاً تمام فیلدهای ضروری را پر کنید');
      return;
    }
    if (form.password.length < 6) {
      toast.error('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('ثبت‌نام با موفقیت انجام شد');
        router.push('/');
      } else {
        toast.error(data.error || 'خطا در ثبت‌نام');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 to-navy-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-gold-500 rounded-2xl flex items-center justify-center text-navy-900 font-bold text-2xl shadow-xl">ش</div>
            <div className="text-white font-bold text-xl">شایا چاپگر آریا</div>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-xl font-bold text-gray-800 mb-1">ایجاد حساب کاربری</h1>
          <p className="text-gray-500 text-sm mb-6">برای خرید و پیگیری سفارشات ثبت‌نام کنید</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5 font-medium">نام کامل <span className="text-red-500">*</span></label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="input-field" placeholder="نام و نام خانوادگی" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5 font-medium">ایمیل <span className="text-red-500">*</span></label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="input-field" placeholder="example@email.com" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5 font-medium">شماره موبایل</label>
              <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="input-field" placeholder="09xxxxxxxxx" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5 font-medium">رمز عبور <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="input-field pl-10" placeholder="حداقل ۶ کاراکتر" dir="ltr" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <UserPlus size={18} />}
              {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            قبلاً ثبت‌نام کرده‌اید؟{' '}
            <Link href="/auth/login" className="text-navy-700 font-medium hover:underline">ورود</Link>
          </p>
          <div className="text-center mt-3">
            <Link href="/" className="text-sm text-gray-400 hover:text-navy-700 transition-colors">← بازگشت به سایت</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
