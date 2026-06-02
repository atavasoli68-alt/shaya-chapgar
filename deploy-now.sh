#!/bin/bash
set -e

echo "🚀 شروع دیپلوی شایا چاپگر آریا..."

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Deploy to Vercel (will ask for login if not authenticated)
npx vercel deploy --prod --yes \
  --env DATABASE_URL="$(grep DATABASE_URL .env.local | cut -d'"' -f2)" \
  --env DIRECT_URL="$(grep DIRECT_URL .env.local | cut -d'"' -f2)" \
  --env JWT_SECRET="$(grep JWT_SECRET .env.local | cut -d'"' -f2)" \
  --env NEXTAUTH_SECRET="$(grep NEXTAUTH_SECRET .env.local | cut -d'"' -f2)" \
  --env NEXTAUTH_URL="$(grep NEXTAUTH_URL .env.local | cut -d'"' -f2)"

echo "✅ دیپلوی کامل شد!"
