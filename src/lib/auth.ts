import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
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
    
    // Return user data from token
    return {
      _id: decoded.userId,
      email: decoded.email,
      firstName: decoded.firstName || '',
      lastName: decoded.lastName || '',
      phoneNumber: decoded.phoneNumber || '',
      createdAt: decoded.createdAt || new Date().toISOString(),
      updatedAt: decoded.updatedAt || new Date().toISOString()
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
