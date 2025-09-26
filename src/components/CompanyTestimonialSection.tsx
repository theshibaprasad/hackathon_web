"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Trophy, Award, Medal, Star } from "lucide-react";

export const CompanyTestimonialSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 relative z-10 overflow-hidden">
      {/* Stage-like background with spotlight effect */}
      <div className="absolute inset-0">
        {/* Dark stage background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-slate-800/30 to-black/40" />
        
        {/* Spotlight effect on winner */}
        <motion.div
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [0.8, 1.1, 0.8]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-radial from-yellow-400/40 via-orange-500/20 to-transparent rounded-full blur-3xl"
        />
        
        {/* Floating particles */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-16 left-16 w-3 h-3 bg-yellow-400 rounded-full opacity-60"
        />
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -180, -360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-24 right-24 w-2 h-2 bg-orange-400 rounded-full opacity-50"
        />
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 90, 180, 270, 360] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-24 left-24 w-2 h-2 bg-pink-400 rounded-full opacity-40"
        />
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4 drop-shadow-2xl">
            🏆 REWARDS & PRIZES 🏆
          </h2>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto font-medium">
            Step onto the stage of innovation and claim your victory
          </p>
        </motion.div>

        {/* Winner Stage - Center Focus */}
        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.9 }}
          animate={isInView ? { y: 0, opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-16 sm:mb-20"
        >
          {/* Stage platform */}
          <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-1.5 shadow-2xl border border-slate-700">
            {/* Winner Prize Card - Spotlight Effect */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.3 }}
              className="relative bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-8 sm:p-10 rounded-xl shadow-2xl border-3 border-yellow-300 overflow-hidden"
            >
              {/* Spotlight beam effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-200/30 via-transparent to-transparent" />
              
              {/* Animated background pattern */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-yellow-300/20 to-orange-400/20 rounded-full blur-xl"
              />
              
              {/* Trophy with dramatic effect */}
              <motion.div
                animate={{ 
                  rotate: [0, 3, -3, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="flex justify-center mb-6"
              >
                <div className="relative">
                  <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-white drop-shadow-2xl" />
                  {/* Glow effect around trophy */}
                  <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl opacity-50" />
                </div>
              </motion.div>

              <div className="text-center space-y-4">
                <motion.h3 
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="text-2xl sm:text-3xl font-black text-white mb-2 drop-shadow-lg"
                >
                  🏆 CHAMPION 🏆
                </motion.h3>
                
                {/* Prize amount with spotlight effect */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    textShadow: [
                      "0 0 15px rgba(255,255,255,0.5)",
                      "0 0 30px rgba(255,255,255,0.8)",
                      "0 0 15px rgba(255,255,255,0.5)"
                    ]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="text-4xl sm:text-5xl md:text-6xl font-black text-white drop-shadow-2xl"
                  style={{
                    textShadow: "0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.4)"
                  }}
                >
                  ₹50,000
                </motion.div>
                
                <p className="text-white/95 text-lg sm:text-xl font-bold">
                  Grand Prize Winner
                </p>
              </div>

              {/* Floating stars around the prize */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [0, -15, 0], 
                    rotate: [0, 360, 0],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{ 
                    duration: 3 + i * 0.5, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: i * 0.3
                  }}
                  className="absolute"
                  style={{
                    top: `${25 + (i * 20)}%`,
                    left: `${15 + (i * 20)}%`,
                    right: i % 2 === 0 ? 'auto' : '15%'
                  }}
                >
                  <Star className="w-4 h-4 text-yellow-200 fill-current drop-shadow-lg" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Runner-up Prizes - Below the stage */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
        >
          {/* 2nd Place */}
          <motion.div
            whileHover={{ scale: 1.02, y: -3 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-slate-700 to-slate-800 p-6 rounded-xl shadow-lg border-2 border-gray-500 relative overflow-hidden"
          >
            <div className="text-center space-y-3">
              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Medal className="w-12 h-12 text-gray-300 mx-auto drop-shadow-lg" />
              </motion.div>
              <h4 className="text-lg font-bold text-gray-200">2nd Place</h4>
              <p className="text-2xl font-black text-gray-100">₹25,000</p>
              <p className="text-gray-400 text-sm">Runner-up Prize</p>
            </div>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            whileHover={{ scale: 1.02, y: -3 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-amber-800 to-orange-900 p-6 rounded-xl shadow-lg border-2 border-amber-600 relative overflow-hidden"
          >
            <div className="text-center space-y-3">
              <motion.div
                animate={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Award className="w-12 h-12 text-amber-300 mx-auto drop-shadow-lg" />
              </motion.div>
              <h4 className="text-lg font-bold text-amber-200">3rd Place</h4>
              <p className="text-2xl font-black text-amber-100">₹15,000</p>
              <p className="text-amber-400 text-sm">Third Place Prize</p>
            </div>
          </motion.div>

          {/* Special Mentions */}
          <motion.div
            whileHover={{ scale: 1.02, y: -3 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-blue-800 to-indigo-900 p-6 rounded-xl shadow-lg border-2 border-blue-600 relative overflow-hidden"
          >
            <div className="text-center space-y-3">
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Star className="w-12 h-12 text-blue-300 mx-auto drop-shadow-lg fill-current" />
              </motion.div>
              <h4 className="text-lg font-bold text-blue-200">Special Mentions</h4>
              <p className="text-xl font-black text-blue-100">₹5,000 each</p>
              <p className="text-blue-400 text-sm">Best Innovation, Best Design</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};