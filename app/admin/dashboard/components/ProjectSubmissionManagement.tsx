"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  FileText, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter,
  ExternalLink,
  Calendar,
} from "lucide-react";

interface ProjectSubmission {
  _id: string;
  teamName: string;
  projectName: string;
  description: string;
  githubRepo: string;
  githubValidation: {
    isPublic: boolean;
    hasSetupMd: boolean;
    hasTeamNamePdf: boolean;
    validatedAt: string;
  };
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  submittedBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  submittedAt: string;
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  teamDetails: {
    _id: string;
    teamName: string;
    leader: {
      userId: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
      };
      name: string;
      email: string;
      phone: string;
    };
    members: Array<{
      userId: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
      };
      name: string;
      email: string;
      phone: string;
    }>;
  };
}

interface ProjectSubmissionStats {
  submitted: number;
  under_review: number;
  approved: number;
  rejected: number;
  total: number;
}

export default function ProjectSubmissionManagement() {
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [stats, setStats] = useState<ProjectSubmissionStats>({
    submitted: 0,
    under_review: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState<ProjectSubmission | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadSubmissions();
  }, [searchTerm, statusFilter, currentPage]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });

      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(`/api/admin/project-submissions?${params}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions);
        setStats(data.stats);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      submitted: { 
        color: 'bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200 hover:border-blue-300', 
        icon: Clock, 
        label: 'Submitted' 
      },
      under_review: { 
        color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border border-yellow-200 hover:border-yellow-300', 
        icon: Eye, 
        label: 'Under Review' 
      },
      approved: { 
        color: 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-200 hover:border-green-300', 
        icon: CheckCircle, 
        label: 'Approved' 
      },
      rejected: { 
        color: 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-200 hover:border-red-300', 
        icon: XCircle, 
        label: 'Rejected' 
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <span className={`${config.color} inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors duration-200 cursor-default`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                <p className="text-2xl font-bold text-blue-600">{stats.submitted}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Under Review</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.under_review}</p>
              </div>
              <Eye className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Project Submissions
          </CardTitle>
          <CardDescription>
            Manage and review project submissions from teams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by team name, project name, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Submissions Table */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Loading submissions...</div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No project submissions found
              </div>
            ) : (
              submissions.map((submission) => (
                <Card key={submission._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold">{submission.teamName}</h3>
                          {getStatusBadge(submission.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formatDate(submission.submittedAt)}
                          </span>
                          {submission.githubRepo && (
                            <a
                              href={submission.githubRepo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                            >
                              <ExternalLink className="h-4 w-4" />
                              GitHub Repository
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setShowDetailsModal(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Submission Details</DialogTitle>
            <DialogDescription>
              Complete details of the project submission
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission ? (
            <div className="space-y-6">
              {/* Project Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Project Name</h4>
                  <h3 className="text-xl font-bold text-gray-900">{selectedSubmission.projectName || 'No project name'}</h3>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Project Description</h4>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">{selectedSubmission.description || 'No description available'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong>Team:</strong> {selectedSubmission.teamName || 'Unknown team'}
                  </div>
                  <div>
                    <strong>Status:</strong> {getStatusBadge(selectedSubmission.status)}
                  </div>
                  <div>
                    <strong>Submitted By:</strong> {
                      selectedSubmission.submittedBy?.firstName && selectedSubmission.submittedBy?.lastName 
                        ? `${selectedSubmission.submittedBy.firstName} ${selectedSubmission.submittedBy.lastName}`
                        : selectedSubmission.submittedBy?.email || 'Unknown user'
                    }
                  </div>
                  <div>
                    <strong>Submitted At:</strong> {selectedSubmission.submittedAt ? formatDate(selectedSubmission.submittedAt) : 'Unknown date'}
                  </div>
                  {selectedSubmission.githubRepo && (
                    <div className="md:col-span-2">
                      <strong>GitHub Repository:</strong> 
                      <a
                        href={selectedSubmission.githubRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View Repository
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Team Details */}
              <div>
                <h4 className="text-md font-semibold mb-3">Team Members</h4>
                <div className="space-y-2">
                  {selectedSubmission.teamDetails?.leader?.userId && (
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                      <span className="font-medium">
                        {selectedSubmission.teamDetails.leader.userId.firstName} {selectedSubmission.teamDetails.leader.userId.lastName}
                      </span>
                      <Badge variant="outline" className="text-xs">Leader</Badge>
                      <span className="text-sm text-muted-foreground">
                        {selectedSubmission.teamDetails.leader.email || selectedSubmission.teamDetails.leader.userId.email}
                      </span>
                    </div>
                  )}
                  {selectedSubmission.teamDetails?.members?.filter(member => member?.userId).map((member, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className="font-medium">
                        {member.userId.firstName} {member.userId.lastName}
                      </span>
                      <Badge variant="outline" className="text-xs">Member</Badge>
                      <span className="text-sm text-muted-foreground">
                        {member.email || member.userId.email}
                      </span>
                    </div>
                  ))}
                  {(!selectedSubmission.teamDetails?.members || selectedSubmission.teamDetails.members.length === 0) && (
                    <div className="text-sm text-muted-foreground">No additional team members</div>
                  )}
                </div>
              </div>

              {/* GitHub Repository */}
              <div>
                <h4 className="text-md font-semibold mb-3">GitHub Repository</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      <span className="font-medium">Repository Link</span>
                    </div>
                    <a
                      href={selectedSubmission.githubRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Repository
                    </a>
                  </div>
                  
                  {/* Validation Status */}
                  {selectedSubmission.githubValidation && (
                    <div className="p-3 bg-gray-50 rounded">
                      <h5 className="font-medium mb-2">Repository Validation</h5>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {selectedSubmission.githubValidation.isPublic ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm">Public Repository</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedSubmission.githubValidation.hasSetupMd ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm">setup.md file present</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedSubmission.githubValidation.hasTeamNamePdf ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm">{selectedSubmission.teamName}.pdf file present</span>
                        </div>
                      </div>
                      {selectedSubmission.githubValidation.validatedAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          Validated on {new Date(selectedSubmission.githubValidation.validatedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Review Notes */}
              {selectedSubmission.reviewNotes && (
                <div>
                  <h4 className="text-md font-semibold mb-3">Review Notes</h4>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm">{selectedSubmission.reviewNotes}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p>No submission data available</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}