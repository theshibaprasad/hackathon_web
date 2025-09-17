"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [otpToken, setOtpToken] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    
    try {
      // For now, we'll simulate Google login
      // In a real app, you'd integrate with Google OAuth
      toast({
        title: "Google Login",
        description: "Google login integration coming soon!",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Google Login Failed",
        description: "Google login failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleOTPChange = (value: string) => {
    // Only allow 6 digits
    if (value.length <= 6 && /^\d*$/.test(value)) {
      setOtp(value);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit verification code",
        variant: "destructive",
      });
      return;
    }

    setIsVerifyingOTP(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: otp,
          otpToken: otpToken
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsRedirecting(true);
        toast({
          title: "Account Created Successfully!",
          description: "Welcome to our platform! Your account has been verified and created. Redirecting to dashboard...",
          variant: "default",
        });
        
        // Small delay to ensure cookie is set before redirect
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        toast({
          title: "Verification Failed",
          description: data.error || 'Invalid verification code',
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otpToken: otpToken
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpToken(data.otpToken); // Update OTP token
        toast({
          title: "OTP Resent",
          description: "A new verification code has been sent to your email",
          variant: "default",
        });
      } else {
        toast({
          title: "Resend Failed",
          description: data.error || 'Failed to resend OTP',
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the Terms of Service and Privacy Policy",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpToken(data.otpToken); // Store OTP token
        toast({
          title: "OTP Sent",
          description: "Please check your email for verification code",
          variant: "default",
        });
        setShowOTPVerification(true);
      } else {
        toast({
          title: "Registration Failed",
          description: data.error || 'Registration failed',
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showOTPVerification) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row gap-0">
        {/* Left side - OTP Verification */}
        <motion.div 
          className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end px-4 lg:pr-4 py-8 lg:py-0"
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.div 
            className="w-full max-w-md"
            initial={{ x: -100, opacity: 0, scale: 0.7 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.div 
              className="text-center mb-6 lg:mb-8"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Verify Your Email</h1>
              <p className="text-sm lg:text-base text-muted-foreground">
                We've sent a 6-digit verification code to<br />
                <span className="font-medium text-primary">{formData.email}</span><br />
                <span className="text-xs text-muted-foreground">Code expires in 5 minutes</span>
              </p>
            </motion.div>
            
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm rounded-2xl">
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="otp">Verification Code</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={otp}
                        onChange={(e) => handleOTPChange(e.target.value)}
                        maxLength={6}
                        className="h-12 rounded-lg border-2 focus:border-primary transition-colors bg-background/50 text-center text-2xl tracking-widest"
                      />
                    </div>
                    
                    <Button
                      onClick={handleVerifyOTP}
                      className="w-full h-12 rounded-lg font-medium transition-all duration-200 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
                      disabled={isVerifyingOTP || isRedirecting || otp.length !== 6}
                    >
                      {isRedirecting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Redirecting to Dashboard...
                        </>
                      ) : isVerifyingOTP ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Verify & Create Account'
                      )}
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Didn't receive the code?
                      </p>
                      <Button
                        variant="outline"
                        onClick={handleResendOTP}
                        disabled={isLoading}
                        className="text-sm"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Resending...
                          </>
                        ) : (
                          'Resend Code'
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right side - SVG Image (Desktop Only) */}
        <motion.div 
          className="hidden lg:flex lg:w-1/2 bg-white items-center justify-start pl-4"
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.div 
            className="max-w-lg w-full"
            initial={{ x: 100, opacity: 0, scale: 0.7 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Image
              src="/Register_pic.svg"
              alt="Register Illustration"
              width={600}
              height={400}
              className="w-full h-auto"
              priority
            />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row gap-0">
      {/* Left side - Register Form */}
      <motion.div 
        className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end px-4 lg:pr-14 py-8 lg:py-0"
        initial={{ x: 0, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.div 
          className="w-full max-w-md"
          initial={{ x: -100, opacity: 0, scale: 0.7 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.div 
            className="text-center mb-6 lg:mb-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Create Account</h1>
            <p className="text-sm lg:text-base text-muted-foreground">Join our community and start your journey</p>
          </motion.div>
          
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm rounded-2xl">
              <CardHeader className="space-y-1">
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="h-12 rounded-lg border-2 focus:border-primary hover:border-primary/70 transition-colors bg-background/50 hover:bg-background/80"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="h-12 rounded-lg border-2 focus:border-primary hover:border-primary/70 transition-colors bg-background/50 hover:bg-background/80"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="h-12 rounded-lg border-2 focus:border-primary transition-colors bg-background/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="h-12 rounded-lg border-2 focus:border-primary hover:border-primary/70 transition-colors bg-background/50 hover:bg-background/80 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-primary/10 hover:text-primary transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="h-12 rounded-lg border-2 focus:border-primary hover:border-primary/70 transition-colors bg-background/50 hover:bg-background/80 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-primary/10 hover:text-primary transition-colors"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Privacy Policy Agreement */}
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                      className="mt-0.5 h-4 w-4"
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-muted-foreground leading-relaxed cursor-pointer select-none"
                    >
                      I agree to the{' '}
                      <a href="#" className="text-primary hover:text-primary/80 hover:underline transition-colors font-medium">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-primary hover:text-primary/80 hover:underline transition-colors font-medium">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full h-12 rounded-lg font-medium transition-all duration-200 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
                    disabled={isLoading || !agreeToTerms}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Submit'
                    )}
                  </Button>
                  
                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>
                  
                  {/* Google Login Button */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 rounded-lg font-medium transition-all duration-200 hover:bg-accent/10 hover:border-accent/50 hover:text-accent hover:shadow-md"
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading || isLoading}
                  >
                    {isGoogleLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing up with Google...
                      </>
                    ) : (
                      <>
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Continue with Google
                      </>
                    )}
                  </Button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <a
                      href="/login"
                      className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
                    >
                      Sign in
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right side - SVG Image (Desktop Only) */}
      <motion.div 
        className="hidden lg:flex lg:w-1/2 bg-white items-center justify-start pl-4"
        initial={{ x: 0, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.div 
          className="max-w-lg w-full"
          initial={{ x: 100, opacity: 0, scale: 0.7 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Image
            src="/Register_pic.svg"
            alt="Register Illustration"
            width={600}
            height={400}
            className="w-full h-auto"
            priority
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

