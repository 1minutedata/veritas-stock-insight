import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Brain, Zap, TrendingUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Success = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check subscription status after successful payment
    const checkSubscription = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-subscription');
        if (error) throw error;
        
        if (data.subscribed) {
          toast({
            title: "Welcome to VeritasPilot Premium!",
            description: `Your ${data.subscription_tier} subscription is now active.`,
          });
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    };

    checkSubscription();
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-terminal flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-glow">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                VeritasPilot
              </h1>
              <p className="text-muted-foreground text-sm">AI-Powered Stock Analysis</p>
            </div>
          </div>
        </div>

        {/* Success Card */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-bullish/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-bullish" />
            </div>
            <CardTitle className="text-2xl font-bold">
              🎉 Welcome to VeritasPilot Premium!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-lg">Your subscription is now active!</p>
              <p className="text-muted-foreground">
                You now have access to all premium features with your 7-day free trial.
              </p>
            </div>

            {/* Features */}
            <div className="grid gap-4">
              <div className="flex items-center gap-3 p-3 bg-card/50 rounded-lg border border-border/50">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Advanced AI Analysis</h3>
                  <p className="text-sm text-muted-foreground">Get deeper insights with our premium AI models</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-card/50 rounded-lg border border-border/50">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Real-time Data & Alerts</h3>
                  <p className="text-sm text-muted-foreground">Access live market data and personalized alerts</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-card/50 rounded-lg border border-border/50">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Premium Integrations</h3>
                  <p className="text-sm text-muted-foreground">Connect with Gmail, Slack, and more platforms</p>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm text-center">
                <strong>Free Trial Period:</strong> 7 days • <strong>Then:</strong> $19/month
              </p>
              <p className="text-xs text-center text-muted-foreground mt-1">
                Cancel anytime during your trial period with no charges
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => navigate("/")} className="flex-1 bg-gradient-primary hover:opacity-90">
                Start Analyzing Stocks
              </Button>
              <Button onClick={() => navigate("/integrations")} variant="outline" className="flex-1">
                Manage Integrations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Success;