"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export const CompanyStatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 px-6 bg-background relative overflow-hidden">
      {/* Illustration placeholder for the left image */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={isInView ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 w-64 h-80 illustration-person opacity-20"
      />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Image placeholder */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="w-full h-96 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground">
              [Image Placeholder - Hackathon Scene]
            </div>
            {/* Floating illustrations around the image */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 w-16 h-16 bg-devfolio-yellow rounded-full opacity-80"
            />
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 w-12 h-12 bg-devfolio-blue rounded-lg rotate-12 opacity-80"
            />
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              We drop{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                jaws!
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground">
              Everything you need to participate in hackathons and projects to win.
            </p>

            {/* Stats Pills */}
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0, x: 50 }}
                animate={isInView ? { scale: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="inline-flex items-center bg-devfolio-green text-white px-6 py-3 rounded-full font-semibold text-lg"
              >
                800,000+ Developers
              </motion.div>
              
              <motion.div
                initial={{ scale: 0, x: 50 }}
                animate={isInView ? { scale: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="inline-flex items-center bg-devfolio-blue text-white px-6 py-3 rounded-full font-semibold text-lg ml-4"
              >
                75,000+ Projects
              </motion.div>
              
              <motion.div
                initial={{ scale: 0, x: 50 }}
                animate={isInView ? { scale: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 1 }}
                className="inline-flex items-center bg-devfolio-purple text-white px-6 py-3 rounded-full font-semibold text-lg"
              >
                1,300+ Hackathons
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};