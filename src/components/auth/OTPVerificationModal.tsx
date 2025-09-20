"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Shield, Loader2, CheckCircle, RotateCcw } from 'lucide-react';

interface OTPVerificationModalProps {
  isOpen: boolean;
  email: string;
  onVerified: () => void;
  onBack: () => void;
  onClose: () => void;
}

export default function OTPVerificationModal({ 
  isOpen, 
  email, 
  onVerified, 
  onBack, 
  onClose 
}: OTPVerificationModalProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isVerified, setIsVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { toast } = useToast();

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && isOpen) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isOpen]);

  // Reset timer when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(300);
      setOtp(['', '', '', '', '', '']);
      setIsVerified(false);
    }
  }, [isOpen]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    
    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter all 6 digits",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: otpString }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsVerified(true);
        // No alert - just show the animated success UI
        
        setTimeout(() => {
          onVerified();
        }, 1500);
      } else {
        toast({
          title: "Invalid OTP",
          description: data.error || 'Please enter the correct OTP',
          variant: "destructive",
        });
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
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

  const handleResendOTP = async () => {
    setIsResending(true);

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
        setTimeLeft(300);
        setOtp(['', '', '', '', '', '']);
        toast({
          title: "OTP Resent",
          description: "A new 6-digit OTP has been sent to your email.",
          variant: "default",
        });
        inputRefs.current[0]?.focus();
      } else {
        toast({
          title: "Error",
          description: data.error || 'Failed to resend OTP',
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
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
              
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${
                isVerified ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                {isVerified ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <Shield className="w-8 h-8 text-blue-600" />
                )}
              </div>
              
              <CardTitle className="text-2xl font-bold text-gray-900">
                {isVerified ? 'OTP Verified!' : 'Verify OTP'}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isVerified 
                  ? 'Redirecting to password reset...' 
                  : `Enter the 6-digit OTP sent to ${email}`
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {!isVerified ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-center space-x-2">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleInputChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={handlePaste}
                          className="w-12 h-12 text-center text-lg font-semibold border-2 focus:border-blue-500"
                          disabled={isLoading}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleVerify}
                    className="w-full h-12 font-medium"
                    disabled={isLoading || otp.join('').length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify OTP'
                    )}
                  </Button>
                  
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">
                      {timeLeft > 0 ? (
                        <>OTP expires in <span className="font-semibold text-red-600">{formatTime(timeLeft)}</span></>
                      ) : (
                        <span className="text-red-600 font-semibold">OTP expired</span>
                      )}
                    </p>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResendOTP}
                      disabled={isResending || timeLeft > 0}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          Resending...
                        </>
                      ) : (
                        <>
                          <RotateCcw className="mr-2 h-3 w-3" />
                          Resend OTP
                        </>
                      )}
                    </Button>
                  </div>
                </div>
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
