import { NextRequest, NextResponse } from 'next/server';
import { orderRepository } from '@/modules/orders/order.repository';
import { withAdmin } from '@/middleware/auth';
import { withErrorHandler } from '@/lib/errors';

export const PUT = withAdmin(
  withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const { status } = await req.json();
    const order = await orderRepository.updateStatus(id, status);
    return NextResponse.json(order);
  }) as any
);
