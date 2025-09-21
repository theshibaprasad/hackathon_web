import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Team from '@/models/Team';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
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

    const { teamName, themeId, problemId, leaderId } = await request.json();

    if (!teamName || !leaderId) {
      return NextResponse.json(
        { error: 'Team name and leader ID are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if team name already exists
    const existingTeam = await Team.findOne({ teamName });
    if (existingTeam) {
      return NextResponse.json(
        { error: 'Team name already exists' },
        { status: 400 }
      );
    }

    // Get leader information
    const leader = await User.findById(leaderId);
    if (!leader) {
      return NextResponse.json(
        { error: 'Leader not found' },
        { status: 404 }
      );
    }

    // Create team
    const team = new Team({
      teamName,
      leader: {
        userId: leader._id,
        name: `${leader.firstName} ${leader.lastName}`,
        email: leader.email,
        phone: leader.phoneNumber
      },
      members: [{
        userId: leader._id,
        name: `${leader.firstName} ${leader.lastName}`,
        email: leader.email,
        phone: leader.phoneNumber
      }],
      themeId: themeId || 'TBD',
      problemId: problemId || 'TBD'
    });

    await team.save();

    // Update user's teamId and set as team leader
    await User.findByIdAndUpdate(leaderId, { 
      teamId: team._id,
      isTeamLeader: true 
    });

    return NextResponse.json({
      success: true,
      team: {
        id: team._id,
        teamName: team.teamName,
        leader: team.leader,
        members: team.members,
        themeId: team.themeId,
        problemId: team.problemId,
        createdAt: team.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
