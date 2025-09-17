"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Laptop, Code, Github, Cpu, Database, Zap, Terminal, Smartphone, Globe, Monitor, Keyboard, Mouse, Wifi, HardDrive, Layers, FileText, GitBranch, Code2, Smartphone as Phone, Tablet, Headphones, Camera, Mic, Wrench, Settings } from "lucide-react";

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
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 bg-background overflow-hidden">
      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingIcons.map((iconData, index) => (
          <FloatingIcon key={index} iconData={iconData} index={index} />
        ))}
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto text-center" >
        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
           className="text-4xl md:text-6xl font-bold leading-tight mb-8"
        >
          Building the future through{" "}
          <motion.span 
            initial={{ backgroundPosition: "0% 50%" }}
            animate={{ backgroundPosition: "100% 50%" }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent"
          >
            innovation and creativity
          </motion.span>{" "}
          with{" "}
          <span className="relative">
            hackathons
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="absolute -bottom-2 left-0 right-0 h-1 bg-accent rounded-full origin-left"
            />
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto"
        >
          Join the largest community of developers, designers, and innovators creating groundbreaking solutions through collaborative hackathons.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center mb-16"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" className="rounded-full px-8 py-4 bg-primary hover:bg-primary/90 text-lg font-semibold">
              Explore More
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-wrap items-center justify-center gap-8"
        >
          <div className="text-sm text-muted-foreground">Trusted by developers from</div>
          <div className="flex items-center gap-6">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + i * 0.1, duration: 0.3 }}
                className="w-8 h-8 bg-muted rounded-lg"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};