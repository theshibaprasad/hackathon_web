"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Laptop, Code, Github, Cpu, Database, Zap, Terminal, Smartphone, Globe, Monitor, Keyboard, Mouse, Wifi, HardDrive, Layers, FileText, GitBranch, Code2, Smartphone as Phone, Tablet, Headphones, Camera, Mic, Wrench, Settings } from "lucide-react";
import Link from "next/link";

// Optimized floating icons configuration - reduced size for better webpack performance
const iconComponents = [Laptop, Code, Code2, Monitor, Keyboard, Github, Database, Terminal, GitBranch, Phone, Tablet, Cpu, HardDrive, Zap, Wifi, Layers, FileText, Headphones, Camera, Mic, Wrench, Settings, Globe, Mouse, Smartphone];

const floatingIcons = iconComponents.map((Icon, index) => ({
  icon: Icon,
  size: ["w-20 h-20", "w-16 h-16", "w-18 h-18", "w-14 h-14", "w-12 h-12", "w-10 h-10"][index % 6],
  color: ["text-devfolio-yellow", "text-devfolio-orange", "text-devfolio-green", "text-devfolio-blue", "text-devfolio-purple", "text-devfolio-pink", "text-devfolio-lightBlue"][index % 7],
  position: [
    "top-32 left-16", "top-40 left-40", "top-28 right-20", "top-36 right-40", "top-48 left-1/4",
    "top-1/2 left-12", "top-1/2 right-16", "top-1/2 left-1/2", "top-1/2 right-1/3", "bottom-40 left-20",
    "bottom-32 left-40", "bottom-48 right-24", "bottom-36 right-40", "bottom-24 left-1/3", "bottom-32 right-1/4",
    "bottom-40 right-1/2", "bottom-28 left-1/2", "bottom-20 left-1/4", "bottom-36 left-1/6", "bottom-44 right-1/6",
    "bottom-32 left-2/3", "bottom-40 right-2/3", "top-1/4 left-1/3", "top-1/3 right-1/4", "top-2/3 left-1/6"
  ][index],
  delay: index * 0.2
}));

const FloatingIcon = ({ iconData, index }: { iconData: any, index: number }) => {
  const IconComponent = iconData.icon;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ 
        opacity: 0.8, 
        scale: 1, 
        rotate: 0,
        y: [0, -20, 0],
      }}
      transition={{
        opacity: { delay: iconData.delay, duration: 0.6 },
        scale: { delay: iconData.delay, duration: 0.6 },
        rotate: { delay: iconData.delay, duration: 0.6 },
        y: { delay: iconData.delay + 1, duration: 3, repeat: Infinity, ease: "easeInOut" }
      }}
      className={`absolute ${iconData.position} ${iconData.size} ${iconData.color} pointer-events-none`}
    >
      <IconComponent className="w-full h-full" />
    </motion.div>
  );
};


export const CompanyHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20 bg-background overflow-hidden">
      {/* Simple background for hero */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 via-white/50 to-gray-100/40" />
      
      {/* Very subtle orbs for glass contrast */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-gray-200/10 to-gray-300/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-slate-200/8 to-zinc-300/4 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/2 w-[500px] h-[500px] bg-gradient-to-br from-neutral-200/6 to-gray-300/3 rounded-full blur-3xl" />
      </div>
      
      {/* Floating Icons - Hidden on mobile for better performance */}
      <div className="absolute inset-0 pointer-events-none hidden sm:block">
        {floatingIcons.map((iconData, index) => (
          <FloatingIcon key={index} iconData={iconData} index={index} />
        ))}
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-12 sm:mb-16"
        >
          <div className="glass-card-enhanced p-8 sm:p-12 liquid-glass shadow-2xl">
            <div className="relative">
              <img
                src="/novothon_blue.svg"
                alt="Novothon"
                className="mx-auto h-40 sm:h-56 md:h-64 lg:h-72 w-auto object-contain drop-shadow-2xl relative z-10"
              />
              {/* Glow effect behind logo */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl scale-110" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center mb-12 sm:mb-16"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/problem-statements">
              <Button size="lg" className="glass-button liquid-glass rounded-full px-8 sm:px-12 py-4 sm:py-5 bg-primary/90 hover:bg-primary text-base sm:text-lg font-semibold backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                Explore More
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8"
        >
          <div className="text-xs sm:text-sm text-muted-foreground">Trusted by developers from </div>
          <div className="flex items-center gap-4 sm:gap-6">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + i * 0.1, duration: 0.3 }}
                className="w-6 h-6 sm:w-8 sm:h-8 bg-muted rounded-lg"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};