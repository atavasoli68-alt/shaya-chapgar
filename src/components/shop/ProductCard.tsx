'use client';

import Link from 'next/link';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  brand?: string;
  stock: number;
  categoryName?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
    });
    toast.success('محصول به سبد خرید اضافه شد');
  };

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <Link href={`/shop/products/${product.slug}`} className="group card overflow-hidden">
      {/* Image */}
      <div className="relative bg-gray-50 aspect-square overflow-hidden">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🖨️</div>
        )}

        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            {discount}٪ تخفیف
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 text-sm font-medium px-4 py-2 rounded-lg">ناموجود</span>
          </div>
        )}

        {/* Quick actions */}
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-9 h-9 bg-navy-700 hover:bg-navy-800 text-white rounded-xl flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="افزودن به سبد خرید"
          >
            <ShoppingCart size={15} />
          </button>
          <button className="w-9 h-9 bg-white hover:bg-gray-50 text-gray-700 rounded-xl flex items-center justify-center shadow-lg transition-colors">
            <Eye size={15} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {product.brand && (
          <span className="text-xs text-gray-400 mb-1 block">{product.brand}</span>
        )}
        <h3 className="text-sm font-semibold text-gray-800 leading-5 mb-2 line-clamp-2 group-hover:text-navy-700 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-3">
          <div>
            <div className="text-navy-800 font-bold text-sm">{formatPrice(product.price)}</div>
            {product.comparePrice && (
              <div className="text-gray-400 text-xs line-through">{formatPrice(product.comparePrice)}</div>
            )}
          </div>
          {product.stock > 0 && (
            <div className="flex items-center gap-1 text-green-600 text-xs">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              موجود
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
