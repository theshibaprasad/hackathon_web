import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Theme from '@/models/Theme';
import ProblemStatement from '@/models/ProblemStatement';

// GET /api/themes - Get all active themes with their problem statements
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
          _id: theme._id,
          name: theme.name,
          description: theme.description,
          problemStatements: problemStatements.map(ps => ({
            _id: ps._id,
            title: ps.title,
            description: ps.description
          }))
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
