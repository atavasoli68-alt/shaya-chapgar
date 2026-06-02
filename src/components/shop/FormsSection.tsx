import Link from 'next/link';
import { Wrench, MessageSquare, ArrowLeft } from 'lucide-react';

export default function FormsSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-navy-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Repair Request */}
          <div className="relative overflow-hidden bg-navy-800 rounded-3xl p-8 text-white">
            <div className="absolute top-0 left-0 w-64 h-64 bg-navy-700/50 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-gold-500 rounded-2xl flex items-center justify-center mb-5">
                <Wrench size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-3">درخواست تعمیر</h3>
              <p className="text-navy-200 leading-7 mb-6">
                آیا دستگاه شما خراب شده؟ فرم درخواست تعمیر را پر کنید و تکنسین‌های ما در اسرع وقت با شما تماس می‌گیرند.
              </p>
              <Link href="/forms/repair" className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                ثبت درخواست تعمیر
                <ArrowLeft size={16} />
              </Link>
            </div>
          </div>

          {/* Consultation */}
          <div className="relative overflow-hidden bg-gold-500 rounded-3xl p-8 text-white">
            <div className="absolute top-0 left-0 w-64 h-64 bg-gold-400/50 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-5">
                <MessageSquare size={24} className="text-gold-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">مشاوره رایگان</h3>
              <p className="text-gold-50 leading-7 mb-6">
                نمی‌دانید چه دستگاهی برای کسب‌وکارتان مناسب است؟ کارشناسان ما آماده مشاوره رایگان هستند.
              </p>
              <Link href="/forms/consultation" className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gold-700 px-6 py-3 rounded-xl font-medium transition-colors">
                درخواست مشاوره
                <ArrowLeft size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
