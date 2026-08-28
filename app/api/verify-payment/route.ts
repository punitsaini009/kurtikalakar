import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is verified
      const payment = await (prisma.payment as any).findUnique({
        where: { razorpayOrderId: razorpay_order_id }
      });

      if (!payment) {
        return NextResponse.json({ success: false, error: "Payment not found" }, { status: 404 });
      }
      if (payment.status !== 'APPROVED') {
        await (prisma.payment as any).update({
          where: { razorpayOrderId: razorpay_order_id },
          data: {
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            status: 'APPROVED',
          }
        });

        await prisma.order.update({
          where: { id: payment.orderId },
          data: { status: 'PAID' }
        });
      }

      return NextResponse.json({ success: true, message: "Payment verified successfully", orderId: payment.orderId });
    } else {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
  }
}
