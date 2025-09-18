import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Admin from '@/models/Admin';
import HackathonRegistration from '@/models/HackathonRegistration';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('adminToken')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.type !== 'admin') {
      return NextResponse.json({ message: 'Invalid token type' }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Verify admin still exists and is active
    const admin = await Admin.findById(decoded.adminId);
    if (!admin || !admin.isActive) {
      return NextResponse.json({ message: 'Admin not found or inactive' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    const query = search ? {
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch users with pagination
    const [users, totalUsers] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query)
    ]);

    // Get registration info for each user
    const usersWithRegistrations = await Promise.all(
      users.map(async (user) => {
        const registrations = await HackathonRegistration.find({ userId: (user._id as any).toString() })
          .select('hackathonId status teamId createdAt')
          .lean();
        
        return {
          ...user,
          registrations: registrations.length,
          lastRegistration: registrations.length > 0 ? 
            registrations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] : null
        };
      })
    );

    const totalPages = Math.ceil(totalUsers / limit);

    return NextResponse.json({
      success: true,
      users: usersWithRegistrations,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('adminToken')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.type !== 'admin') {
      return NextResponse.json({ message: 'Invalid token type' }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Verify admin still exists and is active
    const admin = await Admin.findById(decoded.adminId);
    if (!admin || !admin.isActive) {
      return NextResponse.json({ message: 'Admin not found or inactive' }, { status: 401 });
    }

    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // Delete user and their registrations
    await Promise.all([
      User.findByIdAndDelete(userId),
      HackathonRegistration.deleteMany({ userId })
    ]);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('User deletion error:', error);
    return NextResponse.json(
      { message: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
