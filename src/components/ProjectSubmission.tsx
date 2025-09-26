"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  Github, 
  FileText, 
  Archive,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  X,
  Clock
} from "lucide-react";

export const ProjectSubmission = () => {
  const { toast } = useToast();
  const [projectData, setProjectData] = useState({
    projectName: '',
    description: '',
    githubRepo: '',
    pptFile: null as File | null,
    zipFile: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'draft' | 'submitted'>('draft');
  const [hackathonStatus, setHackathonStatus] = useState<'live' | 'stop'>('live');

  // Fetch hackathon status
  useEffect(() => {
    const fetchHackathonStatus = async () => {
      try {
        const response = await fetch('/api/settings/hackathon-status', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setHackathonStatus(data.hackathonStatus);
        }
      } catch (error) {
        console.error('Error fetching hackathon status:', error);
      }
    };

    fetchHackathonStatus();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (field: 'pptFile' | 'zipFile', file: File) => {
    setProjectData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSubmit = async () => {
    if (!projectData.projectName || !projectData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in project name and description!",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmissionStatus('submitted');
    setIsSubmitting(false);
    
    toast({
      title: "Project Submitted!",
      description: "Your project has been submitted successfully.",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
          </div>
          <div className="flex justify-center sm:justify-start">
            <Badge 
              variant={submissionStatus === 'submitted' ? 'default' : 'secondary'}
              className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 font-semibold shadow-sm"
            >
              {submissionStatus === 'submitted' ? (
                <>
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  ✅ Submitted
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Draft
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
                <Label htmlFor="githubRepo">GitHub Repository Link</Label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="githubRepo"
                    value={projectData.githubRepo}
                    onChange={(e) => handleInputChange('githubRepo', e.target.value)}
                    placeholder="https://github.com/username/repository"
                    className="pl-10 h-10 sm:h-12"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Uploads */}
          <Card className="bg-gradient-to-br from-card via-card to-card/90 border-border/50 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 rounded-xl sm:rounded-2xl backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-bold">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400/20 to-green-500/10 rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                📤 File Uploads
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-muted-foreground/80 mt-1 sm:mt-2">
                Upload your presentation slides and complete project files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
              {/* PPT Upload */}
              <div className="space-y-3">
                <Label className="text-sm sm:text-base font-medium">Presentation File (PPT/PDF)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 sm:p-6 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    id="ppt-upload"
                    accept=".ppt,.pptx,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('pptFile', file);
                    }}
                    className="hidden"
                  />
                  <label htmlFor="ppt-upload" className="cursor-pointer">
                    <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-2 sm:mb-3" />
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PPT, PPTX, PDF (Max 50MB)
                    </p>
                  </label>
                </div>
                {projectData.pptFile && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{projectData.pptFile.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({formatFileSize(projectData.pptFile.size)})
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setProjectData(prev => ({ ...prev, pptFile: null }))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* ZIP Upload */}
              <div className="space-y-3">
                <Label className="text-sm sm:text-base font-medium">Project Files (ZIP)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 sm:p-6 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    id="zip-upload"
                    accept=".zip"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('zipFile', file);
                    }}
                    className="hidden"
                  />
                  <label htmlFor="zip-upload" className="cursor-pointer">
                    <Archive className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-2 sm:mb-3" />
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ZIP file (Max 100MB)
                    </p>
                  </label>
                </div>
                {projectData.zipFile && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <Archive className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{projectData.zipFile.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({formatFileSize(projectData.zipFile.size)})
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setProjectData(prev => ({ ...prev, zipFile: null }))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                )}
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
                <span>GitHub repository should be public and accessible</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Presentation should showcase your project effectively</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>ZIP file should contain all source code and assets</span>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Card className="bg-gradient-to-br from-card via-card to-card/90 border-border/50 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 rounded-xl sm:rounded-2xl backdrop-blur-sm">
            <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !projectData.projectName || !projectData.description}
                className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold rounded-lg sm:rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary hover:shadow-xl hover:shadow-primary/25 hover:scale-105 transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Project
                  </>
                )}
              </Button>
              {submissionStatus === 'submitted' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-green-800 font-medium">
                    Project submitted successfully!
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
