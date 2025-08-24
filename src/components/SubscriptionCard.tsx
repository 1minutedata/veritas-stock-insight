import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Crown, Calendar, CreditCard, RefreshCw } from "lucide-react";

const SubscriptionCard = () => {
  const { user, subscription, checkSubscription } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      if (error) throw error;
      
      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      
      // Open Stripe customer portal in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open customer portal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshStatus = async () => {
    setIsLoading(true);
    try {
      await checkSubscription();
      toast({
        title: "Status Updated",
        description: "Subscription status has been refreshed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh subscription status.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            Premium Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Unlock advanced AI analysis and premium integrations
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Advanced AI insights</li>
              <li>• Real-time alerts</li>
              <li>• Premium integrations</li>
              <li>• Priority support</li>
            </ul>
          </div>
          <Button 
            onClick={() => window.location.href = '/auth'} 
            className="w-full bg-gradient-primary hover:opacity-90"
          >
            Start Free Trial
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            Subscription
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefreshStatus}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscription?.subscribed ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <Badge variant="default" className="bg-bullish/20 text-bullish">
                Active
              </Badge>
            </div>
            
            {subscription.subscription_tier && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Plan</span>
                <Badge variant="secondary">
                  {subscription.subscription_tier}
                </Badge>
              </div>
            )}
            
            {subscription.subscription_end && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Next billing</span>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(subscription.subscription_end).toLocaleDateString()}
                </div>
              </div>
            )}

            <Button 
              onClick={handleManageSubscription} 
              variant="outline" 
              className="w-full"
              disabled={isLoading}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Manage Subscription
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <Badge variant="secondary">Free</Badge>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Upgrade to unlock premium features
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Advanced AI analysis</li>
                <li>• Real-time data & alerts</li>
                <li>• Premium integrations</li>
                <li>• Priority support</li>
              </ul>
            </div>

            <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
              <p className="text-sm font-medium">Premium Plan</p>
              <p className="text-sm text-muted-foreground">
                $19/month • 7-day free trial
              </p>
            </div>

            <Button 
              onClick={handleUpgrade} 
              className="w-full bg-gradient-primary hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Start Free Trial"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;