const stats = [
  { number: "50K+", label: "Active Developers" },
  { number: "1000+", label: "Hackathons Hosted" },
  { number: "$5M+", label: "Prizes Distributed" },
  { number: "200+", label: "Partner Companies" }
];

export const StatsSection = () => {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join the <span className="gradient-text">movement</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Be part of the largest hackathon community in the world
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-6xl font-bold gradient-text mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground text-lg">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};