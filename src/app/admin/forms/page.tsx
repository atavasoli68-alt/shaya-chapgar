'use client';

import { useState, useEffect } from 'react';
import { FileText, Eye, X, Check } from 'lucide-react';
import { formatDate, formTypeLabels, statusLabels } from '@/lib/utils';

export default function AdminForms() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewItem, setViewItem] = useState<any>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const res = await fetch('/api/forms');
    const data = await res.json();
    setSubmissions(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const markRead = (id: string) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: 'read' } : s));
    if (viewItem?.id === id) setViewItem((s: any) => ({ ...s, status: 'read' }));
  };

  const types = [...new Set(submissions.map(s => s.formType))];
  const filtered = submissions.filter(s =>
    (!typeFilter || s.formType === typeFilter) &&
    (!statusFilter || s.status === statusFilter)
  );

  const getStatusBadge = (status: string) => {
    if (status === 'new') return 'badge-warning';
    if (status === 'read') return 'badge-info';
    return 'badge-success';
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">فرم‌های ثبت شده</h1>
        <p className="text-gray-500 text-sm">{submissions.filter(s => s.status === 'new').length} فرم جدید</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'همه', value: submissions.length, color: 'bg-gray-50 text-gray-700' },
          { label: 'جدید', value: submissions.filter(s => s.status === 'new').length, color: 'bg-yellow-50 text-yellow-700' },
          { label: 'بررسی شده', value: submissions.filter(s => s.status !== 'new').length, color: 'bg-green-50 text-green-700' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.color} rounded-2xl p-4 text-center`}>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card p-4 flex flex-wrap gap-3">
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
          <option value="">همه انواع</option>
          {types.map(t => <option key={t} value={t}>{formTypeLabels[t] || t}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
          <option value="">همه وضعیت‌ها</option>
          <option value="new">جدید</option>
          <option value="read">خوانده شده</option>
          <option value="replied">پاسخ داده شده</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center"><div className="animate-spin w-8 h-8 border-4 border-navy-700 border-t-transparent rounded-full mx-auto" /></div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(sub => (
              <div key={sub.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${sub.status === 'new' ? 'border-r-4 border-yellow-400' : ''}`}>
                <div className="w-9 h-9 bg-navy-50 rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-navy-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800 text-sm">{sub.data?.name || 'ناشناس'}</span>
                    <span className="badge badge-gray text-xs">{formTypeLabels[sub.formType] || sub.formType}</span>
                    {sub.status === 'new' && <span className="w-2 h-2 bg-yellow-500 rounded-full" />}
                  </div>
                  <div className="text-gray-400 text-xs mt-0.5">{sub.data?.phone || sub.data?.email || ''}</div>
                </div>
                <div className="text-xs text-gray-400 shrink-0">{formatDate(sub.createdAt)}</div>
                <span className={`badge ${getStatusBadge(sub.status)} shrink-0`}>{statusLabels[sub.status] || sub.status}</span>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => { setViewItem(sub); markRead(sub.id); }}
                    className="w-8 h-8 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg flex items-center justify-center">
                    <Eye size={14} />
                  </button>
                </div>
              </div>
            ))}
            {!filtered.length && (
              <div className="py-12 text-center text-gray-400">
                <FileText size={32} className="mx-auto mb-2 opacity-40" />
                <p>فرمی یافت نشد</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-800">{formTypeLabels[viewItem.formType] || viewItem.formType}</h2>
                <div className="text-gray-400 text-xs">{formatDate(viewItem.createdAt)}</div>
              </div>
              <button onClick={() => setViewItem(null)} className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-3">
              {Object.entries(viewItem.data || {}).map(([key, val]) => (
                <div key={key} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                  <span className="text-gray-500 text-sm w-32 shrink-0">{key}:</span>
                  <span className="text-gray-800 text-sm font-medium">{String(val)}</span>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={() => { setSubmissions(prev => prev.map(s => s.id === viewItem.id ? { ...s, status: 'replied' } : s)); setViewItem(null); }}
                className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm">
                <Check size={16} />
                علامت‌گذاری به عنوان پاسخ‌داده‌شده
              </button>
              <button onClick={() => setViewItem(null)} className="btn-outline text-sm px-5">بستن</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
