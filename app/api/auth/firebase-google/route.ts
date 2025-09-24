import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Team from '@/models/Team';
import { generateRandomPassword } from '@/lib/passwordGenerator';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const auth = getAuth();

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: 'Firebase ID token is required' },
        { status: 400 }
      );
    }

    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid: firebaseUid, email, name, given_name, family_name, picture } = decodedToken;


    if (!email || !firebaseUid) {
      return NextResponse.json(
        { error: 'Invalid Firebase account data' },
        { status: 400 }
      );
    }

    await connectDB();

    // Parse name into first and last name (prefer given_name/family_name if available)
    let firstName = 'User';
    let lastName = '';
    
    if (given_name && family_name) {
      // Use the separate given_name and family_name fields if available
      firstName = given_name.trim();
      lastName = family_name.trim();
    } else if (given_name) {
      // If only given_name is available
      firstName = given_name.trim();
      lastName = '';
    } else if (name) {
      // Fallback to parsing the full name
      const nameParts = name.trim().split(/\s+/);
      firstName = nameParts[0] || 'User';
      lastName = nameParts.slice(1).join(' ').trim() || '';
    }


    // Check if user already exists
    let user = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { firebaseUid: firebaseUid }
      ]
    });

    if (user) {
      // User exists - update Firebase UID if not set
      if (!user.firebaseUid) {
        user.firebaseUid = firebaseUid;
        user.isGoogleUser = true;
        await user.save();
      }

      // Create JWT token
      const token = jwt.sign(
        { 
          userId: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber || '',
          isGoogleUser: user.isGoogleUser || false,
          isOTPVerified: user.otpVerified || false,
          isBoarding: user.isBoarding || false,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      const response = NextResponse.json(
        { 
          success: true,
          message: 'Login successful',
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isGoogleUser: true
          }
        },
        { status: 200 }
      );

      // Set HTTP-only cookie
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return response;
    } else {
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

      // New user - create account
      const generatedPassword = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(generatedPassword, 12);

      const newUser = new User({
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: '', // Will be collected during onboarding
        userType: 'student', // Default user type, can be updated during onboarding
        firebaseUid: firebaseUid,
        isGoogleUser: true,
        isBoarding: false
      });

      await newUser.save();

      // Create minimal JWT token with only essential auth data
      const token = jwt.sign(
        { 
          userId: newUser._id,
          email: newUser.email,
          role: 'user'
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      const response = NextResponse.json(
        { 
          success: true,
          message: 'Account created successfully',
          user: {
            id: newUser._id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            isGoogleUser: true
          },
          isNewUser: true
        },
        { status: 201 }
      );

      // Set HTTP-only cookie
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return response;
    }
  } catch (error) {
    console.error('Firebase Google Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
