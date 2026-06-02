/**
 * ─── تنظیمات مرکزی اپلیکیشن ───────────────────────────────────────
 * همه مقادیر ثابت و پیکربندی پروژه اینجا هستند.
 * برای اضافه کردن امکان جدید، فقط این فایل رو تغییر بده.
 */

export const APP_CONFIG = {
  name: 'شایا چاپگر آریا',
  nameEn: 'Shaya Chapgar Aria',
  version: '1.0.0',
  url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
} as const;

export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 12,
  maxLimit: 100,
} as const;

export const AUTH_CONFIG = {
  jwtSecret: process.env.JWT_SECRET || 'shaya-chapgar-secret',
  tokenExpiry: '7d',
  cookieName: 'auth_token',
  cookieMaxAge: 60 * 60 * 24 * 7, // 7 days
} as const;

export const ROLES = {
  admin: 'admin',
  user: 'user',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const ORDER_STATUS = {
  pending: 'pending',
  processing: 'processing',
  shipped: 'shipped',
  delivered: 'delivered',
  cancelled: 'cancelled',
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const FORM_STATUS = {
  new: 'new',
  read: 'read',
  replied: 'replied',
} as const;

export const FORM_TYPES = {
  repair: 'repair',
  consultation: 'consultation',
  service: 'service',
  contact: 'contact',
} as const;

/**
 * ─── Feature Flags ─────────────────────────────────────────────────
 * برای فعال/غیرفعال کردن امکانات بدون تغییر کد
 */
export const FEATURES = {
  onlinePayment: false,         // درگاه پرداخت آنلاین
  productReviews: false,        // نظرات محصول
  wishlist: false,              // لیست علاقه‌مندی
  loyaltyPoints: false,         // امتیاز وفاداری
  multiCurrency: false,         // چند ارز
  smsNotification: false,       // پیامک
  emailNotification: false,     // ایمیل
  liveChat: true,               // چت آنلاین
  blogModule: false,            // وبلاگ
  warrantyTracker: false,       // پیگیری گارانتی
} as const;

/**
 * ─── Payment Gateways ─────────────────────────────────────────────
 * برای اضافه کردن درگاه جدید، اینجا اضافه کن
 */
export const PAYMENT_GATEWAYS = {
  zarinpal: {
    name: 'زرین‌پال',
    enabled: false,
    merchantId: process.env.ZARINPAL_MERCHANT_ID || '',
    sandbox: process.env.NODE_ENV !== 'production',
  },
  idpay: {
    name: 'آیدی‌پی',
    enabled: false,
    apiKey: process.env.IDPAY_API_KEY || '',
    sandbox: process.env.NODE_ENV !== 'production',
  },
} as const;

export const LABELS = {
  orderStatus: {
    pending: 'در انتظار بررسی',
    processing: 'در حال پردازش',
    shipped: 'ارسال شده',
    delivered: 'تحویل داده شده',
    cancelled: 'لغو شده',
  },
  formStatus: {
    new: 'جدید',
    read: 'خوانده شده',
    replied: 'پاسخ داده شده',
  },
  formType: {
    repair: 'درخواست تعمیر',
    consultation: 'مشاوره خرید',
    service: 'درخواست سرویس',
    contact: 'تماس با ما',
  },
  roles: {
    admin: 'مدیر',
    user: 'کاربر',
  },
} as const;
