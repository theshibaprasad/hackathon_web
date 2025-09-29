import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Theme from '@/models/Theme';
import ProblemStatement from '@/models/ProblemStatement';

// GET /api/admin/themes - Get all themes with their problem statements
export async function GET() {
  try {
    await connectDB();
    
    const themes = await Theme.find({ isActive: true }).sort({ createdAt: -1 });
    const themesWithProblemStatements = await Promise.all(
      themes.map(async (theme) => {
        const problemStatements = await ProblemStatement.find({ 
          themeId: theme._id, 
          isActive: true 
        }).sort({ createdAt: -1 });
        
        return {
          ...theme.toObject(),
          problemStatements
        };
      })
    );

    return NextResponse.json({ themes: themesWithProblemStatements });
  } catch (error) {
    console.error('Error fetching themes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch themes' },
      { status: 500 }
    );
  }
}

// POST /api/admin/themes - Create a new theme
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { name, description } = await request.json();
    
    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    const theme = new Theme({
      name,
      description
    });

    await theme.save();

    return NextResponse.json({ theme }, { status: 201 });
  } catch (error) {
    console.error('Error creating theme:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      return NextResponse.json(
        { error: 'Theme with this name already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create theme' },
      { status: 500 }
    );
  }
}
