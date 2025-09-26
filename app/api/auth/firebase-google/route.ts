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
  // Hardcoded Firebase private key
  const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCl1/duhaz54jn4
WxLChe6SP784ZQ+Y8Uq9617Djlobvid9n+lv+RyFDwP7gu44ubwx73Ht2HRUvfiV
se3SlDuBFz5FrspA2saZojXdoek2Um8XvBuBHObtOFY9ZyX/KnHuwRpZRqW9Y13p
7bsuBI6BsNjCE4+bXouOsDv5ubNWCyFnGJgWvoOmEossCja6nbfphCeIXiagqHNU
z+TvR3uSWyuxC3/EiwZ8x8OJ9WH6k9+jtHXoxct/ylnEFi9UaDEvSfqu3opLwY7U
Qpnfr4TDOBrgA0Kq3rhFms0Od/2igX5gSVfFGt11emXu/rSSfhhwb5qafKpn6rAy
wNoPie7TAgMBAAECggEATbcZrQIZX/PiRH6xGNTYSlJzEkNRftM7uins+2je0vdV
3Cmuo5kyAyxZKmhdp9lp1mClm9Z+FSP8tHFvx+lMxR6WQOM6xg9/V4lLArQX7CvP
AWlV3jgkAvAOgbGvfZZvU3nMFh/kFQ7WeIO93j+mZCHyQWgXOLCiZ1gwksKxxlSo
vyFmdwv0YpKI0ry1ewL0ofkWLoNIEN4QqrPEGQquBg91TiutclJIFe/j9xUBXAMH
fd4t7s4AGpZjldI9KN45/6x6+ZC0+0G90wfk/3SG1xkNEiicvRBTgExO4unUiRfC
Qj8KjE9WwhI2JK6XsZqePyUAokRGqEIA6VD4zXwloQKBgQDk97wCQMi2zeK0r6+t
jr+T98xMotrAimkzhByAUlg7tmDDhgejlvnf5vM75Ab1LtqKXAIfRZDLNPQ0wiJU
YH4GcVbj57cpWhP38Tp5aZbzYTqXVmSzJOMKu5YJT5xWCS0pMsaQaSQm5VQxtQUM
DrvplcM7j6PHN89/2eLhh5s1sQKBgQC5bGJy3y8yXIsAvvGYTZlXAoAcyS0V2HHN
IjIujH1shCX920zZ74jPwg07CulC7vKcxL6NT9/117tkxCcP5pdG8VgOCIixvjce
5S9JvLZYUbYf9OdIZZs+s5L0apGrwlbHz7KRyENX5gqT1JKd2gGWD7haA37tq3yh
9goB+t3ZwwKBgG3RaEpIWjxbaVWyQfdjVP2aR1GmdncMq8J6pdTiKdGR+r0sprNO
sVAzjAv4pWGpdEYSNS5chkMAhfRb/G0tzqQ2bi9nLtFVk+hCugILo8vdoWV+mVPW
6FJ4gFC870XQpulwog4Xb7B8I7KnmOEcnAI/w2Do1uuxGAPBNHFpQgcxAoGATv8n
HkuJnwogSmwPH9UHnDM7g4gOBj2VllCYUo6WLPJMAVA5+Kt9fQ3udxYZ9OM6R6Hm
kOvTvbhwZOjQv4x9LMNLwYbPPfKNJ0N7Fw4oHY6Kaij7lDN9pYP5+tmgQC3mrPAG
4ucQEdW28e5hnJCxlk4SO387x2QFEDdzYg6QD+MCgYAhtueOnyHy+48HefMSKQJ9
jqdYLjdRFpzzbMEsMSR1VQ9OBh1GHa2PcxMmlvRMtiEbPVHnGgugx6ECsSLqoReW
VLaRdw2dWYz6Rpm3QaD5tY9+z69bd2NgeARW1HEZ6SbWlIFBXN6EpqJ07+buo5tI
UWGmfyqfhBHvTcJWneJnhQ==
-----END PRIVATE KEY-----`;

  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
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
