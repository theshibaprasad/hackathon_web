"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Mail, 
  Settings, 
  BarChart3, 
  Shield, 
  LogOut,
  Send,
  UserPlus,
  Bell,
  Key,
  ToggleLeft,
  ToggleRight
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalAdmins: number;
  totalTeams: number;
  totalRegistrations: number;
  activeRegistrations: number;
  emailsSent: number;
  activeHackathons: number;
  recentUsers: number;
  recentRegistrations: number;
  lastUpdated: string;
}

interface Activity {
  type: string;
  message: string;
  email: string;
  timestamp: string;
  icon: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalAdmins: 0,
    totalTeams: 0,
    totalRegistrations: 0,
    activeRegistrations: 0,
    emailsSent: 0,
    activeHackathons: 0,
    recentUsers: 0,
    recentRegistrations: 0,
    lastUpdated: ''
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [earlyBirdEnabled, setEarlyBirdEnabled] = useState(true);
  const [updatingEarlyBird, setUpdatingEarlyBird] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check admin authentication
    checkAdminAuth();
    // Load dashboard data
    loadDashboardData();
    // Load Early Bird settings
    loadEarlyBirdSettings();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadDashboardData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const checkAdminAuth = async () => {
    try {
      const response = await fetch('/api/admin/verify');
      if (!response.ok) {
        router.push('/admin/login');
      }
    } catch (error) {
      router.push('/admin/login');
    }
  };

  const loadDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      }

      // Fetch stats and activities in parallel
      const [statsResponse, activitiesResponse] = await Promise.all([
        fetch('/api/admin/dashboard/stats'),
        fetch('/api/admin/dashboard/activities')
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }

      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        setActivities(activitiesData.activities);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData(true);
  };

  const loadEarlyBirdSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings/early-bird');
      if (response.ok) {
        const data = await response.json();
        setEarlyBirdEnabled(data.earlyBirdEnabled);
      }
    } catch (error) {
      console.error('Error loading Early Bird settings:', error);
    }
  };

  const handleEarlyBirdToggle = async () => {
    setUpdatingEarlyBird(true);
    try {
      const response = await fetch('/api/admin/settings/early-bird', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          earlyBirdEnabled: !earlyBirdEnabled
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setEarlyBirdEnabled(data.earlyBirdEnabled);
        // Show success message (you can add a toast notification here)
        console.log(data.message);
      } else {
        console.error('Failed to update Early Bird settings');
      }
    } catch (error) {
      console.error('Error updating Early Bird settings:', error);
    } finally {
      setUpdatingEarlyBird(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const adminFeatures = [
    {
      title: "User Management",
      description: "Manage users, teams, and permissions",
      icon: Users,
      color: "bg-blue-500",
      href: "/admin/users"
    },
    {
      title: "Email System",
      description: "Send emails and manage templates",
      icon: Mail,
      color: "bg-green-500",
      href: "/admin/emails"
    },
    {
      title: "Hackathon Settings",
      description: "Configure hackathon parameters",
      icon: Settings,
      color: "bg-purple-500",
      href: "/admin/settings"
    },
    {
      title: "Analytics",
      description: "View reports and statistics",
      icon: BarChart3,
      color: "bg-orange-500",
      href: "/admin/analytics"
    }
  ];

  const quickActions = [
    {
      title: "Send Welcome Emails",
      description: "Send welcome emails to new users",
      icon: Send,
      action: () => console.log("Send welcome emails")
    },
    {
      title: "Team Invitations",
      description: "Send team invitation emails",
      icon: UserPlus,
      action: () => console.log("Send team invitations")
    },
    {
      title: "Hackathon Updates",
      description: "Send hackathon notifications",
      icon: Bell,
      action: () => console.log("Send hackathon updates")
    },
    {
      title: "Password Resets",
      description: "Send password reset emails",
      icon: Key,
      action: () => console.log("Send password resets")
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Refresh Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <div className="flex items-center space-x-4">
            {stats.lastUpdated && (
              <p className="text-sm text-gray-500">
                Last updated: {new Date(stats.lastUpdated).toLocaleTimeString()}
              </p>
            )}
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              {refreshing ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              ) : (
                <div className="w-4 h-4" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                    <p className="text-xs text-green-600">+{stats.recentUsers} this week</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Teams</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalTeams}</p>
                    <p className="text-xs text-gray-500">Active teams</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Registrations</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeRegistrations}</p>
                    <p className="text-xs text-blue-600">+{stats.recentRegistrations} this week</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Bell className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Emails</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.emailsSent}</p>
                    <p className="text-xs text-blue-600">Emails sent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Admins</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalAdmins}</p>
                    <p className="text-xs text-gray-500">Active administrators</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalRegistrations}</p>
                    <p className="text-xs text-gray-500">All time registrations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Settings className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Hackathons</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeHackathons}</p>
                    <p className="text-xs text-gray-500">Active events</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Early Bird Settings */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Hackathon Settings</h2>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    {earlyBirdEnabled ? (
                      <ToggleRight className="w-6 h-6 text-orange-600" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Novothon Early Bird Offer</h3>
                    <p className="text-sm text-gray-600">
                      {earlyBirdEnabled 
                        ? "Early Bird offer is currently active and visible to users" 
                        : "Early Bird offer is disabled and will show as expired"
                      }
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleEarlyBirdToggle}
                  disabled={updatingEarlyBird}
                  className={`flex items-center space-x-2 ${
                    earlyBirdEnabled
                      ? 'bg-orange-600 hover:bg-orange-700 text-white'
                      : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
                >
                  {updatingEarlyBird ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : earlyBirdEnabled ? (
                    <ToggleRight className="w-4 h-4" />
                  ) : (
                    <ToggleLeft className="w-4 h-4" />
                  )}
                  <span>
                    {updatingEarlyBird 
                      ? 'Updating...' 
                      : earlyBirdEnabled 
                        ? 'Disable Offer' 
                        : 'Enable Offer'
                    }
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={action.action}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <action.icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        {activities.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activities</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {activities.slice(0, 10).map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className="p-2 bg-gray-100 rounded-full">
                        {activity.icon === 'user-plus' && <UserPlus className="w-4 h-4 text-blue-600" />}
                        {activity.icon === 'calendar' && <Bell className="w-4 h-4 text-green-600" />}
                        {activity.icon === 'clock' && <Bell className="w-4 h-4 text-yellow-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.email}</p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(activity.timestamp).toLocaleString()}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Admin Features */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adminFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 ${feature.color} rounded-lg`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
