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

  const getPaymentStatus = (payment: any) => {
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
                    <span className="font-medium">Overall Status</span>
                    {getStatusBadge(team.paymentInfo.isFullyPaid ? "success" : "pending")}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-4 h-4 text-red-600" />
                        <span className="font-medium">Team Leader</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{getPaymentStatus(team.paymentInfo.leaderPayment)}</span>
                        {team.paymentInfo.leaderPayment && getStatusBadge(team.paymentInfo.leaderPayment.paymentStatus)}
                      </div>
                    </div>
                    {team.members.map((member, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{member.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{getPaymentStatus(team.paymentInfo.memberPayments[index])}</span>
                          {team.paymentInfo.memberPayments[index] && getStatusBadge(team.paymentInfo.memberPayments[index].paymentStatus)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Team Leader Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-red-600" />
                    Team Leader
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{team.leader.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{team.leader.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{team.leader.phone}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          {team.paymentInfo.leaderPayment ? 
                            `Paid ₹${team.paymentInfo.leaderPayment.amount}` : 
                            'Not paid'
                          }
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          {team.paymentInfo.leaderPayment ? 
                            `Paid on ${new Date(team.paymentInfo.leaderPayment.createdAt).toLocaleDateString()}` : 
                            'No payment'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Team Members */}
              {team.members.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      Team Members ({team.members.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {team.members.map((member, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4 text-gray-500" />
                                <span className="font-medium">{member.name}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">{member.email}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">{member.phone}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <DollarSign className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">
                                  {team.paymentInfo.memberPayments[index] ? 
                                    `Paid ₹${team.paymentInfo.memberPayments[index].amount}` : 
                                    'Not paid'
                                  }
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">
                                  {team.paymentInfo.memberPayments[index] ? 
                                    `Paid on ${new Date(team.paymentInfo.memberPayments[index].createdAt).toLocaleDateString()}` : 
                                    'No payment'
                                  }
                                </span>
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
                        {team.paymentInfo.memberPayments.filter(p => p).length + (team.paymentInfo.leaderPayment ? 1 : 0)}
                      </p>
                      <p className="text-sm text-gray-600">Paid Members</p>
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

