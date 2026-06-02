'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('ایمیل و رمز عبور را وارد کنید'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('ورود موفق');
        if (data.user?.role === 'admin') router.push('/admin/dashboard');
        else router.push('/');
      } else {
        toast.error(data.error || 'خطا در ورود');
      }
    } catch { toast.error('خطا در ارتباط با سرور'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 to-navy-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-gold-500 rounded-2xl flex items-center justify-center text-navy-900 font-bold text-2xl shadow-xl">ش</div>
            <div className="text-white font-bold text-xl">شایا چاپگر آریا</div>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-xl font-bold text-gray-800 mb-1">ورود به حساب</h1>
          <p className="text-gray-500 text-sm mb-6">برای دسترسی به پنل مدیریت وارد شوید</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5 font-medium">ایمیل</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="input-field" placeholder="example@email.com" dir="ltr" autoFocus />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5 font-medium">رمز عبور</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  className="input-field pl-10" placeholder="رمز عبور خود را وارد کنید" dir="ltr" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <LogIn size={18} />}
              {loading ? 'در حال ورود...' : 'ورود'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
            <p className="text-blue-700 text-xs font-medium mb-2">اطلاعات دمو (اولین ورود):</p>
            <p className="text-blue-600 text-xs font-mono">ایمیل: admin@shaya.ir</p>
            <p className="text-blue-600 text-xs font-mono">رمز عبور: admin1234</p>
          </div>

          <div className="text-center mt-5">
            <Link href="/" className="text-sm text-gray-500 hover:text-navy-700 transition-colors">
              ← بازگشت به سایت
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
