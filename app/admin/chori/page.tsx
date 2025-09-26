'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AdminChoriPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [specialPricingEnabled, setSpecialPricingEnabled] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/chori/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        setSuccess('Authentication successful!');
        loadSettings();
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch (error) {
      setError('Failed to authenticate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSettings = async () => {
    setIsLoadingSettings(true);
    try {
      const response = await fetch('/api/admin/chori/settings');
      const data = await response.json();
      
      if (response.ok) {
        setSpecialPricingEnabled(data.specialPricingEnabled);
      } else {
        setError('Failed to load settings');
      }
    } catch (error) {
      setError('Failed to load settings');
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const handleToggleSpecialPricing = async (enabled: boolean) => {
    console.log('🎯 Frontend: Toggle clicked, new value:', enabled);
    try {
      const response = await fetch('/api/admin/chori/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ specialPricingEnabled: enabled }),
      });

      console.log('🎯 Frontend: Response status:', response.status);
      const data = await response.json();
      console.log('🎯 Frontend: Response data:', data);

      if (response.ok) {
        setSpecialPricingEnabled(enabled);
        setSuccess(`Special pricing ${enabled ? 'enabled' : 'disabled'} successfully!`);
        setError('');
        console.log('🎯 Frontend: Success! Updated state to:', enabled);
      } else {
        console.log('🎯 Frontend: Error response:', data);
        setError(data.error || 'Failed to update settings');
      }
    } catch (error) {
      console.error('🎯 Frontend: Toggle error:', error);
      setError('Failed to update settings');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Super Admin Access</CardTitle>
            <CardDescription>
              Enter super admin password to access special pricing controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">Super Admin Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter super admin password"
                  required
                  className="mt-1"
                />
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Access Controls'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Special Pricing Controls
            </CardTitle>
            <CardDescription>
              Manage the special 2 rupees pricing feature for users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                <div className="space-y-1">
                  <Label htmlFor="special-pricing" className="text-base font-medium">
                    Special 2 Rupees Pricing
                  </Label>
                  <p className="text-sm text-gray-600">
                    Enable/disable the special pricing feature that reduces payment to ₹2 after 5 clicks
                  </p>
                </div>
                
                {isLoadingSettings ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                ) : (
                  <div className="flex items-center space-x-2">
                    {specialPricingEnabled ? (
                      <ToggleRight className="w-6 h-6 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-400" />
                    )}
                    <Switch
                      id="special-pricing"
                      checked={specialPricingEnabled}
                      onCheckedChange={handleToggleSpecialPricing}
                      disabled={isLoadingSettings}
                    />
                  </div>
                )}
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Users need to click "Regular Plan" button 5 times</li>
                  <li>• After 5 clicks, the price automatically reduces to ₹2</li>
                  <li>• Special visual feedback with sparkles and "Amazing deal!" message</li>
                  <li>• Feature resets when user switches to Early Bird plan</li>
                </ul>
              </div>

              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAuthenticated(false);
                    setPassword('');
                    setError('');
                    setSuccess('');
                  }}
                >
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
