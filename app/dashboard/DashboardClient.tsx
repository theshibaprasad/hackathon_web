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
  createdAt: string;
  updatedAt: string;
}

interface DashboardClientProps {
  user: DashboardUser;
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState('hackathon');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isHackathonRegistered, setIsHackathonRegistered] = useState(false);
  const [showRegistrationMessage, setShowRegistrationMessage] = useState(false);

  // Check hackathon registration status from database
  useEffect(() => {
    const checkRegistrationStatus = async () => {
      try {
        const response = await fetch('/api/hackathon/status?hackathonId=novothon-1.0', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setIsHackathonRegistered(data.isRegistered);
        }
      } catch (error) {
        console.error('Error checking registration status:', error);
      }
    };

    checkRegistrationStatus();
  }, []);

  // Listen for registration updates from HackathonDetails component
  useEffect(() => {
    const handleRegistrationUpdate = async () => {
      try {
        const response = await fetch('/api/hackathon/status?hackathonId=novothon-1.0', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setIsHackathonRegistered(data.isRegistered);
        }
      } catch (error) {
        console.error('Error checking registration status:', error);
      }
    };

    window.addEventListener('hackathonRegistered', handleRegistrationUpdate);
    return () => window.removeEventListener('hackathonRegistered', handleRegistrationUpdate);
  }, []);

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
        return <TeamMembers user={user} />;
      case 'project-submission':
        return <ProjectSubmission />;
      default:
        return <HackathonDetails />;
    }
  };

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

        {/* User Info */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-muted-foreground">
                {user.email}
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
                <p className="font-medium text-amber-800">Registration Required</p>
                <p className="text-sm text-amber-700">
                  Please register for the hackathon first to access team management and project submission features.
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
