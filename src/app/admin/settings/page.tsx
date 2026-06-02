'use client';

import { useState, useEffect } from 'react';
import { Save, Store, Phone, Globe, Palette, Image, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const sections = [
  {
    id: 'general', label: 'اطلاعات فروشگاه', icon: Store,
    fields: [
      { key: 'storeName', label: 'نام فروشگاه (فارسی)', placeholder: 'شایا چاپگر آریا' },
      { key: 'storeNameEn', label: 'نام فروشگاه (انگلیسی)', placeholder: 'Shaya Chapgar Aria' },
      { key: 'footerText', label: 'متن فوتر', placeholder: 'متن پایین سایت' },
    ],
  },
  {
    id: 'contact', label: 'اطلاعات تماس', icon: Phone,
    fields: [
      { key: 'phone', label: 'تلفن ثابت', placeholder: '021-88123456' },
      { key: 'mobile', label: 'موبایل', placeholder: '0912-345-6789' },
      { key: 'email', label: 'ایمیل', placeholder: 'info@shayachapgar.ir' },
      { key: 'address', label: 'آدرس', placeholder: 'تهران، خیابان...' },
      { key: 'workingHours', label: 'ساعات کاری', placeholder: 'شنبه تا چهارشنبه ۸ تا ۱۷' },
    ],
  },
  {
    id: 'social', label: 'شبکه‌های اجتماعی', icon: Globe,
    fields: [
      { key: 'instagram', label: 'اینستاگرام (لینک)', placeholder: 'https://instagram.com/...' },
      { key: 'telegram', label: 'تلگرام (لینک)', placeholder: 'https://t.me/...' },
      { key: 'whatsapp', label: 'واتساپ (شماره)', placeholder: '09123456789' },
    ],
  },
  {
    id: 'homepage', label: 'صفحه اصلی', icon: Image,
    fields: [
      { key: 'heroTitle', label: 'عنوان اصلی', placeholder: 'تخصصی‌ترین مرکز فروش...' },
      { key: 'heroSubtitle', label: 'زیرعنوان', placeholder: 'توضیح کوتاه...' },
    ],
  },
  {
    id: 'theme', label: 'رنگ‌بندی', icon: Palette,
    fields: [
      { key: 'primaryColor', label: 'رنگ اصلی', placeholder: '#1e3a6e', type: 'color' },
      { key: 'accentColor', label: 'رنگ تاکیدی', placeholder: '#f5a623', type: 'color' },
    ],
  },
  {
    id: 'payment', label: 'درگاه پرداخت', icon: Info,
    fields: [
      { key: 'zarinpalMerchant', label: 'کد پذیرنده زرین‌پال', placeholder: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX' },
      { key: 'idpayApiKey', label: 'کلید API آیدی‌پی', placeholder: 'کلید API' },
    ],
  },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('general');

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => { setSettings(data); setLoading(false); });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    if (res.ok) toast.success('تنظیمات ذخیره شد');
    else toast.error('خطا در ذخیره تنظیمات');
  };

  const current = sections.find(s => s.id === activeSection);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">تنظیمات سایت</h1>
          <p className="text-gray-500 text-sm">مدیریت اطلاعات و ظاهر سایت</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 text-sm">
          {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
          {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Sidebar */}
        <div className="bg-white rounded-2xl shadow-card p-3 lg:col-span-1 h-fit">
          {sections.map(s => {
            const Icon = s.icon;
            return (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-right transition-colors mb-1 last:mb-0 ${activeSection === s.id ? 'bg-navy-700 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                <Icon size={16} />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Form */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-card p-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : current ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center">
                  <current.icon size={18} className="text-navy-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">{current.label}</h2>
              </div>
              {current.fields.map(field => (
                <div key={field.key}>
                  <label className="block text-sm text-gray-600 mb-1.5 font-medium">{field.label}</label>
                  {(field as any).type === 'color' ? (
                    <div className="flex items-center gap-3">
                      <input type="color" value={settings[field.key] || '#000000'}
                        onChange={e => setSettings(prev => ({ ...prev, [field.key]: e.target.value }))}
                        className="w-12 h-12 rounded-xl border border-gray-200 cursor-pointer p-1" />
                      <input type="text" value={settings[field.key] || ''} placeholder={field.placeholder}
                        onChange={e => setSettings(prev => ({ ...prev, [field.key]: e.target.value }))}
                        className="input-field flex-1" dir="ltr" />
                    </div>
                  ) : (
                    <input type="text" value={settings[field.key] || ''} placeholder={field.placeholder}
                      onChange={e => setSettings(prev => ({ ...prev, [field.key]: e.target.value }))}
                      className="input-field" />
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
