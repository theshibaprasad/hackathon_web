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

    // Fetch real statistics
    const [
      totalUsers,
      totalAdmins,
      totalRegistrations,
      activeRegistrations,
      recentUsers,
      recentRegistrations
    ] = await Promise.all([
      // Total users count
      User.countDocuments(),
      
      // Total admins count
      Admin.countDocuments({ isActive: true }),
      
      // Total hackathon registrations
      HackathonRegistration.countDocuments(),
      
      // Active hackathon registrations (not cancelled)
      HackathonRegistration.countDocuments({ status: 'registered' }),
      
      // Recent users (last 7 days)
      User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      
      // Recent registrations (last 7 days)
      HackathonRegistration.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    ]);

    // Calculate teams (assuming each team has multiple registrations)
    const teamStats = await HackathonRegistration.aggregate([
      { $match: { status: 'registered' } },
      { $group: { _id: '$teamId', count: { $sum: 1 } } },
      { $count: 'totalTeams' }
    ]);
    const totalTeams = teamStats[0]?.totalTeams || 0;

    // Calculate email stats (this would need to be tracked in a separate collection)
    // For now, we'll estimate based on registrations
    const emailsSent = totalRegistrations;

    // Active hackathons (for now, we'll use a default value or calculate based on registrations)
    const activeHackathons = 1; // This could be dynamic based on your hackathon data

    const stats = {
      totalUsers,
      totalAdmins,
      totalTeams,
      totalRegistrations,
      activeRegistrations,
      emailsSent,
      activeHackathons,
      recentUsers,
      recentRegistrations,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
