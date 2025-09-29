import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Theme from '@/models/Theme';
import ProblemStatement from '@/models/ProblemStatement';

// PUT /api/admin/themes/[id] - Update a theme
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { name, description, isActive } = await request.json();
    
    const theme = await Theme.findByIdAndUpdate(
      params.id,
      { name, description, isActive },
      { new: true, runValidators: true }
    );

    if (!theme) {
      return NextResponse.json(
        { error: 'Theme not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ theme });
  } catch (error) {
    console.error('Error updating theme:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      return NextResponse.json(
        { error: 'Theme with this name already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update theme' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/themes/[id] - Delete a theme
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // Check if theme has problem statements
    const problemStatements = await ProblemStatement.find({ themeId: params.id });
    if (problemStatements.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete theme with existing problem statements' },
        { status: 400 }
      );
    }

    const theme = await Theme.findByIdAndDelete(params.id);

    if (!theme) {
      return NextResponse.json(
        { error: 'Theme not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Theme deleted successfully' });
  } catch (error) {
    console.error('Error deleting theme:', error);
    return NextResponse.json(
      { error: 'Failed to delete theme' },
      { status: 500 }
    );
  }
}
