import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Team from '@/models/Team';
import { ProjectSubmission } from '@/models/ProjectSubmission';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    // Get JWT token from cookies
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token found' },
        { status: 401 }
      );
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Get user's team
    const team = await Team.findOne({
      $or: [
        { 'leader.userId': decoded.userId },
        { 'members.userId': decoded.userId }
      ]
    });

    if (!team) {
      return NextResponse.json(
        { error: 'No team found for user' },
        { status: 404 }
      );
    }

    // Check if user is team leader
    const isTeamLeader = team.leader.userId.toString() === decoded.userId;
    
    if (!isTeamLeader) {
      return NextResponse.json(
        { error: 'Only team leaders can submit projects' },
        { status: 403 }
      );
    }

    // No external service configuration needed for GitHub validation

    // Check if project already submitted
    const existingSubmission = await ProjectSubmission.findOne({ teamId: team._id });
    if (existingSubmission) {
      return NextResponse.json(
        { error: 'Project already submitted for this team' },
        { status: 400 }
      );
    }

    // Parse request body
    const { teamName, projectName, description, githubRepo } = await request.json();

    if (!teamName || !projectName || !description || !githubRepo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate GitHub URL format
    const githubUrlPattern = /^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;
    if (!githubUrlPattern.test(githubRepo)) {
      return NextResponse.json(
        { error: 'Invalid GitHub repository URL format' },
        { status: 400 }
      );
    }

    // Validate team name matches
    if (teamName !== team.teamName) {
      return NextResponse.json(
        { error: 'Team name does not match' },
        { status: 400 }
      );
    }

    // Validate GitHub repository
    let githubValidation;
    try {
      // Extract owner and repo from URL
      const urlParts = githubRepo.split('/');
      const owner = urlParts[3];
      const repo = urlParts[4];

      if (!owner || !repo) {
        return NextResponse.json(
          { error: 'Could not extract owner and repository from URL' },
          { status: 400 }
        );
      }

      // Check if repository is public and exists
      const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Hackathon-Web-App'
        }
      });

      if (!repoResponse.ok) {
        if (repoResponse.status === 404) {
          return NextResponse.json(
            { error: 'Repository not found or is private' },
            { status: 404 }
          );
        }
        return NextResponse.json(
          { error: 'Failed to access repository' },
          { status: repoResponse.status }
        );
      }

      const repoData = await repoResponse.json();
      
      if (repoData.private) {
        return NextResponse.json(
          { error: 'Repository is private. Please make it public.' },
          { status: 400 }
        );
      }

      // Check for setup.md file
      const setupMdResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/setup.md`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Hackathon-Web-App'
        }
      });

      const hasSetupMd = setupMdResponse.ok;

      // Check for teamname.pdf file (case insensitive)
      const teamNamePdfResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${teamName}.pdf`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Hackathon-Web-App'
        }
      });

      const hasTeamNamePdf = teamNamePdfResponse.ok;

      // Validate required files
      if (!hasSetupMd) {
        return NextResponse.json(
          { error: 'Repository must contain a setup.md file' },
          { status: 400 }
        );
      }

      if (!hasTeamNamePdf) {
        return NextResponse.json(
          { error: `Repository must contain a ${teamName}.pdf file` },
          { status: 400 }
        );
      }

      // Store validation results
      githubValidation = {
        isPublic: true,
        hasSetupMd,
        hasTeamNamePdf,
        validatedAt: new Date()
      };

    } catch (error: any) {
      console.error('GitHub validation error:', error);
      return NextResponse.json(
        { 
          error: 'Failed to validate GitHub repository',
          details: error.message || 'Unknown error occurred'
        },
        { status: 500 }
      );
    }

    // Save submission to database
    try {
      const submission = new ProjectSubmission({
        teamId: team._id,
        teamName: teamName,
        projectName,
        description,
        githubRepo,
        githubValidation,
        submittedBy: decoded.userId,
        submittedAt: new Date(),
        status: 'submitted',
      });

      await submission.save();

      return NextResponse.json({
        success: true,
        message: 'Project submitted successfully',
        data: {
          submissionId: submission._id,
          githubRepo,
          validation: githubValidation,
        },
      });
    } catch (error) {
      console.error('Error saving submission to database:', error);
      return NextResponse.json(
        { error: 'Failed to save submission to database' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Project submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
