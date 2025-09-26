"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

export const CompanyValuesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-12 sm:py-20 px-4 sm:px-6 bg-background relative overflow-hidden z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left side - Illustration */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            {/* Main illustration - abstract face */}
            <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 mx-auto relative">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-devfolio-green rounded-full absolute top-6 sm:top-8 left-12 sm:left-16"
              />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="w-18 h-18 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-devfolio-yellow rounded-full absolute top-12 sm:top-16 right-6 sm:right-8"
              />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-12 h-6 sm:w-14 sm:h-7 lg:w-16 lg:h-8 bg-devfolio-orange rounded-full absolute bottom-12 sm:bottom-16 left-8 sm:left-12"
              />
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-devfolio-blue rounded-lg absolute bottom-6 sm:bottom-8 right-12 sm:right-16"
              />
            </div>
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 sm:space-y-8 order-1 lg:order-2"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              We speak, we listen, we discuss, we grow.
            </h2>
            
            <p className="text-lg sm:text-xl text-muted-foreground">
              From ideas, feedback, content and positive vibes that the lives of 50 lakhs of our community.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="glass-button liquid-glass bg-primary/90 hover:bg-primary text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Join our Discord
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating background shapes - Hidden on mobile */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-20 w-16 h-16 bg-devfolio-purple rounded-full opacity-20 hidden sm:block"
      />
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-32 left-16 w-12 h-12 bg-devfolio-pink rounded-lg rotate-45 opacity-20 hidden sm:block"
      />
    </section>
  );
};