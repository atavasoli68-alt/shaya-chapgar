import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'شایا چاپگر آریا - فروش و خدمات تجهیزات اداری',
  description: 'فروش و خدمات پرینتر، کپی‌مشین، اسکنر و تجهیزات اداری با بهترین قیمت و ضمانت اصالت کالا',
  keywords: 'پرینتر، کپی مشین، اسکنر، تجهیزات اداری، HP، Canon، Epson',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Toaster
          position="bottom-left"
          toastOptions={{
            style: { fontFamily: 'Vazirmatn, sans-serif', direction: 'rtl', borderRadius: '12px' },
          }}
        />
      </body>
    </html>
  );
}
