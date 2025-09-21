import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { jwtOTPService } from '@/lib/jwtOTPService';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { email, otp, otpToken } = await request.json();

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

    if (!otpToken) {
      return NextResponse.json(
        { error: 'OTP token is required' },
        { status: 400 }
      );
    }

    // Verify OTP using JWT token
    const otpData = jwtOTPService.verifyOTPToken(otpToken, otp);
    
    if (!otpData) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Verify email matches
    if (otpData.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Email mismatch' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create new user with the data from OTP token
    const newUser = new User({
      firstName: otpData.firstName,
      lastName: otpData.lastName,
      email: otpData.email,
      phoneNumber: otpData.phoneNumber,
      password: otpData.password,
      otpVerified: true,
      userType: 'student', // Default user type
      isBoarding: false
    });

    await newUser.save();

    // Create JWT token for authentication
    const authToken = jwt.sign(
      { 
        userId: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phoneNumber: newUser.phoneNumber || '',
        isGoogleUser: newUser.isGoogleUser || false,
        isOTPVerified: newUser.otpVerified || false,
        isBoarding: newUser.isBoarding || false,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      success: true,
      message: 'Account created and verified successfully',
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        isBoarding: newUser.isBoarding
      }
    });

    // Set HTTP-only cookie
    response.cookies.set('auth-token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return response;

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}