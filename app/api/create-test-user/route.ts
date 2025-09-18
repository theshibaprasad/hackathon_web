import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName } = await request.json();
    
    await connectDB();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        message: 'User already exists',
        user: existingUser
      });
    }
    
    // Create new user
    const user = new User({
      email: email || 'test@example.com',
      firstName: firstName || 'Test',
      lastName: lastName || 'User',
      isActive: true
    });
    
    await user.save();
    
    return NextResponse.json({
      message: 'Test user created successfully',
      user: user
    });
    
  } catch (error) {
    console.error('Error creating test user:', error);
    return NextResponse.json(
      { message: 'Error creating test user', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

