import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FormPage from '@/components/ui/FormPage';
import { Wrench } from 'lucide-react';

export const metadata = { title: 'درخواست تعمیر - شایا چاپگر آریا' };

export default function RepairFormPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-card overflow-hidden">
            <div className="bg-navy-800 p-8 text-white">
              <div className="w-14 h-14 bg-gold-500 rounded-2xl flex items-center justify-center mb-4">
                <Wrench size={26} />
              </div>
              <h1 className="text-2xl font-bold mb-2">درخواست تعمیر دستگاه</h1>
              <p className="text-navy-200 text-sm leading-7">
                فرم زیر را تکمیل کنید. کارشناسان تعمیر ما در اسرع وقت با شما تماس خواهند گرفت.
              </p>
            </div>
            <div className="p-8">
              <FormPage
                formType="repair"
                title="درخواست تعمیر"
                description=""
                icon={<Wrench />}
                fields={[
                  { name: 'name', label: 'نام و نام خانوادگی', placeholder: 'نام کامل', required: true },
                  { name: 'phone', label: 'شماره موبایل', type: 'tel', placeholder: '09xxxxxxxxx', required: true },
                  { name: 'email', label: 'ایمیل', type: 'email', placeholder: 'example@email.com' },
                  { name: 'deviceType', label: 'نوع دستگاه', type: 'select', required: true,
                    options: ['پرینتر لیزری', 'پرینتر جوهرافشان', 'کپی‌مشین', 'اسکنر', 'سایر'] },
                  { name: 'brand', label: 'برند دستگاه', placeholder: 'مثلاً HP، Canon، Epson' },
                  { name: 'model', label: 'مدل دستگاه', placeholder: 'مثلاً LaserJet Pro M404n' },
                  { name: 'issue', label: 'شرح مشکل', type: 'textarea', placeholder: 'مشکل دستگاه را به طور کامل توضیح دهید...', required: true },
                  { name: 'address', label: 'آدرس (برای مراجعه تکنسین)', type: 'textarea', placeholder: 'شهر، خیابان، کوچه، پلاک' },
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
