import { NextRequest, NextResponse } from 'next/server';
import { orderRepository } from '@/modules/orders/order.repository';
import { withAdmin } from '@/middleware/auth';
import { withErrorHandler } from '@/lib/errors';
import { validate, createOrderSchema } from '@/lib/validations';
import { getServerUser } from '@/middleware/auth';

export const GET = withAdmin(
  withErrorHandler(async () => {
    const orders = await orderRepository.findAll();
    return NextResponse.json(orders);
  }) as any
);

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const data = validate(createOrderSchema, body);
  const user = await getServerUser();
  const order = await orderRepository.create({ ...data, userId: user?.id });
  return NextResponse.json(order, { status: 201 });
});
