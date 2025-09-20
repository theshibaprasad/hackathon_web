import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import Settings, { ISettingsModel } from '@/models/Settings';
import jwt from 'jsonwebtoken';

// Get Early Bird offer status
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

    // Get Early Bird offer status from database
    await connectDB();
    const earlyBirdEnabled = await (Settings as ISettingsModel).getSetting('early_bird_enabled', true);
    
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

// Update Early Bird offer status
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

    const { earlyBirdEnabled } = await request.json();

    if (typeof earlyBirdEnabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid earlyBirdEnabled value' },
        { status: 400 }
      );
    }

    // Update setting in database
    await (Settings as ISettingsModel).setSetting(
      'early_bird_enabled', 
      earlyBirdEnabled, 
      'Controls whether the Early Bird offer is active for hackathon registration'
    );

    return NextResponse.json({
      success: true,
      message: `Early Bird offer ${earlyBirdEnabled ? 'enabled' : 'disabled'} successfully`,
      earlyBirdEnabled
    });
  } catch (error) {
    console.error('Error updating Early Bird status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
