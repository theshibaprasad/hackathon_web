import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ProblemStatement from '@/models/ProblemStatement';
import Theme from '@/models/Theme';

// GET /api/admin/problem-statements - Get all problem statements with their themes
export async function GET() {
  try {
    await connectDB();
    
    const problemStatements = await ProblemStatement.find({ isActive: true })
      .populate('themeId', 'name description')
      .sort({ createdAt: -1 });

    return NextResponse.json({ problemStatements });
  } catch (error) {
    console.error('Error fetching problem statements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problem statements' },
      { status: 500 }
    );
  }
}

// POST /api/admin/problem-statements - Create a new problem statement
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { title, description, themeId } = await request.json();
    
    if (!title || !description || !themeId) {
      return NextResponse.json(
        { error: 'Title, description, and theme are required' },
        { status: 400 }
      );
    }

    // Verify theme exists
    const theme = await Theme.findById(themeId);
    if (!theme) {
      return NextResponse.json(
        { error: 'Theme not found' },
        { status: 404 }
      );
    }

    const problemStatement = new ProblemStatement({
      title,
      description,
      themeId
    });

    await problemStatement.save();
    await problemStatement.populate('themeId', 'name description');

    return NextResponse.json({ problemStatement }, { status: 201 });
  } catch (error) {
    console.error('Error creating problem statement:', error);
    return NextResponse.json(
      { error: 'Failed to create problem statement' },
      { status: 500 }
    );
  }
}
