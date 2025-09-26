"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export const CompanyCommunitySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section 
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 1 }}
      className="py-12 sm:py-20 px-4 sm:px-6 bg-devfolio-yellow relative overflow-hidden z-10"
    >
      {/* Floating shapes - Hidden on mobile for better performance */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 left-10 w-16 h-16 bg-white/20 rounded-full hidden sm:block"
      />
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-20 w-12 h-12 bg-white/30 rounded-lg rotate-45 hidden sm:block"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-20 w-20 h-20 bg-white/15 rounded-full hidden sm:block"
      />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.h2 
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-black mb-6 sm:mb-8"
        >
          Timelines
        </motion.h2>
      </div>
    </motion.section>
  );
};