"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin } from "lucide-react";
import Image from "next/image";

const footerLinks = {
  quickLinks: [
    { name: "Problem Statements", href: "/problem-statements" },
    { name: "Guidelines", href: "/guidelines" },
    { name: "About", href: "/about" },
    { name: "Sponsor", href: "/sponsor" }
  ],
  social: ["Twitter", "GitHub", "LinkedIn"]
};

export const CompanyFooter = () => {
  return (
    <footer className="bg-background/95 backdrop-blur-sm py-12 sm:py-16 px-4 sm:px-6 border-t border-border/50 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-bold" style={{ color: '#4437FB' }}>
                NOVOTHON
              </h1>
            </div>
            <p className="text-muted-foreground mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
              Join the ultimate hackathon experience designed to{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-semibold">
                unleash creativity
              </span>{" "}
              and{" "}
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent font-semibold">
                accelerate careers.
              </span>
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="glass-button liquid-glass text-muted-foreground hover:text-primary h-8 w-8 sm:h-10 sm:w-10 backdrop-blur-sm">
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="glass-button liquid-glass text-muted-foreground hover:text-primary h-8 w-8 sm:h-10 sm:w-10 backdrop-blur-sm">
                  <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="glass-button liquid-glass text-muted-foreground hover:text-primary h-8 w-8 sm:h-10 sm:w-10 backdrop-blur-sm">
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-bold mb-3 sm:mb-4 text-primary text-sm sm:text-base">QUICK LINKS</h4>
            <div className="space-y-1 sm:space-y-2">
              {footerLinks.quickLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  whileHover={{ x: 5 }}
                  className="block text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-border pt-6 sm:pt-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-xs sm:text-sm text-center sm:text-left">
              © 2024 Novothon. All rights reserved. ❤️ & 💻 from India by Polygon Devs.
            </p>
            <div className="flex space-x-4 sm:space-x-6">
              <motion.a
                href="/terms"
                whileHover={{ y: -2 }}
                className="text-muted-foreground hover:text-primary text-xs sm:text-sm transition-colors"
              >
                Terms
              </motion.a>
              <motion.a
                href="/privacy"
                whileHover={{ y: -2 }}
                className="text-muted-foreground hover:text-primary text-xs sm:text-sm transition-colors"
              >
                Privacy
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};