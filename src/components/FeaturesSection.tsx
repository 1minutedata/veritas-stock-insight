import { FeatureChart } from "./FeatureChart";
import { Brain, Zap, Globe, DollarSign, Mail, Slack } from "lucide-react";
import { Card } from "@/components/ui/card";

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful features for{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              smarter investing
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            VeritasPilot combines AI-powered analysis with seamless integrations to give you 
            the edge in financial markets.
          </p>
        </div>

        {/* Main Feature Charts */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <FeatureChart
            type="sentiment"
            title="AI Sentiment Analysis"
            description="Real-time market sentiment tracking with bullish and bearish trend analysis"
          />
          <FeatureChart
            type="performance"
            title="Portfolio Performance"
            description="Track and compare investment performance across multiple portfolios"
          />
          <FeatureChart
            type="automation"
            title="Smart Automation"
            description="Automate workflows with email alerts, Slack notifications, and more"
          />
        </div>

        {/* Integration Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-feature border-border/50 hover:shadow-glow transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/20">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">AI Copilot</h3>
            </div>
            <p className="text-muted-foreground">
              Get personalized investment advice powered by advanced machine learning algorithms
              and real-time market data analysis.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-feature border-border/50 hover:shadow-glow transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-bullish/20">
                <Globe className="h-6 w-6 text-bullish" />
              </div>
              <h3 className="text-lg font-semibold">Plaid Integration</h3>
            </div>
            <p className="text-muted-foreground">
              Securely connect your bank accounts and financial institutions for comprehensive
              portfolio tracking and analysis.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-feature border-border/50 hover:shadow-glow transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-accent/20">
                <DollarSign className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold">Stripe Invoicing</h3>
            </div>
            <p className="text-muted-foreground">
              Automate invoice generation and payment processing for your financial services
              with seamless Stripe integration.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-feature border-border/50 hover:shadow-glow transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/20">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Gmail Integration</h3>
            </div>
            <p className="text-muted-foreground">
              Receive automated market alerts, portfolio updates, and investment insights
              directly in your Gmail inbox.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-feature border-border/50 hover:shadow-glow transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-bullish/20">
                <Slack className="h-6 w-6 text-bullish" />
              </div>
              <h3 className="text-lg font-semibold">Slack Notifications</h3>
            </div>
            <p className="text-muted-foreground">
              Keep your team informed with real-time market updates and portfolio alerts
              sent directly to your Slack channels.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-feature border-border/50 hover:shadow-glow transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-accent/20">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold">Smart Automations</h3>
            </div>
            <p className="text-muted-foreground">
              Create custom workflows that trigger based on market conditions, portfolio
              performance, or specific investment criteria.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}