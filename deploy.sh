#!/bin/bash

# ═══════════════════════════════════════════════════════════
#   شایا چاپگر آریا — اسکریپت دیپلوی خودکار
# ═══════════════════════════════════════════════════════════

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔══════════════════════════════════════╗"
echo "║   شایا چاپگر آریا — راه‌اندازی      ║"
echo "╚══════════════════════════════════════╝"
echo -e "${NC}"

# ─── Check prerequisites ──────────────────
echo -e "${YELLOW}▶ بررسی پیش‌نیازها...${NC}"

if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js نصب نیست! از https://nodejs.org نصب کنید.${NC}"
  exit 1
fi

if ! command -v git &> /dev/null; then
  echo -e "${RED}✗ Git نصب نیست!${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v)${NC}"
echo -e "${GREEN}✓ npm $(npm -v)${NC}"
echo -e "${GREEN}✓ Git $(git --version | awk '{print $3}')${NC}"

# ─── Check .env.local ─────────────────────
if [ ! -f ".env.local" ]; then
  echo -e "${RED}✗ فایل .env.local یافت نشد!${NC}"
  echo ""
  echo "فایل .env.local را بسازید:"
  echo ""
  echo "DATABASE_URL=\"postgresql://...\""
  echo "DIRECT_URL=\"postgresql://...\""
  echo "JWT_SECRET=\"یک رشته تصادفی ۳۲ کاراکتری\""
  echo "NEXTAUTH_URL=\"https://your-domain.vercel.app\""
  echo ""
  exit 1
fi

# ─── Install dependencies ─────────────────
echo -e "${YELLOW}▶ نصب پکیج‌ها...${NC}"
npm install
echo -e "${GREEN}✓ پکیج‌ها نصب شدند${NC}"

# ─── Generate Prisma Client ───────────────
echo -e "${YELLOW}▶ ساخت Prisma Client...${NC}"
npx prisma generate
echo -e "${GREEN}✓ Prisma Client آماده شد${NC}"

# ─── Push DB Schema ───────────────────────
echo -e "${YELLOW}▶ ساخت جداول دیتابیس در Supabase...${NC}"
npx prisma db push
echo -e "${GREEN}✓ جداول ساخته شدند${NC}"

# ─── Seed Database ────────────────────────
echo -e "${YELLOW}▶ بارگذاری داده‌های اولیه...${NC}"
npm run db:seed
echo -e "${GREEN}✓ داده‌های اولیه بارگذاری شدند${NC}"
echo -e "${GREEN}  → ادمین: admin@shaya.ir / admin1234${NC}"

# ─── Check Vercel CLI ─────────────────────
echo ""
echo -e "${YELLOW}▶ بررسی Vercel CLI...${NC}"

if ! command -v vercel &> /dev/null; then
  echo "نصب Vercel CLI..."
  npm install -g vercel
fi

echo -e "${GREEN}✓ Vercel CLI آماده است${NC}"

# ─── Deploy ───────────────────────────────
echo ""
echo -e "${BLUE}══════════════════════════════════════${NC}"
echo -e "${BLUE}  دیپلوی به Vercel                    ${NC}"
echo -e "${BLUE}══════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}متغیرهای محیطی مورد نیاز در Vercel:${NC}"
echo "  DATABASE_URL  → آدرس Supabase (pooler)"
echo "  DIRECT_URL    → آدرس Supabase (direct)"
echo "  JWT_SECRET    → رشته تصادفی امن"
echo "  NEXTAUTH_URL  → آدرس سایت شما در Vercel"
echo ""

vercel deploy --prod

echo ""
echo -e "${GREEN}╔══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ دیپلوی با موفقیت انجام شد!       ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}گام‌های بعدی:${NC}"
echo "1. متغیرهای محیطی را در Vercel Dashboard تنظیم کنید"
echo "   vercel.com → Project → Settings → Environment Variables"
echo ""
echo "2. بعد از تنظیم متغیرها، یک‌بار redeploy کنید:"
echo "   vercel deploy --prod"
echo ""
echo "3. پنل مدیریت:"
echo "   https://your-domain.vercel.app/admin/dashboard"
echo "   admin@shaya.ir / admin1234"
