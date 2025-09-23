import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
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

    await connectDB();

    // Find the latest successful payment for the user
    const payment = await Payment.findOne({ 
      userId: decoded.userId,
      paymentStatus: 'success'
    }).sort({ createdAt: -1 });

    if (!payment) {
      return NextResponse.json(
        { error: 'No successful payment found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: payment._id,
        razorpayPaymentId: payment.razorpayPaymentId,
        razorpayOrderId: payment.razorpayOrderId,
        amount: payment.amount,
        isEarlyBird: payment.isEarlyBird,
        paymentStatus: payment.paymentStatus,
        createdAt: payment.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching latest payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

