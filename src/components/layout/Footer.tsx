import Link from 'next/link';
import { Phone, Mail, MapPin, Camera, Send } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-gold-500 rounded-xl flex items-center justify-center text-navy-900 font-bold text-xl">
                ش
              </div>
              <div>
                <div className="font-bold text-lg">شایا چاپگر آریا</div>
                <div className="text-navy-300 text-xs">فروش و خدمات تجهیزات اداری</div>
              </div>
            </div>
            <p className="text-navy-300 text-sm leading-7">
              ارائه دهنده تخصصی انواع پرینتر، کپی‌مشین، اسکنر و تجهیزات اداری با بیش از ۱۵ سال سابقه درخشان در صنعت.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a href="https://instagram.com/shayachapgar" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-navy-700 hover:bg-gold-500 rounded-lg flex items-center justify-center transition-colors">
                <Camera size={16} />
              </a>
              <a href="https://t.me/shayachapgar" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-navy-700 hover:bg-gold-500 rounded-lg flex items-center justify-center transition-colors">
                <Send size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-base mb-5 text-gold-400">لینک‌های مهم</h3>
            <ul className="space-y-3 text-sm text-navy-300">
              {[
                { label: 'محصولات ما', href: '/shop/products' },
                { label: 'پرینترها', href: '/shop/products?category=printer' },
                { label: 'کپی‌مشین‌ها', href: '/shop/products?category=copier' },
                { label: 'اسکنرها', href: '/shop/products?category=scanner' },
                { label: 'لوازم جانبی', href: '/shop/products?category=accessories' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-gold-400 transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-base mb-5 text-gold-400">خدمات ما</h3>
            <ul className="space-y-3 text-sm text-navy-300">
              {[
                { label: 'تعمیر پرینتر', href: '/forms/repair' },
                { label: 'سرویس دوره‌ای', href: '/forms/service' },
                { label: 'مشاوره خرید', href: '/forms/consultation' },
                { label: 'نصب و راه‌اندازی', href: '/forms/service' },
                { label: 'تامین لوازم مصرفی', href: '/shop/products?category=accessories' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-gold-400 transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-base mb-5 text-gold-400">تماس با ما</h3>
            <ul className="space-y-4 text-sm text-navy-300">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <div>۰۲۱-۸۸۱۲۳۴۵۶</div>
                  <div>۰۹۱۲-۳۴۵-۶۷۸۹</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-gold-400 shrink-0 mt-0.5" />
                <span>info@shayachapgar.ir</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-gold-400 shrink-0 mt-0.5" />
                <span>تهران، خیابان ولیعصر، پلاک ۱۲۳</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-700 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-navy-400">
          <p>© {currentYear} شایا چاپگر آریا - تمامی حقوق محفوظ است</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-gold-400 transition-colors">حریم خصوصی</Link>
            <Link href="/terms" className="hover:text-gold-400 transition-colors">قوانین و مقررات</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
