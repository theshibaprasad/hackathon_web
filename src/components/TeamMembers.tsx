"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
// Define user type for team members
interface TeamMembersUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  X, 
  User, 
  Mail, 
  Crown,
  Users,
  Trash2,
  Send
} from "lucide-react";

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isTeamLead?: boolean;
}

interface TeamMembersProps {
  user: TeamMembersUser | null;
}

export const TeamMembers = ({ user }: TeamMembersProps) => {
  const { toast } = useToast();
  
  // Initialize members with user data immediately
  const [members, setMembers] = useState<TeamMember[]>(() => {
    if (user) {
      return [{
        id: user._id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        isTeamLead: true
      }];
    }
    return [];
  });
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Update members when user changes
  useEffect(() => {
    if (user) {
      setMembers([{
        id: user._id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        isTeamLead: true
      }]);
    }
  }, [user]);

  // Prevent body scroll when modal is open and handle ESC key
  useEffect(() => {
    if (showAddForm) {
      document.body.style.overflow = 'hidden';
      
      const handleEscKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setShowAddForm(false);
          setNewMember({ firstName: '', lastName: '', email: '' });
          setEmailStatus(null);
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
    if (!newMember.firstName.trim() || !newMember.lastName.trim() || !newMember.email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields!",
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

    // Add member to state first
    setMembers(prevMembers => [...prevMembers, member]);
    
    // Send invitation email
    setIsSendingEmail(true);
    setEmailStatus(null);
    
    try {
      const response = await fetch('/api/emails/team-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inviteeEmail: newMember.email.trim(),
          inviteeName: `${newMember.firstName.trim()} ${newMember.lastName.trim()}`,
          teamName: 'Your Team',
          hackathonName: 'Hackathon 2024'
        }),
      });

      if (response.ok) {
        setEmailStatus({ type: 'success', message: 'Invitation email sent successfully!' });
        toast({
          title: "Member Added",
          description: `${member.firstName} ${member.lastName} has been added to your team!`,
          variant: "success",
        });
      } else {
        setEmailStatus({ type: 'error', message: 'Failed to send invitation email.' });
        toast({
          title: "Email Error",
          description: "Member added but invitation email failed to send.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Email sending error:', error);
      setEmailStatus({ type: 'error', message: 'Failed to send invitation email.' });
      toast({
        title: "Email Error",
        description: "Member added but invitation email failed to send.",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }

    // Reset form and close modal
    setNewMember({ firstName: '', lastName: '', email: '' });
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
    setMembers(members.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Team Members</h2>
          <p className="text-muted-foreground mt-2">
            Manage your team members for the hackathon
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="text-sm">
            <Users className="w-4 h-4 mr-1" />
            {members.length}/5 Members
          </Badge>
          <Button
            onClick={() => setShowAddForm(true)}
            disabled={members.length >= 5}
            className="bg-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Email Status */}
      {emailStatus && (
        <Alert className={`mb-4 ${emailStatus.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
          <AlertDescription className={emailStatus.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {emailStatus.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative group hover:shadow-lg hover:shadow-primary/10 hover:border-primary/20 transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        {member.firstName} {member.lastName}
                        {member.isTeamLead && (
                          <Crown className="w-4 h-4 ml-2 text-yellow-500" />
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Mail className="w-3 h-3 mr-1" />
                        {member.email}
                      </CardDescription>
                    </div>
                  </div>
                  {!member.isTeamLead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Badge 
                  variant={member.isTeamLead ? "default" : "secondary"}
                  className="text-xs"
                >
                  {member.isTeamLead ? "Team Lead" : "Member"}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
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
                  if (!isSendingEmail && newMember.firstName.trim() && newMember.lastName.trim() && newMember.email.trim()) {
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
                    disabled={!newMember.firstName.trim() || !newMember.lastName.trim() || !newMember.email.trim() || isSendingEmail}
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
                      setNewMember({ firstName: '', lastName: '', email: '' });
                      setEmailStatus(null);
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
    </div>
  );
};
