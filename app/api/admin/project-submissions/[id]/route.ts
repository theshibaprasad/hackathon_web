import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ProjectSubmission } from '@/models/ProjectSubmission';
import Team from '@/models/Team';
import jwt from 'jsonwebtoken';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Verify admin authentication
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No admin token found' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      if (!decoded.role || !['admin', 'super_admin'].includes(decoded.role)) {
        return NextResponse.json(
          { error: 'Unauthorized - Admin access required' },
          { status: 403 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid admin token' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get submission details
    const submission = await ProjectSubmission.findById(id)
      .populate('submittedBy', 'firstName lastName email')
      .lean();

    if (!submission) {
      return NextResponse.json(
        { error: 'Project submission not found' },
        { status: 404 }
      );
    }

    // Get team details
    const team = await Team.findById((submission as any).teamId)
      .select('teamName leader members themeId problemId')
      .populate('leader.userId', 'firstName lastName email')
      .populate('members.userId', 'firstName lastName email')
      .lean();

    return NextResponse.json({
      success: true,
      submission: {
        ...submission,
        teamDetails: team
      }
    });
  } catch (error) {
    console.error('Error fetching project submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status, reviewNotes } = await request.json();

    // Verify admin authentication
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No admin token found' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      if (!decoded.role || !['admin', 'super_admin'].includes(decoded.role)) {
        return NextResponse.json(
          { error: 'Unauthorized - Admin access required' },
          { status: 403 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid admin token' },
        { status: 401 }
      );
    }

    await connectDB();

    // Validate status
    const validStatuses = ['submitted', 'under_review', 'approved', 'rejected'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') },
        { status: 400 }
      );
    }

    // Update submission
    const updateData: any = {};
    if (status) updateData.status = status;
    if (reviewNotes !== undefined) updateData.reviewNotes = reviewNotes;
    if (status && status !== 'submitted') {
      updateData.reviewedBy = decoded.userId;
      updateData.reviewedAt = new Date();
    }

    const submission = await ProjectSubmission.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('submittedBy', 'firstName lastName email');

    if (!submission) {
      return NextResponse.json(
        { error: 'Project submission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Project submission updated successfully',
      submission
    });
  } catch (error) {
    console.error('Error updating project submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


