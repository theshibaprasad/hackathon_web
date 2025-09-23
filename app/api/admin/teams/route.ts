import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Team from '@/models/Team';
import User from '@/models/User';
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

    // Fetch all teams with detailed information
    const teams = await Team.find()
      .populate('leader.userId', 'firstName lastName email phoneNumber userType education job')
      .populate('members.userId', 'firstName lastName email phoneNumber userType education job')
      .sort({ createdAt: -1 })
      .lean();

    // Get payment information for each team
    const teamsWithPayments = await Promise.all(
      teams.map(async (team) => {
        // Get payment for team leader
        const leaderPayment = await Payment.findOne({ 
          userId: team.leader.userId,
          paymentStatus: 'success'
        }).lean();

        // Get payments for team members
        const memberPayments = await Promise.all(
          team.members.map(async (member) => {
            return await Payment.findOne({ 
              userId: member.userId,
              paymentStatus: 'success'
            }).lean();
          })
        );

        return {
          ...team,
          paymentInfo: {
            leaderPayment,
            memberPayments: memberPayments.filter(p => p !== null),
            totalPaid: (leaderPayment?.amount || 0) + memberPayments.reduce((sum, p) => sum + (p?.amount || 0), 0),
            isFullyPaid: leaderPayment && memberPayments.every(p => p !== null)
          }
        };
      })
    );

    return NextResponse.json({
      success: true,
      teams: teamsWithPayments,
      totalTeams: teamsWithPayments.length
    });

  } catch (error) {
    console.error('Teams fetch error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch teams data' },
      { status: 500 }
    );
  }
}
