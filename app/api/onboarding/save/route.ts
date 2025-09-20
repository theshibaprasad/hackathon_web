import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
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

    // Check if user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare update data - don't include isBoarding as it should only be set by payment verification
    const updateData = {
      ...body,
      paymentStatus: body.paymentStatus || 'pending'
    };

    // Remove isBoarding from the update data to prevent overriding the payment verification setting
    delete updateData.isBoarding;

    // Update user with onboarding data
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update user data' },
        { status: 500 }
      );
    }

    console.log('Onboarding save successful:', {
      userId: decoded.userId,
      paymentStatus: updatedUser.paymentStatus,
      paymentAmount: updatedUser.paymentAmount,
      razorpayPaymentId: updatedUser.razorpayPaymentId,
      razorpayOrderId: updatedUser.razorpayOrderId,
      isBoarding: updatedUser.isBoarding
    });

    return NextResponse.json({
      success: true,
      message: 'Onboarding data saved successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Onboarding save error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    // Get user data (which now includes onboarding data)
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Onboarding fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
