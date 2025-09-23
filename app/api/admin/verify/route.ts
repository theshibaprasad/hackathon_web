import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'No admin token found' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (decoded.type !== 'admin') {
      return NextResponse.json(
        { message: 'Invalid token type' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Verify admin still exists and is active
    const admin = await Admin.findById(decoded.adminId).select('-password');
    
    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { message: 'Admin not found or inactive' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: 'Admin verified',
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Admin verification error:', error);
    return NextResponse.json(
      { message: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}
