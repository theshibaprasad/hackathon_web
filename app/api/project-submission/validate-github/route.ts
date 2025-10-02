import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { githubRepo, teamName } = await request.json();

    if (!githubRepo || !teamName) {
      return NextResponse.json(
        { error: 'GitHub repository URL and team name are required' },
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

    try {
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

      return NextResponse.json({
        success: true,
        validation: {
          isPublic: true,
          hasSetupMd,
          hasTeamNamePdf,
          validatedAt: new Date().toISOString()
        },
        repository: {
          name: repoData.name,
          fullName: repoData.full_name,
          description: repoData.description,
          url: repoData.html_url,
          stars: repoData.stargazers_count,
          forks: repoData.forks_count
        }
      });

    } catch (error) {
      console.error('GitHub API error:', error);
      return NextResponse.json(
        { error: 'Failed to validate GitHub repository' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('GitHub validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

