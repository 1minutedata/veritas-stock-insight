import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Clean Background with Blue Accents */}
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl"></div>
        </div>
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="grid grid-cols-20 h-full">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="border-r border-foreground"></div>
          ))}
        </div>
        <div className="absolute inset-0 grid grid-rows-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="border-b border-foreground"></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center pt-20">
        <div className="max-w-5xl mx-auto space-y-12">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground max-w-4xl mx-auto">
            The AI-powered Financial 
            <span className="text-primary block mt-2">
              Assistant Platform
            </span>
            <span className="text-2xl md:text-3xl lg:text-4xl font-normal text-muted-foreground block mt-4">
              made for automation
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Low-code customization platform with AI agents to transform your 
            financial experience and market analysis.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link to="/auth">
              <Button size="lg" className="px-8 py-4 text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                Request a demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-4 text-base border-border hover:bg-muted/50"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
          
          {/* Hero Visual - Clean Blue Card */}
          <div className="max-w-4xl mx-auto mt-16">
            <div className="bg-primary rounded-2xl p-8 md:p-12 shadow-xl">
              <div className="bg-card rounded-xl p-6 md:p-8 border border-border/20 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="font-medium text-foreground">Financial Analysis Portal</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-muted rounded-full"></div>
                    <div className="w-3 h-3 bg-muted rounded-full"></div>
                    <div className="w-3 h-3 bg-muted rounded-full"></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-muted-foreground">Portfolio Value</span>
                    <span className="font-semibold text-primary">+$127,420</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-muted-foreground">AI Recommendations</span>
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-muted-foreground">Market Analysis</span>
                    <span className="text-primary font-medium">Real-time</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}