"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';

interface PasswordResetModalProps {
  isOpen: boolean;
  email: string;
  onSuccess: () => void;
  onBack: () => void;
  onClose: () => void;
}

export default function PasswordResetModal({ 
  isOpen, 
  email, 
  onSuccess, 
  onBack, 
  onClose 
}: PasswordResetModalProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const validatePassword = (password: string) => {
    const minLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    return {
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers,
      checks: {
        minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers
      }
    };
  };

  const passwordValidation = validatePassword(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordValidation.isValid) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters with uppercase, lowercase, and numbers",
        variant: "destructive",
      });
      return;
    }

    if (!passwordsMatch) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords are the same",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        // Show success animation for 1.5 seconds then call onSuccess
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        toast({
          title: "Error",
          description: data.error || 'Failed to reset password',
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
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 hover:scale-105 transition-all duration-200 rounded-full hover:shadow-md hover:border-gray-200"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-600 hover:text-gray-800 transition-colors duration-200" />
                </Button>
                <div className="flex-1"></div>
              </div>
              
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              
              <CardTitle className="text-2xl font-bold text-gray-900">
                Reset Password
              </CardTitle>
              <CardDescription className="text-gray-600">
                Create a new password for {email}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-12 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-gray-100"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    {/* Password Requirements */}
                    {password && (
                      <div className="space-y-1 text-xs">
                        <div className={`flex items-center ${passwordValidation.checks.minLength ? 'text-green-600' : 'text-red-600'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full mr-2 ${passwordValidation.checks.minLength ? 'bg-green-600' : 'bg-red-600'}`} />
                          At least 6 characters
                        </div>
                        <div className={`flex items-center ${passwordValidation.checks.hasUpperCase ? 'text-green-600' : 'text-red-600'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full mr-2 ${passwordValidation.checks.hasUpperCase ? 'bg-green-600' : 'bg-red-600'}`} />
                          One uppercase letter
                        </div>
                        <div className={`flex items-center ${passwordValidation.checks.hasLowerCase ? 'text-green-600' : 'text-red-600'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full mr-2 ${passwordValidation.checks.hasLowerCase ? 'bg-green-600' : 'bg-red-600'}`} />
                          One lowercase letter
                        </div>
                        <div className={`flex items-center ${passwordValidation.checks.hasNumbers ? 'text-green-600' : 'text-red-600'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full mr-2 ${passwordValidation.checks.hasNumbers ? 'bg-green-600' : 'bg-red-600'}`} />
                          One number
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="h-12 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-gray-100"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    {/* Password Match Indicator */}
                    {confirmPassword && (
                      <div className={`flex items-center text-xs ${
                        passwordsMatch ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          passwordsMatch ? 'bg-green-600' : 'bg-red-600'
                        }`} />
                        {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                      </div>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full h-12 font-medium"
                    disabled={isLoading || !passwordValidation.isValid || !passwordsMatch}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  </motion.div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
