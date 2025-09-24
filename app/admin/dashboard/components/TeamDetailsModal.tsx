"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Shield, 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  GraduationCap,
  Briefcase,
  Building,
  Code,
  FileText
} from "lucide-react";

interface TeamMember {
  userId: string;
  name: string;
  email: string;
  phone: string;
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
  members: TeamMember[];
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

interface TeamDetailsModalProps {
  team: Team | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TeamDetailsModal({ team, isOpen, onClose }: TeamDetailsModalProps) {
  if (!team) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPaymentStatus = (payment: any, isMember: boolean = false) => {
    if (isMember) {
      // Team members don't pay individually - they're covered by team leader's payment
      return "Covered by team payment";
    }
    if (!payment) return "Not paid";
    return `₹${payment.amount} - ${payment.paymentStatus}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{team.teamName}</h2>
                <p className="text-gray-600">Team Details & Payment Status</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Team Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Total Members</p>
                        <p className="text-lg font-semibold">{team.members.length + 1}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Total Paid</p>
                        <p className="text-lg font-semibold">₹{team.paymentInfo.totalPaid}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">Created</p>
                        <p className="text-lg font-semibold">
                          {new Date(team.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Payment Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium">Team Payment Status</span>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(team.paymentInfo.leaderPayment ? "success" : "pending")}
                      <span className="text-sm text-gray-600">
                        {team.paymentInfo.leaderPayment ? 
                          `₹${team.paymentInfo.leaderPayment.amount} paid by team leader` : 
                          'Team leader payment pending'
                        }
                      </span>
                    </div>
                  </div>
                  
                  {/* Payment Explanation */}
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-800 font-medium">Team Payment Model</p>
                        <p className="text-xs text-blue-600 mt-1">
                          Only the team leader pays the registration fee. Team members are automatically covered by this single payment.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Team Leader Payment Details */}
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Shield className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-sm font-semibold text-gray-900">{team.leader.name}</h4>
                          <Badge className="bg-green-100 text-green-800 text-xs">Team Leader</Badge>
                        </div>
                        <div className="space-y-1 mb-3">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="w-3 h-3" />
                            <span>{team.leader.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="w-3 h-3" />
                            <span>{team.leader.phone}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">Payment Status:</span>
                          <span className="text-sm">{getPaymentStatus(team.paymentInfo.leaderPayment)}</span>
                          {team.paymentInfo.leaderPayment && getStatusBadge(team.paymentInfo.leaderPayment.paymentStatus)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>


              {/* Team Members */}
              {team.members.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="w-5 h-5 mr-2 text-blue-600" />
                        Team Members
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {team.members.length} member{team.members.length !== 1 ? 's' : ''}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {team.members.map((member, index) => (
                        <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="text-sm font-semibold text-gray-900">{member.name}</h4>
                                <Badge variant="outline" className="text-xs">Member</Badge>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <Mail className="w-3 h-3" />
                                  <span>{member.email}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <Phone className="w-3 h-3" />
                                  <span>{member.phone}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Project Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="w-5 h-5 mr-2 text-purple-600" />
                    Project Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Theme</label>
                      <p className="mt-1 p-3 bg-gray-50 rounded-lg">
                        {team.themeId || "Not selected"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Problem Statement</label>
                      <p className="mt-1 p-3 bg-gray-50 rounded-lg">
                        {team.problemId || "Not selected"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Team Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                    Team Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{team.members.length + 1}</p>
                      <p className="text-sm text-gray-600">Total Members</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {team.paymentInfo.leaderPayment ? "1" : "0"}
                      </p>
                      <p className="text-sm text-gray-600">Payment Status</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {team.paymentInfo.leaderPayment ? "Paid by Leader" : "Pending Payment"}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">₹{team.paymentInfo.totalPaid}</p>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={onClose}>
                Export Team Data
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


