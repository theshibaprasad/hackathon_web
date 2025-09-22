import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from './mongodb';
import User from '@/models/User';

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isGoogleUser: boolean;
  isOTPVerified: boolean;
  isBoarding: boolean;
  teamId?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getServerSideUser(): Promise<User | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return null;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Return minimal auth data from token
    return {
      _id: decoded.userId,
      email: decoded.email,
      firstName: '', // Will be fetched fresh from database
      lastName: '', // Will be fetched fresh from database
      phoneNumber: '', // Will be fetched fresh from database
      isGoogleUser: false, // Will be fetched fresh from database
      isOTPVerified: false, // Will be fetched fresh from database
      isBoarding: false, // Will be fetched fresh from database
      teamId: undefined, // Will be fetched fresh from database
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getServerSideUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

export async function refreshUserToken(userId: string): Promise<string | null> {
  try {
    await connectDB();
    const user = await User.findById(userId);
    
    if (!user) {
      return null;
    }

    // Create minimal JWT token with only essential auth data
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: 'user'
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return token;
  } catch (error) {
    console.error('Error refreshing user token:', error);
    return null;
  }
}
