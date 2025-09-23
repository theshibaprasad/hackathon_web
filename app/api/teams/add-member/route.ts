import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Team from '@/models/Team';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    const { teamId, email, firstName, lastName, phone } = await request.json();

    if (!teamId || !email || !firstName || !lastName || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: teamId, email, firstName, lastName, and phone are required' },
        { status: 400 }
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

    // Check if email already exists in this team's members
    const existingMember = team.members.find(
      (member: any) => member.email.toLowerCase() === email.toLowerCase()
    );
    
    if (existingMember) {
      return NextResponse.json(
        { error: 'This email is already a member of this team' },
        { status: 400 }
      );
    }

    // Check if email is already a team leader in any team
    const isTeamLeader = await Team.findOne({ 
      'leader.email': email.toLowerCase() 
    });
    
    if (isTeamLeader) {
      return NextResponse.json(
        { error: 'This email is already registered as a team leader' },
        { status: 400 }
      );
    }

    // Add new member directly to the team
    const newMember = {
      userId: new mongoose.Types.ObjectId(), // Generate a new ObjectId for the member
      name: `${firstName} ${lastName}`,
      email: email.toLowerCase(),
      phone: phone
    };
    
    team.members.push(newMember);
    await team.save();
    
    console.log('Team member added to Teams collection:', {
      teamId: team._id,
      teamName: team.teamName,
      newMember,
      totalMembers: team.members.length
    });

    return NextResponse.json({
      success: true,
      message: 'Member added successfully',
      team: {
        id: team._id,
        teamName: team.teamName,
        members: team.members
      }
    });

  } catch (error) {
    console.error('Error adding team member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
