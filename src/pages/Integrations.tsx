import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ComposioAuth } from "@/components/ComposioAuth";
import { ComposioActions } from "@/components/ComposioActions";
import { Link } from "react-router-dom";
import { ArrowLeft, Settings, Zap, Brain, Mail } from "lucide-react";
const Integrations = () => {
  const [connectedUser, setConnectedUser] = useState<string | null>(null);
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Authentication Section */}
          <div className="space-y-6">
            <Card className="p-6 bg-white border border-border/20 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Available Integrations</h2>
              <div className="space-y-4">
                <div className="p-4 border border-border/20 rounded-lg bg-gray-50/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground">Gmail Integration</h3>
                    <Badge variant={connectedUser ? "default" : "secondary"} className={connectedUser ? "bg-green-100 text-green-700 border-green-200" : ""}>
                      {connectedUser ? "Connected" : "Available"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Send automated stock analysis reports and receive market alerts directly via email.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Automated analysis reports</li>
                    <li>• Market alert notifications</li>
                    <li>• Portfolio summaries</li>
                    <li>• Custom email templates</li>
                  </ul>
                </div>
              </div>
            </Card>

            <ComposioAuth onConnectionSuccess={setConnectedUser} />
          </div>

          {/* Actions Section */}
          <div className="space-y-6">
            {connectedUser ? <ComposioActions userEmail={connectedUser} stockSymbol="AAPL" analysis="Sample analysis for demonstration purposes" /> : <Card className="p-6 shadow-card">
                <div className="text-center space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">AI Actions Available</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect your Gmail account to unlock AI-powered email actions and automation features.
                    </p>
                  </div>
                </div>
              </Card>}

            <Card className="p-6 shadow-card">
              <h3 className="font-semibold mb-3">Integration Benefits</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Automated Workflows</p>
                    <p>Set up automated email reports and notifications based on market conditions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Brain className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">AI-Generated Content</p>
                    <p>Generate personalized analysis reports and market insights automatically.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Email Automation</p>
                    <p>Send analysis reports to clients, team members, or personal email addresses.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
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