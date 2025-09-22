"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamMembers } from "@/components/TeamMembers";
import { ProjectSubmission } from "@/components/ProjectSubmission";
import { Header } from "@/components/Header";
import { HackathonDetails } from "@/components/HackathonDetails";
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
}

interface DashboardClientProps {
  user: DashboardUser;
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState('hackathon');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [showRegistrationMessage, setShowRegistrationMessage] = useState(false);
  const [currentUser, setCurrentUser] = useState<DashboardUser>(user);
  const [loading, setLoading] = useState(true);

  // Use isBoarding status instead of hackathon registration
  const isHackathonRegistered = currentUser.isBoarding;

  // Fetch fresh user data on component mount
  useEffect(() => {
    const fetchFreshUserData = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching fresh user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFreshUserData();
  }, []);

  // Fetch team data if user has a teamId
  useEffect(() => {
    const fetchTeamData = async () => {
      if (currentUser.teamId) {
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
              isTeamLeader: data.team.leader.userId === currentUser._id
            });
          }
        } catch (error) {
          console.error('Error fetching team data:', error);
        }
      }
    };

    if (!loading && currentUser.teamId) {
      fetchTeamData();
    }
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
    
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'hackathon':
        return <HackathonDetails />;
      case 'team-members':
        return <TeamMembers user={currentUser} />;
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
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={() => setSidebarOpen(false)}
      />
    )}

    {/* Sidebar */}
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border lg:relative lg:translate-x-0 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}
    style={{ top: '80px', height: 'calc(100vh - 80px)' }}>
      <div className="flex h-full flex-col">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Team Info */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">
                {teamData?.teamName || 'No Team'}
              </p>
              <p className="text-sm text-muted-foreground">
                {teamData?.isTeamLeader ? 'Team Leader' : 'Team Member'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={`w-full justify-start h-12 text-left transition-all duration-200 ${
                  item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/10 hover:text-primary hover:shadow-sm'
                }`}
                onClick={() => handleTabClick(item.id)}
                disabled={item.disabled}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
                {item.disabled && (
                  <span className="ml-auto text-xs text-muted-foreground">🔒</span>
                )}
              </Button>
            );
          })}
        </nav>
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
      <main className="flex-1 overflow-y-auto p-6">
        {/* Registration Message */}
        {showRegistrationMessage && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="text-amber-600">⚠️</div>
              <div>
                <p className="font-medium text-amber-800">Onboarding Required</p>
                <p className="text-sm text-amber-700">
                  Please complete your onboarding first to access team management and project submission features.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {renderContent()}
      </main>
    </div>
  </div>
  );
}
