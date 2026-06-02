import { z } from 'zod';

/**
 * ─── اسکیماهای Validation ─────────────────────────────────────────
 * هر ورودی API باید از یکی از این اسکیماها validate بشه.
 * برای اضافه کردن فیلد جدید، فقط اسکیما رو گسترش بده.
 */

// ─── Auth ─────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email('ایمیل معتبر نیست'),
  password: z.string().min(6, 'رمز عبور حداقل ۶ کاراکتر باشد'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'نام حداقل ۲ کاراکتر باشد'),
  email: z.string().email('ایمیل معتبر نیست'),
  password: z.string().min(6, 'رمز عبور حداقل ۶ کاراکتر باشد'),
  phone: z.string().optional(),
  role: z.enum(['admin', 'user']).optional().default('user'),
});

// ─── Product ─────────────────────────────────────────────────────
export const createProductSchema = z.object({
  name: z.string().min(2, 'نام محصول الزامی است'),
  slug: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive('قیمت باید مثبت باشد'),
  comparePrice: z.coerce.number().positive().optional().nullable(),
  sku: z.string().optional().nullable(),
  stock: z.coerce.number().int().min(0).default(0),
  images: z.array(z.string()).default([]),
  categoryId: z.string().optional().nullable(),
  brand: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export const updateProductSchema = createProductSchema.partial();

// ─── Category ─────────────────────────────────────────────────────
export const createCategorySchema = z.object({
  name: z.string().min(2, 'نام دسته‌بندی الزامی است'),
  slug: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const updateCategorySchema = createCategorySchema.partial();

// ─── Order ────────────────────────────────────────────────────────
export const createOrderSchema = z.object({
  customerName: z.string().min(2, 'نام الزامی است'),
  customerEmail: z.string().email('ایمیل معتبر نیست'),
  customerPhone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        productName: z.string(),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
      })
    )
    .min(1, 'سبد خرید خالی است'),
});

// ─── Form Submission ──────────────────────────────────────────────
export const formSubmissionSchema = z.object({
  formType: z.enum(['repair', 'consultation', 'service', 'contact']),
  data: z.record(z.string(), z.string()),
});

// ─── Settings ─────────────────────────────────────────────────────
export const updateSettingsSchema = z.record(z.string(), z.string());

// ─── Helper: validate and return typed data ────────────────────────
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(' | ');
    throw new Error(message);
  }
  return result.data;
}

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type FormSubmissionInput = z.infer<typeof formSubmissionSchema>;
