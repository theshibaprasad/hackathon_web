import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings, { ISettingsModel } from '@/models/Settings';

// Get special pricing settings
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get special pricing setting from database
    const specialPricingEnabled = await (Settings as ISettingsModel).getSetting('special_pricing_enabled', false);
    
    return NextResponse.json({
      success: true,
      specialPricingEnabled
    });
  } catch (error) {
    console.error('Error getting special pricing settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update special pricing settings
export async function POST(request: NextRequest) {
  try {
    const { specialPricingEnabled } = await request.json();
    
    console.log('🔧 API: Received request to update special pricing:', specialPricingEnabled);

    // Validate input
    if (typeof specialPricingEnabled !== 'boolean') {
      console.log('❌ API: Validation failed - not a boolean');
      return NextResponse.json(
        { error: 'Invalid specialPricingEnabled value. Must be boolean.' },
        { status: 400 }
      );
    }

    await connectDB();
    console.log('🔧 API: Connected to database');

    // Update special pricing setting in database
    const result = await (Settings as ISettingsModel).setSetting(
      'special_pricing_enabled', 
      specialPricingEnabled, 
      'Controls whether the special 2 rupees pricing feature is enabled for users'
    );
    
    console.log('🔧 API: Database update result:', result);

    return NextResponse.json({
      success: true,
      message: 'Special pricing settings updated successfully',
      specialPricingEnabled
    });
  } catch (error) {
    console.error('❌ API: Error updating special pricing settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
