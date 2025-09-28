import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Server, Users, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface McpIntegrationProps {
  connectedUser: string | null;
}

const McpIntegration = ({ connectedUser }: McpIntegrationProps) => {
  const [serverStatus, setServerStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Developer-specific MCP Config ID
  const MCP_CONFIG_ID = "37ddeb18-1162-43a3-9ebc-947f5577f0b4";

  const checkServerStatus = async () => {
    if (!connectedUser) {
      toast({
        title: "Authentication Required",
        description: "Please connect your Gmail account first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('composio-auth', {
        body: {
          action: 'check_mcp_status',
          mcpConfigId: MCP_CONFIG_ID,
          userId: connectedUser,
        },
      });

      if (error) throw error;

      setServerStatus(data);
      toast({
        title: "Status Updated",
        description: "MCP server status has been refreshed.",
      });
    } catch (error) {
      console.error('Error checking MCP status:', error);
      toast({
        title: "Error",
        description: "Failed to check MCP server status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateServerUrl = async () => {
    if (!connectedUser) {
      toast({
        title: "Authentication Required",
        description: "Please connect your Gmail account first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('composio-auth', {
        body: {
          action: 'generate_mcp_server',
          mcpConfigId: MCP_CONFIG_ID,
          userId: connectedUser,
        },
      });

      if (error) throw error;

      if (data?.serverUrl) {
        navigator.clipboard.writeText(data.serverUrl);
        toast({
          title: "Server URL Generated",
          description: "MCP server URL has been copied to your clipboard.",
        });
      }
    } catch (error) {
      console.error('Error generating MCP server:', error);
      toast({
        title: "Error",
        description: "Failed to generate MCP server URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 shadow-card">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            MCP Server Management
          </h3>
          <p className="text-sm text-muted-foreground">
            Manage your Model Control Protocol server for AI agent integrations
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium">MCP Config ID</p>
            <p className="text-xs text-muted-foreground font-mono">{MCP_CONFIG_ID}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Developer-configured MCP server for LyticalPilot integration
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={checkServerStatus} 
              disabled={loading || !connectedUser}
              className="flex-1"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Server className="h-4 w-4 mr-2" />
              )}
              Check Status
            </Button>
            
            <Button 
              onClick={generateServerUrl} 
              disabled={loading || !connectedUser}
              variant="secondary"
              className="flex-1"
            >
              <Users className="h-4 w-4 mr-2" />
              Generate Server URL
            </Button>
          </div>

          {!connectedUser && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Connect your Gmail account above to enable MCP server management.
              </p>
            </div>
          )}
        </div>

        {serverStatus && (
          <div className="space-y-3">
            <h4 className="font-medium">Server Status</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <span className="text-sm">Connection Status</span>
                <Badge variant={serverStatus.connected ? "default" : "secondary"}>
                  {serverStatus.connected ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <AlertCircle className="h-3 w-3 mr-1" />
                  )}
                  {serverStatus.connected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
              
              {serverStatus.toolkits && (
                <div className="p-2 bg-muted/50 rounded">
                  <p className="text-sm font-medium mb-1">Available Toolkits</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(serverStatus.toolkits).map(([toolkit, status]: [string, any]) => (
                      <Badge key={toolkit} variant={status.connected ? "default" : "secondary"} className="text-xs">
                        {toolkit}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-medium">MCP Integration Benefits</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <Server className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">Universal AI Integration</p>
                <p>Connect your tools to any MCP-compatible AI client (Claude Desktop, Cursor, etc.)</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">User-Specific Authentication</p>
                <p>Each user's server URL maintains their individual authentication and permissions</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">Secure & Scalable</p>
                <p>Industry-standard MCP protocol with secure authentication handling</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default McpIntegration;