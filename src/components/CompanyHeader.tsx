"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
          className="flex items-center space-x-3"
        >
          <Image
            src="/favicon/android-chrome-192x192.png"
            alt="Novothon Logo"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <h1 className="text-2xl font-bold" style={{ color: '#4437FB' }}>
            NOVOTHON
          </h1>
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
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" size="sm" onClick={handleSignIn} className="border-primary text-primary hover:bg-primary/10 hover:text-primary transition-all duration-200">
              Sign in
            </Button>
          </motion.div>
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