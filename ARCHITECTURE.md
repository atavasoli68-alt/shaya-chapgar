# راهنمای معماری — چطور ماژول جدید اضافه کنیم

## ساختار معماری

```
src/
├── config/index.ts          ← تنظیمات مرکزی + Feature Flags
├── types/index.ts           ← تایپ‌های TypeScript
├── lib/
│   ├── prisma.ts            ← Prisma Client (singleton)
│   ├── auth.ts              ← JWT utilities
│   ├── validations.ts       ← Zod schemas
│   ├── errors.ts            ← ApiError + withErrorHandler
│   └── utils.ts             ← توابع کمکی
├── middleware/
│   └── auth.ts              ← withAuth / withAdmin HOF
├── modules/                 ← ماژول‌های Feature محور
│   ├── products/
│   │   ├── product.repository.ts   ← Database Operations
│   │   └── product.service.ts      ← Business Logic
│   ├── orders/
│   ├── users/
│   └── index.ts             ← Barrel exports
├── hooks/
│   └── index.ts             ← Custom React hooks
└── app/
    ├── api/                 ← HTTP handlers (نازک)
    └── ...                  ← صفحات Next.js
```

---

## اضافه کردن ماژول جدید — مثال: Blog

### گام ۱: تعریف تایپ در `src/types/index.ts`
```typescript
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  authorId: string;
  publishedAt: Date | null;
  createdAt: Date;
}
```

### گام ۲: اضافه کردن Model به Prisma Schema
```prisma
// prisma/schema.prisma
model BlogPost {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("blog_posts")
}
```
سپس: `npm run db:push`

### گام ۳: ساخت Repository
```typescript
// src/modules/blog/blog.repository.ts
import prisma from '@/lib/prisma';

export class BlogRepository {
  async findAll() {
    return prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
  }
  async findBySlug(slug: string) {
    return prisma.blogPost.findUnique({ where: { slug } });
  }
  async create(data: any) {
    return prisma.blogPost.create({ data });
  }
}
export const blogRepository = new BlogRepository();
```

### گام ۴: ساخت Service
```typescript
// src/modules/blog/blog.service.ts
import { blogRepository } from './blog.repository';
import { ApiError } from '@/lib/errors';

export class BlogService {
  async getPosts() {
    return blogRepository.findAll();
  }
  async getPost(slug: string) {
    const post = await blogRepository.findBySlug(slug);
    if (!post) throw ApiError.notFound('پست');
    return post;
  }
}
export const blogService = new BlogService();
```

### گام ۵: ساخت Validation Schema
```typescript
// src/lib/validations.ts (اضافه کن)
export const createBlogPostSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(50),
  slug: z.string().optional(),
});
```

### گام ۶: ساخت API Route
```typescript
// src/app/api/blog/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { blogService } from '@/modules/blog/blog.service';
import { withAdmin } from '@/middleware/auth';
import { withErrorHandler } from '@/lib/errors';

export const GET = withErrorHandler(async () => {
  const posts = await blogService.getPosts();
  return NextResponse.json(posts);
});

export const POST = withAdmin(
  withErrorHandler(async (req: NextRequest) => {
    const body = await req.json();
    // validate + create
    return NextResponse.json({}, { status: 201 });
  }) as any
);
```

### گام ۷: فعال کردن Feature Flag
```typescript
// src/config/index.ts
export const FEATURES = {
  blogModule: true,  // ← فعال شد
};
```

---

## اضافه کردن درگاه پرداخت جدید

```typescript
// src/config/index.ts — اضافه کردن گزینه جدید
export const PAYMENT_GATEWAYS = {
  ...existing,
  nextpay: {
    name: 'نکست‌پی',
    enabled: true,
    apiKey: process.env.NEXTPAY_API_KEY || '',
    sandbox: true,
  },
};
```

```typescript
// src/modules/payment/nextpay.gateway.ts
export class NextPayGateway {
  async createPayment(amount: number, orderId: string) { ... }
  async verifyPayment(transId: string) { ... }
}
```

---

## قوانین معماری

| قانون | توضیح |
|-------|-------|
| **Repository** | فقط DB operations — بدون business logic |
| **Service** | فقط business logic — بدون HTTP/DB |
| **Route** | فقط HTTP — validate + call service |
| **Config** | همه ثوابت اینجا — نه inline در کد |
| **Types** | همه Interface‌ها اینجا — reuse کن |
| **Validation** | همه Zod schemas اینجا — نه inline |
