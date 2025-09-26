"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Trophy, Clock, Code } from "lucide-react";

const hackathons = [
  {
    title: "Novothon",
    date: "Nov 15, 2025",
    location: "Odisha",
    color: "bg-devfolio-purple",
    isActive: true
  }
];

export const CompanyHackathonSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-12 sm:py-20 px-4 sm:px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            Happening now
          </h2>
          
          {/* Progress bar */}
          <div className="w-full max-w-sm sm:max-w-md mx-auto mb-8 sm:mb-12">
            <div className="flex items-center justify-between mb-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-devfolio-purple rounded-full"></div>
              <div className="flex-1 h-1 bg-muted mx-2"></div>
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-muted rounded-full"></div>
              <div className="flex-1 h-1 bg-muted mx-2"></div>
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-devfolio-green rounded-full"></div>
            </div>
          </div>
        </motion.div>

        {/* Center the single hackathon card with responsive width */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 w-full max-w-4xl">
            {hackathons.map((hackathon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -8, scale: 1.05 }}
                className={`${hackathon.color} p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl text-white relative overflow-hidden cursor-pointer group`}
                style={{
                  background: `linear-gradient(135deg, ${hackathon.color.replace('bg-', '')} 0%, ${hackathon.color.replace('bg-', '')}dd 100%)`
                }}
              >
                {/* Animated blue border */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <motion.div
                    className="absolute inset-0 rounded-3xl"
                    style={{
                      background: 'linear-gradient(45deg, transparent, #3B82F6, transparent, #3B82F6, transparent)',
                      backgroundSize: '400% 400%'
                    }}
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  <div className="absolute inset-1 rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800" />
                </div>

                {/* Golden glow flowing around outside perimeter */}
                <motion.div
                  className="absolute -inset-4 pointer-events-none"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(255, 215, 0, 0), 0 0 0 0 rgba(255, 215, 0, 0), 0 0 0 0 rgba(255, 215, 0, 0), 0 0 0 0 rgba(255, 215, 0, 0)",
                      "0 0 40px 20px rgba(255, 215, 0, 1), 0 0 0 0 rgba(255, 215, 0, 0), 0 0 0 0 rgba(255, 215, 0, 0), 0 0 0 0 rgba(255, 215, 0, 0)",
                      "0 0 0 0 rgba(255, 215, 0, 0), 0 0 40px 20px rgba(255, 215, 0, 1), 0 0 0 0 rgba(255, 215, 0, 0), 0 0 0 0 rgba(255, 215, 0, 0)",
                      "0 0 0 0 rgba(255, 215, 0, 0), 0 0 0 0 rgba(255, 215, 0, 0), 0 0 40px 20px rgba(255, 215, 0, 1), 0 0 0 0 rgba(255, 215, 0, 0)",
                      "0 0 0 0 rgba(255, 215, 0, 0), 0 0 0 0 rgba(255, 215, 0, 0), 0 0 0 0 rgba(255, 215, 0, 0), 0 0 40px 20px rgba(255, 215, 0, 1)",
                      "0 0 0 0 rgba(255, 215, 0, 0), 0 0 0 0 rgba(255, 215, 0, 0), 0 0 0 0 rgba(255, 215, 0, 0), 0 0 0 0 rgba(255, 215, 0, 0)"
                    ]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />


                {/* Floating decoration */}
                {hackathon.isActive && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-8 -right-8 w-32 h-32 bg-white/20 rounded-full"
                  />
                )}
                
                <div className="relative z-10">
                  {/* Icons row - non-clickable */}
                  <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
                      <Code className="w-4 h-4 sm:w-6 sm:h-6" />
                    </div>
                    <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
                      <Trophy className="w-4 h-4 sm:w-6 sm:h-6" />
                    </div>
                    <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
                      <Users className="w-4 h-4 sm:w-6 sm:h-6" />
                    </div>
                    <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
                      <Clock className="w-4 h-4 sm:w-6 sm:h-6" />
                    </div>
                  </div>

                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 group-hover:text-blue-200 transition-colors">
                    {hackathon.title}
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                      <p className="text-xl sm:text-2xl lg:text-3xl opacity-90">{hackathon.date}</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
                      <p className="text-lg sm:text-xl lg:text-2xl opacity-80 font-semibold">Winner Prize</p>
                    </div>
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block"
                  >
                    <Button 
                      variant="secondary" 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 text-lg sm:text-xl lg:text-2xl py-3 sm:py-4 lg:py-5 px-6 sm:px-8 lg:px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                    >
                      {hackathon.isActive ? "Register now" : "View details"}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};