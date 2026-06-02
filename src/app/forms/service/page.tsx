import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FormPage from '@/components/ui/FormPage';
import { Settings } from 'lucide-react';

export const metadata = { title: 'درخواست سرویس - شایا چاپگر آریا' };

export default function ServiceFormPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-card overflow-hidden">
            <div className="bg-green-600 p-8 text-white">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4">
                <Settings size={26} className="text-green-600" />
              </div>
              <h1 className="text-2xl font-bold mb-2">درخواست سرویس دوره‌ای</h1>
              <p className="text-green-50 text-sm leading-7">
                نگهداری پیشگیرانه و سرویس منظم دستگاه‌ها برای عملکرد بهتر و جلوگیری از خرابی‌های ناگهانی.
              </p>
            </div>
            <div className="p-8">
              <FormPage
                formType="service"
                title="درخواست سرویس"
                description=""
                icon={<Settings />}
                fields={[
                  { name: 'name', label: 'نام و نام خانوادگی', placeholder: 'نام کامل', required: true },
                  { name: 'phone', label: 'شماره موبایل', type: 'tel', placeholder: '09xxxxxxxxx', required: true },
                  { name: 'email', label: 'ایمیل', type: 'email', placeholder: 'example@email.com' },
                  { name: 'company', label: 'شرکت / سازمان', placeholder: 'نام شرکت' },
                  { name: 'deviceType', label: 'نوع دستگاه', type: 'select', required: true,
                    options: ['پرینتر لیزری', 'پرینتر جوهرافشان', 'کپی‌مشین', 'اسکنر', 'چندین دستگاه'] },
                  { name: 'deviceCount', label: 'تعداد دستگاه', placeholder: 'تعداد دستگاه‌هایی که نیاز به سرویس دارند' },
                  { name: 'serviceType', label: 'نوع سرویس', type: 'select',
                    options: ['سرویس دوره‌ای (۶ ماهه)', 'سرویس دوره‌ای (سالانه)', 'قرارداد سرویس', 'بازرسی و تنظیم'] },
                  { name: 'address', label: 'آدرس محل سرویس', type: 'textarea', placeholder: 'آدرس کامل برای مراجعه تکنسین', required: true },
                  { name: 'notes', label: 'توضیحات', type: 'textarea', placeholder: 'توضیحات اضافی...' },
                ]}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
