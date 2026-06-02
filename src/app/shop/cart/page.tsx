'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/ui/ChatWidget';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center py-20">
            <ShoppingCart size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">سبد خرید خالی است</h2>
            <p className="text-gray-500 mb-8">محصولات مورد نظر خود را انتخاب کنید</p>
            <Link href="/shop/products" className="btn-primary inline-flex">
              مشاهده محصولات
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold text-navy-800 mb-8">سبد خرید</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-2xl shadow-card p-5 flex gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                    ) : (
                      <span className="text-3xl">🖨️</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm leading-5 mb-2 line-clamp-2">{item.name}</h3>
                    <div className="text-navy-700 font-bold text-sm mb-3">{formatPrice(item.price)}</div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors">
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-700 font-semibold text-sm">{formatPrice(item.price * item.quantity)}</span>
                        <button onClick={() => removeItem(item.productId)}
                          className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
                <h2 className="font-bold text-gray-800 text-lg mb-5">خلاصه سفارش</h2>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">تعداد اقلام</span>
                    <span className="font-medium">{items.reduce((s, i) => s + i.quantity, 0)} عدد</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">جمع کل</span>
                    <span className="font-medium">{formatPrice(total())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">هزینه ارسال</span>
                    <span className="text-green-600 font-medium">رایگان</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between font-bold">
                    <span>مبلغ قابل پرداخت</span>
                    <span className="text-navy-800 text-lg">{formatPrice(total())}</span>
                  </div>
                </div>
                <Link href="/shop/checkout" className="btn-primary w-full text-center block mb-3">
                  ادامه خرید
                </Link>
                <Link href="/shop/products" className="btn-outline w-full text-center block text-sm">
                  ← ادامه خرید
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
