import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import HackathonRegistration from '@/models/HackathonRegistration';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      return NextResponse.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { hackathonId } = body;

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

    // Get user from database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is already registered
    const existingRegistration = await HackathonRegistration.findOne({
      userId: user._id.toString(),
      hackathonId: hackathonId
    });

    if (existingRegistration) {
      return NextResponse.json(
        { message: 'User is already registered for this hackathon' },
        { status: 400 }
      );
    }

    // Create new registration
    const registration = new HackathonRegistration({
      userId: user._id.toString(),
      hackathonId: hackathonId,
      status: 'registered'
    });

    await registration.save();

    return NextResponse.json({
      message: 'Successfully registered for hackathon',
      registration: {
        id: registration._id,
        userId: registration.userId,
        hackathonId: registration.hackathonId,
        registrationDate: registration.registrationDate,
        status: registration.status
      }
    });

  } catch (error) {
    console.error('Hackathon registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}


