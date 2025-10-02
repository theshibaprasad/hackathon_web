import { NextRequest, NextResponse } from 'next/server';
import { sendPaymentConfirmationEmail } from '@/lib/emailService';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Payment from '@/models/Payment';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
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

    const { paymentId } = await request.json();

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the payment
    const payment = await Payment.findOne({ 
      _id: paymentId,
      userId: decoded.userId,
      paymentStatus: 'success'
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found or not successful' },
        { status: 404 }
      );
    }

    // Get user details
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Send payment confirmation email
    const result = await sendPaymentConfirmationEmail(
      user.email,
      `${user.firstName} ${user.lastName}`,
      {
        amount: payment.amount,
        paymentId: payment.razorpayPaymentId || 'N/A',
        orderId: payment.razorpayOrderId,
        isEarlyBird: payment.isEarlyBird,
        timestamp: payment.updatedAt.toISOString()
      }
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Payment confirmation email sent successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send payment confirmation email' },
        { status: 500 }
      );
    }

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

