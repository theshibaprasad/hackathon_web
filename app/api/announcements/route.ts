import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Announcement from '@/models/Announcement';

// GET - Fetch public announcements for home page
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    const type = searchParams.get('type');

    // Build filter for public announcements
    const filter: any = {
      isActive: true,
      visibility: 'public',
      $or: [
        { startDate: { $exists: false } },
        { startDate: { $lte: new Date() } }
      ],
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $gte: new Date() } }
      ]
    };

    if (type) {
      filter.type = type;
    }

    const announcements = await Announcement.find(filter)
      .sort({ isPinned: -1, priority: -1, createdAt: -1 })
      .limit(limit)
      .select('title content type priority isPinned tags imageUrl actionButton createdAt');

    return NextResponse.json({ announcements });

  } catch (error) {
    console.error('Error fetching public announcements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}
