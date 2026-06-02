'use client';

import { useState } from 'react';
import { CheckCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

interface FormField {
  name: string;
  label: string;
  type?: 'text' | 'tel' | 'email' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

interface FormPageProps {
  formType: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  fields: FormField[];
  accentColor?: string;
}

export default function FormPage({ formType, title, description, icon, fields, accentColor = 'navy' }: FormPageProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const required = fields.filter(f => f.required);
    const missing = required.find(f => !values[f.name]);
    if (missing) { toast.error(`لطفاً فیلد "${missing.label}" را پر کنید`); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formType, data: values }),
      });
      if (res.ok) { setSuccess(true); }
      else { toast.error('خطا در ارسال درخواست'); }
    } catch { toast.error('خطا در ارتباط با سرور'); }
    finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="text-center py-12 px-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">درخواست شما ثبت شد!</h3>
        <p className="text-gray-500 leading-7">
          کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت.
          <br />شماره تماس: ۰۲۱-۸۸۱۲۳۴۵۶
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(field => (
        <div key={field.name}>
          <label className="block text-sm text-gray-600 mb-1.5 font-medium">
            {field.label}
            {field.required && <span className="text-red-500 mr-1">*</span>}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              value={values[field.name] || ''}
              onChange={e => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className="input-field h-28 resize-none"
            />
          ) : field.type === 'select' ? (
            <select
              value={values[field.name] || ''}
              onChange={e => handleChange(field.name, e.target.value)}
              className="input-field"
            >
              <option value="">انتخاب کنید</option>
              {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : (
            <input
              type={field.type || 'text'}
              value={values[field.name] || ''}
              onChange={e => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className="input-field"
            />
          )}
        </div>
      ))}
      <button type="submit" disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
        {loading && <Loader size={16} className="animate-spin" />}
        {loading ? 'در حال ارسال...' : 'ارسال درخواست'}
      </button>
    </form>
  );
}
