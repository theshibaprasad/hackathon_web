import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  
  if (!privateKey || !process.env.FIREBASE_CLIENT_EMAIL) {
    console.error('Firebase Admin SDK credentials not found');
    throw new Error('Firebase Admin SDK credentials not configured');
  }

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
    
    // Extract all available data from Google
    const {
      uid: firebaseUid,
      email,
      name,
      given_name,
      family_name,
      phone_number,
      email_verified,
      locale,
      // Add any other fields you want to capture
    } = decodedToken;

    return NextResponse.json({
      success: true,
      message: 'Google data extracted successfully',
      data: {
        // Basic info
        firebaseUid,
        email,
        emailVerified: email_verified,
        
        // Name info
        fullName: name,
        givenName: given_name,
        familyName: family_name,
        
        // Profile info
        phoneNumber: phone_number, // This is usually null from Google
        locale,
        
        // Parsed names (how we'll store them)
        parsedFirstName: given_name || (name ? name.split(' ')[0] : 'User'),
        parsedLastName: family_name || (name ? name.split(' ').slice(1).join(' ') : ''),
        
        // All available claims
        allClaims: decodedToken
      }
    });

  } catch (error) {
    console.error('Test Google data error:', error);
    return NextResponse.json(
      { error: 'Failed to extract Google data' },
      { status: 500 }
    );
  }
}
