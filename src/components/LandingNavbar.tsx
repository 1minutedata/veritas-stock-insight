import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { VeritasierLogo } from "@/components/VeritasierLogo";

export function LandingNavbar() {
  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-card/80 backdrop-blur-lg rounded-full border border-border/50 px-8 py-4 shadow-glow">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            <VeritasierLogo size="sm" className="text-foreground" />
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Payment Solutions
            </a>
            <a href="#integrations" className="text-muted-foreground hover:text-foreground transition-colors">
              Business Tools
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              Support
            </a>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="rounded-full">
                Log in
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="rounded-full bg-gradient-primary hover:opacity-90">
                Start Processing Payments
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}