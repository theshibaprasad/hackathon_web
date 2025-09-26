"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, MapPin, Clock } from "lucide-react";

export const CompanyStatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-12 sm:py-20 px-4 sm:px-6 bg-background relative overflow-hidden">
      {/* Illustration placeholder for the left image - Hidden on mobile */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={isInView ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="absolute left-0 top-1/3 transform -translate-y-1/2 w-80 h-80 illustration-person opacity-20 hidden lg:block rounded-full"
        style={{ aspectRatio: '1/1' }}
      />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left side - Image placeholder */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-2 lg:order-1"
          >
            <div className="w-full h-64 sm:h-80 lg:h-96 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground text-sm sm:text-base">
              [Image Placeholder - Hackathon Scene]
            </div>
            {/* Floating illustrations around the image - Hidden on mobile */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 w-16 h-16 bg-devfolio-yellow rounded-full opacity-80 hidden sm:block"
              style={{ aspectRatio: '1/1' }}
            />
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 w-12 h-12 bg-devfolio-blue rounded-full opacity-80 hidden sm:block"
              style={{ aspectRatio: '1/1' }}
            />
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6 sm:space-y-8 order-1 lg:order-2"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Building the{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                future
              </span>
            </h2>
            
            <p className="text-lg sm:text-xl text-muted-foreground">
              Empowering developers to create innovative solutions that solve real-world problems through collaborative hackathons and cutting-edge technology.
            </p>

            {/* Event Details */}
            <div className="space-y-4">
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={isInView ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900">Event Date</h4>
                  <p className="text-blue-700">March 15-17, 2024</p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={isInView ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-green-900">Location</h4>
                  <p className="text-green-700">Tech Innovation Center</p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={isInView ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 1 }}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl border border-purple-200"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-purple-900">Duration</h4>
                  <p className="text-purple-700">48 Hours of Innovation</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};