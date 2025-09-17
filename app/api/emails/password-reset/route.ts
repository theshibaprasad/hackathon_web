import { NextRequest, NextResponse } from 'next/server';
import { sendPasswordResetEmail } from '@/lib/emailService';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to user
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send password reset email
    const result = await sendPasswordResetEmail(
      user.email,
      `${user.firstName} ${user.lastName}`,
      resetToken
    );

    if (result.success) {
      return NextResponse.json(
        { message: 'Password reset email sent successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'Failed to send password reset email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Password reset email error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
