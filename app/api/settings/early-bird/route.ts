import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings, { ISettingsModel } from '@/models/Settings';

// Public endpoint to get all settings
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get both settings from database with default values
    const earlyBirdEnabled = await (Settings as ISettingsModel).getSetting('early_bird_enabled', true);
    const hackathonRegistrationEnabled = await (Settings as ISettingsModel).getSetting('hackathon_registration_enabled', true);
    
    return NextResponse.json({
      success: true,
      settings: {
        earlyBirdEnabled,
        hackathonRegistrationEnabled
      }
    });
  } catch (error) {
    console.error('Error getting settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
