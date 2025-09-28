"use client";

// import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  GraduationCap,
  Briefcase
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease" | "neutral";
  };
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  description?: string;
  delay?: number;
}

function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color, 
  bgColor, 
  description,
  delay = 0 
}: StatCardProps) {
  return (
    <div className="h-full">
      <Card className="hover:shadow-lg transition-shadow h-full">
        <CardContent className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between flex-1">
            <div className="flex-1 min-h-[80px] flex flex-col justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
                {description && (
                  <p className="text-xs text-gray-500">{description}</p>
                )}
              </div>
              {change && (
                <div className="flex items-center mt-2">
                  {change.type === "increase" ? (
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  ) : change.type === "decrease" ? (
                    <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                  ) : null}
                  <span className={`text-xs font-medium ${
                    change.type === "increase" ? "text-green-600" :
                    change.type === "decrease" ? "text-red-600" :
                    "text-gray-600"
                  }`}>
                    {change.value > 0 ? "+" : ""}{change.value}%
                  </span>
                </div>
              )}
            </div>
            <div className={`p-3 ${bgColor} rounded-lg flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface StatsCardsProps {
  stats: {
    totalUsers: number;
    totalTeams: number;
    totalRevenue: number;
    successfulPayments: number;
    pendingPayments: number;
    failedPayments: number;
    studentUsers: number;
    professionalUsers: number;
    verifiedUsers: number;
    recentUsers: number;
    recentRegistrations: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      change: {
        value: stats.recentUsers > 0 ? Math.round((stats.recentUsers / stats.totalUsers) * 100) : 0,
        type: "increase" as const
      },
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: `${stats.recentUsers} new this week`,
      delay: 0.1
    },
    {
      title: "Total Teams",
      value: stats.totalTeams,
      icon: Building,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "Active teams",
      delay: 0.2
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: "From successful payments",
      delay: 0.3
    },
    {
      title: "Payment Success Rate",
      value: `${Math.round((stats.successfulPayments / (stats.successfulPayments + stats.pendingPayments + stats.failedPayments)) * 100)}%`,
      change: {
        value: 5,
        type: "increase" as const
      },
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      description: `${stats.successfulPayments} successful payments`,
      delay: 0.4
    },
    {
      title: "Student Users",
      value: stats.studentUsers,
      icon: GraduationCap,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      description: `${Math.round((stats.studentUsers / stats.totalUsers) * 100)}% of total users`,
      delay: 0.5
    },
    {
      title: "Professional Users",
      value: stats.professionalUsers,
      icon: Briefcase,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      description: `${Math.round((stats.professionalUsers / stats.totalUsers) * 100)}% of total users`,
      delay: 0.6
    },
    {
      title: "Verified Users",
      value: stats.verifiedUsers,
      change: {
        value: Math.round((stats.verifiedUsers / stats.totalUsers) * 100),
        type: "neutral" as const
      },
      icon: CheckCircle,
      color: "text-teal-600",
      bgColor: "bg-teal-100",
      description: `${Math.round((stats.verifiedUsers / stats.totalUsers) * 100)}% verified (includes Google users)`,
      delay: 0.7
    },
    {
      title: "Pending Payments",
      value: stats.pendingPayments,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      description: "Awaiting completion",
      delay: 0.8
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <StatCard key={card.title} {...card} delay={card.delay} />
      ))}
    </div>
  );
}
