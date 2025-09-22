import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Team from '@/models/Team';
import jwt from 'jsonwebtoken';

export async function GET(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const { teamId } = params;

    if (!teamId) {
      return NextResponse.json(
        { error: 'Team ID is required' },
        { status: 400 }
      );
    }

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

    await connectDB();

    // Find team by ID
    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    // Check if user is part of this team
    const isLeader = team.leader.userId.toString() === decoded.userId;
    const isMember = team.members.some((member: any) => member.userId.toString() === decoded.userId);
    const isTeamMember = isLeader || isMember;

    if (!isTeamMember) {
      return NextResponse.json(
        { error: 'Unauthorized - Not a team member' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      team: {
        _id: team._id,
        teamName: team.teamName,
        leader: team.leader,
        members: team.members,
        themeId: team.themeId,
        problemId: team.problemId,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt
      }
    });

  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
