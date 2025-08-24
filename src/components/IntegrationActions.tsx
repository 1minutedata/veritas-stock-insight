import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, MessageSquare, FileText, Send, Brain, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface IntegrationActionsProps {
  connectedIntegrations: Record<string, string>; // integrationId -> userEmail
  stockSymbol?: string;
  analysis?: string;
}

export const IntegrationActions = ({ connectedIntegrations, stockSymbol, analysis }: IntegrationActionsProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [actionData, setActionData] = useState<Record<string, any>>({
    gmail: { recipient: '', content: '' },
    slack: { channel: '', message: '' },
    quickbooks: { memo: '', amount: '' }
  });

  const generateContent = (type: 'email' | 'slack' | 'quickbooks') => {
    if (!stockSymbol || !analysis) return;

    const baseContent = `VeritasPilot Analysis for ${stockSymbol}:\n\n${analysis}`;
    
    switch (type) {
      case 'email':
        setActionData(prev => ({
          ...prev,
          gmail: {
            ...prev.gmail,
            content: `Subject: Stock Analysis - ${stockSymbol}\n\nDear Investor,\n\n${baseContent}\n\nBest regards,\nVeritasPilot AI`
          }
        }));
        break;
      case 'slack':
        setActionData(prev => ({
          ...prev,
          slack: {
            ...prev.slack,
            message: `📈 *${stockSymbol} Analysis Update*\n\n${baseContent}`
          }
        }));
        break;
      case 'quickbooks':
        setActionData(prev => ({
          ...prev,
          quickbooks: {
            ...prev.quickbooks,
            memo: `Investment Analysis - ${stockSymbol}: ${analysis.substring(0, 100)}...`
          }
        }));
        break;
    }
  };

  const executeAction = async (integrationType: string, actionType: string, parameters: any) => {
    const userEmail = connectedIntegrations[integrationType];
    if (!userEmail) {
      toast({
        title: "Error",
        description: `${integrationType} is not connected`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(prev => ({ ...prev, [integrationType]: true }));

    try {
      const { data, error } = await supabase.functions.invoke('composio-auth', {
        body: {
          action: 'executeAction',
          userId: userEmail,
          actionData: {
            action: actionType,
            parameters: parameters
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Action Executed Successfully",
        description: `Action completed via ${integrationType}`,
      });

      // Clear form data
      setActionData(prev => ({
        ...prev,
        [integrationType]: integrationType === 'gmail' 
          ? { recipient: '', content: '' }
          : integrationType === 'slack'
          ? { channel: '', message: '' }
          : { memo: '', amount: '' }
      }));

    } catch (error: any) {
      console.error('Error executing action:', error);
      toast({
        title: "Error",
        description: `Failed to execute action via ${integrationType}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [integrationType]: false }));
    }
  };

  const availableIntegrations = Object.keys(connectedIntegrations);

  if (availableIntegrations.length === 0) {
    return (
      <Card className="p-6 bg-white shadow-lg">
        <div className="text-center space-y-4">
          <div className="p-4 bg-purple-50 rounded-lg">
            <Brain className="h-12 w-12 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2 text-gray-900">AI Actions Available</h3>
            <p className="text-sm text-gray-600">
              Connect your accounts to unlock AI-powered automation features.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Actions</h3>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
            Connected: {availableIntegrations.length}
          </Badge>
        </div>

        <Tabs defaultValue={availableIntegrations[0]} className="w-full">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${availableIntegrations.length}, 1fr)` }}>
            {availableIntegrations.map(integration => {
              const config = {
                gmail: { icon: Mail, label: 'Gmail' },
                slack: { icon: MessageSquare, label: 'Slack' },
                quickbooks: { icon: FileText, label: 'QuickBooks' }
              }[integration];
              
              if (!config) return null;
              const Icon = config.icon;
              
              return (
                <TabsTrigger key={integration} value={integration} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {config.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Gmail Actions */}
          {availableIntegrations.includes('gmail') && (
            <TabsContent value="gmail" className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Recipient Email</label>
                  <Input
                    type="email"
                    placeholder="recipient@example.com"
                    value={actionData.gmail.recipient}
                    onChange={(e) => setActionData(prev => ({
                      ...prev,
                      gmail: { ...prev.gmail, recipient: e.target.value }
                    }))}
                    className="mt-1 border-purple-200 focus:border-purple-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Email Content</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateContent('email')}
                      disabled={!stockSymbol}
                      className="border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <Brain className="h-3 w-3 mr-1" />
                      Generate
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Email content..."
                    value={actionData.gmail.content}
                    onChange={(e) => setActionData(prev => ({
                      ...prev,
                      gmail: { ...prev.gmail, content: e.target.value }
                    }))}
                    rows={6}
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>

                <Button 
                  onClick={() => {
                    const lines = actionData.gmail.content.split('\n');
                    const subjectLine = lines.find(line => line.startsWith('Subject:'));
                    const subject = subjectLine ? subjectLine.replace('Subject:', '').trim() : 'Stock Analysis from VeritasPilot';
                    const body = actionData.gmail.content.replace(subjectLine || '', '').trim();
                    
                    executeAction('gmail', 'GMAIL_SEND_EMAIL', {
                      to_email: actionData.gmail.recipient,
                      subject,
                      body
                    });
                  }}
                  disabled={isLoading.gmail || !actionData.gmail.recipient || !actionData.gmail.content}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLoading.gmail ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Email
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          )}

          {/* Slack Actions */}
          {availableIntegrations.includes('slack') && (
            <TabsContent value="slack" className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Channel</label>
                  <Input
                    placeholder="#general or @username"
                    value={actionData.slack.channel}
                    onChange={(e) => setActionData(prev => ({
                      ...prev,
                      slack: { ...prev.slack, channel: e.target.value }
                    }))}
                    className="mt-1 border-purple-200 focus:border-purple-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Message</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateContent('slack')}
                      disabled={!stockSymbol}
                      className="border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <Brain className="h-3 w-3 mr-1" />
                      Generate
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Slack message..."
                    value={actionData.slack.message}
                    onChange={(e) => setActionData(prev => ({
                      ...prev,
                      slack: { ...prev.slack, message: e.target.value }
                    }))}
                    rows={6}
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>

                <Button 
                  onClick={() => executeAction('slack', 'SLACK_SEND_MESSAGE', {
                    channel: actionData.slack.channel,
                    text: actionData.slack.message
                  })}
                  disabled={isLoading.slack || !actionData.slack.channel || !actionData.slack.message}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLoading.slack ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          )}

          {/* QuickBooks Actions */}
          {availableIntegrations.includes('quickbooks') && (
            <TabsContent value="quickbooks" className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Transaction Amount</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={actionData.quickbooks.amount}
                    onChange={(e) => setActionData(prev => ({
                      ...prev,
                      quickbooks: { ...prev.quickbooks, amount: e.target.value }
                    }))}
                    className="mt-1 border-purple-200 focus:border-purple-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Memo</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateContent('quickbooks')}
                      disabled={!stockSymbol}
                      className="border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <Brain className="h-3 w-3 mr-1" />
                      Generate
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Transaction memo..."
                    value={actionData.quickbooks.memo}
                    onChange={(e) => setActionData(prev => ({
                      ...prev,
                      quickbooks: { ...prev.quickbooks, memo: e.target.value }
                    }))}
                    rows={4}
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>

                <Button 
                  onClick={() => executeAction('quickbooks', 'QUICKBOOKS_CREATE_ITEM', {
                    name: stockSymbol || 'Investment',
                    description: actionData.quickbooks.memo,
                    unit_price: actionData.quickbooks.amount
                  })}
                  disabled={isLoading.quickbooks || !actionData.quickbooks.memo}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLoading.quickbooks ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Create Entry
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Card>
  );
};