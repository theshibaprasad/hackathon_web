import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Payment from '@/models/Payment';
import Team from '@/models/Team';
import jwt from 'jsonwebtoken';
import { refreshUserToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      isEarlyBird
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

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the payment record
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) {
      return NextResponse.json(
        { error: 'Payment record not found' },
        { status: 404 }
      );
    }

    // Update payment status to success
    const updatedPayment = await Payment.findByIdAndUpdate(
      payment._id,
      {
        paymentStatus: 'success',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature
      },
      { new: true }
    );

    // Remove all other pending payments for this user when payment is successful
    await Payment.deleteMany({
      userId: decoded.userId,
      paymentStatus: 'pending',
      _id: { $ne: payment._id } // Exclude the current successful payment
    });

    // Update user to set isBoarding to true after successful payment
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      {
        isBoarding: true // Set to true after successful payment
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Refresh JWT token with updated isBoarding status
    const newToken = await refreshUserToken(decoded.userId);


    const response = NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      payment: {
        id: updatedPayment._id,
        status: updatedPayment.paymentStatus,
        amount: updatedPayment.amount,
        isEarlyBird: updatedPayment.isEarlyBird
      }
    });

    // Set the new JWT token in the response cookie
    if (newToken) {
      response.cookies.set('auth-token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
    }

    return response;
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
