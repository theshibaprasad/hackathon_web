"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Trophy, 
  Clock, 
  Code,
  CheckCircle,
  Star,
  Award,
  Target
} from "lucide-react";
// Define user type for hackathon details
interface HackathonUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

interface HackathonData {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  duration: string;
  maxParticipants: number;
  currentParticipants: number;
  prizes: string[];
  themes: string[];
  isActive: boolean;
  registrationDeadline: string;
  isRegistered: boolean;
}

const hackathonData: HackathonData = {
  id: "novothon-1.0",
  title: "Novothon",
  description: "Join the most innovative hackathon in Odisha! Build amazing projects, learn new technologies, and compete for exciting prizes. This is your chance to showcase your skills and network with fellow developers.",
  date: "November 15, 2025",
  time: "9:00 AM - 6:00 PM",
  location: "Bhubaneswar, Odisha",
  duration: "48 Hours",
  maxParticipants: 200,
  currentParticipants: 127,
  prizes: [
    "₹50,000 - First Place",
    "₹30,000 - Second Place", 
    "₹20,000 - Third Place",
    "₹10,000 - Best Innovation",
    "₹5,000 - Best Design"
  ],
  themes: [
    "AI & Machine Learning",
    "Web Development",
    "Mobile Apps",
    "Blockchain",
    "IoT & Hardware",
    "Sustainability"
  ],
  isActive: true,
  registrationDeadline: "November 10, 2025",
  isRegistered: false
};

export const HackathonDetails = () => {
  const [user, setUser] = useState<HackathonUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [hackathon, setHackathon] = useState<HackathonData>(hackathonData);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          // Check if user has completed onboarding (isBoarding = true)
          // This means they are registered for the hackathon
          const isRegistered = data.user.isBoarding || false;
          setHackathon(prev => ({ ...prev, isRegistered }));
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Registration is now handled during onboarding, no need for separate registration check

  // Registration is now handled during onboarding, no need for separate registration

  const registrationProgress = (hackathon.currentParticipants / hackathon.maxParticipants) * 100;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Badge variant={hackathon.isActive ? "default" : "secondary"} className="text-sm">
            {hackathon.isActive ? "Active" : "Upcoming"}
          </Badge>
          <Badge variant="outline" className="text-sm">
            {hackathon.duration}
          </Badge>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {hackathon.title}
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {hackathon.description}
        </p>
      </motion.div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-sm text-muted-foreground">{hackathon.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-sm text-muted-foreground">{hackathon.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{hackathon.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Participants</p>
                      <p className="text-sm text-muted-foreground">
                        {hackathon.currentParticipants}/{hackathon.maxParticipants}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Registration Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Registration Progress</span>
                    <span>{Math.round(registrationProgress)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${registrationProgress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Prizes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Prizes & Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {hackathon.prizes.map((prize, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="font-medium">{prize}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Themes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Hackathon Themes
                </CardTitle>
                <CardDescription>
                  Choose from these exciting themes for your project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {hackathon.themes.map((theme, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {theme}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Registration Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {hackathon.isRegistered ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Star className="h-5 w-5" />
                  )}
                  {hackathon.isRegistered ? 'Registered' : 'Registration'}
                </CardTitle>
                <CardDescription>
                  {hackathon.isRegistered 
                    ? 'You are registered for this hackathon'
                    : 'Register now to participate'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {hackathon.isRegistered ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Registration Confirmed</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You can now access team management and project submission features.
                    </p>
                    <Button variant="outline" className="w-full" disabled>
                      Already Registered
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      Complete your onboarding to register for the hackathon
                    </div>
                    <Button 
                      onClick={() => window.location.href = '/onboarding'}
                      className="w-full"
                      size="lg"
                    >
                      Complete Onboarding
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Registration is part of the onboarding process
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="font-medium">{hackathon.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Max Team Size</span>
                  <span className="font-medium">4 members</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Registration</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Format</span>
                  <span className="font-medium">In-person</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
