import { NextRequest, NextResponse } from 'next/server';
import { sendOTPVerificationEmail } from '@/lib/emailService';
import { jwtOTPService } from '@/lib/jwtOTPService';

export async function POST(request: NextRequest) {
  try {
    const { email, otpToken } = await request.json();

    // Validation
    if (!email || !otpToken) {
      return NextResponse.json(
        { error: 'Email and OTP token are required' },
        { status: 400 }
      );
    }

    // Get OTP data from JWT token
    const otpData = jwtOTPService.getOTPData(otpToken);
    if (!otpData) {
      return NextResponse.json(
        { error: 'No pending verification found for this email' },
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

    // Generate new OTP and token
    const refreshResult = jwtOTPService.refreshOTP(otpToken);
    if (!refreshResult) {
      return NextResponse.json(
        { error: 'Failed to generate new OTP' },
        { status: 400 }
      );
    }

    // Send OTP email
    await sendOTPVerificationEmail(email, otpData.firstName, refreshResult.newOTP);

    return NextResponse.json(
      { 
        success: true,
        message: 'New OTP sent to your email',
        otpToken: refreshResult.newToken // Return new token
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
