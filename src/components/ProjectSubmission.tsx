"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Github, 
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Clock,
  Users,
  FileText,
  Upload
} from "lucide-react";

interface SubmissionStatus {
  id: string;
  status: string;
  submittedAt: string;
  projectName: string;
  githubRepo: string;
  githubValidation: {
    isPublic: boolean;
    hasSetupMd: boolean;
    hasTeamNamePdf: boolean;
    validatedAt: string;
  };
  reviewNotes?: string;
  reviewedAt?: string;
}

interface TeamStatus {
  hasTeam: boolean;
  teamName?: string;
  isTeamLeader?: boolean;
  submissionStatus?: SubmissionStatus | null;
}

export const ProjectSubmission = () => {
  const { toast } = useToast();
  const [projectData, setProjectData] = useState({
    teamName: '',
    projectName: '',
    description: '',
    githubRepo: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamStatus, setTeamStatus] = useState<TeamStatus | null>(null);
  const [hackathonStatus, setHackathonStatus] = useState<'live' | 'stop'>('live');

  // Fetch hackathon status and team status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const [hackathonResponse, submissionResponse] = await Promise.all([
          fetch('/api/settings/hackathon-status', {
            method: 'GET',
            credentials: 'include',
          }),
          fetch('/api/project-submission/status', {
            method: 'GET',
            credentials: 'include',
          })
        ]);

        if (hackathonResponse.ok) {
          const hackathonData = await hackathonResponse.json();
          setHackathonStatus(hackathonData.hackathonStatus);
        }

        if (submissionResponse.ok) {
          const submissionData = await submissionResponse.json();
          setTeamStatus(submissionData);
          
          // Set team name if available
          if (submissionData.teamName) {
            setProjectData(prev => ({ ...prev, teamName: submissionData.teamName }));
          }
        }
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };

    fetchStatus();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateGitHubRepo = async (repoUrl: string) => {
    if (!repoUrl) return { isValid: true };

    try {
      const response = await fetch('/api/project-submission/validate-github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          githubRepo: repoUrl,
          teamName: projectData.teamName
        }),
        credentials: 'include',
      });

      const result = await response.json();
      
      if (response.ok) {
        return { isValid: true, validation: result.validation };
      } else {
        return { isValid: false, error: result.error };
      }
    } catch (error) {
      return { isValid: false, error: 'Failed to validate repository' };
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!projectData.teamName || !projectData.projectName || !projectData.description || !projectData.githubRepo) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including GitHub repository!",
        variant: "destructive",
      });
      return;
    }

    // Check if user is team leader
    if (!teamStatus?.isTeamLeader) {
      toast({
        title: "Access Denied",
        description: "Only team leaders can submit projects!",
        variant: "destructive",
      });
      return;
    }

    // Check if already submitted
    if (teamStatus?.submissionStatus) {
      toast({
        title: "Already Submitted",
        description: "Your team has already submitted a project!",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/project-submission/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
        credentials: 'include',
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Project Submitted!",
          description: "Your project has been submitted successfully with GitHub repository validation.",
        });
        
        // Refresh team status
        const statusResponse = await fetch('/api/project-submission/status', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          setTeamStatus(statusData);
        }
      } else {
        toast({
          title: "Submission Failed",
          description: result.error || "Failed to submit project. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: "An error occurred while submitting your project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  // Show simple message when hackathon is not live
  if (hackathonStatus === 'stop') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Project Submission</h2>
            <p className="text-muted-foreground mt-2">
              Submit your hackathon project details and files
            </p>
          </div>
          <Badge variant="destructive" className="text-sm">
            <Clock className="w-4 h-4 mr-1" />
            Hackathon Stopped
          </Badge>
        </div>

        {/* Simple Message */}
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center p-8">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Hackathon is not live now
            </h3>
            <p className="text-gray-600 mb-4">
              When it will live you can post your project. Please check back later.
            </p>
            <Badge variant="outline" className="text-sm">
              Project submission is currently disabled
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  // Show message if user doesn't have a team
  if (teamStatus && !teamStatus.hasTeam) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Project Submission</h2>
            <p className="text-muted-foreground mt-2">
              Submit your hackathon project details and files
            </p>
          </div>
        </div>

        {/* No Team Message */}
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center p-8">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Team Found
            </h3>
            <p className="text-gray-600 mb-4">
              You need to be part of a team to submit a project. Please join or create a team first.
            </p>
            <Badge variant="outline" className="text-sm">
              Team membership required
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  // Show message if user is not team leader
  if (teamStatus && teamStatus.hasTeam && !teamStatus.isTeamLeader) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Project Submission</h2>
            <p className="text-muted-foreground mt-2">
              Submit your hackathon project details and files
            </p>
          </div>
        </div>

        {/* Not Team Leader Message */}
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center p-8">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Access Restricted
            </h3>
            <p className="text-gray-600 mb-4">
              Only team leaders can submit projects. Please contact your team leader to submit the project.
            </p>
            <Badge variant="outline" className="text-sm">
              Team leader access required
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/3 to-background/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-primary/10 shadow-lg shadow-primary/5">
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2 sm:mb-3">
              🚀 Project Submission
            </h2>
            <p className="text-muted-foreground/80 text-sm sm:text-base lg:text-lg leading-relaxed">
              Submit your innovative hackathon project and showcase your work
            </p>
            {teamStatus?.teamName && (
              <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Team: {teamStatus.teamName}
                </span>
              </div>
            )}
          </div>
          <div className="flex justify-center sm:justify-start">
            <Badge 
              variant={teamStatus?.submissionStatus ? 'default' : 'secondary'}
              className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 font-semibold shadow-sm"
            >
              {teamStatus?.submissionStatus ? (
                <>
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  ✅ Submitted ({teamStatus.submissionStatus.status})
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Ready to Submit
                </>
              )}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Project Details */}
          <Card className="bg-gradient-to-br from-card via-card to-card/90 border-border/50 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 rounded-xl sm:rounded-2xl backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-bold">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400/20 to-blue-500/10 rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                📄 Project Details
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-muted-foreground/80 mt-1 sm:mt-2">
                Provide comprehensive information about your innovative project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
              <div className="space-y-2">
                <Label htmlFor="teamName">Team Name *</Label>
                <Input
                  id="teamName"
                  value={projectData.teamName}
                  onChange={(e) => handleInputChange('teamName', e.target.value)}
                  placeholder="Enter your team name"
                  className="h-10 sm:h-12"
                  disabled={!!teamStatus?.teamName}
                />
                {teamStatus?.teamName && (
                  <p className="text-xs text-muted-foreground">
                    Team name is automatically filled from your team information
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  value={projectData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  placeholder="Enter your project name"
                  className="h-10 sm:h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  value={projectData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your project, technologies used, and key features..."
                  className="min-h-[100px] sm:min-h-[120px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubRepo">GitHub Repository Link *</Label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="githubRepo"
                    value={projectData.githubRepo}
                    onChange={(e) => handleInputChange('githubRepo', e.target.value)}
                    placeholder="https://github.com/username/repository"
                    className="pl-10 h-10 sm:h-12"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Repository must be public and contain setup.md and {projectData.teamName || 'teamname'}.pdf files
                </p>
              </div>
            </CardContent>
          </Card>

          {/* GitHub Repository Requirements */}
          <Card className="bg-gradient-to-br from-card via-card to-card/90 border-border/50 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 rounded-xl sm:rounded-2xl backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-bold">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400/20 to-green-500/10 rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm">
                  <Github className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                📋 Repository Requirements
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-muted-foreground/80 mt-1 sm:mt-2">
                Your GitHub repository must meet the following requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Public Repository</p>
                    <p className="text-xs text-muted-foreground">Repository must be publicly accessible</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">setup.md File</p>
                    <p className="text-xs text-muted-foreground">Must contain a setup.md file with project setup instructions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{projectData.teamName || 'TeamName'}.pdf File</p>
                    <p className="text-xs text-muted-foreground">Must contain a PDF file named after your team</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Submission Guidelines */}
          <Card className="bg-gradient-to-br from-card via-card to-card/90 border-border/50 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 rounded-xl sm:rounded-2xl backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-bold">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-400/20 to-purple-500/10 rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                📋 Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3 text-xs sm:text-sm p-4 sm:p-6 pt-0">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Project name should be descriptive and clear</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Description should explain your project's purpose and features</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>GitHub repository must be public and accessible</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Include setup.md with project setup instructions</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Include {projectData.teamName || 'teamname'}.pdf with project documentation</span>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Card className="bg-gradient-to-br from-card via-card to-card/90 border-border/50 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 rounded-xl sm:rounded-2xl backdrop-blur-sm">
            <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
              <Button
                onClick={handleSubmit}
                disabled={
                  isSubmitting || 
                  !projectData.teamName || 
                  !projectData.projectName || 
                  !projectData.description ||
                  !projectData.githubRepo ||
                  !!teamStatus?.submissionStatus
                }
                className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold rounded-lg sm:rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary hover:shadow-xl hover:shadow-primary/25 hover:scale-105 transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Validating GitHub Repository...
                  </>
                ) : teamStatus?.submissionStatus ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Already Submitted
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Project
                  </>
                )}
              </Button>
              {teamStatus?.submissionStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-green-800 font-medium">
                    Project submitted successfully!
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Submitted on {new Date(teamStatus.submissionStatus.submittedAt).toLocaleDateString()}
                  </p>
                  {teamStatus.submissionStatus.githubRepo && (
                    <div className="mt-2">
                      <a
                        href={teamStatus.submissionStatus.githubRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-800 underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View GitHub Repository
                      </a>
                    </div>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
