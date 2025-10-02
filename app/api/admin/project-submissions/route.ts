import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ProjectSubmission } from '@/models/ProjectSubmission';
import Team from '@/models/Team';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No admin token found' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      if (!decoded.role || !['admin', 'super_admin'].includes(decoded.role)) {
        return NextResponse.json(
          { error: 'Unauthorized - Admin access required' },
          { status: 403 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid admin token' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'submittedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build query
    let query: any = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { teamName: { $regex: search, $options: 'i' } },
        { projectName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get submissions with pagination
    const submissions = await ProjectSubmission.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('submittedBy', 'firstName lastName email')
      .lean();

    // Get total count for pagination
    const totalCount = await ProjectSubmission.countDocuments(query);

    // Get team details for each submission
    const submissionsWithTeams = await Promise.all(
      submissions.map(async (submission) => {
        const team = await Team.findById(submission.teamId)
          .select('teamName leader members themeId problemId')
          .populate('leader.userId', 'firstName lastName email')
          .populate('members.userId', 'firstName lastName email')
          .lean();

        return {
          ...submission,
          teamDetails: team
        };
      })
    );

    // Get statistics
    const stats = await ProjectSubmission.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusStats = {
      submitted: 0,
      under_review: 0,
      approved: 0,
      rejected: 0,
      total: totalCount
    };

    stats.forEach((stat) => {
      statusStats[stat._id as keyof typeof statusStats] = stat.count;
    });

    return NextResponse.json({
      success: true,
      submissions: submissionsWithTeams,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      },
      stats: statusStats
    });
  } catch (error) {
    console.error('Error fetching project submissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


