'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { CreditCard, MapPin, User, Phone, Mail, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [form, setForm] = useState({
    customerName: '', customerEmail: '', customerPhone: '',
    address: '', city: '', notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.customerEmail || !form.customerPhone) {
      toast.error('لطفاً فیلدهای ضروری را پر کنید');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          totalAmount: total(),
          items: items.map(i => ({
            productId: i.productId,
            productName: i.name,
            quantity: i.quantity,
            price: i.price,
          })),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrderNumber(data.orderNumber);
        setSuccess(true);
        clearCart();
      } else {
        toast.error(data.error || 'خطا در ثبت سفارش');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-card p-10 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">سفارش ثبت شد!</h2>
            <p className="text-gray-500 mb-2">شماره سفارش شما:</p>
            <div className="bg-navy-50 text-navy-800 font-bold text-lg px-6 py-3 rounded-xl mb-5 inline-block">
              {orderNumber}
            </div>
            <p className="text-gray-500 text-sm leading-6 mb-8">
              سفارش شما با موفقیت ثبت شد. کارشناسان ما به زودی با شما تماس خواهند گرفت.
            </p>
            <button onClick={() => router.push('/')} className="btn-primary w-full">
              بازگشت به صفحه اصلی
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!items.length) {
    router.push('/shop/cart');
    return null;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold text-navy-800 mb-8">تکمیل سفارش</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form */}
              <div className="lg:col-span-2 space-y-5">
                {/* Personal Info */}
                <div className="bg-white rounded-2xl shadow-card p-6">
                  <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
                    <User size={18} className="text-navy-600" /> اطلاعات خریدار
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1.5">نام و نام خانوادگی <span className="text-red-500">*</span></label>
                      <input name="customerName" value={form.customerName} onChange={handleChange}
                        className="input-field" placeholder="نام کامل" required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1.5">ایمیل <span className="text-red-500">*</span></label>
                      <input name="customerEmail" type="email" value={form.customerEmail} onChange={handleChange}
                        className="input-field" placeholder="example@email.com" required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1.5">شماره موبایل <span className="text-red-500">*</span></label>
                      <input name="customerPhone" value={form.customerPhone} onChange={handleChange}
                        className="input-field" placeholder="09xxxxxxxxx" required />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-white rounded-2xl shadow-card p-6">
                  <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
                    <MapPin size={18} className="text-navy-600" /> آدرس تحویل
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1.5">شهر</label>
                      <input name="city" value={form.city} onChange={handleChange}
                        className="input-field" placeholder="تهران" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm text-gray-600 mb-1.5">آدرس کامل</label>
                      <input name="address" value={form.address} onChange={handleChange}
                        className="input-field" placeholder="خیابان، کوچه، پلاک..." />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm text-gray-600 mb-1.5">توضیحات (اختیاری)</label>
                      <textarea name="notes" value={form.notes} onChange={handleChange}
                        className="input-field h-20 resize-none" placeholder="توضیحات اضافی..." />
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="bg-white rounded-2xl shadow-card p-6">
                  <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
                    <CreditCard size={18} className="text-navy-600" /> روش پرداخت
                  </h2>
                  <label className="flex items-center gap-3 p-4 border-2 border-navy-600 rounded-xl bg-navy-50 cursor-pointer">
                    <input type="radio" defaultChecked name="payment" className="accent-navy-700" />
                    <div>
                      <div className="font-medium text-navy-800">پرداخت در محل تحویل</div>
                      <div className="text-sm text-gray-500">پرداخت نقدی یا کارتی هنگام تحویل کالا</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl mt-3 cursor-pointer opacity-60">
                    <input type="radio" name="payment" disabled className="accent-navy-700" />
                    <div>
                      <div className="font-medium text-gray-600">پرداخت آنلاین</div>
                      <div className="text-sm text-gray-400">به زودی فعال می‌شود</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
                  <h2 className="font-bold text-gray-800 mb-5">سبد خرید</h2>
                  <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                          {item.image ? <img src={item.image} alt="" className="w-full h-full object-contain p-1" /> : <span className="text-xl">🖨️</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-700 leading-4 line-clamp-2">{item.name}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-400">×{item.quantity}</span>
                            <span className="text-xs font-semibold text-navy-700">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">جمع کل</span>
                      <span>{formatPrice(total())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">ارسال</span>
                      <span className="text-green-600">رایگان</span>
                    </div>
                    <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100">
                      <span>مبلغ کل</span>
                      <span className="text-navy-800">{formatPrice(total())}</span>
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    className="btn-primary w-full mt-5 flex items-center justify-center gap-2 disabled:opacity-70">
                    {loading ? <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : null}
                    {loading ? 'در حال ثبت...' : 'ثبت نهایی سفارش'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
