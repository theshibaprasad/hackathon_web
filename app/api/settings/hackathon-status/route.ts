import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings, { ISettingsModel } from '@/models/Settings';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get hackathon status from database with default value 'live'
    const hackathonStatus = await (Settings as ISettingsModel).getSetting('hackathon_status', 'live');
    
    return NextResponse.json({
      success: true,
      hackathonStatus
    });
  } catch (error) {
    console.error('Error getting hackathon status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
