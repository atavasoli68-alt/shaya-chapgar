import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FormPage from '@/components/ui/FormPage';
import { MessageSquare } from 'lucide-react';

export const metadata = { title: 'مشاوره خرید - شایا چاپگر آریا' };

export default function ConsultationPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-card overflow-hidden">
            <div className="bg-gold-500 p-8 text-white">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4">
                <MessageSquare size={26} className="text-gold-600" />
              </div>
              <h1 className="text-2xl font-bold mb-2">مشاوره رایگان خرید</h1>
              <p className="text-gold-50 text-sm leading-7">
                نمی‌دانید چه دستگاهی مناسب کسب‌وکار شماست؟ کارشناسان ما آماده راهنمایی هستند.
              </p>
            </div>
            <div className="p-8">
              <FormPage
                formType="consultation"
                title="مشاوره خرید"
                description=""
                icon={<MessageSquare />}
                fields={[
                  { name: 'name', label: 'نام و نام خانوادگی', placeholder: 'نام کامل', required: true },
                  { name: 'phone', label: 'شماره موبایل', type: 'tel', placeholder: '09xxxxxxxxx', required: true },
                  { name: 'email', label: 'ایمیل', type: 'email', placeholder: 'example@email.com' },
                  { name: 'businessType', label: 'نوع کسب‌وکار', placeholder: 'مثلاً دفتر کار، مطب، مدرسه' },
                  { name: 'deviceType', label: 'نوع تجهیز مورد نیاز', type: 'select', required: true,
                    options: ['پرینتر', 'کپی‌مشین', 'اسکنر', 'پرینتر چندکاره', 'لوازم جانبی', 'مشخص نیست'] },
                  { name: 'budget', label: 'بودجه تقریبی', type: 'select',
                    options: ['زیر ۵ میلیون تومان', '۵ تا ۱۵ میلیون', '۱۵ تا ۳۰ میلیون', '۳۰ تا ۵۰ میلیون', 'بیش از ۵۰ میلیون'] },
                  { name: 'description', label: 'شرح نیاز', type: 'textarea', placeholder: 'نیاز خود را کامل توضیح دهید تا بهترین پیشنهاد را دریافت کنید...' },
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
