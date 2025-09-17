import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import HackathonRegistration from '@/models/HackathonRegistration';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hackathonId = searchParams.get('hackathonId');

    if (!hackathonId) {
      return NextResponse.json(
        { message: 'Hackathon ID is required' },
        { status: 400 }
      );
    }

    // Get JWT token from cookies
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized - No token found' },
        { status: 401 }
      );
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch (error) {
      return NextResponse.json(
        { message: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user by ID
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({
        isRegistered: false,
        registration: null
      });
    }

    // Check if user is registered
    const registration = await HackathonRegistration.findOne({
      userId: user._id.toString(),
      hackathonId: hackathonId
    });

    return NextResponse.json({
      isRegistered: !!registration,
      registration: registration ? {
        id: registration._id,
        userId: registration.userId,
        hackathonId: registration.hackathonId,
        registrationDate: registration.registrationDate,
        status: registration.status
      } : null
    });

  } catch (error) {
    console.error('Hackathon status check error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}


