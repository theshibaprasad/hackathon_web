"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamMembers } from "@/components/TeamMembers";
import { ProjectSubmission } from "@/components/ProjectSubmission";
import { Header } from "@/components/Header";
import { HackathonDetails } from "@/components/HackathonDetails";
import { useToast } from "@/hooks/use-toast";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Menu, 
  X,
  User
} from "lucide-react";

interface DashboardUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  teamId?: string;
  isBoarding: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TeamData {
  _id: string;
  teamName: string;
  isTeamLeader: boolean;
  themeDetails?: {
    _id: string;
    name: string;
    description: string;
    isActive: boolean;
  } | null;
  problemStatementDetails?: {
    _id: string;
    title: string;
    description: string;
    themeId: string;
    isActive: boolean;
  } | null;
}

interface DashboardClientProps {
  user: DashboardUser;
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('hackathon');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [showRegistrationMessage, setShowRegistrationMessage] = useState(false);
  const [currentUser, setCurrentUser] = useState<DashboardUser>(user);
  const [loading, setLoading] = useState(true);
  const [hackathonStatus, setHackathonStatus] = useState<'live' | 'stop'>('live');

  // Use isBoarding status instead of hackathon registration
  const isHackathonRegistered = currentUser.isBoarding;

  // Optimize loading by making parallel requests and reducing API calls
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Make parallel requests for better performance
        const [userResponse, hackathonResponse] = await Promise.all([
          fetch('/api/auth/me', {
            method: 'GET',
            credentials: 'include',
          }),
          fetch('/api/settings/hackathon-status', {
            method: 'GET',
            credentials: 'include',
          })
        ]);

        // Update user data if successful
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setCurrentUser(userData.user);
        }

        // Update hackathon status if successful
        if (hackathonResponse.ok) {
          const hackathonData = await hackathonResponse.json();
          setHackathonStatus(hackathonData.hackathonStatus);
        }
      } catch (error) {
        // Continue with provided user data if API calls fail
        console.log('Dashboard data fetch failed, using provided user data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch team data only when user has a teamId and loading is complete
  useEffect(() => {
    const fetchTeamData = async () => {
      if (!loading && currentUser.teamId) {
        try {
          const response = await fetch(`/api/teams/${currentUser.teamId}`, {
            method: 'GET',
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            setTeamData({
              _id: data.team._id,
              teamName: data.team.teamName,
              isTeamLeader: data.team.leader.userId === currentUser._id,
              themeDetails: data.team.themeDetails,
              problemStatementDetails: data.team.problemStatementDetails
            });
          }
        } catch (error) {
          // Team data fetch failed, continue without team data
          console.log('Team data fetch failed');
        }
      }
    };

    fetchTeamData();
  }, [currentUser.teamId, currentUser._id, loading]);

  const menuItems = [
    { 
      id: 'hackathon', 
      label: 'Hackathon', 
      icon: FileText,
      disabled: false
    },
    { 
      id: 'team-members', 
      label: 'Team Members', 
      icon: Users,
      disabled: !isHackathonRegistered
    },
    { 
      id: 'project-submission', 
      label: 'Project Submission', 
      icon: LayoutDashboard,
      disabled: !isHackathonRegistered
    },
  ];

  const handleTabClick = (tabId: string) => {
    const menuItem = menuItems.find(item => item.id === tabId);
    
    if (menuItem?.disabled) {
      setShowRegistrationMessage(true);
      setTimeout(() => setShowRegistrationMessage(false), 3000);
      return;
    }

    // Check if trying to access project submission when hackathon is not live
    if (tabId === 'project-submission' && hackathonStatus === 'stop') {
      toast({
        title: "Hackathon is not live now",
        description: "When it will live you can post your project. Please check back later.",
        variant: "destructive",
      });
      return;
    }
    
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'hackathon':
        return <HackathonDetails />;
      case 'team-members':
        return <TeamMembers user={currentUser} teamData={teamData} />;
      case 'project-submission':
        return <ProjectSubmission />;
      default:
        return <HackathonDetails />;
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex">
      {/* Main Header */}
      <Header />
    
    {/* Mobile sidebar overlay */}
    {sidebarOpen && (
      <div 
        className="fixed top-20 left-0 right-0 bottom-0 bg-black/50 z-40 lg:hidden"
        onClick={() => setSidebarOpen(false)}
      />
    )}

    {/* Sidebar */}
    <div className={`fixed left-0 w-64 border-r shadow-xl lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } ${
      sidebarOpen 
        ? 'top-20 h-[calc(100vh-80px)] z-50 bg-card/95 backdrop-blur-md border-border shadow-2xl lg:z-30 lg:bg-gradient-to-b lg:from-card lg:via-card lg:to-card/95 lg:backdrop-blur-sm lg:border-border/50 lg:shadow-xl' 
        : 'top-20 h-[calc(100vh-80px)] z-30 bg-gradient-to-b from-card via-card to-card/95 backdrop-blur-sm border-border/50'
    }`}>
      <div className="flex h-full flex-col relative">
        {/* Subtle gradient overlay - more prominent on mobile when open */}
        <div className={`absolute inset-0 pointer-events-none ${
          sidebarOpen 
            ? 'bg-gradient-to-br from-muted/10 via-muted/5 to-muted/15 lg:bg-gradient-to-br lg:from-muted/8 lg:via-transparent lg:to-muted/12'
            : 'bg-gradient-to-br from-muted/8 via-transparent to-muted/12'
        }`} />
        
        {/* Dashboard Header */}
        <div className={`relative flex items-center justify-between p-6 border-b ${
          sidebarOpen 
            ? 'border-border bg-muted/10 lg:border-border/50'
            : 'border-border/50'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-muted/60 rounded-lg flex items-center justify-center shadow-sm">
              <LayoutDashboard className="h-4 w-4 text-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Team Info */}
        <div className={`relative p-6 border-b ${
          sidebarOpen 
            ? 'border-border/50 lg:border-border/30'
            : 'border-border/30'
        }`}>
          <div className={`rounded-xl p-4 border shadow-sm ${
            sidebarOpen 
              ? 'bg-gradient-to-r from-muted/70 to-muted/50 border-border/30 shadow-md lg:bg-gradient-to-r lg:from-muted/50 lg:to-muted/30 lg:border-border/20 lg:shadow-sm'
              : 'bg-gradient-to-r from-muted/50 to-muted/30 border-border/20'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-muted/60 rounded-xl flex items-center justify-center shadow-sm border border-border/20">
                  <User className="h-6 w-6 text-foreground" />
                </div>
                {teamData?.isTeamLeader && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-[10px] text-white font-bold">★</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">
                  {teamData?.teamName || 'No Team Assigned'}
                </p>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${teamData?.isTeamLeader ? 'bg-yellow-400' : 'bg-blue-400'} shadow-sm`} />
                  <p className="text-xs text-muted-foreground">
                    {teamData?.isTeamLeader ? 'Team Leader' : 'Team Member'}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Navigation */}
        <nav className="relative flex-1 p-4 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <div key={item.id} className="relative">
                <Button
                  variant="ghost"
                  className={`w-full justify-start h-12 text-left transition-all duration-200 relative group rounded-lg ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 hover:text-blue-700' 
                      : item.disabled 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-muted/60 hover:text-foreground'
                  }`}
                  onClick={() => handleTabClick(item.id)}
                  disabled={item.disabled}
                >
                  {/* Simple active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1 bottom-1 w-1 bg-blue-500 rounded-r-sm" />
                  )}
                  
                  {/* Clean icon */}
                  <div className="mr-3">
                    <Icon className={`h-5 w-5 transition-colors duration-200 ${
                      isActive 
                        ? 'text-blue-600 group-hover:text-blue-600' 
                        : item.disabled 
                          ? 'text-muted-foreground' 
                          : 'text-muted-foreground group-hover:text-foreground'
                    }`} />
                  </div>
                  
                  <span className={`font-medium transition-colors duration-200 ${
                    isActive 
                      ? 'text-blue-700' 
                      : item.disabled 
                        ? 'text-muted-foreground' 
                        : 'text-foreground'
                  }`}>
                    {item.label}
                  </span>
                  
                  {item.disabled && (
                    <div className="ml-auto">
                      <div className="w-5 h-5 bg-muted/60 rounded flex items-center justify-center">
                        <span className="text-xs">🔒</span>
                      </div>
                    </div>
                  )}
                </Button>
              </div>
            );
          })}
        </nav>

        {/* Bottom decoration */}
        <div className="relative p-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent mb-4" />
          <div className="text-center">
            <p className="text-xs text-muted-foreground/60">
              {currentUser.firstName} {currentUser.lastName}
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Main content */}
    <div className="flex-1 flex flex-col overflow-hidden" style={{ marginTop: '80px' }}>
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <div className="w-8" />
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-background via-background to-muted/10">
        {/* Registration Message */}
        {showRegistrationMessage && (
          <div className="mb-8 p-6 bg-gradient-to-r from-amber-50 via-amber-50/80 to-orange-50/60 border-2 border-amber-200/60 rounded-2xl shadow-lg shadow-amber-100/50 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200/50">
                <span className="text-xl">⚠️</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-amber-900 mb-2">Onboarding Required</h3>
                <p className="text-amber-800 leading-relaxed mb-4">
                  Complete your onboarding process to unlock team management and project submission features. This will enable you to build your team and participate in the hackathon.
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-amber-700 font-medium">Action required</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Content Container */}
        <div className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-card/50 via-card/30 to-background/50 rounded-3xl border border-border/40 shadow-xl shadow-black/5 backdrop-blur-sm p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  </div>
  );
}
