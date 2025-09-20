import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    if (otp.length !== 6) {
      return NextResponse.json(
        { error: 'OTP must be 6 digits' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user and verify OTP
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      resetPasswordOTP: otp,
      resetPasswordOTPExpiry: { $gt: new Date() } // OTP not expired
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Clear OTP after successful verification
    await User.findByIdAndUpdate(user._id, {
      $unset: {
        resetPasswordOTP: 1,
        resetPasswordOTPExpiry: 1
      }
    });

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}