"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export const CompanyTestimonialSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Text */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-devfolio-orange">
              InOut connected me to awesome developers & made me feel inclusive.{" "}
              <span className="text-primary">
                CompanyName has been doing an amazing job in keeping the community intact.
              </span>
            </h2>
            
            <div className="space-y-2">
              <p className="font-semibold text-lg">Employee Name</p>
              <p className="text-muted-foreground">Position, Company Name</p>
            </div>

            {/* Floating illustration */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 left-0 w-20 h-20 bg-devfolio-blue rounded-full opacity-20"
            />
          </motion.div>

          {/* Right side - Image placeholder */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="w-full h-96 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground">
              [Image Placeholder - Testimonial Photo]
            </div>
            
            {/* Floating decorations */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -left-6 w-12 h-12 bg-devfolio-yellow rounded-full opacity-80"
            />
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -right-6 w-16 h-8 bg-devfolio-blue rounded-lg rotate-12 opacity-80"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};