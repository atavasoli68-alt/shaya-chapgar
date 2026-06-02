/**
 * ─── تایپ‌های سراسری پروژه ────────────────────────────────────────
 * همه Interface و Type اصلی اینجا تعریف می‌شوند.
 */

// ─── API Response ─────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Auth ─────────────────────────────────────────────────────────
export interface JwtPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

// ─── Product ─────────────────────────────────────────────────────
export interface ProductWithCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  sku: string | null;
  stock: number;
  images: string[];
  categoryId: string | null;
  categoryName?: string | null;
  brand: string | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Filter & Sort ────────────────────────────────────────────────
export interface ProductFilters {
  search?: string;
  category?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ─── Cart ────────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

// ─── Order ───────────────────────────────────────────────────────
export interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  address?: string;
  city?: string;
  notes?: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
}

// ─── Form ────────────────────────────────────────────────────────
export interface FormField {
  name: string;
  label: string;
  type?: 'text' | 'tel' | 'email' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

// ─── Admin Dashboard ──────────────────────────────────────────────
export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  monthlyOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalUsers: number;
  newSubmissions: number;
  recentOrders: RecentOrder[];
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
}
