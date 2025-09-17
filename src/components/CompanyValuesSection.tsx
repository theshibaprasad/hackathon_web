"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

export const CompanyValuesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 px-6 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Illustration */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Main illustration - abstract face */}
            <div className="w-64 h-64 mx-auto relative">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-32 h-32 bg-devfolio-green rounded-full absolute top-8 left-16"
              />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="w-24 h-24 bg-devfolio-yellow rounded-full absolute top-16 right-8"
              />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-8 bg-devfolio-orange rounded-full absolute bottom-16 left-12"
              />
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="w-20 h-20 bg-devfolio-blue rounded-lg absolute bottom-8 right-16"
              />
            </div>
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              We speak, we listen, we discuss, we grow.
            </h2>
            
            <p className="text-xl text-muted-foreground">
              From ideas, feedback, content and positive vibes that the lives of 50 lakhs of our community.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full"
              >
                Join our Discord
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating background shapes */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-20 w-16 h-16 bg-devfolio-purple rounded-full opacity-20"
      />
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-32 left-16 w-12 h-12 bg-devfolio-pink rounded-lg rotate-45 opacity-20"
      />
    </section>
  );
};