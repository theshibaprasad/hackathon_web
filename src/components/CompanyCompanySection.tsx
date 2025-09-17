"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Laptop, Code, Code2, Monitor, Keyboard, Github, Database, Terminal, GitBranch, Phone, Tablet, Cpu, HardDrive, Zap, Wifi, Layers, FileText, Headphones, Camera, Mic, Wrench, Settings, Globe, Mouse, Smartphone } from "lucide-react";

export const CompanyCompanySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section 
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 1 }}
      className="py-20 px-6 bg-gradient-to-br from-primary to-devfolio-blue relative overflow-hidden"
    >
      {/* Floating icons like hero section */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10"
      >
        <Laptop className="w-16 h-16 text-devfolio-yellow" />
      </motion.div>
      
      <motion.div
        animate={{ rotate: [0, 180, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 right-20"
      >
        <Code className="w-12 h-12 text-devfolio-orange" />
      </motion.div>
      
      <motion.div
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/2 right-10"
      >
        <Monitor className="w-14 h-14 text-devfolio-green" />
      </motion.div>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-32 right-1/4"
      >
        <Github className="w-12 h-12 text-devfolio-blue" />
      </motion.div>

      <motion.div
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-32 left-1/4"
      >
        <Database className="w-16 h-16 text-devfolio-purple" />
      </motion.div>

      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 2 }}
        className="absolute top-1/3 left-20"
      >
        <Terminal className="w-14 h-14 text-devfolio-pink" />
      </motion.div>

      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className="absolute bottom-1/3 right-1/3"
      >
        <Phone className="w-12 h-12 text-devfolio-lightBlue" />
      </motion.div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
        className="absolute top-16 right-1/2"
      >
        <Tablet className="w-10 h-10 text-red-500" />
      </motion.div>

      <motion.div
        animate={{ x: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        className="absolute top-1/4 left-1/3"
      >
        <Keyboard className="w-12 h-12 text-devfolio-yellow" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        className="absolute bottom-1/4 left-1/2"
      >
        <Code2 className="w-14 h-14 text-devfolio-orange" />
      </motion.div>

      <motion.div
        animate={{ rotate: [0, -180, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
        className="absolute top-2/3 right-1/5"
      >
        <Cpu className="w-10 h-10 text-devfolio-green" />
      </motion.div>

      <motion.div
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        className="absolute bottom-1/5 left-1/5"
      >
        <HardDrive className="w-12 h-12 text-devfolio-blue" />
      </motion.div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.h2 
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold text-white mb-8"
        >
          CompanyName for companies
        </motion.h2>
        
        <motion.p 
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto"
        >
          Your engineering team and developer products need a brand and a fan base. That's where we come in.
        </motion.p>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg text-white/80 mb-12 max-w-3xl mx-auto"
        >
          Support Open Source Bring top developers of the 100+ web3 are all really high their projects.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90 px-8 py-3 rounded-full font-semibold"
          >
            Learn more
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
};