import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { sendWelcomeEmail } from '@/lib/emailService';
import { jwtOTPService } from '@/lib/jwtOTPService';
import { rateLimiter } from '@/lib/rateLimiter';
import { securityMonitor } from '@/lib/securityMonitor';

export async function POST(request: NextRequest) {
  try {
    const { email, otp, otpToken } = await request.json();

    // Rate limiting check
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimiter.isAllowed(`verify:${clientIP}`)) {
      const remaining = rateLimiter.getRemainingAttempts(`verify:${clientIP}`);
      const resetTime = rateLimiter.getResetTime(`verify:${clientIP}`);
      return NextResponse.json(
        { 
          error: 'Too many verification attempts. Please try again later.',
          remainingAttempts: remaining,
          resetTime: resetTime
        },
        { status: 429 }
      );
    }

    // Validation
    if (!email || !otp || !otpToken) {
      return NextResponse.json(
        { error: 'Email, OTP, and OTP token are required' },
        { status: 400 }
      );
    }

    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      return NextResponse.json(
        { error: 'OTP must be a 6-digit number' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify OTP with JWT
    const otpData = jwtOTPService.verifyOTPToken(otpToken, otp);
    if (!otpData) {
      // Log failed OTP attempt
      securityMonitor.logEvent({
        type: 'failed_otp',
        ip: clientIP,
        email: email,
        details: 'Invalid or expired OTP'
      });

      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Verify email matches
    if (otpData.email !== email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Email mismatch' },
        { status: 400 }
      );
    }

    // Check if user already exists (double-check)
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { phoneNumber: otpData.phoneNumber }
      ]
    });
    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { error: 'User with this phone number already exists' },
          { status: 400 }
        );
      }
    }

    // Create the actual user account
    const user = new User({
      firstName: otpData.firstName,
      lastName: otpData.lastName,
      email: otpData.email,
      phoneNumber: otpData.phoneNumber,
      password: otpData.password
    });

    await user.save();

    // Create JWT token for immediate login
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Create user data response (excluding password)
    const userData = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber
    };

    // Create response with user data
    const response = NextResponse.json(
      { 
        success: true,
        message: 'Account created and verified successfully',
        user: userData
      },
      { status: 201 }
    );

    // Set HTTP-only cookie for authentication
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Send welcome email (async, don't wait for it)
    sendWelcomeEmail(user.email, user.firstName).catch(console.error);

    return response;
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
