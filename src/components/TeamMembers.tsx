"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Define user type for team members
interface TeamMembersUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  teamId?: string;
  createdAt: string;
  updatedAt: string;
}
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { X } from "lucide-react";
import { User } from "lucide-react";
import { Mail } from "lucide-react";
import { Crown } from "lucide-react";
import { Users } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Send } from "lucide-react";
import { Edit } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Lightbulb, Target, ArrowRight } from "lucide-react";

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isTeamLead?: boolean;
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

interface TeamMembersProps {
  user: TeamMembersUser | null;
  teamData?: TeamData | null;
}

export const TeamMembers = ({ user, teamData }: TeamMembersProps) => {
  const { toast } = useToast();
  
  // Initialize members state
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  const [memberToEdit, setMemberToEdit] = useState<TeamMember | null>(null);
  const [newMember, setNewMember] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [editMember, setEditMember] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isUpdatingMember, setIsUpdatingMember] = useState(false);
  const [isRemovingMember, setIsRemovingMember] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Fetch team members from database and check registration status
  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (user?.teamId) {
        try {
          const response = await fetch(`/api/teams/${user.teamId}`, {
            method: 'GET',
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            
            const teamMembers: TeamMember[] = [
              // Add team leader first
              {
                id: data.team.leader.userId,
                firstName: data.team.leader.name.split(' ')[0],
                lastName: data.team.leader.name.split(' ').slice(1).join(' '),
                email: data.team.leader.email,
                phone: data.team.leader.phone || '',
                isTeamLead: true
              },
              // Add team members (leader should not be in members array)
              ...data.team.members.map((member: any) => ({
                id: member.userId,
                firstName: member.name.split(' ')[0],
                lastName: member.name.split(' ').slice(1).join(' '),
                email: member.email,
                phone: member.phone || '',
                isTeamLead: false
              }))
            ];
            setMembers(teamMembers);
          } else {
            const errorData = await response.json();
            toast({
              title: "Error",
              description: errorData.error || 'Failed to fetch team members',
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: 'Failed to fetch team members. Please try again.',
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    const checkRegistrationStatus = async () => {
      try {
        const response = await fetch('/api/settings/registration-status');
        if (response.ok) {
          const data = await response.json();
          setRegistrationEnabled(data.settings.hackathonRegistrationEnabled);
        }
      } catch (error) {
        console.error('Error checking registration status:', error);
      }
    };

    fetchTeamMembers();
    checkRegistrationStatus();
  }, [user?.teamId]);

  // Prevent body scroll when modal is open and handle ESC key
  useEffect(() => {
    if (showAddForm) {
      document.body.style.overflow = 'hidden';
      
      const handleEscKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setShowAddForm(false);
          setNewMember({ firstName: '', lastName: '', email: '', phone: '' });
        }
      };
      
      document.addEventListener('keydown', handleEscKey);
      
      return () => {
        document.removeEventListener('keydown', handleEscKey);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddForm]);

  const handleAddMember = async () => {
    // Check if registration is enabled
    if (!registrationEnabled) {
      toast({
        title: "Registration Closed",
        description: "Registration is currently closed. You cannot add new team members.",
        variant: "destructive",
      });
      return;
    }

    // Validate team limit
    if (members.length >= 5) {
      toast({
        title: "Team Limit Reached",
        description: "Maximum 5 team members allowed!",
        variant: "destructive",
      });
      return;
    }

    // Validate form fields
    if (!newMember.firstName.trim() || !newMember.lastName.trim() || !newMember.email.trim() || !newMember.phone.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields including phone number!",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newMember.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address!",
        variant: "destructive",
      });
      return;
    }

    // Validate and format phone number
    let phoneNumber = newMember.phone.trim();
    
    // If it's just 10 digits, add +91
    if (/^\d{10}$/.test(phoneNumber)) {
      phoneNumber = '+91' + phoneNumber;
    }
    // If it starts with 91 and has 10 more digits, add +
    else if (/^91\d{10}$/.test(phoneNumber)) {
      phoneNumber = '+' + phoneNumber;
    }
    // If it starts with 0 and has 10 digits, remove 0 and add +91
    else if (/^0\d{9}$/.test(phoneNumber)) {
      phoneNumber = '+91' + phoneNumber.slice(1);
    }
    
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Indian phone number!",
        variant: "destructive",
      });
      return;
    }

    // Check if email already exists
    if (members.some(member => member.email.toLowerCase() === newMember.email.toLowerCase())) {
      toast({
        title: "Email Already Exists",
        description: "This email is already in your team!",
        variant: "destructive",
      });
      return;
    }

    const member: TeamMember = {
      id: Date.now().toString(),
      firstName: newMember.firstName.trim(),
      lastName: newMember.lastName.trim(),
      email: newMember.email.trim().toLowerCase(),
      isTeamLead: false
    };

    // Add member to team via API
    setIsSendingEmail(true);
    
    try {
      // First, add member to team
      const teamResponse = await fetch('/api/teams/add-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          teamId: user?.teamId, // Get teamId from user data
          email: newMember.email.trim(),
          firstName: newMember.firstName.trim(),
          lastName: newMember.lastName.trim(),
          phone: phoneNumber
        }),
      });

      const teamData = await teamResponse.json();

      if (teamResponse.ok) {
        // Refresh team members from database
        const refreshResponse = await fetch(`/api/teams/${user?.teamId}`, {
          method: 'GET',
          credentials: 'include',
        });
        
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const teamMembers: TeamMember[] = [
            // Add team leader first
            {
              id: refreshData.team.leader.userId,
              firstName: refreshData.team.leader.name.split(' ')[0],
              lastName: refreshData.team.leader.name.split(' ').slice(1).join(' '),
              email: refreshData.team.leader.email,
              phone: refreshData.team.leader.phone || '',
              isTeamLead: true
            },
            // Add team members (leader should not be in members array)
            ...refreshData.team.members.map((member: any) => ({
              id: member.userId,
              firstName: member.name.split(' ')[0],
              lastName: member.name.split(' ').slice(1).join(' '),
              email: member.email,
              phone: member.phone || '',
              isTeamLead: false
            }))
          ];
          setMembers(teamMembers);
        }
        
        // Send enhanced invitation email
        const emailResponse = await fetch('/api/emails/enhanced-team-invitation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inviteeEmail: newMember.email.trim(),
            inviteeName: `${newMember.firstName.trim()} ${newMember.lastName.trim()}`,
            teamName: teamData.team.teamName || 'Your Team',
            leaderName: teamData.team.leader?.name || 'Team Leader',
            hackathonName: 'Novothon 2024',
            theme: teamData.team.themeId || 'General',
            problemStatement: teamData.team.problemId ? 'Problem statement will be shared by the team leader' : undefined
          }),
        });

        if (emailResponse.ok) {
          toast({
            title: "Member Added",
            description: `${newMember.firstName} ${newMember.lastName} has been added to your team and invitation email sent!`,
            variant: "success",
          });
        } else {
          toast({
            title: "Member Added",
            description: `${newMember.firstName} ${newMember.lastName} has been added to your team, but invitation email failed to send.`,
            variant: "success",
          });
        }
      } else {
        // Handle API errors
        const errorMessage = teamData.error || 'Failed to add member.';
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add member to team.",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }

    // Reset form and close modal
    setNewMember({ firstName: '', lastName: '', email: '', phone: '' });
    setShowAddForm(false);
  };

  const handleRemoveMember = (id: string) => {
    const member = members.find(m => m.id === id);
    if (member?.isTeamLead) {
      toast({
        title: "Cannot Remove Team Lead",
        description: "Cannot remove team lead!",
        variant: "destructive",
      });
      return;
    }
    setMemberToRemove(id);
    setShowRemoveConfirm(true);
  };

  const confirmRemoveMember = async () => {
    if (!memberToRemove || !user?.teamId) return;

    setIsRemovingMember(true);
    
    try {
      const response = await fetch('/api/teams/remove-member', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          teamId: user.teamId,
          memberId: memberToRemove
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh team members from database
        const refreshResponse = await fetch(`/api/teams/${user.teamId}`, {
          method: 'GET',
          credentials: 'include',
        });
        
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const teamMembers: TeamMember[] = [
            // Add team leader first
            {
              id: refreshData.team.leader.userId,
              firstName: refreshData.team.leader.name.split(' ')[0],
              lastName: refreshData.team.leader.name.split(' ').slice(1).join(' '),
              email: refreshData.team.leader.email,
              phone: refreshData.team.leader.phone || '',
              isTeamLead: true
            },
            // Add team members (leader should not be in members array)
            ...refreshData.team.members.map((member: any) => ({
              id: member.userId,
              firstName: member.name.split(' ')[0],
              lastName: member.name.split(' ').slice(1).join(' '),
              email: member.email,
              phone: member.phone || '',
              isTeamLead: false
            }))
          ];
          setMembers(teamMembers);
        }

        toast({
          title: "Member Removed",
          description: `${data.removedMember.name} has been removed from your team!`,
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || 'Failed to remove member',
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove member from team.",
        variant: "destructive",
      });
    } finally {
      setIsRemovingMember(false);
      setShowRemoveConfirm(false);
      setMemberToRemove(null);
    }
  };

  const handleEditMember = (member: TeamMember) => {
    if (member.isTeamLead) {
      toast({
        title: "Cannot Edit Team Lead",
        description: "Cannot edit team lead details!",
        variant: "destructive",
      });
      return;
    }
    setMemberToEdit(member);
    setEditMember({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone || ''
    });
    setShowEditForm(true);
  };

  const handleUpdateMember = async () => {
    if (!memberToEdit || !user?.teamId) return;

    // Validate form fields
    if (!editMember.firstName.trim() || !editMember.lastName.trim() || !editMember.email.trim() || !editMember.phone.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields including phone number!",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editMember.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address!",
        variant: "destructive",
      });
      return;
    }

    // Validate and format phone number
    let phoneNumber = editMember.phone.trim();
    
    // If it's just 10 digits, add +91
    if (/^\d{10}$/.test(phoneNumber)) {
      phoneNumber = '+91' + phoneNumber;
    }
    // If it starts with 91 and has 10 more digits, add +
    else if (/^91\d{10}$/.test(phoneNumber)) {
      phoneNumber = '+' + phoneNumber;
    }
    // If it starts with 0 and has 10 digits, remove 0 and add +91
    else if (/^0\d{9}$/.test(phoneNumber)) {
      phoneNumber = '+91' + phoneNumber.slice(1);
    }
    
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Indian phone number!",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingMember(true);
    
    try {
      const response = await fetch('/api/teams/update-member', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          teamId: user.teamId,
          memberId: memberToEdit.id,
          firstName: editMember.firstName.trim(),
          lastName: editMember.lastName.trim(),
          email: editMember.email.trim().toLowerCase(),
          phone: phoneNumber
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh team members from database
        const refreshResponse = await fetch(`/api/teams/${user.teamId}`, {
          method: 'GET',
          credentials: 'include',
        });
        
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const teamMembers: TeamMember[] = [
            // Add team leader first
            {
              id: refreshData.team.leader.userId,
              firstName: refreshData.team.leader.name.split(' ')[0],
              lastName: refreshData.team.leader.name.split(' ').slice(1).join(' '),
              email: refreshData.team.leader.email,
              phone: refreshData.team.leader.phone || '',
              isTeamLead: true
            },
            // Add team members (leader should not be in members array)
            ...refreshData.team.members.map((member: any) => ({
              id: member.userId,
              firstName: member.name.split(' ')[0],
              lastName: member.name.split(' ').slice(1).join(' '),
              email: member.email,
              phone: member.phone || '',
              isTeamLead: false
            }))
          ];
          setMembers(teamMembers);
        }

        // Show appropriate message based on email change and sending status
        if (data.emailChanged) {
          if (data.emailSent) {
            toast({
              title: "Member Updated & Invitation Sent",
              description: `${editMember.firstName} ${editMember.lastName}'s details have been updated and invitation email sent to the new email address!`,
              variant: "success",
            });
          } else {
            toast({
              title: "Member Updated",
              description: `${editMember.firstName} ${editMember.lastName}'s details have been updated, but invitation email failed to send.`,
              variant: "success",
            });
          }
        } else {
          toast({
            title: "Member Updated",
            description: `${editMember.firstName} ${editMember.lastName}'s details have been updated!`,
            variant: "success",
          });
        }
      } else {
        toast({
          title: "Error",
          description: data.error || 'Failed to update member',
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update member details.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingMember(false);
      setShowEditForm(false);
      setMemberToEdit(null);
      setEditMember({ firstName: '', lastName: '', email: '', phone: '' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">Loading team members...</span>
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
              👥 Team Members
            </h2>
            <p className="text-muted-foreground/80 text-sm sm:text-base lg:text-lg leading-relaxed">
              Build your dream team and manage members for the hackathon
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <Badge variant="secondary" className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 font-semibold shadow-sm bg-muted/80">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              {members.length}/5 Members
            </Badge>
            <Button
              onClick={() => {
                if (!registrationEnabled) {
                  toast({
                    title: "Registration Closed",
                    description: "Registration is currently closed. You cannot add new team members.",
                    variant: "destructive",
                  });
                  return;
                }
                setShowAddForm(true);
              }}
              disabled={members.length >= 5 || !registrationEnabled}
              className={`w-full sm:w-auto transition-all duration-300 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold shadow-lg ${
                !registrationEnabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary hover:shadow-xl hover:shadow-primary/25 hover:scale-105'
              }`}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              <span className="hidden sm:inline">{registrationEnabled ? 'Add Member' : '🔒 Registration Closed'}</span>
              <span className="sm:hidden">{registrationEnabled ? 'Add' : '🔒 Closed'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Project Details Section */}
      {(teamData?.themeDetails || teamData?.problemStatementDetails) && (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl sm:rounded-2xl border border-slate-200/60 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-800 mb-1">
                {teamData.problemStatementDetails?.title || 'Project Details'}
              </h3>
              <p className="text-sm text-slate-600">
                Theme: {teamData.themeDetails?.name || 'Not selected'}
              </p>
            </div>
            <Button 
              onClick={() => setIsDetailsModalOpen(true)}
              variant="outline"
              className="ml-4"
            >
              View Details
            </Button>
          </div>
        </div>
      )}

      {/* Team Members Section */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl sm:rounded-2xl border border-slate-200/60 p-4 sm:p-6 lg:p-8">
        {members.length === 0 ? (
          <div className="text-center py-8 sm:py-12 lg:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-sm">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-primary/60" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2 sm:mb-3">No Team Members Yet</h3>
            <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 max-w-sm sm:max-w-md mx-auto leading-relaxed px-4">
              {user?.teamId ? 'Start building your team by adding talented members to collaborate on your hackathon project!' : 'You need to create a team first.'}
            </p>
            {!user?.teamId && (
              <p className="text-xs sm:text-sm text-slate-500 bg-slate-100 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 inline-block mx-4">
                Complete your hackathon registration to create a team.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Team Stats Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-600">Active Team</span>
                </div>
                <div className="text-sm text-slate-500">
                  {members.length} of 5 members
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-slate-700">Team Members</span>
              </div>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {members.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="relative group bg-white/80 backdrop-blur-sm border-slate-200/60 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 rounded-lg sm:rounded-xl overflow-hidden">
                    {/* Member Header */}
                    <div className="p-4 sm:p-6 pb-3 sm:pb-4">
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                          <div className="relative flex-shrink-0">
                            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm">
                              <User className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
                            </div>
                            {member.isTeamLead && (
                              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
                                <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-800" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm sm:text-lg font-semibold text-slate-800 truncate">
                              {member.firstName} {member.lastName}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-500 truncate flex items-center mt-0.5 sm:mt-1">
                              <Mail className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1.5 sm:mr-2 flex-shrink-0" />
                              <span className="truncate">{member.email}</span>
                            </p>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        {!member.isTeamLead && (
                          <div className="flex space-x-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-md sm:rounded-lg"
                              onClick={() => handleEditMember(member)}
                            >
                              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md sm:rounded-lg"
                              onClick={() => handleRemoveMember(member.id)}
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Member Details */}
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm text-slate-500">Role</span>
                          <Badge 
                            variant={member.isTeamLead ? "default" : "secondary"}
                            className={`text-xs font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full ${
                              member.isTeamLead 
                                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 border-0' 
                                : 'bg-slate-100 text-slate-600 border-0'
                            }`}
                          >
                            {member.isTeamLead ? "Team Lead" : "Member"}
                          </Badge>
                        </div>
                        
                        {member.phone && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm text-slate-500">Phone</span>
                            <span className="text-xs sm:text-sm font-medium text-slate-700 truncate ml-2">{member.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-50/50 border-t border-slate-100/60">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Team Member</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full"></div>
                          <span>Active</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddForm && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-card border border-border rounded-xl shadow-2xl p-8 w-full max-w-lg relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                onClick={() => setShowAddForm(false)}
              >
                <X className="w-5 h-5" />
              </Button>

              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Add Team Member</h3>
                <p className="text-muted-foreground">
                  Invite a new member to join your hackathon team
                </p>
              </div>

              {/* Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!isSendingEmail && newMember.firstName.trim() && newMember.lastName.trim() && newMember.email.trim() && newMember.phone.trim()) {
                    handleAddMember();
                  }
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={newMember.firstName}
                      onChange={(e) => setNewMember({...newMember, firstName: e.target.value})}
                      placeholder="John"
                      className="h-11"
                      disabled={isSendingEmail}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={newMember.lastName}
                      onChange={(e) => setNewMember({...newMember, lastName: e.target.value})}
                      placeholder="Doe"
                      className="h-11"
                      disabled={isSendingEmail}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                    placeholder="john.doe@example.com"
                    className="h-11"
                    disabled={isSendingEmail}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={newMember.phone}
                    onChange={(e) => {
                      let value = e.target.value;
                      // Remove all non-digit characters
                      const digits = value.replace(/\D/g, '');
                      
                      // Handle different input formats (same as register page)
                      if (digits.length <= 10) {
                        // If user enters just digits (up to 10), keep as is
                        setNewMember({...newMember, phone: digits});
                      } else if (digits.length === 11 && digits.startsWith('91')) {
                        // If user enters 91 followed by 10 digits, format as +91
                        setNewMember({...newMember, phone: '+91' + digits.slice(2)});
                      } else if (digits.length === 12 && digits.startsWith('91')) {
                        // If user enters 91 followed by 10 digits with extra, format as +91
                        setNewMember({...newMember, phone: '+91' + digits.slice(2, 12)});
                      } else if (digits.length > 10) {
                        // If more than 10 digits, take only the last 10
                        setNewMember({...newMember, phone: digits.slice(-10)});
                      } else {
                        setNewMember({...newMember, phone: digits});
                      }
                    }}
                    placeholder="+91 0123456789"
                    className="h-11"
                    disabled={isSendingEmail}
                    required
                  />
                </div>

                {/* Team limit info */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>Team capacity: {members.length}/5 members</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex space-x-3 pt-2">
                  <Button
                    type="submit"
                    className="flex-1 h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                    disabled={!newMember.firstName.trim() || !newMember.lastName.trim() || !newMember.email.trim() || !newMember.phone.trim() || isSendingEmail}
                  >
                    {isSendingEmail ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Member
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewMember({ firstName: '', lastName: '', email: '', phone: '' });
                    }}
                    className="flex-1 h-11 font-medium"
                    disabled={isSendingEmail}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}

      {/* Empty State */}
      {members.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Team Members</h3>
            <p className="text-muted-foreground mb-4">
              Start building your team by adding members
            </p>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Member
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Remove Confirmation Modal */}
      {showRemoveConfirm && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setShowRemoveConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-card border border-border rounded-xl shadow-2xl p-8 w-full max-w-md relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Remove Team Member</h3>
                <p className="text-muted-foreground mb-6">
                  Are you sure you want to remove this member from your team? This action cannot be undone.
                </p>
                
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowRemoveConfirm(false)}
                    className="flex-1 h-11 font-medium"
                    disabled={isRemovingMember}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={confirmRemoveMember}
                    className="flex-1 h-11 font-medium"
                    disabled={isRemovingMember}
                  >
                    {isRemovingMember ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Removing...
                      </>
                    ) : (
                      'Remove Member'
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}

      {/* Edit Member Modal */}
      {showEditForm && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-card border border-border rounded-xl shadow-2xl p-8 w-full max-w-lg relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                onClick={() => setShowEditForm(false)}
              >
                <X className="w-5 h-5" />
              </Button>

              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Edit className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Edit Team Member</h3>
                <p className="text-muted-foreground">
                  Update member details for {memberToEdit?.firstName} {memberToEdit?.lastName}
                </p>
              </div>

              {/* Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!isUpdatingMember && editMember.firstName.trim() && editMember.lastName.trim() && editMember.email.trim() && editMember.phone.trim()) {
                    handleUpdateMember();
                  }
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editFirstName" className="text-sm font-medium">
                      First Name
                    </Label>
                    <Input
                      id="editFirstName"
                      value={editMember.firstName}
                      onChange={(e) => setEditMember({...editMember, firstName: e.target.value})}
                      placeholder="John"
                      className="h-11"
                      disabled={isUpdatingMember}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editLastName" className="text-sm font-medium">
                      Last Name
                    </Label>
                    <Input
                      id="editLastName"
                      value={editMember.lastName}
                      onChange={(e) => setEditMember({...editMember, lastName: e.target.value})}
                      placeholder="Doe"
                      className="h-11"
                      disabled={isUpdatingMember}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editEmail" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={editMember.email}
                    onChange={(e) => setEditMember({...editMember, email: e.target.value})}
                    placeholder="john.doe@example.com"
                    className="h-11"
                    disabled={isUpdatingMember}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editPhone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="editPhone"
                    type="tel"
                    value={editMember.phone}
                    onChange={(e) => {
                      let value = e.target.value;
                      // Remove all non-digit characters
                      const digits = value.replace(/\D/g, '');
                      
                      // Handle different input formats (same as register page)
                      if (digits.length <= 10) {
                        // If user enters just digits (up to 10), keep as is
                        setEditMember({...editMember, phone: digits});
                      } else if (digits.length === 11 && digits.startsWith('91')) {
                        // If user enters 91 followed by 10 digits, format as +91
                        setEditMember({...editMember, phone: '+91' + digits.slice(2)});
                      } else if (digits.length === 12 && digits.startsWith('91')) {
                        // If user enters 91 followed by 10 digits with extra, format as +91
                        setEditMember({...editMember, phone: '+91' + digits.slice(2, 12)});
                      } else if (digits.length > 10) {
                        // If more than 10 digits, take only the last 10
                        setEditMember({...editMember, phone: digits.slice(-10)});
                      } else {
                        setEditMember({...editMember, phone: digits});
                      }
                    }}
                    placeholder="+91 0123456789"
                    className="h-11"
                    disabled={isUpdatingMember}
                    required
                  />
                </div>

                {/* Action buttons */}
                <div className="flex space-x-3 pt-2">
                  <Button
                    type="submit"
                    className="flex-1 h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                    disabled={!editMember.firstName.trim() || !editMember.lastName.trim() || !editMember.email.trim() || !editMember.phone.trim() || isUpdatingMember}
                  >
                    {isUpdatingMember ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Update Member
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowEditForm(false);
                      setMemberToEdit(null);
                      setEditMember({ firstName: '', lastName: '', email: '', phone: '' });
                    }}
                    className="flex-1 h-11 font-medium"
                    disabled={isUpdatingMember}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}

      {/* Project Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0 pb-4 border-b">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                  </div>
                  <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                    {teamData?.themeDetails?.name || 'Theme'}
                  </Badge>
                </div>
                <DialogTitle className="text-2xl font-bold text-gray-900 leading-tight">
                  {teamData?.problemStatementDetails?.title || 'Project Details'}
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-2">
                  Detailed information about your team's selected theme and problem statement
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto py-6">
            <div className="space-y-6">
              {/* Theme Details */}
              {teamData?.themeDetails && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-600" />
                    Selected Theme
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Theme Name</label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{teamData.themeDetails.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Description</label>
                      <p className="mt-1 text-gray-700">{teamData.themeDetails.description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Problem Statement Details */}
              {teamData?.problemStatementDetails && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-green-600" />
                    Problem Statement
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Title</label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{teamData.problemStatementDetails.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Description</label>
                      <div 
                        className="mt-1 prose prose-green max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:text-gray-700"
                        dangerouslySetInnerHTML={{ __html: teamData.problemStatementDetails.description }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
