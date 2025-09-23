import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Team from '@/models/Team';
import { sendOTPVerificationEmail } from '@/lib/emailService';
import { jwtOTPService } from '@/lib/jwtOTPService';
import { rateLimiter } from '@/lib/rateLimiter';

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phoneNumber, password } = await request.json();

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
    if (!firstName || !lastName || !email || !phoneNumber || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Phone number validation and formatting
    let cleanedPhone = phoneNumber.replace(/\s+/g, ''); // Remove all spaces
    
    // Ensure phone number has +91 prefix
    if (/^0\d{10}$/.test(cleanedPhone)) {
      // 0 followed by 10 digits - remove 0 and add +91
      cleanedPhone = '+91' + cleanedPhone.slice(1);
    } else if (/^\d{10}$/.test(cleanedPhone)) {
      // 10 digits starting with 6-9 (valid Indian mobile)
      if (/^[6-9]\d{9}$/.test(cleanedPhone)) {
        cleanedPhone = '+91' + cleanedPhone;
      }
    } else if (/^91\d{10}$/.test(cleanedPhone)) {
      cleanedPhone = '+' + cleanedPhone;
    } else if (!cleanedPhone.startsWith('+91')) {
      // If it doesn't start with +91 and doesn't match above patterns, try to add +91
      if (cleanedPhone.length === 10 && /^[6-9]\d{9}$/.test(cleanedPhone)) {
        cleanedPhone = '+91' + cleanedPhone;
      }
    }
    
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanedPhone)) {
      return NextResponse.json(
        { error: 'Please enter a valid Indian phone number' },
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

    // Check if email exists in User collection
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { phoneNumber: cleanedPhone }
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

    // Check if email exists in Team collection (as team leader or member)
    const existingTeamMember = await Team.findOne({
      $or: [
        { 'leader.email': email.toLowerCase() },
        { 'members.email': email.toLowerCase() }
      ]
    });
    if (existingTeamMember) {
      return NextResponse.json(
        { error: 'This email is already registered as a team member or team leader' },
        { status: 400 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create JWT token with OTP data (including phone number)
    const { token: otpToken, otp } = jwtOTPService.createOTPToken({
      email: email.toLowerCase(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneNumber: cleanedPhone,
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
