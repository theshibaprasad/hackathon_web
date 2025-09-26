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

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h2 
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-black mb-12 sm:mb-16 text-center"
        >
          Timelines
        </motion.h2>

        {/* Hackathon Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-black/30 via-black/20 to-black/30 hidden lg:block"></div>
          
          {/* Timeline Items */}
          <div className="space-y-16 lg:space-y-20">
            {/* Day 1 - Registration & Opening */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Timeline Dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2 w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-4 border-white shadow-lg hidden lg:block z-10"></div>
              
              {/* Content Card - Left Side */}
              <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
                <div className="lg:text-right lg:pr-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 shadow-xl border-2 border-blue-200">
                    <div className="flex lg:flex-row-reverse items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
                        1
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl lg:text-3xl font-black text-blue-900 mb-2">Registration & Opening</h3>
                        <div className="flex items-center gap-2 text-blue-600 font-bold">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          Day 1 - Morning (9:00 AM)
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed mb-4">
                      Welcome to Novothon! Register your team, collect your welcome kit, and join us for an inspiring opening ceremony featuring industry leaders and expert mentors.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
                      <span className="px-4 py-2 bg-blue-200 text-blue-800 rounded-full text-sm font-bold">Registration</span>
                      <span className="px-4 py-2 bg-blue-200 text-blue-800 rounded-full text-sm font-bold">Welcome Kit</span>
                      <span className="px-4 py-2 bg-blue-200 text-blue-800 rounded-full text-sm font-bold">Keynote</span>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block"></div>
              </div>
            </motion.div>

            {/* Day 1 - Problem Statement Release */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              {/* Timeline Dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2 w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-4 border-white shadow-lg hidden lg:block z-10"></div>
              
              {/* Content Card - Right Side */}
              <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
                <div className="hidden lg:block"></div>
                <div className="lg:pl-8">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 shadow-xl border-2 border-green-200">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
                        2
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl lg:text-3xl font-black text-green-900 mb-2">Problem Statements</h3>
                        <div className="flex items-center gap-2 text-green-600 font-bold">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Day 1 - Afternoon (2:00 PM)
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed mb-4">
                      The moment you've been waiting for! Problem statements are unveiled across multiple tracks. Choose your challenge and start brainstorming innovative solutions.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-4 py-2 bg-green-200 text-green-800 rounded-full text-sm font-bold">Problem Release</span>
                      <span className="px-4 py-2 bg-green-200 text-green-800 rounded-full text-sm font-bold">Track Selection</span>
                      <span className="px-4 py-2 bg-green-200 text-green-800 rounded-full text-sm font-bold">Team Formation</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Day 2 - Development Phase */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative"
            >
              {/* Timeline Dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2 w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border-4 border-white shadow-lg hidden lg:block z-10"></div>
              
              {/* Content Card - Left Side */}
              <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
                <div className="lg:text-right lg:pr-8">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 shadow-xl border-2 border-purple-200">
                    <div className="flex lg:flex-row-reverse items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
                        3
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl lg:text-3xl font-black text-purple-900 mb-2">Development Sprint</h3>
                        <div className="flex items-center gap-2 text-purple-600 font-bold">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          Day 2 - Full Day (24 Hours)
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed mb-4">
                      Time to build! Code your solution, create prototypes, and bring your ideas to life. Expert mentors are available 24/7 to guide and support your journey.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
                      <span className="px-4 py-2 bg-purple-200 text-purple-800 rounded-full text-sm font-bold">Coding</span>
                      <span className="px-4 py-2 bg-purple-200 text-purple-800 rounded-full text-sm font-bold">Prototyping</span>
                      <span className="px-4 py-2 bg-purple-200 text-purple-800 rounded-full text-sm font-bold">24/7 Mentorship</span>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block"></div>
              </div>
            </motion.div>

            {/* Day 3 - Final Presentations */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="relative"
            >
              {/* Timeline Dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2 w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full border-4 border-white shadow-lg hidden lg:block z-10"></div>
              
              {/* Content Card - Right Side */}
              <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
                <div className="hidden lg:block"></div>
                <div className="lg:pl-8">
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-8 shadow-xl border-2 border-orange-200">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
                        4
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl lg:text-3xl font-black text-orange-900 mb-2">Final Showcase</h3>
                        <div className="flex items-center gap-2 text-orange-600 font-bold">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Day 3 - Morning (10:00 AM)
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed mb-4">
                      Present your innovative solutions to our expert panel of judges. Showcase your hard work, creativity, and technical excellence to industry leaders.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-4 py-2 bg-orange-200 text-orange-800 rounded-full text-sm font-bold">Presentations</span>
                      <span className="px-4 py-2 bg-orange-200 text-orange-800 rounded-full text-sm font-bold">Live Demo</span>
                      <span className="px-4 py-2 bg-orange-200 text-orange-800 rounded-full text-sm font-bold">Expert Judging</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Day 3 - Awards & Closing */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="relative"
            >
              {/* Timeline Dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border-4 border-white shadow-lg hidden lg:block z-10"></div>
              
              {/* Content Card - Center (Full Width) */}
              <div className="flex justify-center">
                <div className="max-w-2xl w-full">
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-3xl p-8 shadow-xl border-2 border-yellow-200 text-center">
                    <div className="flex justify-center items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
                        🏆
                      </div>
                      <div>
                        <h3 className="text-2xl lg:text-3xl font-black text-yellow-900 mb-2">Grand Finale</h3>
                        <div className="flex justify-center items-center gap-2 text-yellow-600 font-bold">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                          Day 3 - Evening (6:00 PM)
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed mb-4">
                      Celebrate the winners and recognize all participants for their incredible work. Network with fellow innovators and industry professionals at our grand closing ceremony.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <span className="px-4 py-2 bg-yellow-200 text-yellow-800 rounded-full text-sm font-bold">₹50,000 Prize</span>
                      <span className="px-4 py-2 bg-yellow-200 text-yellow-800 rounded-full text-sm font-bold">Awards Ceremony</span>
                      <span className="px-4 py-2 bg-yellow-200 text-yellow-800 rounded-full text-sm font-bold">Networking</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};