'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/ui/ChatWidget';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Phone, Shield, Truck, Star, ChevronLeft, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then(r => r.json())
      .then(data => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    addItem({ productId: product.id, name: product.name, price: product.price, image: product.images?.[0] });
    toast.success(`${product.name} به سبد خرید اضافه شد`);
  };

  if (loading) return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-navy-700 border-t-transparent rounded-full" />
      </div>
    </>
  );

  if (!product || product.error) return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-6xl">😔</div>
        <h2 className="text-xl font-bold text-gray-700">محصول یافت نشد</h2>
        <Link href="/shop/products" className="btn-primary">بازگشت به محصولات</Link>
      </div>
    </>
  );

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const productImages = product.images?.length ? product.images : [null];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-navy-700">خانه</Link>
            <ChevronLeft size={14} />
            <Link href="/shop/products" className="hover:text-navy-700">محصولات</Link>
            {product.categoryName && (
              <>
                <ChevronLeft size={14} />
                <span>{product.categoryName}</span>
              </>
            )}
            <ChevronLeft size={14} />
            <span className="text-navy-800 font-medium">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Images */}
            <div>
              <div className="bg-white rounded-3xl aspect-square flex items-center justify-center overflow-hidden shadow-card mb-4">
                {productImages[selectedImage] ? (
                  <img src={productImages[selectedImage]} alt={product.name} className="w-full h-full object-contain p-8" />
                ) : (
                  <div className="text-9xl">🖨️</div>
                )}
              </div>
              {productImages.length > 1 && (
                <div className="flex gap-3">
                  {productImages.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 bg-white rounded-2xl overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-navy-600' : 'border-gray-200'}`}
                    >
                      {img ? <img src={img} alt="" className="w-full h-full object-contain p-2" /> : <div className="text-2xl flex items-center justify-center h-full">🖨️</div>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              {product.brand && (
                <div className="text-gold-600 text-sm font-medium mb-2">{product.brand}</div>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-navy-900 leading-tight mb-4">
                {product.name}
              </h1>

              {/* Rating placeholder */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex text-gold-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <span className="text-gray-500 text-sm">(۲۴ نظر)</span>
              </div>

              {/* Price */}
              <div className="bg-navy-50 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-3xl font-bold text-navy-800">{formatPrice(product.price)}</span>
                  {discount > 0 && (
                    <span className="bg-red-500 text-white text-sm font-bold px-2 py-0.5 rounded-lg">{discount}٪</span>
                  )}
                </div>
                {product.comparePrice && (
                  <div className="text-gray-400 text-sm line-through">{formatPrice(product.comparePrice)}</div>
                )}
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `موجود در انبار (${product.stock} عدد)` : 'ناموجود'}
                </span>
              </div>

              {/* Quantity + Add to cart */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>
                  <button onClick={handleAddToCart} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    <ShoppingCart size={18} />
                    افزودن به سبد خرید
                  </button>
                </div>
              )}

              <Link href="/forms/consultation" className="btn-outline w-full mb-6 text-center block">
                مشاوره قبل از خرید
              </Link>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Shield, label: 'ضمانت اصالت' },
                  { icon: Truck, label: 'ارسال سریع' },
                  { icon: Phone, label: 'پشتیبانی ۲۴ساعته' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl p-3 text-center">
                    <Icon size={20} className="text-navy-600" />
                    <span className="text-xs text-gray-600">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-12 bg-white rounded-3xl shadow-card p-8">
              <h2 className="text-xl font-bold text-navy-800 mb-4">توضیحات محصول</h2>
              <p className="text-gray-600 leading-8 whitespace-pre-line">{product.description}</p>
            </div>
          )}

          {/* Specs placeholder */}
          {product.sku && (
            <div className="mt-6 bg-white rounded-3xl shadow-card p-8">
              <h2 className="text-xl font-bold text-navy-800 mb-4">مشخصات</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['کد محصول (SKU)', product.sku],
                  ['برند', product.brand || '—'],
                  ['دسته‌بندی', product.categoryName || '—'],
                  ['موجودی', `${product.stock} عدد`],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                    <span className="text-gray-500 text-sm w-36 shrink-0">{label}:</span>
                    <span className="text-gray-800 text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
