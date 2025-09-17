import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FloatingShapes } from "./FloatingShapes";
import { ArrowRight } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-br from-background to-background/80">
      <FloatingShapes />
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
          Redefining{" "}
          <span className="gradient-text">economic opportunities</span>{" "}
          for builders with{" "}
          <span className="relative">
            hackathons
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-accent rounded-full"></div>
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          Join the largest community of developers, designers, and innovators building the future through hackathons.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <div className="relative flex-1 w-full">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
              JOIN US
            </span>
            <Input 
              type="email" 
              placeholder="Your email" 
              className="pl-20 pr-12 h-12 rounded-full border-2 border-primary/20 focus:border-primary"
            />
          </div>
          <Button size="lg" className="rounded-full px-8 h-12 bg-primary hover:bg-primary/90">
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
          <div className="text-sm text-muted-foreground">Trusted by developers from</div>
          <div className="flex items-center gap-6">
            <div className="w-8 h-8 bg-muted rounded-lg"></div>
            <div className="w-8 h-8 bg-muted rounded-lg"></div>
            <div className="w-8 h-8 bg-muted rounded-lg"></div>
            <div className="w-8 h-8 bg-muted rounded-lg"></div>
            <div className="w-8 h-8 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
};