import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ProblemStatement from '@/models/ProblemStatement';
import Theme from '@/models/Theme';

// PUT /api/admin/problem-statements/[id] - Update a problem statement
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { title, description, themeId, isActive } = await request.json();
    
    // Verify theme exists if themeId is provided
    if (themeId) {
      const theme = await Theme.findById(themeId);
      if (!theme) {
        return NextResponse.json(
          { error: 'Theme not found' },
          { status: 404 }
        );
      }
    }

    const problemStatement = await ProblemStatement.findByIdAndUpdate(
      params.id,
      { title, description, themeId, isActive },
      { new: true, runValidators: true }
    ).populate('themeId', 'name description');

    if (!problemStatement) {
      return NextResponse.json(
        { error: 'Problem statement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ problemStatement });
  } catch (error) {
    console.error('Error updating problem statement:', error);
    return NextResponse.json(
      { error: 'Failed to update problem statement' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/problem-statements/[id] - Delete a problem statement
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const problemStatement = await ProblemStatement.findByIdAndDelete(params.id);

    if (!problemStatement) {
      return NextResponse.json(
        { error: 'Problem statement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Problem statement deleted successfully' });
  } catch (error) {
    console.error('Error deleting problem statement:', error);
    return NextResponse.json(
      { error: 'Failed to delete problem statement' },
      { status: 500 }
    );
  }
}
