import Link from 'next/link';
import { Wrench, Settings, Phone, Truck, Star, Shield } from 'lucide-react';

const services = [
  {
    icon: Wrench,
    title: 'تعمیر تخصصی',
    description: 'تعمیر حرفه‌ای انواع پرینتر، کپی‌مشین و اسکنر توسط تکنسین‌های مجرب',
    link: '/forms/repair',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Settings,
    title: 'سرویس دوره‌ای',
    description: 'نگهداری پیشگیرانه و سرویس منظم دستگاه‌ها برای عملکرد بهتر',
    link: '/forms/service',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: Phone,
    title: 'مشاوره تخصصی',
    description: 'راهنمایی رایگان برای انتخاب بهترین تجهیز متناسب با نیاز شما',
    link: '/forms/consultation',
    color: 'text-gold-600',
    bg: 'bg-gold-50',
  },
  {
    icon: Truck,
    title: 'نصب و راه‌اندازی',
    description: 'نصب حرفه‌ای و راه‌اندازی دستگاه در محل کار یا منزل شما',
    link: '/forms/service',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: Star,
    title: 'تامین قطعات',
    description: 'تامین قطعات اورجینال و باکیفیت برای انواع پرینتر و کپی',
    link: '/shop/products?category=accessories',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    icon: Shield,
    title: 'گارانتی کالا',
    description: 'ضمانت اصالت کالا و گارانتی رسمی برای تمامی محصولات',
    link: '/shop/products',
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
];

export default function ServicesSection() {
  return (
    <section className="py-16 px-4 bg-white" id="services">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="section-title">خدمات ما</h2>
          <p className="section-subtitle">ارائه طیف کاملی از خدمات تخصصی تجهیزات اداری</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => {
            const Icon = service.icon;
            return (
              <Link
                key={service.title}
                href={service.link}
                className="card p-6 flex items-start gap-4 group hover:-translate-y-1"
              >
                <div className={`w-12 h-12 ${service.bg} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon size={22} className={service.color} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1.5 group-hover:text-navy-700 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-6">{service.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
