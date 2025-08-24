import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Simple,{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              transparent pricing
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start with a 7-day free trial. No setup fees, no hidden costs.
            Cancel anytime.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Free Trial */}
          <Card className="p-8 relative bg-gradient-feature border-border/50">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Free Trial</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/7 days</span>
              </div>
              <Link to="/auth">
                <Button variant="outline" className="w-full rounded-full">
                  Start Free Trial
                </Button>
              </Link>
            </div>
            <ul className="mt-8 space-y-3">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-bullish" />
                <span>Real-time market data</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-bullish" />
                <span>Basic AI analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-bullish" />
                <span>Portfolio tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-bullish" />
                <span>Email support</span>
              </li>
            </ul>
          </Card>

          {/* Pro Plan */}
          <Card className="p-8 relative bg-gradient-primary border-primary shadow-glow scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2 text-primary-foreground">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-primary-foreground">$19</span>
                <span className="text-primary-foreground/70">/month</span>
              </div>
              <Link to="/auth">
                <Button className="w-full rounded-full bg-card text-card-foreground hover:bg-card/90">
                  Start Pro Trial
                </Button>
              </Link>
            </div>
            <ul className="mt-8 space-y-3">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-bullish" />
                <span className="text-primary-foreground">Everything in Free</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-bullish" />
                <span className="text-primary-foreground">Advanced AI insights</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-bullish" />
                <span className="text-primary-foreground">Unlimited automations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-bullish" />
                <span className="text-primary-foreground">All integrations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-bullish" />
                <span className="text-primary-foreground">Priority support</span>
              </li>
            </ul>
          </Card>

          {/* Enterprise Plan */}
          <Card className="p-8 relative bg-gradient-feature border-border/50">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">Custom</span>
              </div>
              <Button variant="outline" className="w-full rounded-full">
                Contact Sales
              </Button>
            </div>
            <ul className="mt-8 space-y-3">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-bullish" />
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-bullish" />
                <span>Custom integrations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-bullish" />
                <span>Dedicated support</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-bullish" />
                <span>SLA guarantees</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}