import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import User from '@/models/User';
import Team from '@/models/Team';

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
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};
    if (status && status !== 'all') {
      filter.paymentStatus = status;
    }

    // Fetch payments with user and team information
    const payments = await Payment.find(filter)
      .populate('userId', 'firstName lastName email phoneNumber userType teamId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get team information for each payment
    const paymentsWithTeamInfo = await Promise.all(
      payments.map(async (payment) => {
        let teamInfo = null;
        if (payment.userId?.teamId) {
          teamInfo = await Team.findById(payment.userId.teamId)
            .select('teamName leader members themeId problemId')
            .lean();
        }

        return {
          ...payment,
          teamInfo
        };
      })
    );

    // Get payment statistics
    const [
      totalPayments,
      successfulPayments,
      failedPayments,
      pendingPayments,
      earlyBirdPayments,
      totalRevenue
    ] = await Promise.all([
      Payment.countDocuments(),
      Payment.countDocuments({ paymentStatus: 'success' }),
      Payment.countDocuments({ paymentStatus: 'failed' }),
      Payment.countDocuments({ paymentStatus: 'pending' }),
      Payment.countDocuments({ isEarlyBird: true, paymentStatus: 'success' }),
      Payment.aggregate([
        { $match: { paymentStatus: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const stats = {
      totalPayments,
      successfulPayments,
      failedPayments,
      pendingPayments,
      earlyBirdPayments,
      totalRevenue: totalRevenue[0]?.total || 0,
      successRate: totalPayments > 0 ? ((successfulPayments / totalPayments) * 100).toFixed(2) : 0
    };

    return NextResponse.json({
      success: true,
      payments: paymentsWithTeamInfo,
      stats,
      pagination: {
        page,
        limit,
        total: totalPayments,
        pages: Math.ceil(totalPayments / limit)
      }
    });

  } catch (error) {
    console.error('Payments fetch error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch payments data' },
      { status: 500 }
    );
  }
}
