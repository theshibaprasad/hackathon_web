"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, Loader2, CheckCircle } from 'lucide-react';
import OTPVerificationModal from './OTPVerificationModal';
import PasswordResetModal from './PasswordResetModal';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose, onBackToLogin }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserEmail(email);
        setShowOTPModal(true);
        toast({
          title: "OTP Sent",
          description: "A 6-digit OTP has been sent to your email address.",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || 'Failed to send OTP',
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerified = () => {
    setShowOTPModal(false);
    setShowPasswordResetModal(true);
  };

  const handlePasswordReset = () => {
    setShowPasswordResetModal(false);
    onClose();
    onBackToLogin();
    // No duplicate message - the PasswordResetModal will handle its own success UI
  };

  const handleBackToEmail = () => {
    setShowOTPModal(false);
    setShowPasswordResetModal(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-full max-w-md mx-4"
        >
          <Card className="border-0 shadow-2xl bg-white">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBackToLogin}
                  className="p-2 hover:bg-gray-100 hover:scale-105 transition-all duration-200 rounded-full hover:shadow-md hover:border-gray-200"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-600 hover:text-gray-800 transition-colors duration-200" />
                </Button>
                <div className="flex-1"></div>
              </div>
              
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              
              <CardTitle className="text-2xl font-bold text-gray-900">
                Forgot Password?
              </CardTitle>
              <CardDescription className="text-gray-600">
                Enter your email address and we'll send you a 6-digit OTP to reset your password.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full h-12 font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    'Send OTP'
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Remember your password?{' '}
                  <button
                    onClick={onBackToLogin}
                    className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
                  >
                    Back to Login
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        isOpen={showOTPModal}
        email={userEmail}
        onVerified={handleOTPVerified}
        onBack={handleBackToEmail}
        onClose={onClose}
      />

      {/* Password Reset Modal */}
      <PasswordResetModal
        isOpen={showPasswordResetModal}
        email={userEmail}
        onSuccess={handlePasswordReset}
        onBack={handleBackToEmail}
        onClose={onClose}
      />
    </AnimatePresence>
  );
}
