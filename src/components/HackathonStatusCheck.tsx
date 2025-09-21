"use client";

import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface HackathonStatusCheckProps {
  children: React.ReactNode;
}

interface Settings {
  earlyBirdEnabled: boolean;
  hackathonRegistrationEnabled: boolean;
}

export default function HackathonStatusCheck({ children }: HackathonStatusCheckProps) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings/early-bird');
        if (response.ok) {
          const data = await response.json();
          setSettings(data.settings);
        } else {
          setError('Failed to load hackathon status');
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        setError('Failed to load hackathon status');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-gray-600">Loading hackathon status...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!settings) {
    return null;
  }

  // If hackathon registration is disabled, show message
  if (!settings.hackathonRegistrationEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="mb-6">
            <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Registration Closed
            </h1>
            <p className="text-gray-600">
              Hackathon registration is currently closed. Please check back later or contact the organizers for more information.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Registration may reopen soon</li>
              <li>• Follow us for updates</li>
              <li>• Contact support if you have questions</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // If registration is enabled, show the children (normal content)
  return (
    <>
      {children}
      
      {/* Show Early Bird status if disabled */}
      {!settings.earlyBirdEnabled && (
        <Alert className="m-4 border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Early Bird offer has ended. Regular pricing is now in effect.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
