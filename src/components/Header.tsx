"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

// Define user type for the header
interface HeaderUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export const Header = () => {
  const [user, setUser] = useState<HeaderUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const router = useRouter();

  // Fetch user data and registration status on component mount
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
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRegistrationStatus = async () => {
      try {
        const response = await fetch('/api/settings/registration-status');
        if (response.ok) {
          const data = await response.json();
          setRegistrationEnabled(data.settings.hackathonRegistrationEnabled);
        }
      } catch (error) {
        console.error('Error fetching registration status:', error);
      }
    };

    fetchUser();
    fetchRegistrationStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      // Clear user state
      setUser(null);
      
      // Clear any local storage
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
      
      // Force reload to clear any cached state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local state and redirect
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/';
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold" style={{ color: '#4437FB' }}>
            NOVOTHON
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-foreground hover:text-primary hover:scale-105 transition-all duration-200 font-medium">
            Problem Statements
          </a>
          <a href="#" className="text-foreground hover:text-primary hover:scale-105 transition-all duration-200 font-medium">
            Guidelines
          </a>
          <a href="#" className="text-foreground hover:text-primary hover:scale-105 transition-all duration-200 font-medium">
            About
          </a>
          <a href="#" className="text-foreground hover:text-primary hover:scale-105 transition-all duration-200 font-medium">
            Sponsor
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="w-8 h-8 bg-muted animate-pulse rounded-full" />
          ) : user ? (
            // Show user info and logout button when authenticated
            <>
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user.firstName} {user.lastName}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            // Show sign in and register buttons when not authenticated
            <>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push('/login')}
                className="hover:bg-primary/10 hover:text-primary transition-all duration-200"
              >
                Sign In
              </Button>
              <Button 
                size="sm"
                onClick={() => {
                  if (registrationEnabled) {
                    router.push('/register');
                  } else {
                    alert('Registration is currently closed. Please contact the organizers for more information.');
                  }
                }}
                disabled={!registrationEnabled}
                className={`transition-all duration-200 ${
                  registrationEnabled 
                    ? 'hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                {registrationEnabled ? 'Register' : 'Registration Closed'}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};