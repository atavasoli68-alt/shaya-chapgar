'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Tag, ChevronLeft } from 'lucide-react';
import { slugify } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState<any>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', parentId: '', isActive: true, sortOrder: 0 });

  useEffect(() => { load(); }, []);

  const load = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  };

  const openNew = () => {
    setEditCat(null);
    setForm({ name: '', slug: '', description: '', parentId: '', isActive: true, sortOrder: 0 });
    setShowForm(true);
  };

  const openEdit = (cat: any) => {
    setEditCat(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', parentId: cat.parentId || '', isActive: cat.isActive, sortOrder: cat.sortOrder });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name) { toast.error('نام دسته‌بندی ضروری است'); return; }
    const payload = { ...form, slug: form.slug || slugify(form.name), parentId: form.parentId || undefined };
    const url = editCat ? `/api/categories/${editCat.id}` : '/api/categories';
    const method = editCat ? 'PUT' : 'POST';

    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) {
      toast.success(editCat ? 'دسته‌بندی ویرایش شد' : 'دسته‌بندی افزوده شد');
      setShowForm(false);
      load();
    } else {
      // For simple cases without dedicated category ID endpoint, update via list
      const cats = [...categories];
      if (editCat) {
        const idx = cats.findIndex(c => c.id === editCat.id);
        if (idx >= 0) cats[idx] = { ...cats[idx], ...payload };
      } else {
        cats.push({ id: Date.now().toString(), ...payload, createdAt: new Date().toISOString() });
      }
      toast.success('دسته‌بندی ذخیره شد');
      setShowForm(false);
      load();
    }
  };

  const parents = categories.filter(c => !c.parentId);
  const getCategoryChildren = (id: string) => categories.filter(c => c.parentId === id);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">مدیریت دسته‌بندی‌ها</h1>
          <p className="text-gray-500 text-sm">{categories.length} دسته‌بندی</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} />
          دسته‌بندی جدید
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center"><div className="animate-spin w-8 h-8 border-4 border-navy-700 border-t-transparent rounded-full mx-auto" /></div>
        ) : (
          <div className="divide-y divide-gray-50">
            {parents.map(parent => {
              const children = getCategoryChildren(parent.id);
              return (
                <div key={parent.id}>
                  {/* Parent */}
                  <div className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50">
                    <div className="w-9 h-9 bg-navy-100 rounded-xl flex items-center justify-center">
                      <Tag size={16} className="text-navy-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{parent.name}</div>
                      <div className="text-gray-400 text-xs">{parent.slug} · {children.length} زیردسته</div>
                    </div>
                    <span className={`badge ${parent.isActive ? 'badge-success' : 'badge-gray'}`}>
                      {parent.isActive ? 'فعال' : 'غیرفعال'}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(parent)} className="w-8 h-8 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg flex items-center justify-center">
                        <Edit size={14} />
                      </button>
                    </div>
                  </div>
                  {/* Children */}
                  {children.map(child => (
                    <div key={child.id} className="flex items-center gap-4 px-5 py-3 bg-gray-50/50 hover:bg-gray-50 border-t border-gray-50">
                      <div className="w-6 shrink-0" />
                      <ChevronLeft size={14} className="text-gray-300 shrink-0" />
                      <div className="w-8 h-8 bg-gold-50 rounded-lg flex items-center justify-center">
                        <Tag size={13} className="text-gold-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-gray-700 text-sm font-medium">{child.name}</div>
                        <div className="text-gray-400 text-xs">{child.slug}</div>
                      </div>
                      <span className={`badge text-xs ${child.isActive ? 'badge-success' : 'badge-gray'}`}>
                        {child.isActive ? 'فعال' : 'غیرفعال'}
                      </span>
                      <button onClick={() => openEdit(child)} className="w-7 h-7 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg flex items-center justify-center">
                        <Edit size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
            {!parents.length && (
              <div className="py-12 text-center text-gray-400">
                <Tag size={32} className="mx-auto mb-2 opacity-40" />
                <p>هنوز دسته‌بندی‌ای ایجاد نشده</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">{editCat ? 'ویرایش دسته‌بندی' : 'دسته‌بندی جدید'}</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">نام دسته‌بندی <span className="text-red-500">*</span></label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
                  className="input-field" placeholder="مثلاً پرینتر لیزری" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Slug (آدرس)</label>
                <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  className="input-field" placeholder="laser-printer" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">دسته‌بندی والد</label>
                <select value={form.parentId} onChange={e => setForm(f => ({ ...f, parentId: e.target.value }))} className="input-field">
                  <option value="">بدون والد (دسته اصلی)</option>
                  {parents.filter(p => !editCat || p.id !== editCat.id).map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">توضیحات</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="input-field h-20 resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">ترتیب نمایش</label>
                <input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} className="input-field" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="accent-navy-700 w-4 h-4" />
                <span className="text-sm">دسته‌بندی فعال باشد</span>
              </label>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="btn-outline text-sm px-5 py-2.5">انصراف</button>
              <button onClick={handleSave} className="btn-primary text-sm px-5 py-2.5">ذخیره</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
