"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import FirebaseGoogleAuth from '@/components/auth/FirebaseGoogleAuth';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [otpToken, setOtpToken] = useState('');
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [checkingRegistration, setCheckingRegistration] = useState(true);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { toast } = useToast();
  const router = useRouter();

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

  const passwordValidation = validatePassword(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

  // Check registration status on component mount
  useEffect(() => {
    const checkRegistrationStatus = async () => {
      try {
        const response = await fetch('/api/settings/registration-status');
        if (response.ok) {
          const data = await response.json();
          setRegistrationEnabled(data.settings.hackathonRegistrationEnabled);
        }
      } catch (error) {
        // Registration status check failed, continue with default enabled state
      } finally {
        setCheckingRegistration(false);
      }
    };

    checkRegistrationStatus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Handle different input formats
    if (digits.length <= 10) {
      // If user enters just digits (up to 10), keep as is
      setFormData({
        ...formData,
        phoneNumber: digits
      });
    } else if (digits.length === 11 && digits.startsWith('91')) {
      // If user enters 91 followed by 10 digits, format as +91
      setFormData({
        ...formData,
        phoneNumber: '+91' + digits.slice(2)
      });
    } else if (digits.length === 12 && digits.startsWith('91')) {
      // If user enters 91 followed by 10 digits with extra, format as +91
      setFormData({
        ...formData,
        phoneNumber: '+91' + digits.slice(2, 12)
      });
    } else if (digits.length > 10) {
      // If more than 10 digits, take only the last 10
      setFormData({
        ...formData,
        phoneNumber: digits.slice(-10)
      });
    } else {
      setFormData({
        ...formData,
        phoneNumber: digits
      });
    }
  };


  const handleOTPChange = (index: number, value: string) => {
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

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
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
          otp: otpString,
          otpToken: otpToken
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsRedirecting(true);
        toast({
          title: "Account Created Successfully!",
          description: "Welcome to our platform! Your account has been verified and created. Redirecting to onboarding...",
          variant: "default",
        });
        
        // Small delay to ensure cookie is set before redirect
        setTimeout(() => {
          router.push('/onboarding');
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

    // Check if registration is enabled
    if (!registrationEnabled) {
      toast({
        title: "Registration Closed",
        description: "Registration is currently closed. Please contact the organizers for more information.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

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

    if (!passwordValidation.isValid) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters with uppercase, lowercase, and numbers",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!passwordsMatch) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords are the same",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Phone number validation and formatting
    let phoneNumber = formData.phoneNumber;
    
    // If it's just 10 digits, add +91
    if (/^\d{10}$/.test(phoneNumber)) {
      phoneNumber = '+91' + phoneNumber;
    }
    // If it starts with 91 and has 10 more digits, add +
    else if (/^91\d{10}$/.test(phoneNumber)) {
      phoneNumber = '+' + phoneNumber;
    }
    // If it starts with 0 and has 10 digits, remove 0 and add +91
    else if (/^0\d{9}$/.test(phoneNumber)) {
      phoneNumber = '+91' + phoneNumber.slice(1);
    }
    
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit Indian mobile number",
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
          phoneNumber: formData.phoneNumber,
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

  // Show registration closed message if registration is disabled
  if (!checkingRegistration && !registrationEnabled) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row gap-0">
        {/* Left side - Registration Closed Message */}
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
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Registration Closed</h1>
              <p className="text-sm lg:text-base text-muted-foreground">
                Registration for the hackathon is currently closed.<br />
                <span className="text-xs text-muted-foreground">Please contact the organizers for more information.</span>
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
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🚫</span>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">Registration Unavailable</h3>
                      <p className="text-muted-foreground mb-6">
                        We're sorry, but registration for this hackathon has been closed. 
                        If you have any questions, please contact the organizers.
                      </p>
                      <Button
                        onClick={() => router.push('/')}
                        className="w-full h-12 rounded-lg font-medium transition-all duration-200 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
                      >
                        Return to Home
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
                    <div className="space-y-4">
                      <Label htmlFor="otp">Verification Code</Label>
                      <div className="flex justify-center space-x-2">
                        {otp.map((digit, index) => (
                          <Input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOTPChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className="w-12 h-12 text-center text-lg font-semibold border-2 focus:border-primary transition-colors bg-background/50"
                            disabled={isVerifyingOTP || isRedirecting}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <Button
                      onClick={handleVerifyOTP}
                      className="w-full h-12 rounded-lg font-medium transition-all duration-200 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
                      disabled={isVerifyingOTP || isRedirecting || otp.join('').length !== 6}
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
        className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end px-4 lg:pr-14 py-4 lg:py-0"
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
            className="text-center mb-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h1 className="text-xl lg:text-2xl font-bold text-foreground mb-1">Create Account</h1>
            <p className="text-sm text-muted-foreground">Join our community and start your journey</p>
          </motion.div>
          
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm rounded-2xl">
              <CardHeader className="space-y-1">
              </CardHeader>
              <CardContent className="p-4">
                <form onSubmit={handleSubmit} className="space-y-3">
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="firstName" className="text-sm">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="h-10 rounded-lg border-2 focus:border-primary hover:border-primary/70 transition-colors bg-background/50 hover:bg-background/80"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="lastName" className="text-sm">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="h-10 rounded-lg border-2 focus:border-primary hover:border-primary/70 transition-colors bg-background/50 hover:bg-background/80"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-sm">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="h-10 rounded-lg border-2 focus:border-primary transition-colors bg-background/50"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="phoneNumber" className="text-sm">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="+91 0123456789"
                      value={formData.phoneNumber}
                      onChange={handlePhoneChange}
                      required
                      className="h-10 rounded-lg border-2 focus:border-primary hover:border-primary/70 transition-colors bg-background/50 hover:bg-background/80"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter 10-digit mobile number
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="password" className="text-sm">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="h-10 rounded-lg border-2 focus:border-primary hover:border-primary/70 transition-colors bg-background/50 hover:bg-background/80 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-10 px-3 py-2 hover:bg-primary/10 hover:text-primary transition-colors"
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
                    {formData.password && (
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
                  
                  <div className="space-y-1">
                    <Label htmlFor="confirmPassword" className="text-sm">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="h-10 rounded-lg border-2 focus:border-primary hover:border-primary/70 transition-colors bg-background/50 hover:bg-background/80 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-10 px-3 py-2 hover:bg-primary/10 hover:text-primary transition-colors"
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
                    {formData.confirmPassword && (
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
                  
                  {/* Privacy Policy Agreement */}
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                      className="mt-0.5 h-4 w-4"
                    />
                    <label
                      htmlFor="terms"
                      className="text-xs text-muted-foreground leading-relaxed cursor-pointer select-none"
                    >
                      I agree to the{' '}
                      <a href="/terms" target="_blank" className="text-primary hover:text-primary/80 hover:underline transition-colors font-medium">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="/privacy" target="_blank" className="text-primary hover:text-primary/80 hover:underline transition-colors font-medium">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full h-10 rounded-lg font-medium transition-all duration-200 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
                    disabled={isLoading || !agreeToTerms || !passwordValidation.isValid || !passwordsMatch}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
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
                  
                  {/* Firebase Google Login Button */}
                  <FirebaseGoogleAuth
                    className="w-full h-12 rounded-lg font-medium transition-all duration-200 hover:bg-accent/10 hover:border-accent/50 hover:text-accent hover:shadow-md"
                  />
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

