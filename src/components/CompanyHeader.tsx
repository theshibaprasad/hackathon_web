"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const CompanyHeader = () => {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/login');
  };

  const handleSignUp = () => {
    router.push('/register');
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glass-effect"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">H</span>
          </div>
          <span className="text-2xl font-bold text-primary">HackName</span>
        </motion.div>
        
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

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={handleSignIn}>
            Sign in
          </Button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={handleSignUp}>
              Signup
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};