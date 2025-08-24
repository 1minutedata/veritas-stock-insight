import { LandingNavbar } from "@/components/LandingNavbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { PricingSection } from "@/components/PricingSection";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      
      {/* Footer */}
      <footer className="py-12 border-t border-border/50 bg-card/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            © 2024 VeritasPilot. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;