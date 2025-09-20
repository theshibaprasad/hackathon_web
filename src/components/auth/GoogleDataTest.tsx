'use client';

import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, Mail, Phone } from 'lucide-react';

export default function GoogleDataTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [googleData, setGoogleData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testGoogleData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Sign in with Google popup
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Get the ID token
      const idToken = await user.getIdToken();
      
      // Send the ID token to test endpoint
      const response = await fetch('/api/test-google-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (data.success) {
        setGoogleData(data.data);
      } else {
        throw new Error(data.error || 'Failed to extract data');
      }
    } catch (error: any) {
      console.error('Test error:', error);
      setError(error.message || 'Test failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Google Data Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={testGoogleData}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Google Data...
              </>
            ) : (
              'Test Google Data Extraction'
            )}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 font-medium">Error: {error}</p>
            </div>
          )}

          {googleData && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Captured Data from Google:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Email:</span>
                  </div>
                  <Badge variant="outline">{googleData.email}</Badge>
                  <p className="text-sm text-gray-600">
                    Verified: {googleData.emailVerified ? 'Yes' : 'No'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Name:</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <strong>Full:</strong> {googleData.fullName || 'Not provided'}
                    </p>
                    <p className="text-sm">
                      <strong>First:</strong> {googleData.parsedFirstName}
                    </p>
                    <p className="text-sm">
                      <strong>Last:</strong> {googleData.parsedLastName}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">Phone:</span>
                  </div>
                  <Badge variant={googleData.phoneNumber ? "default" : "secondary"}>
                    {googleData.phoneNumber || 'Not provided by Google'}
                  </Badge>
                  <p className="text-sm text-gray-600">
                    Google typically doesn't provide phone numbers
                  </p>
                </div>

              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">What gets stored in MongoDB:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>✅ <strong>Email:</strong> {googleData.email}</li>
                  <li>✅ <strong>First Name:</strong> {googleData.parsedFirstName}</li>
                  <li>✅ <strong>Last Name:</strong> {googleData.parsedLastName}</li>
                  <li>❌ <strong>Phone Number:</strong> Will be collected during onboarding</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
