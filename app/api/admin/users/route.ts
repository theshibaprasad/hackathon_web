import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Team from '@/models/Team';
import Payment from '@/models/Payment';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.type !== 'admin') {
      return NextResponse.json({ message: 'Invalid token type' }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const userType = searchParams.get('userType');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};
    if (userType && userType !== 'all') {
      filter.userType = userType;
    }

    // Fetch users with team and payment information
    const users = await User.find(filter)
      .populate('teamId', 'teamName leader members themeId problemId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get payment information for each user
    const usersWithPayments = await Promise.all(
      users.map(async (user) => {
        const payment = await Payment.findOne({ 
          userId: user._id,
          paymentStatus: 'success'
        }).lean();

        return {
          ...user,
          paymentInfo: payment
        };
      })
    );

    // Get user statistics
    const [
      totalUsers,
      studentUsers,
      professionalUsers,
      verifiedUsers,
      teamLeaders,
      paidUserIds
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ userType: 'student' }),
      User.countDocuments({ userType: 'professional' }),
      User.countDocuments({ otpVerified: true }),
      User.countDocuments({ isTeamLeader: true }),
      Payment.distinct('userId', { paymentStatus: 'success' })
    ]);

    const stats = {
      totalUsers,
      studentUsers,
      professionalUsers,
      verifiedUsers,
      teamLeaders,
      usersWithPayments: paidUserIds.length,
      verificationRate: totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(2) : 0
    };

    return NextResponse.json({
      success: true,
      users: usersWithPayments,
      stats,
      pagination: {
        page,
        limit,
        total: totalUsers,
        pages: Math.ceil(totalUsers / limit)
      }
    });

  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch users data' },
      { status: 500 }
    );
  }
}