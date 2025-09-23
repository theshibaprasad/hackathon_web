import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import Settings, { ISettingsModel } from '@/models/Settings';
import jwt from 'jsonwebtoken';

// Get all settings
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token found' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    await connectDB();
    const admin = await Admin.findById(decoded.adminId);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin not found' },
        { status: 401 }
      );
    }

    // Get all settings from database with default values
    const earlyBirdEnabled = await (Settings as ISettingsModel).getSetting('early_bird_enabled', true);
    const hackathonRegistrationEnabled = await (Settings as ISettingsModel).getSetting('hackathon_registration_enabled', true);
    const hackathonStatus = await (Settings as ISettingsModel).getSetting('hackathon_status', 'live');
    
    return NextResponse.json({
      success: true,
      settings: {
        earlyBirdEnabled,
        hackathonRegistrationEnabled,
        hackathonStatus
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

// Update settings
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token found' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    await connectDB();
    const admin = await Admin.findById(decoded.adminId);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin not found' },
        { status: 401 }
      );
    }

    const { earlyBirdEnabled, hackathonRegistrationEnabled, hackathonStatus } = await request.json();

    // Validate input
    if (typeof earlyBirdEnabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid earlyBirdEnabled value' },
        { status: 400 }
      );
    }

    if (typeof hackathonRegistrationEnabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid hackathonRegistrationEnabled value' },
        { status: 400 }
      );
    }

    if (hackathonStatus && !['live', 'stop'].includes(hackathonStatus)) {
      return NextResponse.json(
        { error: 'Invalid hackathonStatus value. Must be "live" or "stop"' },
        { status: 400 }
      );
    }

    // Update all settings in database
    await (Settings as ISettingsModel).setSetting(
      'early_bird_enabled', 
      earlyBirdEnabled, 
      'Controls whether the Early Bird offer is active for hackathon registration'
    );

    await (Settings as ISettingsModel).setSetting(
      'hackathon_registration_enabled', 
      hackathonRegistrationEnabled, 
      'Controls whether hackathon registration is open for new users'
    );

    if (hackathonStatus) {
      await (Settings as ISettingsModel).setSetting(
        'hackathon_status', 
        hackathonStatus, 
        'Controls whether the hackathon is live (allows project submission) or stopped'
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings: {
        earlyBirdEnabled,
        hackathonRegistrationEnabled,
        hackathonStatus: hackathonStatus || 'live'
      }
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
