import { NextResponse } from 'next/server';
import { withAdmin } from '@/middleware/auth';
import { withErrorHandler } from '@/lib/errors';
import { orderRepository } from '@/modules/orders/order.repository';
import prisma from '@/lib/prisma';

export const GET = withAdmin(
  withErrorHandler(async () => {
    const [orderStats, totalProducts, activeProducts, totalUsers, newSubmissions, recentOrders] =
      await Promise.all([
        orderRepository.getMonthlyStats(),
        prisma.product.count(),
        prisma.product.count({ where: { isActive: true } }),
        prisma.user.count(),
        prisma.formSubmission.count({ where: { status: 'new' } }),
        prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { items: true },
        }),
      ]);

    return NextResponse.json({
      totalProducts,
      activeProducts,
      totalOrders: orderStats.total,
      monthlyOrders: orderStats.monthly,
      totalRevenue: orderStats.revenue,
      monthlyRevenue: 0, // گسترش‌پذیر برای ماه جاری
      totalUsers,
      newSubmissions,
      recentOrders,
    });
  }) as any
);
