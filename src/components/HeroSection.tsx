import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FloatingShapes } from "./FloatingShapes";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-br from-background to-background/80">
      <FloatingShapes />
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="mb-12">
          <Image
            src="/novothon_blue.png"
            alt="Novothon"
            width={400}
            height={200}
            className="mx-auto h-32 w-auto object-contain"
          />
        </div>

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