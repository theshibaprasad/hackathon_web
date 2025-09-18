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

    // Fetch recent activities
    const [recentUsers, recentRegistrations] = await Promise.all([
      // Recent users (last 10)
      User.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('firstName lastName email createdAt')
        .lean(),
      
      // Recent hackathon registrations (last 10)
      HackathonRegistration.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('userId', 'firstName lastName email')
        .lean()
    ]);

    // Format activities
    const activities = [
      ...recentUsers.map(user => ({
        type: 'user_registered',
        message: `${user.firstName} ${user.lastName} registered`,
        email: user.email,
        timestamp: user.createdAt,
        icon: 'user-plus'
      })),
      ...recentRegistrations.map(reg => ({
        type: 'hackathon_registered',
        message: `${reg.userId?.firstName || 'User'} ${reg.userId?.lastName || ''} registered for hackathon`,
        email: reg.userId?.email,
        timestamp: reg.createdAt,
        icon: 'calendar'
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 20);

    return NextResponse.json({
      success: true,
      activities,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Dashboard activities error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch dashboard activities' },
      { status: 500 }
    );
  }
}
