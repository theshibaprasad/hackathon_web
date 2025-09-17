import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { sendOTPVerificationEmail } from '@/lib/emailService';
import { jwtOTPService } from '@/lib/jwtOTPService';
import { rateLimiter } from '@/lib/rateLimiter';

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    // Rate limiting check
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimiter.isAllowed(`register:${clientIP}`)) {
      const remaining = rateLimiter.getRemainingAttempts(`register:${clientIP}`);
      const resetTime = rateLimiter.getResetTime(`register:${clientIP}`);
      return NextResponse.json(
        { 
          error: 'Too many registration attempts. Please try again later.',
          remainingAttempts: remaining,
          resetTime: resetTime
        },
        { status: 429 }
      );
    }

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists (verified)
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create JWT token with OTP data
    const { token: otpToken, otp } = jwtOTPService.createOTPToken({
      email: email.toLowerCase(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      password: hashedPassword
    });

    // Send OTP email
    await sendOTPVerificationEmail(email, firstName, otp);

    return NextResponse.json(
      { 
        success: true,
        message: 'OTP sent to your email for verification',
        otpToken: otpToken // Include token for frontend verification
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
