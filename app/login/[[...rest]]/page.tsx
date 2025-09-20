"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Login Successful",
          description: "Welcome back! Redirecting to dashboard...",
          variant: "success",
        });
        router.push('/dashboard');
      } else {
        toast({
          title: "Login Failed",
          description: data.error || 'Login failed',
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

  return (
    <div className="min-h-screen flex flex-col lg:flex-row gap-0">
      {/* Left side - SVG Image (Desktop Only) */}
      <motion.div 
        className="hidden lg:flex lg:w-1/2 bg-white items-center justify-end pr-4"
        initial={{ x: 0, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.div 
          className="max-w-lg w-full"
          initial={{ x: -100, opacity: 0, scale: 0.7 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Image
            src="/Login_pic.svg"
            alt="Login Illustration"
            width={600}
            height={400}
            className="w-full h-auto"
            priority
          />
        </motion.div>
      </motion.div>

      {/* Right side - Login Form */}
      <motion.div 
        className="w-full lg:w-1/2 flex items-center justify-center lg:justify-start px-4 lg:pl-14 py-8 lg:py-0"
        initial={{ x: 0, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.div 
          className="w-full max-w-md"
          initial={{ x: 100, opacity: 0, scale: 0.7 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.div 
            className="text-center mb-6 lg:mb-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-sm lg:text-base text-muted-foreground">Sign in to your account to continue</p>
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 rounded-lg border-2 focus:border-primary hover:border-primary/70 transition-colors bg-background/50 hover:bg-background/80"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full h-12 rounded-lg font-medium transition-all duration-200 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
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
                        Signing in with Google...
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
                    Don't have an account?{' '}
                    <a
                      href="/register"
                      className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
                    >
                      Sign up
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onBackToLogin={() => setShowForgotPassword(false)}
      />
    </div>
  );
}

