import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Team from '@/models/Team';
import jwt from 'jsonwebtoken';

export async function PUT(request: NextRequest) {
  try {
    const { teamId, memberId, firstName, lastName, email, phone } = await request.json();

    if (!teamId || !memberId || !firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: teamId, memberId, firstName, lastName, email, and phone are required' },
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
        { error: 'Unauthorized - Only team leader can update members' },
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

    // Store original email to check if it changed
    const originalEmail = team.members[memberIndex].email;
    const emailChanged = originalEmail.toLowerCase() !== email.toLowerCase();

    // Check if email already exists in other members (excluding current member)
    const existingMember = team.members.find(
      (member: any, index: number) => 
        index !== memberIndex && 
        member.email.toLowerCase() === email.toLowerCase()
    );
    
    if (existingMember) {
      return NextResponse.json(
        { error: 'This email is already used by another team member' },
        { status: 400 }
      );
    }

    // Update member details (preserve userId)
    team.members[memberIndex] = {
      userId: team.members[memberIndex].userId, // Preserve the existing userId
      name: `${firstName} ${lastName}`,
      email: email.toLowerCase(),
      phone: phone
    };

    await team.save();

    // Send invitation email if email changed
    let emailSent = false;
    if (emailChanged) {
      try {
        const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/emails/enhanced-team-invitation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inviteeEmail: email.toLowerCase(),
            inviteeName: `${firstName} ${lastName}`,
            teamName: team.teamName,
            leaderName: team.leader.name,
            hackathonName: 'Novothon 2024',
            theme: team.themeId || 'General',
            problemStatement: team.problemId ? 'Problem statement will be shared by the team leader' : undefined
          }),
        });

        emailSent = emailResponse.ok;
      } catch (error) {
        console.error('Error sending invitation email:', error);
        // Don't fail the update if email sending fails
      }
    }

    return NextResponse.json({
      success: true,
      message: emailChanged 
        ? (emailSent ? 'Member updated successfully and invitation email sent!' : 'Member updated successfully, but invitation email failed to send.')
        : 'Member updated successfully',
      emailChanged,
      emailSent,
      updatedMember: {
        userId: team.members[memberIndex].userId,
        name: team.members[memberIndex].name,
        email: team.members[memberIndex].email,
        phone: team.members[memberIndex].phone
      },
      team: {
        id: team._id,
        teamName: team.teamName,
        members: team.members
      }
    });

  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
