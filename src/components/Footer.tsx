import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin } from "lucide-react";

const footerLinks = {
  company: ["Code of Conduct", "Privacy Policy", "Terms of Service", "FAQ", "Platform Status", "Twitter"],
  platform: ["Organize a hackathon", "Student Resources", "Sponsor", "API", "College", "FAQ"],
  support: ["Contact Us", "Bug Report", "Discord", "Instagram", "YouTube", "LinkedIn"]
};

export const Footer = () => {
  return (
    <footer className="bg-background py-16 px-6 border-t">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">C</span>
              </div>
              <span className="text-2xl font-bold">CompanyName</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              We love{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-semibold">
                software
              </span>{" "}
              and the{" "}
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent font-semibold">
                people who build them.
              </span>
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Github className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Linkedin className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-primary">COMPANY</h4>
            <div className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <a
                  key={index}
                  href="#"
                  className="block text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-primary">PLATFORM</h4>
            <div className="space-y-2">
              {footerLinks.platform.map((link, index) => (
                <a
                  key={index}
                  href="#"
                  className="block text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-primary">SUPPORT</h4>
            <div className="space-y-2">
              {footerLinks.support.map((link, index) => (
                <a
                  key={index}
                  href="#"
                  className="block text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2024 CompanyName. All rights reserved. ❤️ & 💻 from India by Polygon Devs.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                Privacy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};