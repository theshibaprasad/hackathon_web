import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import OnboardingData from '@/models/OnboardingData';
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

    // Check if onboarding data already exists
    const existingData = await OnboardingData.findOne({ userId: decoded.userId });
    
    if (existingData) {
      // Update existing data
      const updatedData = await OnboardingData.findOneAndUpdate(
        { userId: decoded.userId },
        {
          ...body,
          userId: decoded.userId,
          paymentStatus: body.paymentStatus || 'pending'
        },
        { new: true, upsert: true }
      );
      
      return NextResponse.json({
        success: true,
        message: 'Onboarding data updated successfully',
        data: updatedData
      });
    } else {
      // Create new onboarding data
      const onboardingData = new OnboardingData({
        ...body,
        userId: decoded.userId,
        paymentStatus: body.paymentStatus || 'pending'
      });

      await onboardingData.save();

      return NextResponse.json({
        success: true,
        message: 'Onboarding data saved successfully',
        data: onboardingData
      });
    }
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

    // Get onboarding data
    const onboardingData = await OnboardingData.findOne({ userId: decoded.userId });
    
    if (!onboardingData) {
      return NextResponse.json(
        { error: 'Onboarding data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: onboardingData
    });
  } catch (error) {
    console.error('Onboarding fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
