import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link, Mail, MessageSquare, FileText, CheckCircle, Zap } from "lucide-react";

interface Integration {
  id: 'gmail' | 'slack' | 'quickbooks';
  name: string;
  icon: React.ElementType;
  authConfigId: string;
  description: string;
  capabilities: string[];
  badgeColor: string;
}

const integrations: Integration[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    icon: Mail,
    authConfigId: 'ac_kmqPF3GWRcEN',
    description: 'Send automated stock analysis reports and receive market alerts via email.',
    capabilities: [
      'Send analysis reports',
      'Market alert notifications',
      'Portfolio summaries',
      'Custom email templates'
    ],
    badgeColor: 'bg-red-100 text-red-700 border-red-200'
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: MessageSquare,
    authConfigId: 'ac_rd62cQ0sL5OF',
    description: 'Get real-time stock alerts and analysis directly in your Slack workspace.',
    capabilities: [
      'Real-time alerts',
      'Channel notifications',
      'Interactive reports',
      'Team collaboration'
    ],
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-200'
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    icon: FileText,
    authConfigId: 'ac_YPVZ_HdcF3BF',
    description: 'Sync investment data and generate financial reports for accounting.',
    capabilities: [
      'Investment tracking',
      'Financial reports',
      'Tax preparation',
      'Portfolio valuation'
    ],
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200'
  }
];

interface MultiIntegrationAuthProps {
  onConnectionSuccess?: (integrationId: string, userEmail: string) => void;
}

export const MultiIntegrationAuth = ({ onConnectionSuccess }: MultiIntegrationAuthProps) => {
  const { toast } = useToast();
  const [userEmail, setUserEmail] = useState("");
  const [loadingIntegration, setLoadingIntegration] = useState<string | null>(null);
  const [connectionStates, setConnectionStates] = useState<Record<string, {
    status: 'idle' | 'connecting' | 'connected';
    redirectUrl?: string;
    connectionRequestId?: string;
  }>>({});

  const handleInitiateConnection = async (integration: Integration) => {
    if (!userEmail) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setLoadingIntegration(integration.id);
    setConnectionStates(prev => ({
      ...prev,
      [integration.id]: { ...prev[integration.id], status: 'connecting' }
    }));

    try {
      const { data, error } = await supabase.functions.invoke('composio-auth', {
        body: {
          action: 'initiate',
          userId: userEmail,
          authConfigId: integration.authConfigId,
        }
      });

      if (error) throw error;

      setConnectionStates(prev => ({
        ...prev,
        [integration.id]: {
          status: 'connecting',
          redirectUrl: data.redirect_url,
          connectionRequestId: data.id
        }
      }));
      
      toast({
        title: "Connection Initiated",
        description: `Click the link to authenticate with ${integration.name}`,
      });

    } catch (error: any) {
      console.error('Error initiating connection:', error);
      setConnectionStates(prev => ({
        ...prev,
        [integration.id]: { status: 'idle' }
      }));
      toast({
        title: "Error",
        description: `Failed to initiate ${integration.name} connection. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoadingIntegration(null);
    }
  };

  const checkConnectionStatus = async (integration: Integration) => {
    const state = connectionStates[integration.id];
    if (!state?.connectionRequestId) return;

    try {
      const { data, error } = await supabase.functions.invoke('composio-auth', {
        body: {
          action: 'checkConnection',
          connectionRequestId: state.connectionRequestId,
        }
      });

      if (error) throw error;

      if (data.status === 'connected') {
        setConnectionStates(prev => ({
          ...prev,
          [integration.id]: { ...prev[integration.id], status: 'connected' }
        }));
        toast({
          title: "Success",
          description: `${integration.name} connection established successfully!`,
        });
        onConnectionSuccess?.(integration.id, userEmail);
      }
    } catch (error: any) {
      console.error('Error checking connection:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Input */}
      <Card className="p-6 bg-white border border-purple-200 shadow-lg">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Connect Your Accounts</h3>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="mt-1 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>
      </Card>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          const state = connectionStates[integration.id] || { status: 'idle' };
          
          return (
            <Card key={integration.id} className="p-6 bg-white border border-purple-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                    <Badge 
                      variant="secondary" 
                      className={`mt-1 ${integration.badgeColor}`}
                    >
                      {state.status === 'connected' ? 'Connected' : 'Available'}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-gray-600">{integration.description}</p>

                <ul className="text-xs text-gray-500 space-y-1">
                  {integration.capabilities.map((capability, index) => (
                    <li key={index}>• {capability}</li>
                  ))}
                </ul>

                {state.status === 'idle' && (
                  <Button 
                    onClick={() => handleInitiateConnection(integration)}
                    disabled={loadingIntegration === integration.id || !userEmail}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {loadingIntegration === integration.id ? "Initiating..." : `Connect ${integration.name}`}
                  </Button>
                )}

                {state.redirectUrl && state.status === 'connecting' && (
                  <div className="space-y-3">
                    <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      <a href={state.redirectUrl} target="_blank" rel="noopener noreferrer">
                        <Link className="h-4 w-4 mr-2" />
                        Authenticate with {integration.name}
                      </a>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => checkConnectionStatus(integration)}
                      className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      I've completed authentication
                    </Button>
                  </div>
                )}

                {state.status === 'connected' && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">
                      {integration.name} connected successfully!
                    </span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};