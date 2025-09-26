"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export const CompanyHeader = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignIn = () => {
    router.push('/login');
  };

  const handleSignUp = () => {
    router.push('/register');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glass-effect"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2 sm:space-x-3"
        >
          <Image
            src="/favicon/android-chrome-192x192.png"
            alt="Novothon Logo"
            width={32}
            height={32}
            className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
          />
          <h1 className="text-lg sm:text-2xl font-bold" style={{ color: '#4437FB' }}>
            NOVOTHON
          </h1>
        </motion.div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <motion.a 
            whileHover={{ y: -2 }}
            href="#" 
            className="text-foreground hover:text-primary transition-colors"
          >
            Problem Statements
          </motion.a>
          <motion.a 
            whileHover={{ y: -2 }}
            href="#" 
            className="text-foreground hover:text-primary transition-colors"
          >
            Guidelines
          </motion.a>
          <motion.a 
            whileHover={{ y: -2 }}
            href="#" 
            className="text-foreground hover:text-primary transition-colors"
          >
            About
          </motion.a>
          <motion.a 
            whileHover={{ y: -2 }}
            href="#" 
            className="text-foreground hover:text-primary transition-colors"
          >
            Sponsor
          </motion.a>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" size="sm" onClick={handleSignIn} className="border-primary text-primary hover:bg-primary/10 hover:text-primary transition-all duration-200">
              Sign in
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={handleSignUp}>
              Register
            </Button>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-background/95 backdrop-blur-sm border-t border-border"
        >
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Navigation Links */}
            <nav className="space-y-3">
              <motion.a 
                whileHover={{ x: 5 }}
                href="#" 
                className="block text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Problem Statements
              </motion.a>
              <motion.a 
                whileHover={{ x: 5 }}
                href="#" 
                className="block text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Guidelines
              </motion.a>
              <motion.a 
                whileHover={{ x: 5 }}
                href="#" 
                className="block text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </motion.a>
              <motion.a 
                whileHover={{ x: 5 }}
                href="#" 
                className="block text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sponsor
              </motion.a>
            </nav>

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col space-y-3 pt-4 border-t border-border">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline" 
                  className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary transition-all duration-200"
                  onClick={handleSignIn}
                >
                  Sign in
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handleSignUp}
                >
                  Register
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};