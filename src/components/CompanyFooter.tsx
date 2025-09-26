"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin } from "lucide-react";
import Image from "next/image";

const footerLinks = {
  company: ["Code of Conduct", "Privacy Policy", "Terms of Service", "FAQ", "Platform Status", "Twitter"],
  platform: ["Organize a hackathon", "Student Resources", "Sponsor", "API", "College", "FAQ"],
  support: ["Contact Us", "Bug Report", "Discord", "Instagram", "YouTube", "LinkedIn"]
};

export const CompanyFooter = () => {
  return (
    <footer className="bg-background py-12 sm:py-16 px-4 sm:px-6 border-t">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="col-span-1 sm:col-span-2 md:col-span-1"
          >
            <div className="flex items-center mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-bold" style={{ color: '#4437FB' }}>
                NOVOTHON
              </h1>
            </div>
            <p className="text-muted-foreground mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
              We love{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-semibold">
                software
              </span>{" "}
              and the{" "}
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent font-semibold">
                people who build them.
              </span>
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8 sm:h-10 sm:w-10">
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8 sm:h-10 sm:w-10">
                  <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8 sm:h-10 sm:w-10">
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
            <h4 className="font-bold mb-3 sm:mb-4 text-primary text-sm sm:text-base">COMPANY</h4>
            <div className="space-y-1 sm:space-y-2">
              {footerLinks.company.map((link, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ x: 5 }}
                  className="block text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm"
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-bold mb-3 sm:mb-4 text-primary text-sm sm:text-base">PLATFORM</h4>
            <div className="space-y-1 sm:space-y-2">
              {footerLinks.platform.map((link, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ x: 5 }}
                  className="block text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm"
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="font-bold mb-3 sm:mb-4 text-primary text-sm sm:text-base">SUPPORT</h4>
            <div className="space-y-1 sm:space-y-2">
              {footerLinks.support.map((link, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ x: 5 }}
                  className="block text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm"
                >
                  {link}
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
                href="#"
                whileHover={{ y: -2 }}
                className="text-muted-foreground hover:text-primary text-xs sm:text-sm transition-colors"
              >
                Terms
              </motion.a>
              <motion.a
                href="#"
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