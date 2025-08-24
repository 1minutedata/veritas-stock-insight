import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MultiIntegrationAuth } from "@/components/MultiIntegrationAuth";
import { IntegrationActions } from "@/components/IntegrationActions";
import { Link } from "react-router-dom";
import { ArrowLeft, Settings, Zap, Brain, Mail } from "lucide-react";
const Integrations = () => {
  const [connectedIntegrations, setConnectedIntegrations] = useState<Record<string, string>>({});
  return <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  Integrations
                </h1>
                <p className="text-muted-foreground">Connect external services to enhance VeritasPilot</p>
              </div>
            </div>
            
            <div className="flex justify-center gap-2">
              <Badge variant="secondary" className="gap-1 bg-purple-100 text-purple-700 border-purple-200">
                <Zap className="h-3 w-3" />
                AI Platform
              </Badge>
              <Badge variant="secondary" className="gap-1 bg-blue-100 text-blue-700 border-blue-200">
                <Brain className="h-3 w-3" />
                AI-Powered Actions
              </Badge>
              <Badge variant="secondary" className="gap-1 bg-green-100 text-green-700 border-green-200">
                <Mail className="h-3 w-3" />
                Email Automation
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Multi-Integration Authentication */}
          <MultiIntegrationAuth 
            onConnectionSuccess={(integrationId, userEmail) => {
              setConnectedIntegrations(prev => ({
                ...prev,
                [integrationId]: userEmail
              }));
            }} 
          />

          {/* Integration Actions */}
          <IntegrationActions 
            connectedIntegrations={connectedIntegrations}
            stockSymbol="AAPL" 
            analysis="Sample analysis for demonstration purposes" 
          />

          {/* Integration Benefits */}
          <Card className="p-6 bg-white shadow-lg">
            <h3 className="font-semibold mb-3 text-gray-900">Integration Benefits</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Automated Workflows</p>
                  <p>Set up automated reports and notifications across all your connected platforms.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Brain className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">AI-Generated Content</p>
                  <p>Generate personalized analysis reports and market insights automatically.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Multi-Platform Communication</p>
                  <p>Send analysis via email, Slack, and sync with QuickBooks for comprehensive coverage.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer Info */}
        <Card className="p-6 shadow-card">
          <div className="text-center">
            <h3 className="font-semibold mb-2">Powered by VeritasPilot</h3>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">VeritasPilot leverages LangChain technology to accelerate your agents' financial capabilities from sending invoices simply through text via Stripe, chatting with the agent to send Gmail notifications regarding data & sentiment analysis, or even Slack Notifications. </p>
          </div>
        </Card>
      </div>
    </div>;
};
export default Integrations;