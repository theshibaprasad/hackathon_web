import { NextRequest, NextResponse } from 'next/server';
import { sendTeamInvitationEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const { inviteeEmail, inviteeName, teamName, hackathonName } = await request.json();

    if (!inviteeEmail || !inviteeName || !teamName || !hackathonName) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Send team invitation email
    const result = await sendTeamInvitationEmail(
      inviteeEmail,
      inviteeName,
      teamName,
      hackathonName
    );

    if (result.success) {
      return NextResponse.json(
        { message: 'Team invitation email sent successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'Failed to send team invitation email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Team invitation email error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
