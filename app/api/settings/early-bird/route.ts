import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings from '@/models/Settings';

// Public endpoint to get Early Bird offer status
export async function GET(request: NextRequest) {
  try {
    // Get Early Bird offer status from database
    await connectDB();
    const earlyBirdEnabled = await Settings.getSetting('early_bird_enabled', true);
    
    return NextResponse.json({
      success: true,
      earlyBirdEnabled
    });
  } catch (error) {
    console.error('Error getting Early Bird status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
