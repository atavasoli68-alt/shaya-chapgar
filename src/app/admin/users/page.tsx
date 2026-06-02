'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, X, Shield, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'user' });

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(data => { setUsers(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!form.name || !form.email || !form.password) { toast.error('اطلاعات ضروری را وارد کنید'); return; }
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success('کاربر افزوده شد');
      setShowForm(false);
      setForm({ name: '', email: '', phone: '', password: '', role: 'user' });
      const data = await fetch('/api/admin/users').then(r => r.json());
      setUsers(data);
    } else {
      const err = await res.json();
      toast.error(err.error || 'خطا در ایجاد کاربر');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">مدیریت کاربران</h1>
          <p className="text-gray-500 text-sm">{users.length} کاربر</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} />
          کاربر جدید
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center"><div className="animate-spin w-8 h-8 border-4 border-navy-700 border-t-transparent rounded-full mx-auto" /></div>
        ) : (
          <div className="divide-y divide-gray-50">
            {users.map(user => (
              <div key={user.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0 ${user.role === 'admin' ? 'bg-navy-700' : 'bg-gray-400'}`}>
                  {user.name?.charAt(0) || '؟'}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 flex items-center gap-2">
                    {user.name}
                    {user.role === 'admin' && <Shield size={14} className="text-navy-600" />}
                  </div>
                  <div className="text-gray-500 text-xs">{user.email} · {user.phone || 'بدون شماره'}</div>
                </div>
                <span className={`badge ${user.role === 'admin' ? 'badge-info' : 'badge-gray'}`}>
                  {user.role === 'admin' ? 'مدیر' : 'کاربر'}
                </span>
                <div className="text-xs text-gray-400">{formatDate(user.createdAt)}</div>
              </div>
            ))}
            {!users.length && (
              <div className="py-12 text-center text-gray-400">
                <Users size={32} className="mx-auto mb-2 opacity-40" />
                <p>کاربری یافت نشد</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">کاربر جدید</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { key: 'name', label: 'نام کامل', placeholder: 'نام کاربر', required: true },
                { key: 'email', label: 'ایمیل', placeholder: 'email@example.com', required: true },
                { key: 'phone', label: 'موبایل', placeholder: '09xxxxxxxxx' },
                { key: 'password', label: 'رمز عبور', placeholder: 'حداقل ۶ کاراکتر', required: true, type: 'password' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm text-gray-600 mb-1.5">{f.label}{f.required && <span className="text-red-500 mr-1">*</span>}</label>
                  <input type={f.type || 'text'} value={(form as any)[f.key]} placeholder={f.placeholder}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="input-field" />
                </div>
              ))}
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">نقش کاربری</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="input-field">
                  <option value="user">کاربر عادی</option>
                  <option value="admin">مدیر</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="btn-outline text-sm px-5 py-2.5">انصراف</button>
              <button onClick={handleSave} className="btn-primary text-sm px-5 py-2.5">افزودن کاربر</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
