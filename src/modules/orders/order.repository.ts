import prisma from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/utils';
import type { CreateOrderInput } from '@/lib/validations';

/**
 * ─── Order Repository ──────────────────────────────────────────────
 */
export class OrderRepository {
  async findAll() {
    return prisma.order.findMany({
      include: { items: true, user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: { items: true, user: { select: { name: true, email: true } } },
    });
  }

  async findByUser(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreateOrderInput & { userId?: string }) {
    return prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: data.userId || null,
        totalAmount: data.items.reduce((s, i) => s + i.price * i.quantity, 0),
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone || null,
        address: data.address || null,
        city: data.city || null,
        notes: data.notes || null,
        items: { create: data.items },
      },
      include: { items: true },
    });
  }

  async updateStatus(id: string, status: string) {
    return prisma.order.update({ where: { id }, data: { status } });
  }

  async getMonthlyStats() {
    const thisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const [total, monthly, revenue] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { createdAt: { gte: thisMonth } } }),
      prisma.order.aggregate({
        where: { status: { not: 'cancelled' } },
        _sum: { totalAmount: true },
      }),
    ]);
    return { total, monthly, revenue: revenue._sum.totalAmount || 0 };
  }
}

export const orderRepository = new OrderRepository();
