import { Card } from "@/components/ui/card";
import { Calendar, Users, Trophy, Rocket } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Find Hackathons",
    description: "Discover exciting hackathons happening around the world and join the ones that match your interests.",
    color: "bg-shape-blue"
  },
  {
    icon: Users,
    title: "Build Teams",
    description: "Connect with like-minded developers, designers, and creators to form winning teams.",
    color: "bg-shape-green"
  },
  {
    icon: Trophy,
    title: "Win Prizes",
    description: "Compete for amazing prizes, funding opportunities, and recognition from top companies.",
    color: "bg-shape-orange"
  },
  {
    icon: Rocket,
    title: "Launch Projects",
    description: "Turn your hackathon projects into real products and startups with our platform.",
    color: "bg-shape-purple"
  }
];

export const FeaturesSection = () => {
  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            We drop <span className="gradient-text">jaws!</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to participate in hackathons, build amazing projects, 
            and connect with the global developer community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};