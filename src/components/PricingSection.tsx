import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 relative bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Simple,{" "}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
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
          <Card className="p-8 relative bg-white border border-border/20 hover:shadow-lg transition-all duration-300">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2 text-foreground">Free Trial</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground">/7 days</span>
              </div>
              <Link to="/auth">
                <Button variant="outline" className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-white">
                  Start Free Trial
                </Button>
              </Link>
            </div>
            <ul className="mt-8 space-y-3">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-foreground">Real-time market data</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-foreground">Basic AI analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-foreground">Portfolio tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-foreground">Email support</span>
              </li>
            </ul>
          </Card>

          {/* Pro Plan */}
          <Card className="p-8 relative bg-gradient-to-br from-blue-500 to-purple-600 border-none shadow-xl scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-white text-purple-600 px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2 text-white">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$19</span>
                <span className="text-white/70">/month</span>
              </div>
              <Link to="/auth">
                <Button className="w-full rounded-full bg-white text-purple-600 hover:bg-gray-50">
                  Start Pro Trial
                </Button>
              </Link>
            </div>
            <ul className="mt-8 space-y-3">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-400" />
                <span className="text-white">Everything in Free</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-400" />
                <span className="text-white">Advanced AI insights</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-400" />
                <span className="text-white">Unlimited automations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-400" />
                <span className="text-white">All integrations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-400" />
                <span className="text-white">Priority support</span>
              </li>
            </ul>
          </Card>

          {/* Enterprise Plan */}
          <Card className="p-8 relative bg-white border border-border/20 hover:shadow-lg transition-all duration-300">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2 text-foreground">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">Custom</span>
              </div>
              <Button variant="outline" className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-white">
                Contact Sales
              </Button>
            </div>
            <ul className="mt-8 space-y-3">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-foreground">Everything in Pro</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-foreground">Custom integrations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-foreground">Dedicated support</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-foreground">SLA guarantees</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}