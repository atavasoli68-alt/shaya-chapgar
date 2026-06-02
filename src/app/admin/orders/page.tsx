'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Eye, X, Search } from 'lucide-react';
import { formatPrice, formatDate, statusLabels } from '@/lib/utils';
import toast from 'react-hot-toast';

const statusOptions = [
  { value: 'pending', label: 'در انتظار بررسی', color: 'badge-warning' },
  { value: 'processing', label: 'در حال پردازش', color: 'badge-info' },
  { value: 'shipped', label: 'ارسال شده', color: 'badge-info' },
  { value: 'delivered', label: 'تحویل داده شده', color: 'badge-success' },
  { value: 'cancelled', label: 'لغو شده', color: 'badge-error' },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewOrder, setViewOrder] = useState<any>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const res = await fetch('/api/orders');
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const updateStatus = async (orderId: string, status: string) => {
    // Update in local state (in production this would call an API endpoint)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    if (viewOrder?.id === orderId) setViewOrder((o: any) => ({ ...o, status }));
    toast.success('وضعیت سفارش بروز شد');
  };

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.orderNumber.includes(search) || o.customerName.includes(search) || o.customerPhone?.includes(search);
    const matchStatus = !statusFilter || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusColor = (status: string) => statusOptions.find(s => s.value === status)?.color || 'badge-gray';

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">مدیریت سفارش‌ها</h1>
        <p className="text-gray-500 text-sm">{orders.length} سفارش</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="جستجو بر اساس شماره، نام یا موبایل..."
            className="w-full border border-gray-200 rounded-xl pr-9 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
          <option value="">همه وضعیت‌ها</option>
          {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {[{ value: '', label: `همه (${orders.length})` }, ...statusOptions.map(s => ({
          value: s.value,
          label: `${s.label} (${orders.filter(o => o.status === s.value).length})`
        }))].map(tab => (
          <button key={tab.value} onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${statusFilter === tab.value ? 'bg-navy-700 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-card'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center"><div className="animate-spin w-8 h-8 border-4 border-navy-700 border-t-transparent rounded-full mx-auto" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">شماره سفارش</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">مشتری</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">مبلغ</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">وضعیت</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">تاریخ</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-navy-700">{order.orderNumber}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-800">{order.customerName}</div>
                      <div className="text-gray-400 text-xs">{order.customerPhone}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold">{formatPrice(order.totalAmount)}</td>
                    <td className="py-3 px-4">
                      <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)}
                        className={`badge ${getStatusColor(order.status)} cursor-pointer border-0 focus:outline-none`}>
                        {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{formatDate(order.createdAt)}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => setViewOrder(order)} className="w-8 h-8 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg flex items-center justify-center">
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr><td colSpan={6} className="py-12 text-center text-gray-400">
                    <ShoppingBag size={32} className="mx-auto mb-2 opacity-40" />
                    <p>سفارشی یافت نشد</p>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl my-8 animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-800 text-lg">جزئیات سفارش</h2>
                <div className="text-gray-500 text-sm font-mono">{viewOrder.orderNumber}</div>
              </div>
              <button onClick={() => setViewOrder(null)} className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="text-xs text-gray-500 mb-1">نام مشتری</div>
                  <div className="font-semibold">{viewOrder.customerName}</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="text-xs text-gray-500 mb-1">موبایل</div>
                  <div className="font-semibold">{viewOrder.customerPhone || '—'}</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="text-xs text-gray-500 mb-1">ایمیل</div>
                  <div className="font-semibold text-sm">{viewOrder.customerEmail}</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="text-xs text-gray-500 mb-1">شهر</div>
                  <div className="font-semibold">{viewOrder.city || '—'}</div>
                </div>
                {viewOrder.address && (
                  <div className="col-span-2 bg-gray-50 rounded-2xl p-4">
                    <div className="text-xs text-gray-500 mb-1">آدرس</div>
                    <div className="text-sm">{viewOrder.address}</div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">اقلام سفارش</h3>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
                  {(viewOrder.items || []).map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center p-4">
                      <div>
                        <div className="text-sm font-medium text-gray-800">{item.productName}</div>
                        <div className="text-xs text-gray-400">×{item.quantity}</div>
                      </div>
                      <div className="font-semibold text-navy-700">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-4 bg-navy-50">
                    <span className="font-bold text-gray-800">مجموع</span>
                    <span className="font-bold text-navy-800 text-lg">{formatPrice(viewOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {viewOrder.notes && (
                <div className="bg-yellow-50 rounded-2xl p-4">
                  <div className="text-xs text-yellow-700 mb-1 font-medium">یادداشت مشتری</div>
                  <div className="text-sm text-yellow-800">{viewOrder.notes}</div>
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-600 mb-2">تغییر وضعیت</label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map(s => (
                    <button key={s.value} onClick={() => updateStatus(viewOrder.id, s.value)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${viewOrder.status === s.value ? 'bg-navy-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
