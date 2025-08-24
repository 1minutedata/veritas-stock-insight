
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link, Mail, Zap, CheckCircle } from "lucide-react";

interface ComposioAuthProps {
  onConnectionSuccess?: (connectionId: string) => void;
}

export const ComposioAuth = ({ onConnectionSuccess }: ComposioAuthProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [connectionRequestId, setConnectionRequestId] = useState<string | null>(null);

  const handleInitiateConnection = async () => {
    if (!userEmail) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setConnectionStatus('connecting');

    console.log('[ComposioAuth] Initiating connection with payload:', {
      action: 'initiate',
      userId: userEmail,
      authConfigId: 'ac_kmqPF3GWRcEN',
    });

    try {
      const { data, error } = await supabase.functions.invoke('composio-auth', {
        body: {
          action: 'initiate',
          userId: userEmail,
          authConfigId: 'ac_kmqPF3GWRcEN', // Gmail auth config
        }
      });

      console.log('[ComposioAuth] Initiate response:', { data, error });

      if (error) {
        const details = (data as any)?.attempts || (data as any)?.error || error.message;
        throw new Error(typeof details === 'string' ? details : JSON.stringify(details));
      }

      const status = (data as any)?.status;
      if (status === 'connected') {
        setConnectionStatus('connected');
        toast({
          title: "Already connected",
          description: "Gmail is already connected",
        });
        onConnectionSuccess?.(userEmail);
      } else {
        setRedirectUrl((data as any).redirect_url || (data as any).redirectUrl || null);
        setConnectionRequestId((data as any).id || (data as any).connectionId || null);
        
        toast({
          title: "Connection Initiated",
          description: "Click the link below to authenticate with Gmail",
        });
      }

    } catch (e: any) {
      console.error('[ComposioAuth] Error initiating connection:', e);
      setConnectionStatus('idle');
      toast({
        title: "Failed to initiate connection",
        description: e?.message?.slice(0, 300) || "Please check logs for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkConnectionStatus = async () => {
    if (!connectionRequestId) return;

    console.log('[ComposioAuth] Checking connection status for:', connectionRequestId);
    try {
      const { data, error } = await supabase.functions.invoke('composio-auth', {
        body: {
          action: 'checkConnection',
          connectionRequestId: connectionRequestId,
        }
      });

      console.log('[ComposioAuth] Check status response:', { data, error });

      if (error) {
        const details = (data as any)?.attempts || (data as any)?.error || error.message;
        throw new Error(typeof details === 'string' ? details : JSON.stringify(details));
      }

      if ((data as any).status === 'connected') {
        setConnectionStatus('connected');
        toast({
          title: "Success",
          description: "Gmail connection established successfully!",
        });
        onConnectionSuccess?.(userEmail);
      } else {
        toast({
          title: "Still connecting",
          description: `Status: ${(data as any).status || 'unknown'}`,
        });
      }
    } catch (err: any) {
      console.error('[ComposioAuth] Error checking connection:', err);
      toast({
        title: "Error",
        description: err?.message?.slice(0, 300) || "Failed to check connection.",
        variant: "destructive",
      });
    }
  };

  const handleConnectionComplete = () => {
    checkConnectionStatus();
  };

  return (
    <Card className="p-6 shadow-card">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Composio Integration</h3>
          <Badge variant="secondary" className="gap-1">
            <Mail className="h-3 w-3" />
            Gmail
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          Connect your Gmail account to enable AI-powered email capabilities for stock analysis and notifications.
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Email Address</label>
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              disabled={connectionStatus === 'connected'}
            />
          </div>

          {connectionStatus === 'idle' && (
            <Button 
              onClick={handleInitiateConnection}
              disabled={isLoading || !userEmail}
              className="w-full"
            >
              {isLoading ? "Initiating..." : "Connect Gmail"}
            </Button>
          )}

          {redirectUrl && connectionStatus === 'connecting' && (
            <div className="space-y-3">
              <Button asChild className="w-full">
                <a href={redirectUrl} target="_blank" rel="noopener noreferrer">
                  <Link className="h-4 w-4 mr-2" />
                  Authenticate with Gmail
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleConnectionComplete}
                className="w-full"
              >
                I've completed authentication
              </Button>
            </div>
          )}

          {connectionStatus === 'connected' && (
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800">
                Gmail connected successfully! You can now use AI-powered email features.
              </span>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Available capabilities once connected:</p>
          <ul className="mt-1 space-y-1 ml-4">
            <li>• Send stock analysis reports via email</li>
            <li>• Receive market alerts and notifications</li>
            <li>• AI-powered email responses about your portfolio</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};
