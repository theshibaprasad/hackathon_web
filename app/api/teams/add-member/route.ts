import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Team from '@/models/Team';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { teamId, email, firstName, lastName, phone } = await request.json();

    if (!teamId || !email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Check if email exists in User collection
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      // Check if this user is already a team leader in any team
      const isTeamLeader = await Team.findOne({ 
        'leader.userId': existingUser._id 
      });
      
      if (isTeamLeader) {
        return NextResponse.json(
          { error: 'Team member is registered as Leader' },
          { status: 400 }
        );
      }

      // Check if user is already in this team
      const existingMember = team.members.find(
        (member: any) => member.userId.toString() === existingUser._id.toString()
      );
      if (existingMember) {
        return NextResponse.json(
          { error: 'User is already a member of this team' },
          { status: 400 }
        );
      }

      // Check if user is already in another team
      if (existingUser.teamId && existingUser.teamId.toString() !== teamId) {
        return NextResponse.json(
          { error: 'User is already a member of another team' },
          { status: 400 }
        );
      }

      // Add existing user to team
      const newMember = {
        userId: existingUser._id,
        name: `${existingUser.firstName} ${existingUser.lastName}`,
        email: existingUser.email,
        phone: existingUser.phoneNumber || phone
      };
      
      team.members.push(newMember);
      await team.save();
      
      console.log('Team member added to Teams collection:', {
        teamId: team._id,
        teamName: team.teamName,
        newMember,
        totalMembers: team.members.length
      });

      // Update user's teamId
      await User.findByIdAndUpdate(existingUser._id, { 
        teamId: team._id,
        teamName: team.teamName
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
    } else {
      // Email doesn't exist in User collection
      // Create a new user entry (without password since they'll need to register)
      const newUser = new User({
        firstName,
        lastName,
        email: email.toLowerCase(),
        phoneNumber: phone || '',
        password: '', // Empty password - user will need to set it when they register
        otpVerified: false,
        userType: 'student', // Default type
        isBoarding: false // They haven't completed onboarding yet
      });

      await newUser.save();

      // Add new user to team
      const newMember = {
        userId: newUser._id,
        name: `${firstName} ${lastName}`,
        email: email.toLowerCase(),
        phone: phone || ''
      };
      
      team.members.push(newMember);
      await team.save();
      
      console.log('New team member added to Teams collection:', {
        teamId: team._id,
        teamName: team.teamName,
        newMember,
        totalMembers: team.members.length
      });

      // Update user's teamId
      await User.findByIdAndUpdate(newUser._id, { 
        teamId: team._id,
        teamName: team.teamName
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
    }

  } catch (error) {
    console.error('Error adding team member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
