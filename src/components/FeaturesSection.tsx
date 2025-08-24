import { FeatureChart } from "./FeatureChart";
import { Brain, Zap, Globe, DollarSign, Mail, Slack } from "lucide-react";
import { Card } from "@/components/ui/card";

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Powerful features for{" "}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              smarter investing
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            VeritasPilot combines AI-powered analysis with seamless integrations to give you 
            the edge in financial markets.
          </p>
        </div>

        {/* Feature Screenshots */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-border/20">
            <div className="aspect-[4/3] bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl mb-4 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-white/20 flex items-center justify-center">
                  <Brain className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Financial Dashboard</h3>
                <p className="text-sm opacity-90">Real-time insights</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">AI-Powered Analytics</h3>
            <p className="text-muted-foreground text-sm">
              Real-time market sentiment tracking with advanced AI analysis and trend prediction.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-border/20">
            <div className="aspect-[4/3] bg-gradient-to-br from-green-500 to-blue-500 rounded-xl mb-4 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-white/20 flex items-center justify-center">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Bank Integration</h3>
                <p className="text-sm opacity-90">Secure connections</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Portfolio Management</h3>
            <p className="text-muted-foreground text-sm">
              Securely connect your accounts for comprehensive portfolio tracking and analysis.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-border/20">
            <div className="aspect-[4/3] bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-white/20 flex items-center justify-center">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Stock Analysis</h3>
                <p className="text-sm opacity-90">AI insights</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Smart Analysis</h3>
            <p className="text-muted-foreground text-sm">
              Get personalized stock analysis with AI-powered insights and market predictions.
            </p>
          </div>
        </div>

        {/* Integration Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-white border border-border/20 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">AI Copilot</h3>
            </div>
            <p className="text-muted-foreground">
              Get personalized investment advice powered by advanced machine learning algorithms
              and real-time market data analysis.
            </p>
          </Card>

          <Card className="p-6 bg-white border border-border/20 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-blue-500">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Plaid Integration</h3>
            </div>
            <p className="text-muted-foreground">
              Securely connect your bank accounts and financial institutions for comprehensive
              portfolio tracking and analysis.
            </p>
          </Card>

          <Card className="p-6 bg-white border border-border/20 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Stripe Invoicing</h3>
            </div>
            <p className="text-muted-foreground">
              Automate invoice generation and payment processing for your financial services
              with seamless Stripe integration.
            </p>
          </Card>

          <Card className="p-6 bg-white border border-border/20 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Gmail Integration</h3>
            </div>
            <p className="text-muted-foreground">
              Receive automated market alerts, portfolio updates, and investment insights
              directly in your Gmail inbox.
            </p>
          </Card>

          <Card className="p-6 bg-white border border-border/20 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-600 to-teal-500">
                <Slack className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Slack Notifications</h3>
            </div>
            <p className="text-muted-foreground">
              Keep your team informed with real-time market updates and portfolio alerts
              sent directly to your Slack channels.
            </p>
          </Card>

          <Card className="p-6 bg-white border border-border/20 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-purple-600">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Smart Automations</h3>
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