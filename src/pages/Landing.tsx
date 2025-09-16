import { LandingNavbar } from "@/components/LandingNavbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { PricingSection } from "@/components/PricingSection";
import { ScrollAnimatedSection } from "@/components/ScrollAnimatedSection";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <LandingNavbar />
      <HeroSection />
      
      <ScrollAnimatedSection animation="fade-up" delay={200}>
        <FeaturesSection />
      </ScrollAnimatedSection>
      
      <ScrollAnimatedSection animation="fade-up" delay={300}>
        <PricingSection />
      </ScrollAnimatedSection>
      
      {/* Footer */}
      <ScrollAnimatedSection animation="fade-in" delay={100}>
        <footer className="py-16 border-t border-border/20 bg-card/30 backdrop-blur-sm">
          <div className="container mx-auto px-6 text-center">
            <p className="text-muted-foreground">
              © 2024 LyticalPilot. All rights reserved.
            </p>
          </div>
        </footer>
      </ScrollAnimatedSection>
    </div>
  );
};

export default Landing;