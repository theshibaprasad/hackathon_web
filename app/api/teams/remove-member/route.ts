import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Team from '@/models/Team';
import jwt from 'jsonwebtoken';

export async function DELETE(request: NextRequest) {
  try {
    const { teamId, memberId } = await request.json();

    if (!teamId || !memberId) {
      return NextResponse.json(
        { error: 'Missing required fields: teamId and memberId are required' },
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

    // Get team
    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    // Check if user is the team leader
    const isLeader = team.leader.userId.toString() === decoded.userId;
    if (!isLeader) {
      return NextResponse.json(
        { error: 'Unauthorized - Only team leader can remove members' },
        { status: 403 }
      );
    }

    // Check if member exists
    const memberIndex = team.members.findIndex(
      (member: any) => member.userId.toString() === memberId
    );
    
    if (memberIndex === -1) {
      return NextResponse.json(
        { error: 'Member not found in this team' },
        { status: 404 }
      );
    }

    // Remove member from team
    const removedMember = team.members[memberIndex];
    team.members.splice(memberIndex, 1);
    await team.save();

    return NextResponse.json({
      success: true,
      message: 'Member removed successfully',
      removedMember: {
        name: removedMember.name,
        email: removedMember.email
      },
      team: {
        id: team._id,
        teamName: team.teamName,
        members: team.members
      }
    });

  } catch (error) {
    console.error('Error removing team member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
