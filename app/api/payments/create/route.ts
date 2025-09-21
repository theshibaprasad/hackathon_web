import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { 
      userId, 
      amount, 
      currency = 'INR', 
      isEarlyBird = false,
      razorpayOrderId 
    } = await request.json();

    if (!userId || !amount || !razorpayOrderId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create payment record
    const payment = new Payment({
      userId,
      paymentStatus: 'pending',
      isEarlyBird,
      razorpayOrderId,
      amount,
      currency
    });

    await payment.save();

    return NextResponse.json({
      success: true,
      payment: {
        id: payment._id,
        userId: payment.userId,
        paymentStatus: payment.paymentStatus,
        isEarlyBird: payment.isEarlyBird,
        razorpayOrderId: payment.razorpayOrderId,
        amount: payment.amount,
        currency: payment.currency,
        createdAt: payment.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
