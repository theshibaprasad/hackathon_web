"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs-simple";
import { Input } from "@/components/ui/input";
import StatsCards from "./components/StatsCards";
import DataTable from "./components/DataTable";
import TeamDetailsModal from "./components/TeamDetailsModal";
import ToggleSwitch from "./components/ToggleSwitch";
import ThemeManagement from "./components/ThemeManagement";
import ProblemStatementManagement from "./components/ProblemStatementManagement";
import AnnouncementManagement from "./components/AnnouncementManagement";
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
  ToggleRight,
  Menu,
  X,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  Building,
  GraduationCap,
  Briefcase,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Lightbulb
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

interface Team {
  _id: string;
  teamName: string;
  leader: {
    userId: string;
    name: string;
    email: string;
    phone: string;
  };
  members: Array<{
    userId: string;
    name: string;
    email: string;
    phone: string;
  }>;
  themeId: string;
  problemId: string;
  createdAt: string;
  updatedAt: string;
  paymentInfo: {
    leaderPayment: any;
    memberPayments: any[];
    totalPaid: number;
    isFullyPaid: boolean;
  };
}

interface Payment {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    userType: string;
    teamId: string;
  } | null; // Allow null for deleted users
  paymentStatus: 'pending' | 'success' | 'failed';
  isEarlyBird: boolean;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  teamInfo: any;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: 'student' | 'professional';
  otpVerified: boolean;
  isTeamLeader: boolean;
  teamId: any;
  education?: any;
  job?: any;
  createdAt: string;
  updatedAt: string;
  paymentInfo: any;
}

export default function AdminDashboardClient() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  const [teams, setTeams] = useState<Team[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [themes, setThemes] = useState<any[]>([]);
  const [problemStatements, setProblemStatements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [settings, setSettings] = useState({
    earlyBirdEnabled: true,
    hackathonRegistrationEnabled: true,
    hackathonStatus: 'live'
  });
  const [updatingSettings, setUpdatingSettings] = useState(false);
  const [updatingEarlyBird, setUpdatingEarlyBird] = useState(false);
  const [updatingRegistration, setUpdatingRegistration] = useState(false);
  const [updatingHackathonStatus, setUpdatingHackathonStatus] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAdminAuth();
    loadDashboardData();
    loadSettings();
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

      const [statsResponse, teamsResponse, paymentsResponse, usersResponse, themesResponse, problemStatementsResponse] = await Promise.all([
        fetch('/api/admin/dashboard/stats'),
        fetch('/api/admin/teams'),
        fetch('/api/admin/payments'),
        fetch('/api/admin/users'),
        fetch('/api/admin/themes'),
        fetch('/api/admin/problem-statements')
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }

      if (teamsResponse.ok) {
        const teamsData = await teamsResponse.json();
        setTeams(teamsData.teams);
      }

      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json();
        setPayments(paymentsData.payments);
      }

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users);
      }

      if (themesResponse.ok) {
        const themesData = await themesResponse.json();
        setThemes(themesData.themes);
      }

      if (problemStatementsResponse.ok) {
        const problemStatementsData = await problemStatementsResponse.json();
        setProblemStatements(problemStatementsData.problemStatements);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings/early-bird');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSettingsUpdate = async (settingType: 'earlyBird' | 'registration' | 'hackathonStatus') => {
    // Set loading state for specific setting
    if (settingType === 'earlyBird') {
      setUpdatingEarlyBird(true);
    } else if (settingType === 'registration') {
      setUpdatingRegistration(true);
    } else {
      setUpdatingHackathonStatus(true);
    }

    try {
      const newSettings = { ...settings };
      
      if (settingType === 'earlyBird') {
        newSettings.earlyBirdEnabled = !settings.earlyBirdEnabled;
      } else if (settingType === 'registration') {
        newSettings.hackathonRegistrationEnabled = !settings.hackathonRegistrationEnabled;
      } else {
        newSettings.hackathonStatus = settings.hackathonStatus === 'live' ? 'stop' : 'live';
      }

      const response = await fetch('/api/admin/settings/early-bird', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      // Reset loading state for specific setting
      if (settingType === 'earlyBird') {
        setUpdatingEarlyBird(false);
      } else if (settingType === 'registration') {
        setUpdatingRegistration(false);
      } else {
        setUpdatingHackathonStatus(false);
      }
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

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "teams", label: "Teams", icon: Users },
    { id: "payments", label: "Payments", icon: DollarSign },
    { id: "users", label: "Users", icon: UserPlus },
    { id: "themes", label: "Themes", icon: Target },
    { id: "problem-statements", label: "Problem Statements", icon: Lightbulb },
    { id: "announcements", label: "Announcements", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const filteredTeams = teams.filter(team =>
    team.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.leader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.leader.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPayments = payments.filter(payment => {
    // Check if payment.userId exists and has the required properties
    const hasValidUser = payment.userId && 
      payment.userId.firstName && 
      payment.userId.lastName && 
      payment.userId.email;
    
    const matchesSearch = hasValidUser && payment.userId ? (
      payment.userId.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.userId.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.userId.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) : false;
    
    // Also search in payment ID if user data is missing
    const matchesPaymentId = payment.razorpayOrderId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || payment.paymentStatus === filterStatus;
    
    return (matchesSearch || matchesPaymentId) && matchesStatus;
  });

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation - Fixed height, no scroll */}
        <nav className="flex-1 px-3 py-6">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors mb-2 ${
                activeTab === item.id
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button - Fixed at bottom */}
        <div className="p-6 border-t flex-shrink-0">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0 h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm border-b lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="w-8" />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto max-h-screen">
          {/* Header with Refresh Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-2xl font-bold text-gray-900 capitalize">
              {activeTab === 'overview' ? 'Dashboard Overview' : activeTab}
            </h2>
            <div className="flex items-center space-x-4">
              {stats.lastUpdated && (
                <p className="text-sm text-gray-500">
                  Last updated: {new Date(stats.lastUpdated).toLocaleTimeString()}
                </p>
              )}
              <Button
                onClick={() => loadDashboardData(true)}
                disabled={refreshing}
                variant="outline"
                size="sm"
              >
                {refreshing ? (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                ) : (
                  <Activity className="w-4 h-4" />
                )}
                Refresh
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          {(activeTab === 'teams' || activeTab === 'payments' || activeTab === 'users') && (
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {activeTab === 'payments' && (
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              )}
            </div>
          )}

          {/* Tab Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Overview */}
              <StatsCards 
                stats={{
                  totalUsers: stats.totalUsers,
                  totalTeams: stats.totalTeams,
                  totalRevenue: payments.reduce((sum, p) => sum + (p.paymentStatus === 'success' ? p.amount : 0), 0),
                  successfulPayments: payments.filter(p => p.paymentStatus === 'success').length,
                  pendingPayments: payments.filter(p => p.paymentStatus === 'pending').length,
                  failedPayments: payments.filter(p => p.paymentStatus === 'failed').length,
                  studentUsers: users.filter(u => u.userType === 'student').length,
                  professionalUsers: users.filter(u => u.userType === 'professional').length,
                  verifiedUsers: users.filter(u => u.otpVerified || (u as any).isGoogleUser).length,
                  recentUsers: stats.recentUsers,
                  recentRegistrations: stats.recentRegistrations
                }}
              />

              {/* Settings Controls */}
              <div className="space-y-4">
                <ToggleSwitch
                  enabled={settings.hackathonRegistrationEnabled}
                  onToggle={() => handleSettingsUpdate('registration')}
                  disabled={updatingRegistration}
                  loading={updatingRegistration}
                  label="Hackathon Registration"
                  description="Control whether new users can register for the hackathon"
                  enabledText="Registration Open"
                  disabledText="Registration Closed"
                  icon={
                    settings.hackathonRegistrationEnabled ? (
                      <ToggleRight className="w-6 h-6 text-blue-600" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-400" />
                    )
                  }
                  color="blue"
                />

                <ToggleSwitch
                  enabled={settings.earlyBirdEnabled}
                  onToggle={() => handleSettingsUpdate('earlyBird')}
                  disabled={updatingEarlyBird}
                  loading={updatingEarlyBird}
                  label="Early Bird Offer"
                  description="Control whether the Early Bird discount is available"
                  enabledText="Early Bird Active"
                  disabledText="Early Bird Disabled"
                  icon={
                    settings.earlyBirdEnabled ? (
                      <ToggleRight className="w-6 h-6 text-orange-600" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-400" />
                    )
                  }
                  color="orange"
                />

                <ToggleSwitch
                  enabled={settings.hackathonStatus === 'live'}
                  onToggle={() => handleSettingsUpdate('hackathonStatus')}
                  disabled={updatingHackathonStatus}
                  loading={updatingHackathonStatus}
                  label="Hackathon Status"
                  description="Control whether the hackathon is live (allows project submission) or stopped"
                  enabledText="Hackathon Live"
                  disabledText="Hackathon Stopped"
                  icon={
                    settings.hackathonStatus === 'live' ? (
                      <ToggleRight className="w-6 h-6 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-400" />
                    )
                  }
                  color="green"
                />
              </div>
            </TabsContent>

            {/* Teams Tab */}
            <TabsContent value="teams" className="space-y-6">
              <DataTable
                data={filteredTeams}
                columns={[
                  {
                    key: "teamName",
                    label: "Team Name",
                    sortable: true,
                    render: (value, team) => (
                      <div>
                        <p className="font-semibold">{value}</p>
                        <p className="text-sm text-gray-500">
                          {team.members.length + 1} members
                        </p>
                      </div>
                    )
                  },
                  {
                    key: "leader.name",
                    label: "Team Leader",
                    sortable: true,
                    render: (_, team) => (
                      <div>
                        <p className="font-medium">{team.leader.name}</p>
                        <p className="text-sm text-gray-500">{team.leader.email}</p>
                      </div>
                    )
                  },
                  {
                    key: "themeId",
                    label: "Theme",
                    render: (value) => value || "Not selected"
                  },
                  {
                    key: "problemId",
                    label: "Problem",
                    render: (value) => value || "Not selected"
                  },
                  {
                    key: "paymentInfo.totalPaid",
                    label: "Payment Status",
                    sortable: true,
                    render: (_, team) => (
                      <div className="flex items-center space-x-2">
                        <Badge variant={team.paymentInfo.isFullyPaid ? "default" : "secondary"}>
                          {team.paymentInfo.isFullyPaid ? "Paid" : "Pending"}
                        </Badge>
                        <span className="text-sm">₹{team.paymentInfo.totalPaid}</span>
                      </div>
                    )
                  },
                  {
                    key: "createdAt",
                    label: "Created",
                    sortable: true,
                    render: (value) => new Date(value).toLocaleDateString()
                  }
                ]}
                title="Teams Management"
                searchPlaceholder="Search teams..."
                onView={(team) => {
                  setSelectedTeam(team);
                  setShowTeamModal(true);
                }}
                onExport={() => {
                  // Export teams data
                  const csvContent = [
                    "Team Name,Leader,Email,Phone,Theme,Problem,Total Paid,Status,Created",
                    ...teams.map(team => [
                      team.teamName,
                      team.leader.name,
                      team.leader.email,
                      team.leader.phone,
                      team.themeId || "Not selected",
                      team.problemId || "Not selected",
                      team.paymentInfo.totalPaid,
                      team.paymentInfo.isFullyPaid ? "Paid" : "Pending",
                      new Date(team.createdAt).toLocaleDateString()
                    ].join(","))
                  ].join("\n");

                  const blob = new Blob([csvContent], { type: "text/csv" });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "teams_export.csv";
                  a.click();
                  window.URL.revokeObjectURL(url);
                }}
              />
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="space-y-6">
              <DataTable
                data={filteredPayments}
                columns={[
                  {
                    key: "userId.firstName",
                    label: "User",
                    sortable: true,
                    render: (_, payment) => (
                      <div>
                        {payment.userId ? (
                          <>
                            <p className="font-semibold">
                              {payment.userId.firstName} {payment.userId.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{payment.userId.email}</p>
                            {payment.teamInfo?.teamName && (
                              <p className="text-xs text-blue-600">Team: {payment.teamInfo.teamName}</p>
                            )}
                          </>
                        ) : (
                          <div>
                            <p className="font-semibold text-red-500">User Deleted</p>
                            <p className="text-sm text-gray-500">User data not available</p>
                            {payment.teamInfo?.teamName && (
                              <p className="text-xs text-blue-600">Team: {payment.teamInfo.teamName}</p>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  },
                  {
                    key: "amount",
                    label: "Amount",
                    sortable: true,
                    render: (value) => `₹${value}`
                  },
                  {
                    key: "paymentStatus",
                    label: "Status",
                    sortable: true,
                    render: (value, payment) => (
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          value === 'success' ? 'default' :
                          value === 'pending' ? 'secondary' :
                          'destructive'
                        }>
                          {value}
                        </Badge>
                        {payment.isEarlyBird && (
                          <Badge variant="outline">Early Bird</Badge>
                        )}
                      </div>
                    )
                  },
                  {
                    key: "razorpayOrderId",
                    label: "Order ID",
                    render: (value) => (
                      <p className="font-mono text-sm">{value}</p>
                    )
                  },
                  {
                    key: "razorpayPaymentId",
                    label: "Payment ID",
                    render: (value) => (
                      <p className="font-mono text-sm">{value || 'N/A'}</p>
                    )
                  },
                  {
                    key: "createdAt",
                    label: "Date",
                    sortable: true,
                    render: (value) => new Date(value).toLocaleDateString()
                  }
                ]}
                title="Payments Management"
                searchPlaceholder="Search payments..."
                onExport={() => {
                  const csvContent = [
                    "User,Email,Amount,Status,Early Bird,Order ID,Payment ID,Date,Team",
                    ...payments.map(payment => [
                      payment.userId ? `${payment.userId.firstName} ${payment.userId.lastName}` : "User Deleted",
                      payment.userId ? payment.userId.email : "N/A",
                      payment.amount,
                      payment.paymentStatus,
                      payment.isEarlyBird ? "Yes" : "No",
                      payment.razorpayOrderId,
                      payment.razorpayPaymentId || "N/A",
                      new Date(payment.createdAt).toLocaleDateString(),
                      payment.teamInfo?.teamName || "N/A"
                    ].join(","))
                  ].join("\n");

                  const blob = new Blob([csvContent], { type: "text/csv" });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "payments_export.csv";
                  a.click();
                  window.URL.revokeObjectURL(url);
                }}
              />
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <DataTable
                data={filteredUsers}
                columns={[
                  {
                    key: "firstName",
                    label: "User",
                    sortable: true,
                    render: (_, user) => (
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          user.userType === 'student' ? 'bg-blue-100' : 'bg-green-100'
                        }`}>
                          {user.userType === 'student' ? (
                            <GraduationCap className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Briefcase className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold">
                              {user.firstName} {user.lastName}
                            </p>
                            {user.isGoogleUser && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                Google
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          {user.teamId?.teamName && (
                            <p className="text-xs text-blue-600">
                              Team: {user.teamId.teamName}
                              {user.isTeamLeader && ' (Leader)'}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  },
                  {
                    key: "userType",
                    label: "Type",
                    sortable: true,
                    render: (value) => (
                      <Badge variant="outline">
                        {value === 'student' ? 'Student' : 'Professional'}
                      </Badge>
                    )
                  },
                  {
                    key: "otpVerified",
                    label: "Status",
                    sortable: true,
                    render: (value, user) => {
                      if (user.isGoogleUser) {
                        return (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Google User
                          </Badge>
                        );
                      }
                      return (
                        <Badge variant={value ? "default" : "secondary"}>
                          {value ? "Verified" : "Unverified"}
                        </Badge>
                      );
                    }
                  },
                  {
                    key: "phoneNumber",
                    label: "Phone",
                    render: (value) => value || "N/A"
                  },
                  {
                    key: "education.instituteName",
                    label: "Institute/Company",
                    render: (_, user) => {
                      if (user.education?.instituteName) {
                        return user.education.instituteName;
                      } else if (user.job?.company) {
                        return user.job.company;
                      }
                      return "N/A";
                    }
                  },
                  {
                    key: "paymentInfo.amount",
                    label: "Payment",
                    sortable: true,
                    render: (_, user) => (
                      <div>
                        {user.paymentInfo ? (
                          <span className="text-green-600 font-medium">
                            ₹{user.paymentInfo.amount}
                          </span>
                        ) : (
                          <span className="text-gray-500">Not paid</span>
                        )}
                      </div>
                    )
                  },
                  {
                    key: "createdAt",
                    label: "Joined",
                    sortable: true,
                    render: (value) => new Date(value).toLocaleDateString()
                  }
                ]}
                title="Users Management"
                searchPlaceholder="Search users..."
                onExport={() => {
                  const csvContent = [
                    "Name,Email,Type,Status,Phone,Institute/Company,Payment,Joined,Team",
                    ...users.map(user => [
                      `${user.firstName} ${user.lastName}`,
                      user.email,
                      user.userType,
                      (user as any).isGoogleUser ? "Google User" : (user.otpVerified ? "Verified" : "Unverified"),
                      user.phoneNumber || "N/A",
                      user.education?.instituteName || user.job?.company || "N/A",
                      user.paymentInfo ? `₹${user.paymentInfo.amount}` : "Not paid",
                      new Date(user.createdAt).toLocaleDateString(),
                      user.teamId?.teamName || "N/A"
                    ].join(","))
                  ].join("\n");

                  const blob = new Blob([csvContent], { type: "text/csv" });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "users_export.csv";
                  a.click();
                  window.URL.revokeObjectURL(url);
                }}
              />
            </TabsContent>

            {/* Themes Tab */}
            <TabsContent value="themes" className="space-y-6">
              <ThemeManagement 
                themes={themes} 
                onRefresh={() => loadDashboardData(true)} 
              />
            </TabsContent>

            {/* Problem Statements Tab */}
            <TabsContent value="problem-statements" className="space-y-6">
              <ProblemStatementManagement 
                problemStatements={problemStatements} 
                themes={themes}
                onRefresh={() => loadDashboardData(true)} 
              />
            </TabsContent>

            {/* Announcements Tab */}
            <TabsContent value="announcements" className="space-y-6">
              <AnnouncementManagement />
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hackathon Settings Card */}
                <Card className="h-full shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Settings className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">Hackathon Settings</CardTitle>
                        <CardDescription className="text-gray-600">Control registration and promotional features</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Registration Status */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${settings.hackathonRegistrationEnabled ? 'bg-blue-200' : 'bg-gray-200'}`}>
                            {settings.hackathonRegistrationEnabled ? (
                              <ToggleRight className="w-5 h-5 text-blue-600" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Registration Status</h4>
                            <p className="text-sm text-gray-600">
                              {settings.hackathonRegistrationEnabled ? "Registration is open" : "Registration is closed"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            settings.hackathonRegistrationEnabled 
                              ? 'bg-green-100 text-green-700 border border-green-200' 
                              : 'bg-red-100 text-red-700 border border-red-200'
                          }`}>
                            {settings.hackathonRegistrationEnabled ? 'Open' : 'Closed'}
                          </span>
                          <Button
                            onClick={() => handleSettingsUpdate('registration')}
                            disabled={updatingRegistration}
                            size="sm"
                            className={`font-medium transition-all duration-200 ${
                              settings.hackathonRegistrationEnabled
                                ? 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg'
                                : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                            }`}
                          >
                            {updatingRegistration ? (
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Updating...</span>
                              </div>
                            ) : settings.hackathonRegistrationEnabled ? 'Close Registration' : 'Open Registration'}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Early Bird Offer */}
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${settings.earlyBirdEnabled ? 'bg-orange-200' : 'bg-gray-200'}`}>
                            {settings.earlyBirdEnabled ? (
                              <ToggleRight className="w-5 h-5 text-orange-600" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Early Bird Offer</h4>
                            <p className="text-sm text-gray-600">
                              {settings.earlyBirdEnabled ? "Early Bird discount is active" : "Early Bird discount is disabled"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            settings.earlyBirdEnabled 
                              ? 'bg-green-100 text-green-700 border border-green-200' 
                              : 'bg-red-100 text-red-700 border border-red-200'
                          }`}>
                            {settings.earlyBirdEnabled ? 'Active' : 'Disabled'}
                          </span>
                          <Button
                            onClick={() => handleSettingsUpdate('earlyBird')}
                            disabled={updatingEarlyBird}
                            size="sm"
                            className={`font-medium transition-all duration-200 ${
                              settings.earlyBirdEnabled
                                ? 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg'
                                : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                            }`}
                          >
                            {updatingEarlyBird ? (
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Updating...</span>
                              </div>
                            ) : settings.earlyBirdEnabled ? 'Disable Offer' : 'Enable Offer'}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Hackathon Status */}
                    <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${settings.hackathonStatus === 'live' ? 'bg-green-200' : 'bg-gray-200'}`}>
                            {settings.hackathonStatus === 'live' ? (
                              <ToggleRight className="w-5 h-5 text-green-600" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Hackathon Status</h4>
                            <p className="text-sm text-gray-600">
                              {settings.hackathonStatus === 'live' ? "Hackathon is live - project submission enabled" : "Hackathon is stopped - project submission disabled"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            settings.hackathonStatus === 'live'
                              ? 'bg-green-100 text-green-700 border border-green-200' 
                              : 'bg-red-100 text-red-700 border border-red-200'
                          }`}>
                            {settings.hackathonStatus === 'live' ? 'Live' : 'Stopped'}
                          </span>
                          <Button
                            onClick={() => handleSettingsUpdate('hackathonStatus')}
                            disabled={updatingHackathonStatus}
                            size="sm"
                            className={`font-medium transition-all duration-200 ${
                              settings.hackathonStatus === 'live'
                                ? 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg'
                                : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                            }`}
                          >
                            {updatingHackathonStatus ? (
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Updating...</span>
                              </div>
                            ) : settings.hackathonStatus === 'live' ? 'Stop Hackathon' : 'Start Hackathon'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* System Information Card */}
                <Card className="h-full shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">System Overview</CardTitle>
                        <CardDescription className="text-gray-600">Current hackathon statistics and metrics</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                        <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold text-blue-700">{stats.totalUsers}</div>
                        <div className="text-sm text-blue-600 font-medium">Total Users</div>
                      </div>
                      
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                        <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Building className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-green-700">{stats.totalTeams}</div>
                        <div className="text-sm text-green-600 font-medium">Total Teams</div>
                      </div>
                      
                      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                        <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-3">
                          <DollarSign className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="text-2xl font-bold text-purple-700">
                          ₹{payments.reduce((sum, p) => sum + (p.paymentStatus === 'success' ? p.amount : 0), 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-purple-600 font-medium">Total Revenue</div>
                      </div>
                      
                      <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                        <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-3">
                          <CheckCircle className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="text-2xl font-bold text-orange-700">{payments.filter(p => p.paymentStatus === 'success').length}</div>
                        <div className="text-sm text-orange-600 font-medium">Successful Payments</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Team Details Modal */}
      <TeamDetailsModal
        team={selectedTeam}
        isOpen={showTeamModal}
        onClose={() => {
          setShowTeamModal(false);
          setSelectedTeam(null);
        }}
      />
    </div>
  );
}
