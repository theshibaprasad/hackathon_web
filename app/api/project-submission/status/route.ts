import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Team from '@/models/Team';
import { ProjectSubmission } from '@/models/ProjectSubmission';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    // Get JWT token from cookies
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token found' },
        { status: 401 }
      );
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Get user's team
    const team = await Team.findOne({
      $or: [
        { 'leader.userId': decoded.userId },
        { 'members.userId': decoded.userId }
      ]
    });

    if (!team) {
      return NextResponse.json({
        hasTeam: false,
        submissionStatus: null,
      });
    }

    // Check if project is already submitted
    const submission = await ProjectSubmission.findOne({ teamId: team._id });

    const isTeamLeader = team.leader.userId.toString() === decoded.userId;

    return NextResponse.json({
      hasTeam: true,
      teamName: team.teamName,
      isTeamLeader: isTeamLeader,
      submissionStatus: submission ? {
        id: submission._id,
        status: submission.status,
        submittedAt: submission.submittedAt,
        projectName: submission.projectName,
        githubRepo: submission.githubRepo,
        githubValidation: submission.githubValidation,
        reviewNotes: submission.reviewNotes,
        reviewedAt: submission.reviewedAt,
      } : null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
