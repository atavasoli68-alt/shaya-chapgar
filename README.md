# شایا چاپگر آریا — فروشگاه آنلاین تجهیزات اداری

## 🚀 راه‌اندازی کامل با Supabase + Vercel

---

## مرحله ۱ — ساخت پروژه Supabase (رایگان)

1. به **[supabase.com](https://supabase.com)** بروید و ثبت‌نام کنید
2. روی **New Project** کلیک کنید
3. مقادیر را وارد کنید:
   - Name: `shaya-chapgar`
   - Database Password: یک رمز قوی انتخاب کنید (**این رمز را ذخیره کنید**)
   - Region: نزدیک‌ترین منطقه (مثلاً Frankfurt)
4. روی **Create new project** کلیک کنید و چند دقیقه صبر کنید

---

## مرحله ۲ — دریافت Connection String

1. در داشبورد Supabase به **Settings → Database** بروید
2. به بخش **Connection String** اسکرول کنید
3. تب **URI** را انتخاب کنید
4. دو آدرس را کپی کنید:

```
# Transaction pooler (برای DATABASE_URL)
postgresql://postgres.[ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres

# Session pooler (برای DIRECT_URL)
postgresql://postgres.[ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

---

## مرحله ۳ — تنظیم محیط توسعه

فایل `.env.local` را بسازید و مقادیر را جایگزین کنید:

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
JWT_SECRET="یک رشته تصادفی ۳۲+ کاراکتری اینجا بنویسید"
NEXTAUTH_URL="http://localhost:3000"
```

---

## مرحله ۴ — نصب و راه‌اندازی

```bash
# نصب پکیج‌ها
npm install

# ساخت جدول‌های پایگاه داده
npm run db:push

# بارگذاری داده‌های نمونه
npm run db:seed

# اجرای سرور توسعه
npm run dev
```

سایت روی `http://localhost:3000` اجرا می‌شود.

**اطلاعات ادمین:**
- ایمیل: `admin@shaya.ir`
- رمز عبور: `admin1234`
- آدرس پنل: `/admin/dashboard`

---

## مرحله ۵ — دیپلوی روی Vercel

### ۵.۱ آپلود کد به GitHub
```bash
git init
git add .
git commit -m "feat: initial commit"
git remote add origin https://github.com/[username]/shaya-chapgar.git
git push -u origin main
```

### ۵.۲ اتصال به Vercel
1. به **[vercel.com](https://vercel.com)** بروید
2. روی **Add New → Project** کلیک کنید
3. ریپازیتوری GitHub را انتخاب کنید
4. روی **Import** کلیک کنید

### ۵.۳ تنظیم متغیرهای محیطی در Vercel

در صفحه تنظیمات پروژه → **Environment Variables** این موارد را اضافه کنید:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | آدرس transaction pooler از Supabase |
| `DIRECT_URL` | آدرس session pooler از Supabase |
| `JWT_SECRET` | رشته تصادفی امن |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` |

### ۵.۴ Deploy

```bash
# یا از داشبورد Vercel روی Deploy کلیک کنید
vercel --prod
```

---

## مرحله ۶ — اجرای Migration در Production

بعد از اولین deploy:

```bash
# این دستور را یک بار روی ترمینال لوکال با .env.local اجرا کنید
npm run db:push

# سپس seed را اجرا کنید
npm run db:seed
```

---

## 📋 دستورات مفید

```bash
npm run dev          # سرور توسعه
npm run build        # بیلد پروداکشن
npm run db:push      # ساخت/بروزرسانی جداول
npm run db:seed      # بارگذاری داده‌های نمونه
npm run db:studio    # رابط گرافیکی پایگاه داده
npm run db:generate  # بروزرسانی Prisma Client
```

---

## 📁 ساختار پروژه

```
src/
├── app/
│   ├── page.tsx              → صفحه اصلی
│   ├── shop/
│   │   ├── products/         → لیست محصولات
│   │   ├── cart/             → سبد خرید
│   │   └── checkout/         → پرداخت
│   ├── forms/
│   │   ├── repair/           → فرم تعمیر
│   │   ├── consultation/     → مشاوره
│   │   ├── service/          → سرویس
│   │   └── contact/          → تماس
│   ├── admin/                → پنل مدیریت
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── orders/
│   │   ├── forms/
│   │   ├── users/
│   │   └── settings/
│   └── api/                  → API Routes (Prisma)
├── components/
├── lib/
│   ├── prisma.ts             → Prisma Client
│   ├── auth.ts               → JWT Auth
│   └── utils.ts              → توابع کمکی
└── store/
    └── cartStore.ts          → سبد خرید (Zustand)

prisma/
├── schema.prisma             → مدل پایگاه داده
└── seed.ts                   → داده‌های اولیه
```

---

## 🛠️ فناوری‌ها

| فناوری | نسخه | کاربرد |
|--------|------|---------|
| Next.js | 16 | فریم‌ورک اصلی |
| TypeScript | 5 | تایپ‌سیفتی |
| Tailwind CSS | 4 | استایل |
| Prisma ORM | 6 | ارتباط با DB |
| Supabase | — | PostgreSQL Cloud |
| Zustand | 5 | مدیریت سبد خرید |
| bcryptjs | — | رمزنگاری |
| jsonwebtoken | — | احراز هویت |

---

## ⚠️ نکات مهم

- فایل `.env.local` را **هرگز** به Git اضافه نکنید
- رمز Supabase را در جای امن نگه دارید
- برای پروداکشن `JWT_SECRET` باید حداقل ۳۲ کاراکتر تصادفی باشد
- پس از تغییر schema، حتماً `npm run db:push` اجرا کنید

---

شایا چاپگر آریا | تهران، خیابان ولیعصر | ۰۲۱-۸۸۱۲۳۴۵۶
# Shaya Chapgar Aria - Fri Jun  5 22:52:10 UTC 2026
