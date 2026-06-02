import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FormPage from '@/components/ui/FormPage';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const metadata = { title: 'تماس با ما - شایا چاپگر آریا' };

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12 px-4" id="contact">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-navy-800 mb-3">تماس با ما</h1>
            <p className="text-gray-500">در هر ساعت از روز آماده پاسخگویی به سوالات شما هستیم</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Info cards */}
            <div className="space-y-4">
              {[
                { icon: Phone, title: 'تلفن', lines: ['۰۲۱-۸۸۱۲۳۴۵۶', '۰۹۱۲-۳۴۵-۶۷۸۹'], color: 'text-blue-600', bg: 'bg-blue-50' },
                { icon: Mail, title: 'ایمیل', lines: ['info@shayachapgar.ir'], color: 'text-gold-600', bg: 'bg-gold-50' },
                { icon: MapPin, title: 'آدرس', lines: ['تهران، خیابان ولیعصر', 'پلاک ۱۲۳، طبقه دوم'], color: 'text-green-600', bg: 'bg-green-50' },
                { icon: Clock, title: 'ساعات کار', lines: ['شنبه تا چهارشنبه: ۸ تا ۱۷', 'پنجشنبه: ۸ تا ۱۳'], color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map(({ icon: Icon, title, lines, color, bg }) => (
                <div key={title} className="bg-white rounded-2xl shadow-card p-5 flex items-start gap-4">
                  <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                    <Icon size={18} className={color} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm mb-1">{title}</div>
                    {lines.map(l => <div key={l} className="text-gray-500 text-sm">{l}</div>)}
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-card p-8">
              <h2 className="text-xl font-bold text-navy-800 mb-6">ارسال پیام</h2>
              <FormPage
                formType="contact"
                title="تماس"
                description=""
                icon={<Mail />}
                fields={[
                  { name: 'name', label: 'نام و نام خانوادگی', placeholder: 'نام کامل', required: true },
                  { name: 'phone', label: 'شماره موبایل', type: 'tel', placeholder: '09xxxxxxxxx', required: true },
                  { name: 'email', label: 'ایمیل', type: 'email', placeholder: 'example@email.com' },
                  { name: 'subject', label: 'موضوع', placeholder: 'موضوع پیام خود را بنویسید' },
                  { name: 'message', label: 'متن پیام', type: 'textarea', placeholder: 'پیام خود را بنویسید...', required: true },
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
