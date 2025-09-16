import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { LyticalPilotLogo } from "@/components/LyticalPilotLogo";

export function LandingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            <LyticalPilotLogo size="sm" className="text-foreground" />
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              How it works
            </a>
            <a href="#integrations" className="text-muted-foreground hover:text-foreground transition-colors">
              Who we serve
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Solutions
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              AI-Agents
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About us
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              Blog
            </a>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                Request a demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}