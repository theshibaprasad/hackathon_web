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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Project Submission</h2>
          <p className="text-muted-foreground mt-2">
            Submit your hackathon project details and files
          </p>
        </div>
        <Badge 
          variant={submissionStatus === 'submitted' ? 'default' : 'secondary'}
          className="text-sm"
        >
          {submissionStatus === 'submitted' ? (
            <>
              <CheckCircle className="w-4 h-4 mr-1" />
              Submitted
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 mr-1" />
              Draft
            </>
          )}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Project Details
              </CardTitle>
              <CardDescription>
                Provide basic information about your project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  value={projectData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  placeholder="Enter your project name"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  value={projectData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your project, technologies used, and key features..."
                  className="min-h-[120px] resize-none"
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
                    className="pl-10 h-12"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Uploads */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                File Uploads
              </CardTitle>
              <CardDescription>
                Upload your presentation and project files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* PPT Upload */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Presentation File (PPT/PDF)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
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
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-2">
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
                <Label className="text-base font-medium">Project Files (ZIP)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
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
                    <Archive className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-2">
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
        <div className="space-y-6">
          {/* Submission Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Submission Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
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
          <Card>
            <CardContent className="pt-6">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !projectData.projectName || !projectData.description}
                className="w-full h-12 text-lg font-semibold"
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
