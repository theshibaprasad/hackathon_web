import { NextRequest, NextResponse } from 'next/server';
import { sendEnhancedTeamInvitationEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const { 
      inviteeEmail, 
      inviteeName, 
      teamName, 
      leaderName, 
      hackathonName, 
      theme, 
      problemStatement 
    } = await request.json();

    if (!inviteeEmail || !inviteeName || !teamName || !leaderName || !hackathonName) {
      return NextResponse.json(
        { message: 'Required fields: inviteeEmail, inviteeName, teamName, leaderName, and hackathonName are required' },
        { status: 400 }
      );
    }

    // Send enhanced team invitation email
    const result = await sendEnhancedTeamInvitationEmail(
      inviteeEmail,
      inviteeName,
      teamName,
      leaderName,
      hackathonName,
      theme,
      problemStatement
    );

    if (result.success) {
      return NextResponse.json(
        { message: 'Enhanced team invitation email sent successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'Failed to send enhanced team invitation email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Enhanced team invitation email error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
