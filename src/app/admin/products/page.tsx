'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Package, Eye, EyeOff } from 'lucide-react';
import { formatPrice, generateId, slugify, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [form, setForm] = useState<any>({
    name: '', slug: '', description: '', price: '', comparePrice: '',
    sku: '', stock: '0', images: '', categoryId: '', brand: '', isActive: true, isFeatured: false
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [pRes, cRes] = await Promise.all([
      fetch('/api/products?limit=100'),
      fetch('/api/categories'),
    ]);
    const pData = await pRes.json();
    const cData = await cRes.json();
    setProducts(pData.products || []);
    setCategories(cData || []);
    setLoading(false);
  };

  const openNew = () => {
    setEditProduct(null);
    setForm({ name: '', slug: '', description: '', price: '', comparePrice: '', sku: '', stock: '0', images: '', categoryId: '', brand: '', isActive: true, isFeatured: false });
    setShowForm(true);
  };

  const openEdit = (p: any) => {
    setEditProduct(p);
    setForm({ ...p, price: String(p.price), comparePrice: String(p.comparePrice || ''), stock: String(p.stock), images: (p.images || []).join(', ') });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error('نام و قیمت ضروری است'); return; }
    const payload = {
      ...form,
      price: parseFloat(form.price),
      comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
      stock: parseInt(form.stock),
      slug: form.slug || slugify(form.name),
      images: form.images ? form.images.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    };
    try {
      const url = editProduct ? `/api/products/${editProduct.id}` : '/api/products';
      const method = editProduct ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) {
        toast.success(editProduct ? 'محصول ویرایش شد' : 'محصول افزوده شد');
        setShowForm(false);
        loadData();
      }
    } catch { toast.error('خطا'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این محصول مطمئن هستید؟')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    toast.success('محصول حذف شد');
    loadData();
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.brand || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">مدیریت محصولات</h1>
          <p className="text-gray-500 text-sm">{products.length} محصول</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} />
          افزودن محصول
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-card p-4 flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="جستجو..."
            className="w-full border border-gray-200 rounded-xl pr-9 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center"><div className="animate-spin w-8 h-8 border-4 border-navy-700 border-t-transparent rounded-full mx-auto" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">محصول</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">قیمت</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">موجودی</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">وضعیت</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">تاریخ</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 text-xl">
                          {p.images?.[0] ? <img src={p.images[0]} className="w-full h-full object-contain rounded-xl" /> : '🖨️'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 max-w-xs truncate">{p.name}</div>
                          <div className="text-gray-400 text-xs">{p.brand || '—'} · {p.sku || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-800">{formatPrice(p.price)}</div>
                      {p.comparePrice && <div className="text-gray-400 text-xs line-through">{formatPrice(p.comparePrice)}</div>}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge ${p.stock > 0 ? 'badge-success' : 'badge-error'}`}>
                        {p.stock > 0 ? `${p.stock} عدد` : 'ناموجود'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge ${p.isActive ? 'badge-success' : 'badge-gray'}`}>
                        {p.isActive ? 'فعال' : 'غیرفعال'}
                      </span>
                      {p.isFeatured && <span className="badge badge-info mr-1">ویژه</span>}
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{formatDate(p.createdAt)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="w-8 h-8 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors" title="ویرایش">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="w-8 h-8 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors" title="حذف">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr><td colSpan={6} className="py-12 text-center text-gray-400">
                    <Package size={32} className="mx-auto mb-2 opacity-40" />
                    <p>محصولی یافت نشد</p>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl my-8 overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-bold text-gray-800 text-lg">{editProduct ? 'ویرایش محصول' : 'افزودن محصول جدید'}</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1.5">نام محصول <span className="text-red-500">*</span></label>
                  <input value={form.name} onChange={e => setForm((f: any) => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
                    className="input-field" placeholder="نام محصول..." />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">قیمت (تومان) <span className="text-red-500">*</span></label>
                  <input type="number" value={form.price} onChange={e => setForm((f: any) => ({ ...f, price: e.target.value }))}
                    className="input-field" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">قیمت قبل از تخفیف</label>
                  <input type="number" value={form.comparePrice} onChange={e => setForm((f: any) => ({ ...f, comparePrice: e.target.value }))}
                    className="input-field" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">موجودی</label>
                  <input type="number" value={form.stock} onChange={e => setForm((f: any) => ({ ...f, stock: e.target.value }))}
                    className="input-field" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">کد محصول (SKU)</label>
                  <input value={form.sku} onChange={e => setForm((f: any) => ({ ...f, sku: e.target.value }))}
                    className="input-field" placeholder="مثلاً HP-M404N" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">برند</label>
                  <input value={form.brand} onChange={e => setForm((f: any) => ({ ...f, brand: e.target.value }))}
                    className="input-field" placeholder="HP، Canon، Epson..." />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">دسته‌بندی</label>
                  <select value={form.categoryId} onChange={e => setForm((f: any) => ({ ...f, categoryId: e.target.value }))} className="input-field">
                    <option value="">بدون دسته‌بندی</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1.5">تصاویر (آدرس‌ها را با کاما جدا کنید)</label>
                  <input value={form.images} onChange={e => setForm((f: any) => ({ ...f, images: e.target.value }))}
                    className="input-field" placeholder="/images/product.jpg, ..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1.5">توضیحات</label>
                  <textarea value={form.description} onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))}
                    className="input-field h-28 resize-none" placeholder="توضیح کامل محصول..." />
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm((f: any) => ({ ...f, isActive: e.target.checked }))} className="accent-navy-700 w-4 h-4" />
                    <span className="text-sm">محصول فعال باشد</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isFeatured} onChange={e => setForm((f: any) => ({ ...f, isFeatured: e.target.checked }))} className="accent-gold-500 w-4 h-4" />
                    <span className="text-sm">محصول ویژه</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="btn-outline text-sm px-5 py-2.5">انصراف</button>
              <button onClick={handleSave} className="btn-primary text-sm px-5 py-2.5">{editProduct ? 'ذخیره تغییرات' : 'افزودن محصول'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
