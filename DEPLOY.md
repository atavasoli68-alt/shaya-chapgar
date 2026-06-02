# 🚀 راهنمای آنلاین کردن سایت — ۵ دقیقه

## روش سریع (توصیه‌شده)

### گام ۱ — Supabase بسازید (رایگان)
1. به **[supabase.com](https://supabase.com)** بروید
2. پروژه جدید بسازید (رمز دیتابیس را یادداشت کنید)
3. از **Settings → Database → URI** دو آدرس را کپی کنید

### گام ۲ — فایل `.env.local` بسازید
```env
DATABASE_URL="postgresql://postgres.[REF]:[PASS]@...pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASS]@...pooler.supabase.com:5432/postgres"
JWT_SECRET="یک-رشته-تصادفی-۳۲-کاراکتری-اینجا-بنویسید"
NEXTAUTH_URL="https://your-project.vercel.app"
```

### گام ۳ — دیپلوی خودکار
```bash
# یک دستور — همه کارها را انجام می‌دهد
bash deploy.sh
```

---

## روش دستی

```bash
# ۱. نصب
npm install

# ۲. ساخت Prisma
npx prisma generate
npx prisma db push

# ۳. داده اولیه
npm run db:seed
# ادمین: admin@shaya.ir / admin1234

# ۴. دیپلوی به Vercel
npm install -g vercel
vercel login
vercel deploy --prod
```

---

## متغیرهای Vercel (مهم!)

در Vercel Dashboard → Settings → Environment Variables:

| نام | مقدار |
|-----|-------|
| `DATABASE_URL` | آدرس Supabase (pooler port 6543) |
| `DIRECT_URL` | آدرس Supabase (direct port 5432) |
| `JWT_SECRET` | رشته تصادفی ۳۲+ کاراکتر |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` |

بعد از ذخیره متغیرها → **Redeploy** را بزنید.

---

## GitHub Auto-Deploy (اختیاری)

برای deploy خودکار با هر push به GitHub:

1. در GitHub repo → Settings → Secrets → Actions:
   - `VERCEL_TOKEN` ← از vercel.com/account/tokens
   - `VERCEL_ORG_ID` ← `team_1bvATrvgrVqTvUzjiJ9hel50`
   - `VERCEL_PROJECT_ID` ← `prj_JK0DJeWNmCVVcAJiW4tw3NSFJbXY`

2. فایل `.github/workflows/deploy.yml` از قبل آماده است ✓

---

## بعد از Deploy

| صفحه | آدرس |
|------|------|
| سایت | `https://your-project.vercel.app` |
| پنل ادمین | `https://your-project.vercel.app/admin/dashboard` |
| وبلاگ | `https://your-project.vercel.app/blog` |
| درخواست تعمیر | `https://your-project.vercel.app/forms/repair` |

**ادمین:** `admin@shaya.ir` / `admin1234`

---

## مشکل‌یابی

**خطای Prisma در build:**
```bash
npx prisma generate
```

**خطای دیتابیس:**
- مطمئن شوید DATABASE_URL در Vercel تنظیم شده
- بعد از تغییر متغیرها، Redeploy کنید

**سایت خراب است:**
```bash
vercel logs --prod
```
