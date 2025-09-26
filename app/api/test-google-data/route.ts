import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

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

  if (!process.env.FIREBASE_CLIENT_EMAIL) {
    console.error('Firebase client email not found');
    throw new Error('Firebase client email not configured');
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
