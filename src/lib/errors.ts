import { NextResponse } from 'next/server';

/**
 * ─── کلاس خطای API ────────────────────────────────────────────────
 * تمام خطاهای API از این کلاس استفاده می‌کنند.
 * برای اضافه کردن نوع خطای جدید، فقط متدهای static رو گسترش بده.
 */
export class ApiError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }

  // ─── Factory methods ──────────────────────────────────────
  static notFound(resource = 'مورد') {
    return new ApiError(`${resource} یافت نشد`, 404, 'NOT_FOUND');
  }

  static unauthorized() {
    return new ApiError('دسترسی غیر مجاز', 401, 'UNAUTHORIZED');
  }

  static forbidden() {
    return new ApiError('شما مجوز این عملیات را ندارید', 403, 'FORBIDDEN');
  }

  static badRequest(msg: string) {
    return new ApiError(msg, 400, 'BAD_REQUEST');
  }

  static conflict(msg: string) {
    return new ApiError(msg, 409, 'CONFLICT');
  }

  static internal(msg = 'خطای داخلی سرور') {
    return new ApiError(msg, 500, 'INTERNAL_ERROR');
  }

  toResponse() {
    return NextResponse.json(
      { error: this.message, code: this.code },
      { status: this.statusCode }
    );
  }
}

/**
 * ─── Wrapper برای API Route Handlerها ─────────────────────────────
 * هر route handler رو در این تابع بپیچ تا خطاها به صورت یکنواخت
 * مدیریت بشن.
 */
export function withErrorHandler(
  handler: (...args: any[]) => Promise<NextResponse>
) {
  return async (...args: any[]): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof ApiError) {
        return error.toResponse();
      }
      // Prisma unique constraint violation
      if ((error as any)?.code === 'P2002') {
        return ApiError.conflict('این مقدار قبلاً ثبت شده است').toResponse();
      }
      // Prisma record not found
      if ((error as any)?.code === 'P2025') {
        return ApiError.notFound().toResponse();
      }
      console.error('[API Error]', error);
      return ApiError.internal().toResponse();
    }
  };
}
