import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);
    const payload = event.payload;

    if (event.event === 'order.paid' || event.event === 'payment.captured') {
      const razorpayOrderId = payload.payment?.entity?.order_id || payload.order?.entity?.id;
      const razorpayPaymentId = payload.payment?.entity?.id;
      
      if (!razorpayOrderId) return NextResponse.json({ received: true });

      const payment = await (prisma.payment as any).findUnique({
        where: { razorpayOrderId }
      });

      if (payment && payment.status === 'PENDING') {
        await (prisma.payment as any).update({
          where: { razorpayOrderId },
          data: {
            status: 'APPROVED',
            razorpayPaymentId: razorpayPaymentId
          }
        });

        await prisma.order.update({
          where: { id: payment.orderId },
          data: { status: 'PAID' }
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
