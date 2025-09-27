import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      error_reason,
      error_code
    } = await request.json();


    // Get JWT token from cookies
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token found' },
        { status: 401 }
      );
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    if (!razorpay_order_id) {
      return NextResponse.json(
        { error: 'Razorpay order ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the payment record by razorpayOrderId
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) {
      return NextResponse.json(
        { error: 'Payment record not found' },
        { status: 404 }
      );
    }

    // Check if payment is already processed (success or failed)
    if (payment.paymentStatus !== 'pending') {
      return NextResponse.json(
        { 
          error: 'Payment already processed',
          currentStatus: payment.paymentStatus
        },
        { status: 400 }
      );
    }

    // Update payment status to failed
    const updatedPayment = await Payment.findByIdAndUpdate(
      payment._id,
      {
        paymentStatus: 'failed',
        // Store error details for debugging
        errorReason: error_reason || 'Payment failed',
        errorCode: error_code || 'UNKNOWN_ERROR'
      },
      { new: true }
    );

    // Clean up all other pending payments for this user when payment fails
    // This prevents accumulation of multiple pending payments
    await Payment.deleteMany({
      userId: decoded.userId,
      paymentStatus: 'pending',
      _id: { $ne: payment._id } // Exclude the current failed payment
    });


    return NextResponse.json({
      success: true,
      message: 'Payment marked as failed',
      payment: {
        id: updatedPayment._id,
        status: updatedPayment.paymentStatus,
        razorpayOrderId: updatedPayment.razorpayOrderId,
        errorReason: updatedPayment.errorReason,
        errorCode: updatedPayment.errorCode
      }
    });
  } catch (error) {
    console.error('Payment failure handling error:', error);
    return NextResponse.json(
      { error: 'Failed to process payment failure' },
      { status: 500 }
    );
  }
}
